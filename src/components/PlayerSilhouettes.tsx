// SVG soccer player silhouettes — pose-based outlines of iconic players
import React from 'react';

// Vini Jr — samba celebration: left knee raised, right arm up, left arm out
function ViniJr({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 170 295" fill="currentColor" className={className} style={style}>
      {/* Head */}
      <ellipse cx="82" cy="22" rx="17" ry="19" />
      {/* Torso */}
      <path d="M60,42 L108,42 L114,115 L54,115 Z" />
      {/* Right arm raised high */}
      <path d="M106,54 L136,10 L143,18 L113,64 Z" />
      <ellipse cx="140" cy="14" rx="8" ry="7" />
      {/* Left arm out to side */}
      <path d="M62,60 L20,74 L18,84 L60,72 Z" />
      <ellipse cx="19" cy="79" rx="8" ry="7" />
      {/* Hips */}
      <path d="M56,113 L112,113 L108,140 L60,140 Z" />
      {/* Right standing leg */}
      <path d="M76,138 L70,202 L86,204 L92,140 Z" />
      <path d="M68,200 L62,256 L80,258 L86,202 Z" />
      <path d="M54,252 L46,268 L84,268 L80,252 Z" />
      {/* Left leg — thigh raises forward (samba knee lift) */}
      <path d="M90,136 L124,170 L136,164 L102,132 Z" />
      {/* Lower left leg kicks forward */}
      <path d="M122,168 L108,218 L122,222 L138,172 Z" />
    </svg>
  );
}

// Haaland — iconic meditation celebration: seated cross-legged, hands together, head bowed
function Haaland({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 230 210" fill="currentColor" className={className} style={style}>
      {/* Head, tilted forward slightly */}
      <ellipse cx="115" cy="28" rx="22" ry="24" transform="rotate(6 115 28)" />
      {/* Torso upright */}
      <path d="M84,55 L150,52 L153,118 L80,122 Z" />
      {/* Left arm angling down to prayer */}
      <path d="M84,78 L68,118 L80,124 L96,84 Z" />
      {/* Right arm angling down to prayer */}
      <path d="M148,76 L168,116 L156,122 L136,82 Z" />
      {/* Hands together — prayer clasp */}
      <path d="M86,120 L102,138 L128,138 L144,120 L116,128 Z" />
      {/* Lower torso / lap */}
      <path d="M80,118 L152,116 L158,152 L74,154 Z" />
      {/* Left leg crossing to the right */}
      <path d="M74,152 L38,170 L40,186 L78,168 Z" />
      <path d="M37,168 L64,192 L70,180 L43,158 Z" />
      {/* Right leg crossing to the left */}
      <path d="M156,150 L192,170 L190,186 L154,168 Z" />
      <path d="M190,168 L164,192 L158,180 L184,158 Z" />
      {/* Centre mass connecting legs */}
      <ellipse cx="115" cy="182" rx="36" ry="14" />
    </svg>
  );
}

// Mbappe — explosive sprint: body near-horizontal, arms close, one leg fully extended back
function Mbappe({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 200" fill="currentColor" className={className} style={style}>
      {/* Head forward */}
      <ellipse cx="268" cy="44" rx="18" ry="20" transform="rotate(-25 268 44)" />
      {/* Torso nearly horizontal, leaning hard forward */}
      <path d="M230,52 L272,28 L282,72 L238,92 Z" />
      {/* Left arm tucked back */}
      <path d="M234,70 L196,90 L200,102 L238,84 Z" />
      <ellipse cx="198" cy="96" rx="8" ry="7" />
      {/* Right arm driving forward */}
      <path d="M270,40 L244,12 L238,20 L264,50 Z" />
      <ellipse cx="241" cy="16" rx="8" ry="7" />
      {/* Hips */}
      <path d="M232,88 L280,68 L285,94 L237,116 Z" />
      {/* Drive leg (left) pushing off ground */}
      <path d="M235,114 L180,96 L176,110 L232,130 Z" />
      <path d="M178,94 L126,106 L128,120 L180,108 Z" />
      <path d="M120,102 L80,118 L86,128 L126,116 Z" />
      {/* Lift leg (right) knee up */}
      <path d="M270,90 L264,148 L278,152 L286,94 Z" />
      <path d="M262,146 L240,172 L252,180 L276,154 Z" />
    </svg>
  );
}

