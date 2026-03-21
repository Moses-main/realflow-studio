import { useEffect, useState, useCallback, useMemo } from "react";
import { useReactFlow, useViewport } from "@xyflow/react";

export interface MobileConfig {
  isMobile: boolean;
  isTablet: boolean;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  optimalNodeSize: "small" | "medium" | "large";
  enableMinimap: boolean;
  enableZoomControls: boolean;
  panOnScroll: boolean;
  nodeSpacing: number;
  touchAction: string;
}

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

const MOBILE_OPTIMAL_NODE_SIZE = {
  small: 120,
  medium: 160,
  large: 200,
} as const;

export function useMobileOptimization(): MobileConfig & {
  zoomToFit: () => void;
  setZoomLevel: (level: number) => void;
  getZoomLevel: () => number;
} {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const reactFlow = useReactFlow();
  const viewport = useViewport();

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };

    updateDimensions();
    checkTouchDevice();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isMobile = dimensions.width < BREAKPOINTS.mobile;
  const isTablet = dimensions.width >= BREAKPOINTS.mobile && dimensions.width < BREAKPOINTS.tablet;

  const config = useMemo<MobileConfig>(() => {
    const screenArea = dimensions.width * dimensions.height;
    const isSmallScreen = screenArea < 500000;

    return {
      isMobile,
      isTablet,
      isTouchDevice,
      screenWidth: dimensions.width,
      screenHeight: dimensions.height,
      optimalNodeSize: isMobile
        ? isSmallScreen ? "small" : "medium"
        : "large",
      enableMinimap: !isMobile,
      enableZoomControls: true,
      panOnScroll: isMobile || isTouchDevice,
      nodeSpacing: isMobile ? 100 : 150,
      touchAction: isMobile ? "none" : "pan",
    };
  }, [isMobile, isTablet, isTouchDevice, dimensions]);

  const zoomToFit = useCallback(() => {
    reactFlow.fitView({
      padding: config.isMobile ? 0.3 : 0.2,
      duration: 300,
    });
  }, [reactFlow, config.isMobile]);

  const setZoomLevel = useCallback(
    (level: number) => {
      const clampedLevel = Math.max(0.1, Math.min(2, level));
      reactFlow.zoomTo(clampedLevel, { duration: 200 });
    },
    [reactFlow]
  );

  const getZoomLevel = useCallback(() => {
    return viewport.zoom || 1;
  }, [viewport.zoom]);

  return {
    ...config,
    zoomToFit,
    setZoomLevel,
    getZoomLevel,
  };
}

export function useTouchGestures() {
  const [isPinching, setIsPinching] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const reactFlow = useReactFlow();

  useEffect(() => {
    let lastDistance = 0;
    let initialZoom = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        setIsPinching(true);
        lastDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoom = reactFlow.getViewport().zoom;
      } else if (e.touches.length === 1) {
        setIsPanning(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinching) {
        e.preventDefault();
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const scale = currentDistance / lastDistance;
        const newZoom = Math.max(0.1, Math.min(4, initialZoom * scale));

        reactFlow.zoomTo(newZoom, { duration: 0 });
      }
    };

    const handleTouchEnd = () => {
      setIsPinching(false);
      setIsPanning(false);
    };

    const container = document.querySelector(".react-flow") as HTMLElement;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", handleTouchEnd);
      container.addEventListener("touchcancel", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
        container.removeEventListener("touchcancel", handleTouchEnd);
      }
    };
  }, [reactFlow, isPinching]);

  return { isPinching, isPanning };
}

export function useResponsiveMinimap() {
  const mobileConfig = useMobileOptimization();

  return {
    visible: mobileConfig.enableMinimap,
    position: mobileConfig.isMobile ? "bottom-left" as const : "bottom-right" as const,
    size: mobileConfig.isMobile ? 80 : 120,
    padding: mobileConfig.isMobile ? 10 : 20,
  };
}
