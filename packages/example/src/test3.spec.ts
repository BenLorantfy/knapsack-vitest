import { expect, test } from "vitest";

test('adds 1 + 2 to equal 3', async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    expect(1 + 2).toBe(3);
}, 10000);