// Julian Alvarez — compact build, goal celebration: running with arm raised, fist pump
function JulianAlvarez({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 160 285" fill="currentColor" className={className} style={style}>
      {/* Head */}
      <ellipse cx="78" cy="22" rx="16" ry="18" />
      {/* Torso — compact, slightly leaning forward */}
      <path d="M58,40 L102,40 L106,110 L54,110 Z" />
      {/* Right arm — fist raised high in celebration */}
      <path d="M100,50 L118,4 L126,10 L108,58 Z" />
      <ellipse cx="122" cy="7" rx="8" ry="8" />
      {/* Left arm — back and low, sprinting */}
      <path d="M60,56 L30,82 L36,92 L66,66 Z" />
      <ellipse cx="33" cy="87" rx="7" ry="7" />
      {/* Hips */}
      <path d="M56,108 L104,108 L100,134 L60,134 Z" />
      {/* Forward leg */}
      <path d="M60,132 L46,192 L62,196 L76,136 Z" />
      <path d="M44,190 L36,242 L54,244 L62,192 Z" />
      <path d="M28,238 L20,252 L58,252 L54,238 Z" />
      {/* Back leg, trailing */}
      <path d="M90,132 L108,186 L122,182 L106,130 Z" />
      <path d="M106,184 L118,226 L132,222 L120,182 Z" />
    </svg>
  );
}

// Hakimi — explosive overlap run: full stride, high knee, leaning into the run
function Hakimi({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 210 280" fill="currentColor" className={className} style={style}>
      {/* Head tilted forward in sprint */}
      <ellipse cx="110" cy="24" rx="17" ry="19" transform="rotate(-15 110 24)" />
      {/* Torso leaning forward */}
      <path d="M78,44 L128,36 L136,106 L72,114 Z" />
      {/* Left arm driving forward and up */}
      <path d="M125,48 L160,18 L166,28 L132,60 Z" />
      <ellipse cx="163" cy="23" rx="8" ry="7" />
      {/* Right arm swinging back */}
      <path d="M80,56 L44,80 L50,90 L86,66 Z" />
      <ellipse cx="47" cy="85" rx="8" ry="7" />
      {/* Hips */}
      <path d="M74,112 L134,104 L136,132 L72,140 Z" />
      {/* Left leg — high knee drive */}
      <path d="M76,138 L106,188 L120,182 L90,134 Z" />
      <path d="M104,186 L138,162 L144,172 L110,198 Z" />
      {/* Right leg — push-off trailing back */}
      <path d="M108,136 L84,196 L100,200 L124,140 Z" />
      <path d="M82,194 L74,246 L92,248 L100,196 Z" />
      <path d="M66,242 L56,258 L96,258 L92,242 Z" />
    </svg>
  );
}

// McKennie — jumping celebration: airborne, both arms raised, legs tucked
function McKennie({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 180 290" fill="currentColor" className={className} style={style}>
      {/* Head */}
      <ellipse cx="90" cy="20" rx="18" ry="20" />
      {/* Torso — upright, airborne */}
      <path d="M66,42 L118,42 L122,116 L62,116 Z" />
      {/* Left arm raised */}
      <path d="M68,54 L34,16 L28,24 L62,64 Z" />
      <ellipse cx="31" cy="20" rx="8" ry="7" />
      {/* Right arm raised */}
      <path d="M116,54 L150,16 L156,24 L122,64 Z" />
      <ellipse cx="153" cy="20" rx="8" ry="7" />
      {/* Hips */}
      <path d="M64,114 L120,114 L116,140 L68,140 Z" />
      {/* Left leg bent back and out (tucked, airborne) */}
      <path d="M70,138 L42,182 L56,190 L82,148 Z" />
      <path d="M40,180 L22,216 L36,224 L54,188 Z" />
      {/* Right leg bent forward (tucked) */}
      <path d="M110,138 L140,176 L152,168 L122,132 Z" />
      <path d="M138,174 L158,210 L170,202 L150,168 Z" />
    </svg>
  );
}

