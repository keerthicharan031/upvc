'use client';
import React, { useState, useRef, useSyncExternalStore } from 'react';

interface BumpListProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxScale?: number;
  neighborScale?: number;
  direction?: 'horizontal' | 'vertical';
  liftPx?: number;
}

const emptySubscribe = () => () => {};
function useIsTouchCapable() {
  return useSyncExternalStore(
    emptySubscribe,
    () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    () => false
  );
}

export default function BumpList({
  children,
  className = '',
  style = {},
  maxScale = 1.1,
  neighborScale = 1.04,
  direction = 'horizontal',
  liftPx = -4,
}: BumpListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isTouch = useIsTouchCapable();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !containerRef.current) return;
    const items = Array.from(containerRef.current.children) as HTMLElement[];
    let closestIndex: number | null = null;
    let minDistance = Infinity;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const center =
        direction === 'horizontal'
          ? rect.left + rect.width / 2
          : rect.top + rect.height / 2;
      const mousePos = direction === 'horizontal' ? e.clientX : e.clientY;
      const dist = Math.abs(mousePos - center);

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = index;
      }
    });

    setHoveredIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const childArray = React.Children.toArray(children);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bump-list-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        gap: style.gap || '0.5rem',
        ...style,
      }}
    >
      {childArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        let scale = 1;
        let translateY = 0;
        let shadowOpacity = 0;

        if (!isTouch && hoveredIndex !== null) {
          const delta = Math.abs(hoveredIndex - index);
          if (delta === 0) {
            scale = maxScale;
            translateY = liftPx;
            shadowOpacity = 0.3;
          } else if (delta === 1) {
            scale = neighborScale;
            translateY = Math.round(liftPx * 0.45);
            shadowOpacity = 0.12;
          } else if (delta === 2) {
            scale = 1 + (neighborScale - 1) * 0.3;
            translateY = Math.round(liftPx * 0.2);
          }
        }

        return (
          <div
            key={child.key || index}
            className="bump-item-wrapper"
            style={{
              transition: 'transform 220ms cubic-bezier(0.2, 0, 0, 1), box-shadow 220ms ease',
              transform: `translateY(${translateY}px) scale(${scale})`,
              transformOrigin: direction === 'horizontal' ? 'center bottom' : 'left center',
              zIndex: hoveredIndex === index ? 10 : 1,
              borderRadius: '0.625rem',
              boxShadow:
                shadowOpacity > 0
                  ? `0 12px 24px -6px rgba(62,123,250, ${shadowOpacity})`
                  : 'none',
              willChange: 'transform',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
