declare module "@knapsack-pro/core" {

    type onQueueFailureType = (error: any) => void;

    class TestFile {
        path: string;
        time_execution?: number;
    }
    
    type onQueueSuccessType = (queueTestFiles: TestFile[]) => Promise<{
        recordedTestFiles: TestFile[];
        isTestSuiteGreen: boolean;
    }>;
    
    type testFilesToExecuteType = () => TestFile[];
    
    class KnapsackProCore {
        private knapsackProAPI;
        private knapsackProLogger;
        private recordedTestFiles;
        private allTestFiles;
        private isTestSuiteGreen;
        constructor(clientName: string, clientVersion: string, testFilesToExecute: testFilesToExecuteType);
        runQueueMode(onSuccess: onQueueSuccessType, onFailure: onQueueFailureType): void;
        private fetchTestsFromQueue;
        private updateRecordedTestFiles;
        private finishQueueMode;
        private createBuildSubset;
    }
    
    class KnapsackProLogger {
        static objectInspect(object: object): string;
        private logger;
        constructor(logLevel?: string);
        error(message: string): void;
        warn(message: string): void;
        info(message: string): void;
        verbose(message: string): void;
        debug(message: string): void;
        silly(message: string): void;
    }
    
    export { KnapsackProCore, KnapsackProLogger, TestFile, type onQueueFailureType, type onQueueSuccessType, type testFilesToExecuteType };
    
}