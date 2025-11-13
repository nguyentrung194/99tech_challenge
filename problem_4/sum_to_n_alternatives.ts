/**
 * Alternative implementations for sum to n
 * Additional unique approaches beyond the three basic implementations
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
  fn: (n: number, ...args: any[]) => number,
  n: number,
  functionName: string,
  ...args: any[]
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
  const result = fn(n, ...args);
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
 * Implementation D: Functional/Array Reduce Approach
 *
 * Complexity: O(n) time, O(n) space
 * Efficiency: Linear time and space due to array creation.
 * Best for: Functional programming style, when working with array transformations.
 *
 * Creates an array of numbers from 1 to n and uses reduce to sum them.
 * More declarative but less efficient than iterative approach due to array overhead.
 */
function sum_to_n_d(n: number): number {
  if (n <= 0) return 0;

  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (sum, num) => sum + num,
    0
  );
}

/**
 * Implementation E: Tail-Recursive Approach (Optimized Recursion)
 *
 * Complexity: O(n) time, O(1) space (theoretically, if TCO is supported)
 * Efficiency: Linear time. In practice, JavaScript/TypeScript may not optimize tail calls,
 * so space could still be O(n) due to call stack, but the pattern is more efficient.
 * Best for: Functional programming style with better space characteristics than regular recursion.
 *
 * Uses an accumulator to make the recursion tail-recursive, allowing potential optimization.
 */
function sum_to_n_e(n: number, accumulator: number = 0): number {
  if (n <= 0) return accumulator;
  return sum_to_n_e(n - 1, accumulator + n);
}

/**
 * Implementation F: Memoized/Cached Version
 *
 * Complexity: O(1) amortized time after first call, O(n) space for cache
 * Efficiency: First call is O(n) or O(1) depending on base implementation.
 * Subsequent calls with same or smaller n are O(1) lookup.
 * Best for: Repeated calls with same or overlapping values of n.
 *
 * Caches results to avoid recomputation. Uses the mathematical formula as base for efficiency.
 */
function sum_to_n_f(n: number): number {
  if (n <= 0) return 0;

  // Use a closure to maintain cache across calls
  if (!sum_to_n_f.cache) {
    sum_to_n_f.cache = new Map<number, number>();
  }

  if (sum_to_n_f.cache.has(n)) {
    return sum_to_n_f.cache.get(n)!;
  }

  // Use mathematical formula for base calculation
  const result = (n * (n + 1)) / 2;
  sum_to_n_f.cache.set(n, result);
  return result;
}

// TypeScript declaration for cache property
declare namespace sum_to_n_f {
  let cache: Map<number, number> | undefined;
}

/**
 * Implementation G: While Loop (Alternative Iteration)
 *
 * Complexity: O(n) time, O(1) space
 * Efficiency: Same as iterative for-loop, but uses while loop pattern.
 * Best for: When you prefer while loops or need more control over iteration.
 *
 * Similar to iterative approach but uses while loop instead of for loop.
 */
function sum_to_n_g(n: number): number {
  if (n <= 0) return 0;

  let sum = 0;
  let i = 1;
  while (i <= n) {
    sum += i;
    i++;
  }
  return sum;
}

/**
 * Implementation H: Bit Manipulation (Advanced)
 *
 * Complexity: O(1) time, O(1) space
 * Efficiency: Constant time, same as mathematical formula but uses bit operations.
 * Best for: When bit manipulation is preferred, or in low-level optimizations.
 *
 * Uses the same mathematical formula but demonstrates bit manipulation techniques.
 * For even n: n/2 * (n+1), for odd n: (n+1)/2 * n
 * Uses bit shift for division by 2.
 */
function sum_to_n_h(n: number): number {
  if (n <= 0) return 0;

  // For even n: n/2 * (n+1)
  // For odd n: (n+1)/2 * n
  // Using bit manipulation: n >> 1 is equivalent to Math.floor(n/2)
  return (n & 1) === 0
    ? (n >> 1) * (n + 1) // Even: n/2 * (n+1)
    : ((n + 1) >> 1) * n; // Odd: (n+1)/2 * n
}

// Example usage and performance comparison
console.log("=".repeat(60));
console.log("Testing Alternative Implementations with Performance Metrics");
console.log("=".repeat(60));

console.log("\n--- Testing with n=5 ---");
printPerformance(
  measurePerformance(sum_to_n_d, 5, "sum_to_n_d"),
  "sum_to_n_d",
  5
);
printPerformance(
  measurePerformance(sum_to_n_e, 5, "sum_to_n_e"),
  "sum_to_n_e",
  5
);
printPerformance(
  measurePerformance(sum_to_n_f, 5, "sum_to_n_f"),
  "sum_to_n_f",
  5
);
printPerformance(
  measurePerformance(sum_to_n_g, 5, "sum_to_n_g"),
  "sum_to_n_g",
  5
);
printPerformance(
  measurePerformance(sum_to_n_h, 5, "sum_to_n_h"),
  "sum_to_n_h",
  5
);

console.log(
  "\n--- Testing with n=1000 (larger value for better comparison) ---"
);
printPerformance(
  measurePerformance(sum_to_n_d, 1000, "sum_to_n_d"),
  "sum_to_n_d",
  1000
);
printPerformance(
  measurePerformance(sum_to_n_e, 1000, "sum_to_n_e"),
  "sum_to_n_e",
  1000
);
printPerformance(
  measurePerformance(sum_to_n_f, 1000, "sum_to_n_f"),
  "sum_to_n_f",
  1000
);
printPerformance(
  measurePerformance(sum_to_n_g, 1000, "sum_to_n_g"),
  "sum_to_n_g",
  1000
);
printPerformance(
  measurePerformance(sum_to_n_h, 1000, "sum_to_n_h"),
  "sum_to_n_h",
  1000
);

console.log("\n--- Testing memoization (sum_to_n_f) ---");
console.log("First call (computes):");
printPerformance(
  measurePerformance(sum_to_n_f, 100, "sum_to_n_f"),
  "sum_to_n_f",
  100
);
console.log("Second call (from cache):");
printPerformance(
  measurePerformance(sum_to_n_f, 100, "sum_to_n_f"),
  "sum_to_n_f",
  100
);

export { sum_to_n_d, sum_to_n_e, sum_to_n_f, sum_to_n_g, sum_to_n_h };
