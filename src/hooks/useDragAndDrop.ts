import { useState, useEffect } from 'react';

export type DragFromType = { pile: number; index: number } | { source: 'waste' } | null;

export const useDragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragFrom, setDragFrom] = useState<DragFromType>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  const handleCardMouseDown = (pileIndex: number, cardIndex: number, e: React.MouseEvent) => {
    setDragFrom({ pile: pileIndex, index: cardIndex });
    setDragPos({
      x: e.clientX - 40,
      y: e.clientY - 60,
    });
    setIsDragging(true);
  };

  const handleWasteMouseDown = (e: React.MouseEvent) => {
    setDragFrom({ source: 'waste' });
    setDragPos({
      x: e.clientX - 40,
      y: e.clientY - 60,
    });
    setIsDragging(true);
  };

  const resetDrag = () => {
    setIsDragging(false);
    setDragFrom(null);
  };

  // Global mouse up and move handler for drag
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragFrom(null);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDragPos({
          x: e.clientX - 40,
          y: e.clientY - 60,
        });
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return {
    isDragging,
    dragFrom,
    dragPos,
    handleCardMouseDown,
    handleWasteMouseDown,
    resetDrag,
  };
};
