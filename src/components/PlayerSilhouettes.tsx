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

        {/* Far left — Ronaldo */}
        <PlayerOutline
          src="/silhouettes/ronaldo.png"
          style={{
            position: 'absolute',
            top: '-5%',
            left: '-8%',
            height: '110vh',
            width: 'auto',
            opacity: 0.22,
          }}
        />

        {/* Far right — Van Dijk */}
        <PlayerOutline
          src="/silhouettes/vandijk.png"
          style={{
            position: 'absolute',
            top: '-5%',
            right: '-8%',
            height: '110vh',
            width: 'auto',
            opacity: 0.2,
            transform: 'scaleX(-1)',
          }}
        />

        {/* Centre-left — Modric: desktop only */}
        <PlayerOutline
          src="/silhouettes/modric.png"
          className="hidden sm:block"
          style={{ position: 'absolute', bottom: '-5%', left: '8%', height: '85vh', width: 'auto', opacity: 0.18 }}
        />

        {/* Centre-right — Silva: desktop only */}
        <PlayerOutline
          src="/silhouettes/silva.png"
          className="hidden sm:block"
          style={{ position: 'absolute', bottom: '-5%', right: '8%', height: '85vh', width: 'auto', opacity: 0.18, transform: 'scaleX(-1)' }}
        />

        {/* Mid-left — Kane: desktop only */}
        <PlayerOutline
          src="/silhouettes/kane.png"
          className="hidden sm:block"
          style={{ position: 'absolute', top: '10%', left: '28%', height: '75vh', width: 'auto', opacity: 0.14 }}
        />

        {/* Mid-right — Neymar: desktop only */}
        <PlayerOutline
          src="/silhouettes/neymar.png"
          className="hidden sm:block"
          style={{ position: 'absolute', top: '10%', right: '28%', height: '75vh', width: 'auto', opacity: 0.14, transform: 'scaleX(-1)' }}
        />

      </div>
    </>
  );
}
