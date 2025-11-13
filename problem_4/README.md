# Sum to N - Three Ways Implementation

This project provides multiple implementations to calculate the sum from 1 to n, with performance benchmarking capabilities.

## Problem Statement

Implement a function that calculates the sum from 1 to n:
- Input: `n` - any integer (assumed to produce result < Number.MAX_SAFE_INTEGER)
- Output: Sum from 1 to n, e.g., `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`

## Project Structure

```
.
├── sum_to_n.ts              # Three basic implementations (A, B, C)
├── sum_to_n_alternatives.ts # Five alternative implementations (D, E, F, G, H)
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Code

### Method 1: Using ts-node (Recommended)

Run the files directly without compilation:

```bash
# Run basic implementations
npx ts-node sum_to_n.ts

# Run alternative implementations
npx ts-node sum_to_n_alternatives.ts
```

### Method 2: Compile and Run

```bash
# Compile TypeScript to JavaScript
npm run build

# Run compiled files
node dist/sum_to_n.js
node dist/sum_to_n_alternatives.js
```

### Method 3: With Garbage Collection (Better Memory Measurements)

For more accurate memory measurements, use the `--expose-gc` flag:

```bash
node --expose-gc -r ts-node/register sum_to_n.ts
node --expose-gc -r ts-node/register sum_to_n_alternatives.ts
```

## Implementations Overview

### Basic Implementations (`sum_to_n.ts`)

#### Implementation A: Iterative Approach
- **Complexity**: O(n) time, O(1) space
- **Description**: Uses a simple for-loop to accumulate the sum
- **Best for**: Small to medium values, when readability is important

#### Implementation B: Recursive Approach
- **Complexity**: O(n) time, O(n) space
- **Description**: Uses recursion to break down the problem
- **Best for**: Educational purposes, functional programming style
- **Note**: May cause stack overflow for very large n

#### Implementation C: Mathematical Formula (Gauss's Formula)
- **Complexity**: O(1) time, O(1) space
- **Description**: Uses the formula: `n * (n + 1) / 2`
- **Best for**: Any value of n, especially large numbers - **OPTIMAL SOLUTION**

### Alternative Implementations (`sum_to_n_alternatives.ts`)

#### Implementation D: Functional/Array Reduce
- **Complexity**: O(n) time, O(n) space
- **Description**: Creates an array and uses reduce to sum
- **Best for**: Functional programming style

#### Implementation E: Tail-Recursive
- **Complexity**: O(n) time, O(1) space (theoretically)
- **Description**: Optimized recursion with accumulator
- **Best for**: Functional style with better space characteristics

#### Implementation F: Memoized/Cached
- **Complexity**: O(1) amortized time after first call
- **Description**: Caches results for repeated calls
- **Best for**: Repeated calls with same or overlapping values

#### Implementation G: While Loop
- **Complexity**: O(n) time, O(1) space
- **Description**: Alternative iteration using while loop
- **Best for**: When you prefer while loops

#### Implementation H: Bit Manipulation
- **Complexity**: O(1) time, O(1) space
- **Description**: Uses bit operations for division
- **Best for**: Low-level optimizations

## Performance Comparison

Based on test results with n=1000:

### Execution Time (Fastest to Slowest)

| Function | Time (ms) | Complexity | Notes |
|----------|-----------|------------|-------|
| `sum_to_n_c` | 0.0003 | O(1) | **Fastest** - Mathematical formula |
| `sum_to_n_h` | 0.0008 | O(1) | Bit manipulation variant |
| `sum_to_n_f` | 0.0007 | O(1) | Memoized (first call) |
| `sum_to_n_g` | 0.0197 | O(n) | While loop |
| `sum_to_n_a` | 0.0153 | O(n) | For loop |
| `sum_to_n_e` | 0.0347 | O(n) | Tail-recursive |
| `sum_to_n_d` | 0.0698 | O(n) | Array reduce |
| `sum_to_n_b` | 0.0961 | O(n) | Regular recursion |

### Key Findings

1. **Fastest Implementation**: `sum_to_n_c` (Mathematical Formula)
   - Constant time O(1) - execution time doesn't increase with n
   - Execution time: ~0.0003ms for n=1000
   - **Recommended for production use**

2. **Memory Efficiency**: 
   - O(1) implementations (`sum_to_n_c`, `sum_to_n_h`) use minimal memory (~432 B)
   - O(n) implementations vary:
     - Iterative approaches (`sum_to_n_a`, `sum_to_n_g`): ~432-528 B
     - Recursive approaches (`sum_to_n_b`, `sum_to_n_e`): Higher memory due to call stack
     - Array-based (`sum_to_n_d`): Highest memory (~9.70 KB for n=1000)

3. **Recursion Performance**:
   - Regular recursion (`sum_to_n_b`): Slowest O(n) implementation (0.0961ms)
   - Tail-recursion (`sum_to_n_e`): Better than regular recursion (0.0347ms)
   - Both use more memory due to call stack

4. **Memoization Benefits**:
   - `sum_to_n_f` shows O(1) performance after first call
   - Useful when function is called repeatedly with same values

5. **Array Operations Overhead**:
   - `sum_to_n_d` (Array reduce) is slowest among O(n) implementations
   - Creates array overhead: ~9.70 KB memory for n=1000

### Performance Recommendations

- **For single calls**: Use `sum_to_n_c` (Mathematical Formula) - fastest and most efficient
- **For repeated calls**: Use `sum_to_n_f` (Memoized) - O(1) after first call
- **For readability**: Use `sum_to_n_a` (Iterative) - simple and clear
- **Avoid for large n**: `sum_to_n_b` (Regular Recursion) - risk of stack overflow

## Example Output

When you run the files, you'll see detailed performance metrics:

```
============================================================
Testing sum_to_n functions with Performance Metrics
============================================================

--- Testing with n=1000 (larger value for better comparison) ---

sum_to_n_a(1000):
  Result: 500500
  Execution Time: 0.0153 ms
  Memory Used: 432.00 B
  Memory Before: 121.64 MB
  Memory After: 121.64 MB

sum_to_n_b(1000):
  Result: 500500
  Execution Time: 0.0961 ms
  Memory Used: 2.23 KB
  Memory Before: 121.65 MB
  Memory After: 121.65 MB

sum_to_n_c(1000):
  Result: 500500
  Execution Time: 0.0003 ms
  Memory Used: 432.00 B
  Memory Before: 121.66 MB
  Memory After: 121.66 MB
```

## Complexity Summary

| Implementation | Time Complexity | Space Complexity | Best Use Case |
|----------------|----------------|------------------|---------------|
| A (Iterative) | O(n) | O(1) | General purpose, readable |
| B (Recursive) | O(n) | O(n) | Educational, small n |
| C (Formula) | **O(1)** | **O(1)** | **Production, any n** |
| D (Array Reduce) | O(n) | O(n) | Functional style |
| E (Tail-Recursive) | O(n) | O(1)* | Functional style |
| F (Memoized) | O(1)* | O(n) | Repeated calls |
| G (While Loop) | O(n) | O(1) | Alternative iteration |
| H (Bit Manipulation) | **O(1)** | **O(1)** | Low-level optimization |

*Theoretical, may vary in practice

## License

ISC

