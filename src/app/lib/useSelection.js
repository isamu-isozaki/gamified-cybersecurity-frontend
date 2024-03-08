import { useEffect, useState } from 'react';

export const useSelection = (containerRef) => {
  const [isTextSelected, setIsTextSelected] = useState(false);

  const updateSelected = () => {
    const selection = window.getSelection();
    if (containerRef.current && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const { startContainer, endContainer } = range;

      const isWithin =
        containerRef.current.contains(startContainer) &&
        containerRef.current.contains(endContainer);
      setIsTextSelected(isWithin && !selection.isCollapsed);
    } else {
      setIsTextSelected(false);
    }
  };

  const getSelectedText = () => {
    return window.getSelection().toString();
  };

  useEffect(() => {
    document.addEventListener('selectionchange', updateSelected);

    return () => {
      document.removeEventListener('selectionchange', updateSelected);
    };
  });

  return { isTextSelected, getSelectedText };
};
