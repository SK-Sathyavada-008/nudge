import type { TriviaItem } from '../types';

export const TRIVIA_QUESTIONS: TriviaItem[] = [
  {
    id: 't-1',
    question: 'What is the average time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 1,
    explanation: 'Balanced BST cuts the search space in half with every comparison, yielding O(log N) time.',
  },
  {
    id: 't-2',
    question: 'Which data structure is primarily used to implement Breadth-First Search (BFS)?',
    options: ['Stack', 'Priority Queue', 'Queue', 'Hash Set'],
    correctIndex: 2,
    explanation: 'BFS explores node level-by-level in First-In, First-Out (FIFO) order, which is the definition of a Queue.',
  },
  {
    id: 't-3',
    question: 'What is the worst-case time complexity of QuickSort if pivot selection is poor (e.g. already sorted array without random pivot)?',
    options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)'],
    correctIndex: 2,
    explanation: 'When partitioning creates unbalanced sub-arrays (1 and N-1 elements), QuickSort degenerates to O(N^2).',
  },
  {
    id: 't-4',
    question: 'In a graph with V vertices and E edges, what is the time complexity of Dijkstra using a Min-Heap (Priority Queue)?',
    options: ['O(V + E)', 'O((V + E) log V)', 'O(V^2)', 'O(E^2)'],
    correctIndex: 1,
    explanation: 'Dijkstra with a binary min-heap runs in O((V + E) log V) time.',
  },
  {
    id: 't-5',
    question: 'How many comparisons does Binary Search take in the worst case for an array of 1,000,000 elements?',
    options: ['Around 10', 'Around 20', 'Around 100', 'Around 500'],
    correctIndex: 1,
    explanation: 'log2(1,000,000) is approximately 19.93, so at most 20 comparisons!',
  },
];
