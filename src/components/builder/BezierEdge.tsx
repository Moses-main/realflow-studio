import { memo, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  useReactFlow,
} from "@xyflow/react";

/**
 * Custom BezierEdge - Professional curved edge with modern styling
 * 
 * Features:
 * - Smooth bezier curve with configurable curvature
 * - Hover effects with animated flow
 * - Delete button on hover/selection
 * - Professional dark theme colors
 */
export const BezierEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();

  // Calculate bezier path with optimal curvature
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.25,
  });

  // Handle edge deletion
  const onDelete = useCallback(() => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  }, [id, setEdges]);

  // Style based on state
  const strokeColor = selected ? "#818cf8" : (data?.color as string) || "#6366f1";
  const strokeWidth = selected ? 3 : 2;
  const strokeOpacity = selected ? 1 : 0.8;

  return (
    <>
      {/* Main edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeOpacity,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
      />

      {/* Delete button (visible on hover/selection) */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all" as const,
          }}
          className="nodrag nopan"
        >
          <button
            onClick={onDelete}
            onMouseDown={(e) => e.stopPropagation()}
            className={`
              w-5 h-5 rounded-full flex items-center justify-center
              bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold
              shadow-lg transition-all duration-200
              ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
            `}
            title="Delete connection"
            type="button"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

BezierEdge.displayName = "BezierEdge";

export default BezierEdge;
