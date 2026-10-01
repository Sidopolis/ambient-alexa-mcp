/**
 * UDP Logo — Unified Delivery Platform by Workmates Core2Cloud
 * 
 * Pure SVG React components for each logo concept.
 * These are production-ready, tree-shakeable, and fully customizable via props.
 * 
 * Usage:
 *   import { UDPConvergenceLogo, UDPDeployArrow, UDPIsometricStack, UDPOrbitalCore } from './UDPLogo'
 *   <UDPConvergenceLogo size={48} />
 */

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

// Brand colors
const COLORS = {
  indigo: '#4B39FF',
  gold: '#FDBE1B',
  orange: '#F9811F',
  ink: '#1F1F53',
} as const;

/**
 * CONCEPT 1: Convergence Mark
 * Three agent paths converge into a unified center within a hexagonal boundary.
 * Best for: app icons, favicons, compact brand marks
 */
export function UDPConvergenceLogo({ size = 64, className }: LogoProps) {
  const id = React.useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="UDP Convergence Logo"
      role="img"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.indigo} />
          <stop offset="100%" stopColor={COLORS.orange} />
        </linearGradient>
      </defs>
      {/* Hexagonal boundary */}
      <path
        d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z"
        fill="none"
        stroke={COLORS.indigo}
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.4"
      />
      {/* Agent paths converging to center */}
      <path d="M20 14 L32 32" stroke={COLORS.indigo} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 14 L32 32" stroke={COLORS.orange} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 52 L32 32" stroke={COLORS.gold} strokeWidth="2.5" strokeLinecap="round" />
      {/* Center unified node */}
      <circle cx="32" cy="32" r="4.5" fill={`url(#${id}-grad)`} />
      {/* Agent origin nodes */}
      <circle cx="20" cy="14" r="3" fill={COLORS.indigo} />
      <circle cx="44" cy="14" r="3" fill={COLORS.orange} />
      <circle cx="32" cy="52" r="3" fill={COLORS.gold} />
    </svg>
  );
}

/**
 * CONCEPT 2: Deploy Arrow
 * Bold upward arrow with gradient — delivery, deployment, forward momentum.
 * Best for: hero sections, splash screens, bold brand statements
 */
export function UDPDeployArrow({ size = 64, className }: LogoProps) {
  const id = React.useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="UDP Deploy Arrow Logo"
      role="img"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={COLORS.indigo} />
          <stop offset="100%" stopColor={COLORS.gold} />
        </linearGradient>
      </defs>
      {/* Arrow shape */}
      <path
        d="M32 6 L52 28 L42 28 L42 56 L22 56 L22 28 L12 28 Z"
        fill={`url(#${id}-grad)`}
      />
      {/* Three agent dots (triangle formation) */}
      <circle cx="28" cy="42" r="2.5" fill={COLORS.ink} opacity="0.5" />
      <circle cx="36" cy="42" r="2.5" fill={COLORS.ink} opacity="0.5" />
      <circle cx="32" cy="34" r="2.5" fill={COLORS.ink} opacity="0.5" />
    </svg>
  );
}

/**
 * CONCEPT 3: Isometric Stack
 * Three stacked isometric planes with a deployment arrow piercing through.
 * Best for: infrastructure/DevOps branding, technical audiences
 */
export function UDPIsometricStack({ size = 64, className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="UDP Isometric Stack Logo"
      role="img"
    >
      {/* Infrastructure layers (bottom to top, increasing opacity) */}
      <path d="M12 44 L32 54 L52 44 L32 34 Z" fill={COLORS.indigo} opacity="0.25" />
      <path d="M12 36 L32 46 L52 36 L32 26 Z" fill={COLORS.indigo} opacity="0.5" />
      <path d="M12 28 L32 38 L52 28 L32 18 Z" fill={COLORS.indigo} />
      {/* Deployment arrow */}
      <path d="M32 6 L37 12 L34 12 L34 20 L30 20 L30 12 L27 12 Z" fill={COLORS.gold} />
      {/* Agent nodes on top layer */}
      <circle cx="24" cy="29" r="1.8" fill={COLORS.gold} />
      <circle cx="32" cy="25" r="1.8" fill={COLORS.orange} />
      <circle cx="40" cy="29" r="1.8" fill={COLORS.gold} />
    </svg>
  );
}

/**
 * CONCEPT 4: Orbital Core
 * Central hexagonal core with three orbital rings carrying agent nodes.
 * Best for: AI/orchestration branding, dynamic applications
 */
export function UDPOrbitalCore({ size = 64, className }: LogoProps) {
  const id = React.useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="UDP Orbital Core Logo"
      role="img"
    >
      <defs>
        <linearGradient id={`${id}-core`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.indigo} />
          <stop offset="100%" stopColor={COLORS.ink} />
        </linearGradient>
      </defs>
      {/* Three orbital rings at different angles */}
      <ellipse
        cx="32" cy="32" rx="26" ry="10"
        fill="none" stroke={COLORS.indigo} strokeWidth="1.2" opacity="0.35"
        transform="rotate(-30 32 32)"
      />
      <ellipse
        cx="32" cy="32" rx="26" ry="10"
        fill="none" stroke={COLORS.orange} strokeWidth="1.2" opacity="0.35"
        transform="rotate(30 32 32)"
      />
      <ellipse
        cx="32" cy="32" rx="26" ry="10"
        fill="none" stroke={COLORS.gold} strokeWidth="1.2" opacity="0.35"
        transform="rotate(90 32 32)"
      />
      {/* Central hexagonal core */}
      <path
        d="M32 24 L39.5 28 L39.5 36 L32 40 L24.5 36 L24.5 28 Z"
        fill={`url(#${id}-core)`}
      />
      {/* Agent nodes distributed across orbits */}
      <circle cx="12" cy="22" r="3" fill={COLORS.indigo} />
      <circle cx="52" cy="22" r="3" fill={COLORS.orange} />
      <circle cx="32" cy="6" r="3" fill={COLORS.gold} />
      <circle cx="52" cy="42" r="3" fill={COLORS.indigo} />
      <circle cx="12" cy="42" r="3" fill={COLORS.orange} />
      <circle cx="32" cy="58" r="3" fill={COLORS.gold} />
    </svg>
  );
}

/**
 * Combined export for convenience
 */
export const UDPLogos = {
  Convergence: UDPConvergenceLogo,
  DeployArrow: UDPDeployArrow,
  IsometricStack: UDPIsometricStack,
  OrbitalCore: UDPOrbitalCore,
};

export default UDPLogos;
