
import React from 'react';

interface MithixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export default function MithixLogo({ size = 'md', className = '', showText = true }: MithixLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Advanced Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="mGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f3e8ff" />
            </linearGradient>
            <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            
            {/* Glow Effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer Ring with Gradient */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="url(#bgGradient)"
            stroke="url(#aiGradient)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          {/* Inner Circle */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="rgba(139, 92, 246, 0.1)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
          
          {/* Stylized "M" Letter */}
          <path
            d="M 25 65 L 25 35 L 35 35 L 50 55 L 65 35 L 75 35 L 75 65 L 68 65 L 68 45 L 56 60 L 44 60 L 32 45 L 32 65 Z"
            fill="url(#mGradient)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="0.5"
          />
          
          {/* AI Neural Network Dots */}
          <circle cx="20" cy="25" r="2" fill="url(#aiGradient)" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="25" r="2" fill="url(#aiGradient)" opacity="0.7">
            <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="75" r="2" fill="url(#aiGradient)" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="15" cy="75" r="2" fill="url(#aiGradient)" opacity="0.7">
            <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Connecting Lines for Neural Network Effect */}
          <line x1="20" y1="25" x2="35" y2="35" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.4" />
          <line x1="80" y1="25" x2="65" y2="35" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.4" />
          <line x1="85" y1="75" x2="75" y2="65" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.4" />
          <line x1="15" y1="75" x2="25" y2="65" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent`}>
            Mithix
          </h1>
          <span className="text-xs text-cyan-400 font-medium tracking-wider">AI</span>
        </div>
      )}
    </div>
  );
}
