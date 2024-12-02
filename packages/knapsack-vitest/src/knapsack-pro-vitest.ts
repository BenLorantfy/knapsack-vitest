#!/usr/bin/env node

import {
  KnapsackProCore,
  KnapsackProLogger,
  onQueueFailureType,
  onQueueSuccessType,
  TestFile,
} from '@knapsack-pro/core';

import { mergeConfig } from 'vitest/config'
import { startVitest, parseCLI, UserConfig } from 'vitest/node'

import { v4 as uuidv4 } from 'uuid';
import { minimatch } from 'minimatch';
import { glob } from 'glob';

const knapsackProLogger = new KnapsackProLogger();
const projectPath = process.cwd();

const knapsackPro = new KnapsackProCore(
  'knapsack-vitest',
  '1.0.0',
  getTestFiles,
);

const onSuccess: onQueueSuccessType = async (queueTestFiles: TestFile[]) => {
  const config = generateVitestConfig(queueTestFiles);
  const vitest = await startVitest('test', undefined, config);
    
  if (!vitest) {
    throw new Error('[knapsack-vitest] Vitest failed to start');
  }

  await vitest.close();

  const recordedTestFiles = vitest.state.getFiles().map<TestFile>((file) => {
    const testFile = vitest.state.getReportedEntity(file)
    if (testFile.type !== 'module') {
      throw new Error('[knapsack-vitest] Vitest reported non-module file')
    }

    const path =
        process.platform === 'win32'
          ? file.filepath.replace(`${projectPath}\\`, '').replace(/\\/g, '/')
          : file.filepath.replace(`${projectPath}/`, '');

    const diagnostic = testFile.diagnostic();
    return {
      path,
      time_execution: diagnostic.duration / 1000
    }
  })

  const isTestSuiteGreen = process.exitCode !== 1;

  return {
    recordedTestFiles,
    isTestSuiteGreen,
  };
};

const onError: onQueueFailureType = () => {};

knapsackPro.runQueueMode(onSuccess, onError);

function generateVitestConfig(queueTestFiles: TestFile[]): UserConfig {
  const providedConfig = parseProvidedVitestConfig();

  const addedConfig: UserConfig = {
    include: queueTestFiles.map((testFile) => testFile.path),
    // @ts-expect-error
    coverage: providedConfig.coverage?.enabled ? {
      reportsDirectory: `${process.env.KNAPSACK_PRO_COVERAGE_DIRECTORY}/${uuidv4()}`
    } : undefined
  }

  return mergeConfig(providedConfig, addedConfig);
}

function parseProvidedVitestConfig(): UserConfig {
  const providedConfig = parseCLI(`vitest ${process.argv.slice(2)}`);
  if (providedConfig.filter.length > 0) {
    throw new Error('[knapsack-vitest] Can not pass list of files to test');
  }

  if (providedConfig.options.coverage?.enabled && providedConfig.options.coverage?.reportsDirectory) {
    throw new Error('[knapsack-vitest] reportsDirectory cli option is not supported.  Use KNAPSACK_PRO_COVERAGE_DIRECTORY environment variable instead.');
  }

  if (providedConfig.options.coverage?.enabled && !process.env.KNAPSACK_PRO_COVERAGE_DIRECTORY) {
    throw new Error('[knapsack-vitest] coverage is enabled but KNAPSACK_PRO_COVERAGE_DIRECTORY environment variable is not set');
  }

  knapsackProLogger.debug(
    `Vitest CLI options:\n${KnapsackProLogger.objectInspect(providedConfig)}`,
  );

  return providedConfig.options;
}

function getTestFiles(): TestFile[] {
  const testFilePattern = process.env.KNAPSACK_PRO_TEST_FILE_PATTERN || '**\/*.{test,spec}.?(c|m)[jt]s?(x)';

  const testFiles = glob
    .sync(testFilePattern)
    .filter((testFilePath) => {
      if (process.env.KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN) {
        return !minimatch(testFilePath, process.env.KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN, {
          matchBase: true,
        });
      }
      return true;
    })
    .filter(
      (testFilePath) =>
        !testFilePath.match(/node_modules/),
    )
    .map((testFilePath) => ({ path: testFilePath }));

  if (testFiles.length === 0) {
    const errorMessage = `[knapsack-vitest] Test files cannot be found.\nPlease set KNAPSACK_PRO_TEST_FILE_PATTERN matching your test directory structure.\nLearn more: https://knapsackpro.com/perma/jest/no-tests-found`;

    knapsackProLogger.error(errorMessage);
    throw new Error(errorMessage);
  }

  return testFiles;
}