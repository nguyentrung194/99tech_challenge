/**
 * Problem 4: Three ways to sum to n
 *
 * Three unique implementations to calculate the sum from 1 to n
 * Input: n - any integer (assumed to produce result < Number.MAX_SAFE_INTEGER)
 * Output: sum from 1 to n, e.g., sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 */

/**
 * Performance measurement utility
 */
interface PerformanceResult {
  result: number;
  executionTime: number; // in milliseconds
  memoryUsed: number; // in bytes
  memoryBefore: number;
  memoryAfter: number;
}

function measurePerformance(
  fn: (n: number) => number,
  n: number,
  functionName: string
): PerformanceResult {
  // Force garbage collection if available (requires --expose-gc flag)
  if (
    typeof global !== "undefined" &&
    typeof (global as any).gc === "function"
  ) {
    (global as any).gc();
  }

  // Measure memory before
  const memBefore = process.memoryUsage();
  const heapUsedBefore = memBefore.heapUsed;

  // Measure execution time
  const startTime = performance.now();
  const result = fn(n);
  const endTime = performance.now();

  // Measure memory after
  const memAfter = process.memoryUsage();
  const heapUsedAfter = memAfter.heapUsed;

  const executionTime = endTime - startTime;
  const memoryUsed = heapUsedAfter - heapUsedBefore;

  return {
    result,
    executionTime,
    memoryUsed,
    memoryBefore: heapUsedBefore,
    memoryAfter: heapUsedAfter,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function printPerformance(
  perf: PerformanceResult,
  functionName: string,
  n: number
): void {
  console.log(`\n${functionName}(${n}):`);
  console.log(`  Result: ${perf.result}`);
  console.log(`  Execution Time: ${perf.executionTime.toFixed(4)} ms`);
  console.log(`  Memory Used: ${formatBytes(perf.memoryUsed)}`);
  console.log(`  Memory Before: ${formatBytes(perf.memoryBefore)}`);
  console.log(`  Memory After: ${formatBytes(perf.memoryAfter)}`);
}

/**
 * Implementation A: Iterative Approach
 *
 * Complexity: O(n) time, O(1) space
 * Efficiency: Linear time complexity. Simple and straightforward.
 * Best for: Small to medium values of n, when readability is important.
 *
 * This approach iterates through all numbers from 1 to n and accumulates the sum.
 */
function sum_to_n_a(n: number): number {
  if (n <= 0) return 0;

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Implementation B: Recursive Approach
 *
 * Complexity: O(n) time, O(n) space
 * Efficiency: Linear time complexity, but uses O(n) space due to call stack.
 * Best for: Educational purposes, functional programming style.
 *
 * Note: For large values of n, this may cause stack overflow due to deep recursion.
 * This approach breaks down the problem into smaller subproblems.
 */
function sum_to_n_b(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  return n + sum_to_n_b(n - 1);
}

/**
 * Implementation C: Mathematical Formula (Gauss's Formula)
 *
 * Complexity: O(1) time, O(1) space
 * Efficiency: Constant time complexity - the most efficient approach.
 * Best for: Any value of n, especially large numbers. This is the optimal solution.
 *
 * Uses the mathematical formula: sum = n * (n + 1) / 2
 * This formula was discovered by Carl Friedrich Gauss as a child.
 */
function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;

  return (n * (n + 1)) / 2;
}

// Example usage and performance tests
console.log("=".repeat(60));
console.log("Testing sum_to_n functions with Performance Metrics");
console.log("=".repeat(60));

console.log("\n--- Testing with n=5 ---");
printPerformance(
  measurePerformance(sum_to_n_a, 5, "sum_to_n_a"),
  "sum_to_n_a",
  5
);
printPerformance(
  measurePerformance(sum_to_n_b, 5, "sum_to_n_b"),
  "sum_to_n_b",
  5
);
printPerformance(
  measurePerformance(sum_to_n_c, 5, "sum_to_n_c"),
  "sum_to_n_c",
  5
);

console.log("\n--- Testing with n=10 ---");
printPerformance(
  measurePerformance(sum_to_n_a, 10, "sum_to_n_a"),
  "sum_to_n_a",
  10
);
printPerformance(
  measurePerformance(sum_to_n_b, 10, "sum_to_n_b"),
  "sum_to_n_b",
  10
);
printPerformance(
  measurePerformance(sum_to_n_c, 10, "sum_to_n_c"),
  "sum_to_n_c",
  10
);

console.log(
  "\n--- Testing with n=1000 (larger value for better comparison) ---"
);
printPerformance(
  measurePerformance(sum_to_n_a, 1000, "sum_to_n_a"),
  "sum_to_n_a",
  1000
);
printPerformance(
  measurePerformance(sum_to_n_b, 1000, "sum_to_n_b"),
  "sum_to_n_b",
  1000
);
printPerformance(
  measurePerformance(sum_to_n_c, 1000, "sum_to_n_c"),
  "sum_to_n_c",
  1000
);

console.log("\n--- Testing edge cases ---");
printPerformance(
  measurePerformance(sum_to_n_a, 0, "sum_to_n_a"),
  "sum_to_n_a",
  0
);
printPerformance(
  measurePerformance(sum_to_n_b, 0, "sum_to_n_b"),
  "sum_to_n_b",
  0
);
printPerformance(
  measurePerformance(sum_to_n_c, 0, "sum_to_n_c"),
  "sum_to_n_c",
  0
);

printPerformance(
  measurePerformance(sum_to_n_a, 1, "sum_to_n_a"),
  "sum_to_n_a",
  1
);
printPerformance(
  measurePerformance(sum_to_n_b, 1, "sum_to_n_b"),
  "sum_to_n_b",
  1
);
printPerformance(
  measurePerformance(sum_to_n_c, 1, "sum_to_n_c"),
  "sum_to_n_c",
  1
);

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
