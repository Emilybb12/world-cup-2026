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

        {/* Top-left — Modric running */}
        <PlayerOutline
          src="/silhouettes/modric.png"
          style={{ position: 'absolute', top: '-8%', left: '-4%', width: '42vw', maxWidth: 520, opacity: 0.22 }}
        />

        {/* Top-right — Van Dijk roaring */}
        <PlayerOutline
          src="/silhouettes/vandijk.png"
          style={{ position: 'absolute', top: '-6%', right: '-4%', width: '38vw', maxWidth: 480, opacity: 0.2, transform: 'scaleX(-1)' }}
        />

        {/* Left middle — Mane running */}
        <PlayerOutline
          src="/silhouettes/mane.png"
          style={{ position: 'absolute', top: '25%', left: '-5%', width: '36vw', maxWidth: 440, opacity: 0.2 }}
        />

        {/* Right middle — Silva running */}
        <PlayerOutline
          src="/silhouettes/silva.png"
          style={{ position: 'absolute', top: '22%', right: '-5%', width: '36vw', maxWidth: 440, opacity: 0.2, transform: 'scaleX(-1)' }}
        />

        {/* Bottom-left — Kane celebrating */}
        <PlayerOutline
          src="/silhouettes/kane.png"
          style={{ position: 'absolute', bottom: '-8%', left: '-3%', width: '38vw', maxWidth: 460, opacity: 0.2 }}
        />

        {/* Bottom-right — Rodri fist pump */}
        <PlayerOutline
          src="/silhouettes/rodri.png"
          style={{ position: 'absolute', bottom: '-6%', right: '-2%', width: '32vw', maxWidth: 400, opacity: 0.19, transform: 'scaleX(-1)' }}
        />

      </div>
    </>
  );
}
