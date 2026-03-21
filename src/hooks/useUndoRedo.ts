import { useCallback, useRef, useState, useEffect } from "react";
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

export function useUndoRedo(
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((prev: Edge[])=> Edge[])) => void,
  maxHistory: number = 50
): UseUndoRedoReturn {
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  
  // Store latest nodes/edges in refs for access in callbacks
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const isUndoRedoRef = useRef(false);
  const lastPushedRef = useRef<string>("");
  
  // Update refs when nodes/edges change
  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  const getStateHash = (nodes: Node[], edges: Edge[]): string => {
    const nodesJson = JSON.stringify(nodes.map(n => ({ id: n.id, position: n.position })));
    const edgesJson = JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    return `${nodesJson}:${edgesJson}`;
  };

  const pushToHistory = useCallback(() => {
    if (isUndoRedoRef.current) return;

    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    const stateHash = getStateHash(currentNodes, currentEdges);
    
    if (stateHash === lastPushedRef.current) return;
    
    const newState: HistoryState = { 
      nodes: JSON.parse(JSON.stringify(currentNodes)), 
      edges: JSON.parse(JSON.stringify(currentEdges)) 
    };
    
    setPast(prev => {
      const newPast = [...prev, newState];
      if (newPast.length > maxHistory) {
        newPast.shift();
      }
      return newPast;
    });
    
    setFuture([]);
    lastPushedRef.current = stateHash;
  }, [maxHistory]);

  const undo = useCallback((): HistoryState | null => {
    if (past.length === 0) return null;
    
    isUndoRedoRef.current = true;
    
    const previous = past[past.length - 1];
    const currentState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodesRef.current)),
      edges: JSON.parse(JSON.stringify(edgesRef.current))
    };
    
    // Add current state to future
    setFuture(prev => [currentState, ...prev]);
    
    // Remove last state from past
    setPast(prev => prev.slice(0, -1));
    
    // Restore previous state
    setNodes(previous.nodes);
    setEdges(previous.edges);
    
    // Update hash to prevent re-pushing
    lastPushedRef.current = getStateHash(previous.nodes, previous.edges);
    
    // Reset flag
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 100);
    
    return previous;
  }, [past, setNodes, setEdges]);

  const redo = useCallback((): HistoryState | null => {
    if (future.length === 0) return null;
    
    isUndoRedoRef.current = true;
    
    const next = future[0];
    const currentState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodesRef.current)),
      edges: JSON.parse(JSON.stringify(edgesRef.current))
    };
    
    // Add current state to past
    setPast(prev => [...prev, currentState]);
    
    // Remove first state from future
    setFuture(prev => prev.slice(1));
    
    // Restore next state
    setNodes(next.nodes);
    setEdges(next.edges);
    
    // Update hash to prevent re-pushing
    lastPushedRef.current = getStateHash(next.nodes, next.edges);
    
    // Reset flag
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 100);
    
    return next;
  }, [future, setNodes, setEdges]);

  const clear = useCallback(() => {
    setPast([]);
    setFuture([]);
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
