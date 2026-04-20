// Player outline silhouettes — SVG filter extracts the contour from cutout PNGs
import React from 'react';

const FILTER_ID = 'player-outline-gold';

function OutlineFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter
          id={FILTER_ID}
          x="-8%" y="-8%" width="116%" height="116%"
          colorInterpolationFilters="sRGB"
        >
          {/* Dilate the alpha channel outward */}
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="dilated" />
          {/* Subtract original alpha → just the outline band */}
          <feComposite in="dilated" in2="SourceAlpha" operator="out" result="border" />
          {/* Flood with light grey */}
          <feFlood floodColor="#b8c8d8" floodOpacity="1" result="grey" />
          {/* Mask grey to the border shape */}
          <feComposite in="grey" in2="border" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

interface OutlineProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

function PlayerOutline({ src, className, style }: OutlineProps) {
  return (
    <svg
      className={className}
      style={{ overflow: 'visible', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href={src}
        width="100%"
        height="100%"
        filter={`url(#${FILTER_ID})`}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

export function PlayerSilhouettesBackground() {
  return (
    <>
      <OutlineFilter />
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">

        {/* Left — Modric running, nearly full height */}
        <PlayerOutline
          src="/silhouettes/modric.png"
          style={{ position: 'absolute', top: '-5%', left: '-6%', height: '95vh', width: 'auto', opacity: 0.22 }}
        />

        {/* Right — Van Dijk roaring, nearly full height */}
        <PlayerOutline
          src="/silhouettes/vandijk.png"
          style={{ position: 'absolute', top: '-5%', right: '-6%', height: '95vh', width: 'auto', opacity: 0.2, transform: 'scaleX(-1)' }}
        />

        {/* Centre-left — Mane */}
        <PlayerOutline
          src="/silhouettes/mane.png"
          style={{ position: 'absolute', bottom: '-5%', left: '12%', height: '80vh', width: 'auto', opacity: 0.17 }}
        />

        {/* Centre-right — Silva */}
        <PlayerOutline
          src="/silhouettes/silva.png"
          style={{ position: 'absolute', bottom: '-5%', right: '12%', height: '80vh', width: 'auto', opacity: 0.17, transform: 'scaleX(-1)' }}
        />

        {/* Far left bottom — Kane */}
        <PlayerOutline
          src="/silhouettes/kane.png"
          style={{ position: 'absolute', bottom: '-8%', left: '-2%', height: '70vh', width: 'auto', opacity: 0.15 }}
        />

        {/* Far right bottom — Rodri */}
        <PlayerOutline
          src="/silhouettes/rodri.png"
          style={{ position: 'absolute', bottom: '-6%', right: '-2%', height: '65vh', width: 'auto', opacity: 0.15, transform: 'scaleX(-1)' }}
        />

      </div>
    </>
  );
}
