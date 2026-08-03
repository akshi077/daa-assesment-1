import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  {
    id: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    allocatedMarks: 15,
    statement:
      'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order. The final sorted array should not be returned by the function — instead it must be stored inside nums1. To accommodate this, nums1 has a length of m + n, where the first m elements are the elements to be merged and the last n elements are 0 placeholders to be ignored/overwritten. nums2 has a length of n.',
    inputFormat:
      'nums1: integer array of size m + n\nm: integer count of initialized elements in nums1\nnums2: integer array of size n\nn: integer count of elements in nums2',
    outputFormat:
      'Void method. Modifies nums1 in-place. Output is evaluated by reading the modified nums1 array.',
    constraints: [
      'nums1.length == m + n',
      'nums2.length == n',
      '0 <= m, n <= 200',
      '1 <= m + n <= 200',
      '-10^9 <= nums1[i], nums2[j] <= 10^9',
      'nums1 and nums2 are sorted in non-decreasing order.'
    ],
    starterTemplate: `public class Solution {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        // Modify nums1 in-place, do not return anything
    }
}`,
    sampleIO: [
      {
        input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
        output: '[1, 2, 2, 3, 5, 6]',
        explanation: 'The arrays being merged are [1,2,3] and [2,5,6]. Result stored in nums1 is [1,2,2,3,5,6].'
      },
      {
        input: 'nums1 = [1], m = 1, nums2 = [], n = 0',
        output: '[1]',
        explanation: 'The arrays being merged are [1] and []. Result stored in nums1 is [1].'
      },
      {
        input: 'nums1 = [0], m = 0, nums2 = [1], n = 1',
        output: '[1]',
        explanation: 'The arrays being merged are [] and [1]. Result stored in nums1 is [1].'
      }
    ],
    testCases: [
      {
        id: 'msa-1',
        input: 'nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3',
        expectedOutput: '[1, 2, 2, 3, 5, 6]',
        isHidden: false,
        description: 'Standard merge with overlapping values'
      },
      {
        id: 'msa-2',
        input: 'nums1=[1], m=1, nums2=[], n=0',
        expectedOutput: '[1]',
        isHidden: false,
        description: 'Empty second array'
      },
      {
        id: 'msa-3',
        input: 'nums1=[0], m=0, nums2=[1], n=1',
        expectedOutput: '[1]',
        isHidden: false,
        description: 'Empty first array (m=0)'
      },
      {
        id: 'msa-4',
        input: 'nums1=[4,5,6,0,0,0], m=3, nums2=[1,2,3], n=3',
        expectedOutput: '[1, 2, 3, 4, 5, 6]',
        isHidden: true,
        description: 'All elements in nums2 are smaller than nums1'
      },
      {
        id: 'msa-5',
        input: 'nums1=[0,0,0,0], m=0, nums2=[1,2,3,4], n=4',
        expectedOutput: '[1, 2, 3, 4]',
        isHidden: true,
        description: 'All elements coming from nums2'
      }
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    allocatedMarks: 15,
    statement:
      'Given an array of integers arr sorted in non-decreasing order and an integer target, write a function to search target in arr. If target exists, then return its 0-based index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    inputFormat: 'arr: sorted integer array\ntarget: target integer to search for',
    outputFormat: 'Returns the 0-based index of target if found, else -1.',
    constraints: [
      '0 <= arr.length <= 10^4',
      '-10^4 <= arr[i], target <= 10^4',
      'All integers in arr are unique.',
      'arr is sorted in ascending order.'
    ],
    starterTemplate: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        // Write your code here
        return -1;
    }
}`,
    sampleIO: [
      {
        input: 'arr = [1,3,5,7,9,11], target = 7',
        output: '3',
        explanation: '7 exists in arr and its index is 3.'
      },
      {
        input: 'arr = [2,4,6,8], target = 5',
        output: '-1',
        explanation: '5 does not exist in arr so return -1.'
      }
    ],
    testCases: [
      {
        id: 'bs-1',
        input: 'arr=[1,3,5,7,9,11], target=7',
        expectedOutput: '3',
        isHidden: false,
        description: 'Target exists in middle'
      },
      {
        id: 'bs-2',
        input: 'arr=[2,4,6,8], target=5',
        expectedOutput: '-1',
        isHidden: false,
        description: 'Target absent'
      },
      {
        id: 'bs-3',
        input: 'arr=[10], target=10',
        expectedOutput: '0',
        isHidden: false,
        description: 'Single element array (target found)'
      },
      {
        id: 'bs-4',
        input: 'arr=[], target=1',
        expectedOutput: '-1',
        isHidden: true,
        description: 'Empty array boundary case'
      },
      {
        id: 'bs-5',
        input: 'arr=[1,2,3,4,5], target=1',
        expectedOutput: '0',
        isHidden: true,
        description: 'Target at first position'
      }
    ]
  },
  {
    id: 'matrix-multiplication',
    title: 'Matrix Multiplication',
    allocatedMarks: 20,
    statement:
      'Given two 2D integer matrices A of dimensions (m x n) and B of dimensions (n x p), calculate and return the product matrix C of dimensions (m x p) where C[i][j] is the dot product of row i of matrix A and column j of matrix B.',
    inputFormat: 'A: 2D integer array (m x n)\nB: 2D integer array (n x p)',
    outputFormat: 'Returns a 2D integer array C of size (m x p).',
    constraints: [
      '1 <= m, n, p <= 100',
      '-100 <= A[i][j], B[i][j] <= 100',
      'The number of columns in A equals the number of rows in B.'
    ],
    starterTemplate: `public class Solution {
    public static int[][] multiply(int[][] A, int[][] B) {
        // Write your code here
        return new int[0][0];
    }
}`,
    sampleIO: [
      {
        input: 'A = [[1,2],[3,4]], B = [[5,6],[7,8]]',
        output: '[[19, 22], [43, 50]]',
        explanation: 'C[0][0] = 1*5 + 2*7 = 19; C[0][1] = 1*6 + 2*8 = 22; C[1][0] = 3*5 + 4*7 = 43; C[1][1] = 3*6 + 4*8 = 50.'
      },
      {
        input: 'A = [[1,0],[0,1]], B = [[2,3],[4,5]]',
        output: '[[2, 3], [4, 5]]',
        explanation: 'Multiplying by identity matrix returns B.'
      }
    ],
    testCases: [
      {
        id: 'mm-1',
        input: 'A=[[1,2],[3,4]], B=[[5,6],[7,8]]',
        expectedOutput: '[[19, 22], [43, 50]]',
        isHidden: false,
        description: '2x2 Matrix Multiplication'
      },
      {
        id: 'mm-2',
        input: 'A=[[1,0],[0,1]], B=[[2,3],[4,5]]',
        expectedOutput: '[[2, 3], [4, 5]]',
        isHidden: false,
        description: 'Identity matrix product'
      },
      {
        id: 'mm-3',
        input: 'A=[[1,2,3]], B=[[1],[1],[1]]',
        expectedOutput: '[[6]]',
        isHidden: false,
        description: 'Vector row and column product (1x3 * 3x1 -> 1x1)'
      },
      {
        id: 'mm-4',
        input: 'A=[[2]], B=[[3]]',
        expectedOutput: '[[6]]',
        isHidden: true,
        description: '1x1 Scalar matrices product'
      },
      {
        id: 'mm-5',
        input: 'A=[[1,1],[1,1]], B=[[1,1],[1,1]]',
        expectedOutput: '[[2, 2], [2, 2]]',
        isHidden: true,
        description: 'All ones 2x2 matrix product'
      }
    ]
  }
];
