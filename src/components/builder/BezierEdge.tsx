import { memo, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  useReactFlow,
} from "@xyflow/react";

/**
 * Custom AnimatedDottedEdge - Dotted animated edge showing data flow
 * 
 * Features:
 * - Smooth bezier curve with configurable curvature
 * - Animated dotted line showing flow direction
 * - Hover effects
 * - Delete button on selection
 */
export const AnimatedDottedEdge = memo(({
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
  const flowSpeed = data?.speed || 1;

  return (
    <>
      {/* Background glow effect */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth + 8}
        strokeOpacity={0.1}
        filter="blur(4px)"
      />

      {/* Main dotted animated edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: "8 4",
          strokeLinecap: "round",
          animation: `flowDash ${1 / flowSpeed}s linear infinite`,
        }}
      />

      {/* Animated flow indicator (moving dot) */}
      <circle r="3" fill={strokeColor} opacity={0.8}>
        <animateMotion
          dur={`${1 / flowSpeed}s`}
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>

      {/* Secondary dot for smoother flow */}
      <circle r="2" fill={strokeColor} opacity={0.5}>
        <animateMotion
          dur={`${1 / flowSpeed}s`}
          repeatCount="indefinite"
          path={edgePath}
          begin="0.5s"
        />
      </circle>

      {/* Delete button (visible on selection) */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all" as const,
          }}
          className="nodrag nopan"
        >
          {selected && (
            <button
              onClick={onDelete}
              onMouseDown={(e) => e.stopPropagation()}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                bg-red-500/90 hover:bg-red-500 text-white text-xs font-bold
                shadow-lg transition-all duration-200
              `}
              title="Delete connection"
              type="button"
            >
              ×
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

AnimatedDottedEdge.displayName = "AnimatedDottedEdge";

export default AnimatedDottedEdge;
