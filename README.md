# ![knapsack-vitest](./img/logo.png)

Split your vitest test suite across multiple parrallel CI nodes with [Knapsack Pro](https://knapsackpro.com/) using this [custom integration](https://docs.knapsackpro.com/2020/how-to-build-native-integration-with-knapsack-pro-api-to-run-tests-in-parallel-for-any-test-runner-testing-framework).

<p align="center">
<a href="https://github.com/benlorantfy/knapsack-vitest/actions?query=branch%3Amain"><img src="https://github.com/benlorantfy/knapsack-vitest/actions/workflows/test.yaml/badge.svg?event=push&branch=main" alt="knapsack-vitest CI status" /></a>
<a href="https://twitter.com/benlorantfy" rel="nofollow"><img src="https://img.shields.io/badge/created%20by-@benlorantfy-4BBAAB.svg" alt="Created by Ben Lorantfy"></a>
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/benlorantfy/knapsack-vitest" alt="License"></a>
</p>


## Getting Started
1. Install the package
```
npm install knapsack-vitest
```
2. Update your CI to use a matrix build. See the [example project](.github/workflows/example.yaml) for reference.

https://github.com/BenLorantfy/knapsack-vitest/blob/da3cb7fd2981d15e0b4a77992deedf5444be45e6/.github/workflows/example.yaml#L9-L13

3. Replace `vitest` with `knapsack-vitest` in your CI config
4. Set the `KNAPSACK_PRO_TEST_SUITE_TOKEN` environment variable to your Knapsack Pro test suite token, and optionally set other environemnt variables as needed.  See the [example project](.github/workflows/example.yaml) for reference.

https://github.com/BenLorantfy/knapsack-vitest/blob/da3cb7fd2981d15e0b4a77992deedf5444be45e6/.github/workflows/example.yaml#L36-L45

> [!NOTE]
> The environment variable is called `KNAPSACK_PRO_TEST_SUITE_TOKEN`, not `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST`