// Modric — classic playmaker stance: slight lean, one arm extended pointing, elegant balance
function Modric({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 190 290" fill="currentColor" className={className} style={style}>
      {/* Head — upright, surveying */}
      <ellipse cx="92" cy="22" rx="17" ry="19" transform="rotate(5 92 22)" />
      {/* Torso — upright, slight forward lean */}
      <path d="M68,42 L118,40 L124,114 L64,118 Z" />
      {/* Right arm pointing/directing */}
      <path d="M116,52 L160,36 L163,46 L120,64 Z" />
      <ellipse cx="162" cy="41" rx="8" ry="7" />
      {/* Left arm — bent, tucked at side */}
      <path d="M70,58 L50,90 L62,96 L82,66 Z" />
      <ellipse cx="56" cy="93" rx="7" ry="7" />
      {/* Hips */}
      <path d="M66,116 L122,112 L120,140 L68,144 Z" />
      {/* Right leg — slight step forward */}
      <path d="M88,142 L78,202 L94,206 L104,146 Z" />
      <path d="M76,200 L70,254 L88,256 L94,202 Z" />
      <path d="M62,250 L54,266 L92,266 L88,250 Z" />
      {/* Left leg — planted back */}
      <path d="M108,140 L122,196 L136,192 L124,138 Z" />
      <path d="M120,194 L130,242 L144,238 L134,192 Z" />
      <path d="M126,238 L160,250 L148,262 L128,250 Z" />
    </svg>
  );
}

// Rudiger — monster/roar celebration: wide stance, arms spread, head thrust forward aggressively
function Rudiger({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 250" fill="currentColor" className={className} style={style}>
      {/* Head thrust forward */}
      <ellipse cx="150" cy="38" rx="22" ry="24" transform="rotate(-10 150 38)" />
      {/* Torso — wide, slightly crouched */}
      <path d="M110,65 L196,60 L204,140 L104,148 Z" />
      {/* Left arm spread wide and low */}
      <path d="M112,80 L46,112 L50,126 L118,96 Z" />
      <ellipse cx="48" cy="119" rx="12" ry="10" />
      {/* Right arm spread wide and low */}
      <path d="M192,78 L262,110 L258,124 L188,94 Z" />
      <ellipse cx="260" cy="117" rx="12" ry="10" />
      {/* Hips — wide stance */}
      <path d="M106,145 L202,138 L206,172 L102,180 Z" />
      {/* Left leg — wide planted */}
      <path d="M108,178 L82,228 L98,234 L122,184 Z" />
      <path d="M78,226 L56,244 L94,244 L98,228 Z" />
      {/* Right leg — wide planted other side */}
      <path d="M190,176 L214,226 L228,220 L206,172 Z" />
      <path d="M212,224 L202,244 L240,242 L228,222 Z" />
    </svg>
  );
}

export function PlayerSilhouettesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">

      {/* Top-left — Vini Jr samba, large */}
      <ViniJr
        className="absolute text-gold-400"
        style={{ top: '-6%', left: '-3%', width: '26vw', maxWidth: 300, opacity: 0.06 }}
      />

      {/* Top-right — Haaland meditation, mirrored */}
      <Haaland
        className="absolute text-star-400"
        style={{ top: '-2%', right: '1%', width: '28vw', maxWidth: 320, opacity: 0.05, transform: 'scaleX(-1)' }}
      />

      {/* Left middle — Modric playmaker */}
      <Modric
        className="absolute text-gold-300"
        style={{ top: '28%', left: '-2%', width: '22vw', maxWidth: 250, opacity: 0.045 }}
      />

      {/* Right middle — Mbappe sprint */}
      <Mbappe
        className="absolute text-star-300"
        style={{ top: '24%', right: '-3%', width: '34vw', maxWidth: 380, opacity: 0.05, transform: 'scaleX(-1)' }}
      />

      {/* Bottom-left — Rudiger roar */}
      <Rudiger
        className="absolute text-gold-400"
        style={{ bottom: '2%', left: '-2%', width: '38vw', maxWidth: 430, opacity: 0.045 }}
      />

      {/* Bottom-right — McKennie jump */}
      <McKennie
        className="absolute text-star-400"
        style={{ bottom: '-5%', right: '-1%', width: '22vw', maxWidth: 250, opacity: 0.05, transform: 'scaleX(-1)' }}
      />

      {/* Centre-left below middle — Hakimi run */}
      <Hakimi
        className="absolute text-gold-300"
        style={{ top: '55%', left: '5%', width: '20vw', maxWidth: 230, opacity: 0.04 }}
      />

      {/* Centre-right below middle — Julian Alvarez */}
      <JulianAlvarez
        className="absolute text-star-300"
        style={{ top: '52%', right: '8%', width: '18vw', maxWidth: 200, opacity: 0.04, transform: 'scaleX(-1)' }}
      />

    </div>
  );
}
