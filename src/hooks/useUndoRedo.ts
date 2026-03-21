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

function areStatesEqual(a: HistoryState, b: HistoryState): boolean {
  if (a.nodes.length !== b.nodes.length || a.edges.length !== b.edges.length) {
    return false;
  }
  
  const nodesJson = JSON.stringify(a.nodes.map(n => ({ id: n.id, position: n.position, type: n.type })));
  const nodesJsonB = JSON.stringify(b.nodes.map(n => ({ id: n.id, position: n.position, type: n.type })));
  
  const edgesJson = JSON.stringify(a.edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
  const edgesJsonB = JSON.stringify(b.edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
  
  return nodesJson === nodesJsonB && edgesJson === edgesJsonB;
}

export function useUndoRedo(
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((prev: Edge[])=> Edge[])) => void,
  maxHistory: number = 50
): UseUndoRedoReturn {
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  
  const pendingRef = useRef<Node[] | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPushedRef = useRef<string>("");
  const isUndoRedoRef = useRef<boolean>(false);

  const getStateHash = (nodes: Node[], edges: Edge[]): string => {
    const nodesHash = JSON.stringify(nodes.map(n => ({ id: n.id, position: n.position })));
    // Fixed: was e.target twice, should be e.source and e.target
    const edgesHash = JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    return `${nodesHash}:${edgesHash}`;
  };

  const pushToHistory = useCallback(() => {
    // Skip if we're in the middle of an undo/redo operation
    if (isUndoRedoRef.current) {
      return;
    }

    const currentState: HistoryState = { nodes, edges };
    const stateHash = getStateHash(nodes, edges);
    
    if (stateHash === lastPushedRef.current) {
      return;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (pendingRef.current !== null) {
      const pendingState = { nodes: pendingRef.current, edges };
      if (areStatesEqual(pendingState, currentState)) {
        return;
      }
      pendingRef.current = nodes;
      return;
    }
    
    pendingRef.current = nodes;
    
    timeoutRef.current = setTimeout(() => {
      setPast((prevPast) => {
        const newPast = [...prevPast, currentState];
        
        if (newPast.length > maxHistory) {
          newPast.shift();
        }
        
        return newPast;
      });
      
      setFuture([]);
      
      lastPushedRef.current = getStateHash(currentState.nodes, currentState.edges);
      pendingRef.current = null;
      timeoutRef.current = null;
    }, 300);
  }, [nodes, edges, maxHistory]);

  const undo = useCallback((): HistoryState | null => {
    if (past.length === 0) return null;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      pendingRef.current = null;
    }
    
    const previous = past[past.length - 1];
    
    // Set flag to prevent pushToHistory from firing
    isUndoRedoRef.current = true;
    
    setFuture((prevFuture) => [
      { nodes, edges },
      ...prevFuture,
    ]);
    
    setPast((prevPast) => prevPast.slice(0, -1));
    
    setNodes(previous.nodes);
    setEdges(previous.edges);
    
    // Update the last pushed hash to the restored state
    lastPushedRef.current = getStateHash(previous.nodes, previous.edges);
    
    // Reset flag after state update
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 50);
    
    return previous;
  }, [past, nodes, edges, setNodes, setEdges]);

  const redo = useCallback((): HistoryState | null => {
    if (future.length === 0) return null;
    
    const next = future[0];
    
    // Set flag to prevent pushToHistory from firing
    isUndoRedoRef.current = true;
    
    setPast((prevPast) => [
      ...prevPast,
      { nodes, edges },
    ]);
    
    setFuture((prevFuture) => prevFuture.slice(1));
    
    setNodes(next.nodes);
    setEdges(next.edges);
    
    // Update the last pushed hash to the restored state
    lastPushedRef.current = getStateHash(next.nodes, next.edges);
    
    // Reset flag after state update
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 50);
    
    return next;
  }, [future, nodes, edges, setNodes, setEdges]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setPast([]);
    setFuture([]);
    pendingRef.current = null;
    lastPushedRef.current = "";
  }, []);

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
