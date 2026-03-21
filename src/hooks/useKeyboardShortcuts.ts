import { useEffect, useCallback, useState, useRef } from "react";

interface KeyboardShortcutsOptions {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onSelectAll?: () => void;
  onSave?: () => void;
  onSpaceDown?: () => void;
  onSpaceUp?: () => void;
  enabled?: boolean;
}

/**
 * Hook to handle keyboard shortcuts for the canvas builder
 * 
 * Supported Shortcuts:
 * - Ctrl/Cmd + Z: Undo
 * - Ctrl/Cmd + Shift + Z: Redo (or Ctrl/Cmd + Y)
 * - Ctrl/Cmd + C: Copy
 * - Ctrl/Cmd + V: Paste
 * - Ctrl/Cmd + A: Select All
 * - Ctrl/Cmd + S: Save
 * - Delete/Backspace: Delete selected
 * - Space (hold): Pan mode
 * 
 * @param options - Callback functions for each shortcut
 */
export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onDelete,
  onCopy,
  onPaste,
  onSelectAll,
  onSave,
  onSpaceDown,
  onSpaceUp,
  enabled = true,
}: KeyboardShortcutsOptions) {
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const isMac = useRef(navigator.platform.toUpperCase().indexOf("MAC") >= 0);

  // Check if we're in an input field
  const isInputField = useCallback((target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    return (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      if (isInputField(e.target)) return;

      const ctrlKey = isMac.current ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (ctrlKey && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((ctrlKey && e.shiftKey && e.key === "z") || (ctrlKey && e.key === "y")) {
        e.preventDefault();
        onRedo?.();
        return;
      }

      // Copy: Ctrl/Cmd + C
      if (ctrlKey && e.key === "c") {
        e.preventDefault();
        onCopy?.();
        return;
      }

      // Paste: Ctrl/Cmd + V
      if (ctrlKey && e.key === "v") {
        e.preventDefault();
        onPaste?.();
        return;
      }

      // Select All: Ctrl/Cmd + A
      if (ctrlKey && e.key === "a") {
        e.preventDefault();
        onSelectAll?.();
        return;
      }

      // Save: Ctrl/Cmd + S
      if (ctrlKey && e.key === "s") {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete?.();
        return;
      }

      // Escape: Deselect all
      if (e.key === "Escape") {
        e.preventDefault();
        // This could be used to deselect
        return;
      }

      // Space: Pan mode (hold)
      if (e.key === " " && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
        onSpaceDown?.();
      }
    },
    [enabled, onUndo, onRedo, onCopy, onPaste, onSelectAll, onSave, onDelete, onSpaceDown, isSpacePressed, isInputField]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " ") {
        setIsSpacePressed(false);
        onSpaceUp?.();
      }
    },
    [onSpaceUp]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  return { isSpacePressed };
}

/**
 * Hook to detect if a specific key is currently pressed
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}
