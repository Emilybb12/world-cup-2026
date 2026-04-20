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
          {/* Flood with gold */}
          <feFlood floodColor="#c9a832" floodOpacity="1" result="gold" />
          {/* Mask gold to the border shape */}
          <feComposite in="gold" in2="border" operator="in" />
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

        {/* Top-left — Modric running */}
        <PlayerOutline
          src="/silhouettes/modric.png"
          style={{ position: 'absolute', top: '-6%', left: '-3%', width: '26vw', maxWidth: 300, opacity: 0.18 }}
        />

        {/* Top-right — Van Dijk roaring */}
        <PlayerOutline
          src="/silhouettes/vandijk.png"
          style={{ position: 'absolute', top: '-4%', right: '-1%', width: '24vw', maxWidth: 280, opacity: 0.16, transform: 'scaleX(-1)' }}
        />

        {/* Left middle — Mane running */}
        <PlayerOutline
          src="/silhouettes/mane.png"
          style={{ position: 'absolute', top: '30%', left: '-2%', width: '22vw', maxWidth: 250, opacity: 0.15 }}
        />

        {/* Right middle — Silva running */}
        <PlayerOutline
          src="/silhouettes/silva.png"
          style={{ position: 'absolute', top: '27%', right: '-2%', width: '24vw', maxWidth: 270, opacity: 0.15, transform: 'scaleX(-1)' }}
        />

        {/* Bottom-left — Kane celebrating */}
        <PlayerOutline
          src="/silhouettes/kane.png"
          style={{ position: 'absolute', bottom: '-2%', left: '-1%', width: '22vw', maxWidth: 250, opacity: 0.15 }}
        />

        {/* Bottom-right — Rodri fist pump */}
        <PlayerOutline
          src="/silhouettes/rodri.png"
          style={{ position: 'absolute', bottom: '-4%', right: '2%', width: '18vw', maxWidth: 210, opacity: 0.14, transform: 'scaleX(-1)' }}
        />

      </div>
    </>
  );
}
