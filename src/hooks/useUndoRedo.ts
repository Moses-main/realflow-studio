import { useCallback, useRef, useState } from "react";
import type { Node, Edge } from "@xyflow/react";

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface UseUndoRedoReturn {
  pushToHistory: () => void;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  getHistory: () => { past: HistoryState[]; future: HistoryState[] };
}

/**
 * Hook for undo/redo functionality in the canvas builder
 * 
 * Features:
 * - Stores history of node and edge states
 * - Batches rapid changes (within 300ms)
 * - Respects max history limit
 * - Provides canUndo/canRedo flags
 * 
 * Usage:
 * - Call pushToHistory() after making changes
 * - Use undo()/redo() to restore states
 * 
 * @param nodes - Current nodes state
 * @param edges - Current edges state
 * @param setNodes - Function to update nodes
 * @param setEdges - Function to update edges
 * @param maxHistory - Maximum history size (default: 50)
 */
export function useUndoRedo(
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((prev: Edge[])=> Edge[])) => void,
  maxHistory: number = 50
): UseUndoRedoReturn {
  // Past states (undo stack)
  const [past, setPast] = useState<HistoryState[]>([]);
  // Future states (redo stack)
  const [future, setFuture] = useState<HistoryState[]>([]);
  
  // Pending state for batching
  const pendingRef = useRef<Node[] | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Push current state to history
  const pushToHistory = useCallback(() => {
    const currentState: HistoryState = { nodes, edges };
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Batch: if we already have a pending state, update it instead of creating new history
    if (pendingRef.current !== null) {
      pendingRef.current = nodes;
      return;
    }
    
    // Create new pending state
    pendingRef.current = nodes;
    
    // Batch rapid changes within 300ms
    timeoutRef.current = setTimeout(() => {
      setPast((prevPast) => {
        // Add current state to history
        const newPast = [...prevPast, currentState];
        
        // Limit history size
        if (newPast.length > maxHistory) {
          newPast.shift();
        }
        
        return newPast;
      });
      
      // Clear future (redo stack) when new action is taken
      setFuture([]);
      
      // Reset pending
      pendingRef.current = null;
      timeoutRef.current = null;
    }, 300);
  }, [nodes, edges, maxHistory]);

  // Undo last action
  const undo = useCallback((): HistoryState | null => {
    if (past.length === 0) return null;
    
    // Clear pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      pendingRef.current = null;
    }
    
    const previous = past[past.length - 1];
    
    // Add current state to future (redo stack)
    setFuture((prevFuture) => [
      { nodes, edges },
      ...prevFuture,
    ]);
    
    // Remove last state from past
    setPast((prevPast) => prevPast.slice(0, -1));
    
    // Update nodes and edges
    setNodes(previous.nodes);
    setEdges(previous.edges);
    
    return previous;
  }, [past, nodes, edges, setNodes, setEdges]);

  // Redo previously undone action
  const redo = useCallback((): HistoryState | null => {
    if (future.length === 0) return null;
    
    const next = future[0];
    
    // Add current state to past (undo stack)
    setPast((prevPast) => [
      ...prevPast,
      { nodes, edges },
    ]);
    
    // Remove first state from future
    setFuture((prevFuture) => prevFuture.slice(1));
    
    // Update nodes and edges
    setNodes(next.nodes);
    setEdges(next.edges);
    
    return next;
  }, [future, nodes, edges, setNodes, setEdges]);

  // Clear all history
  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setPast([]);
    setFuture([]);
    pendingRef.current = null;
  }, []);

  // Get current history state
  const getHistory = useCallback(() => ({
    past,
    future,
  }), [past, future]);

  return {
    pushToHistory,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    clear,
    getHistory,
  };
}
