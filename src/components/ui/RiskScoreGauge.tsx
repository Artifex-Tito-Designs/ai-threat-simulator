'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RiskScoreGaugeProps {
  score: number; // 0-100
  label: string;
  size?: number;
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#EF4444';
  if (score >= 50) return '#F59E0B';
  if (score >= 25) return '#3B82F6';
  return '#22C55E';
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
}

export function RiskScoreGauge({ score, label, size = 200 }: RiskScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getScoreColor(score);
  const riskLabel = getScoreLabel(score);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect behind gauge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          backgroundColor: color,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.4)"
          strokeWidth={strokeWidth}
        />

        {/* Score arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        />

        {/* Tick marks */}
        {[0, 25, 50, 75].map((tick) => {
          const angle = (tick / 100) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const innerR = radius - strokeWidth / 2 - 4;
          const outerR = radius - strokeWidth / 2 - 10;
          return (
            <line
              key={tick}
              x1={center + innerR * Math.cos(rad)}
              y1={center + innerR * Math.sin(rad)}
              x2={center + outerR * Math.cos(rad)}
              y2={center + outerR * Math.sin(rad)}
              stroke="rgba(100, 116, 139, 0.3)"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold tracking-tight"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {animatedScore}
        </motion.span>
        <motion.span
          className="text-xs font-semibold uppercase tracking-widest mt-0.5"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {riskLabel}
        </motion.span>
      </div>

      {/* Label below */}
      <motion.p
        className="text-xs text-slate-500 mt-3 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {label}
      </motion.p>
    </div>
  );
}
