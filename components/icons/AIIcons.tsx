
import React from 'react';

export const GptIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35.7979 23.3333C35.7979 27.5333 34.1312 31.5278 31.2523 34.4067C28.3734 37.2856 24.3789 38.9523 20.1789 38.9523C15.9789 38.9523 11.9844 37.2856 9.10555 34.4067C6.22664 31.5278 4.55997 27.5333 4.55997 23.3333C4.55997 19.1333 6.22664 15.1389 9.10555 12.26C11.9844 9.38111 15.9789 7.71444 20.1789 7.71444C21.7912 7.71444 23.3762 8.01972 24.8467 8.59972" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.0211 17.5278L20.1789 12.37L30.4922 22.6833L25.3344 27.8411" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M35.7978 12.26C35.7978 10.1583 35.109 8.1136 33.8475 6.45202C32.5859 4.79044 30.8258 3.61204 28.8467 3.09999C26.8676 2.58794 24.7891 2.77609 22.9102 3.63333L20.1789 5.00555L15.0211 2.33333L12.2899 3.70555L17.4478 6.37777L15.0211 7.71444L17.7523 9.08666" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ClaudeIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8C10.6622 8 9.38313 8.39679 8.33333 9.10833C8.61867 7.82012 9.71534 6.88167 11 7C12.5 7.15 13.5 8.5 13.5 10C13.5 11.5 12.5 13.5 11 14" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DeepSeekIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 16.5L6 12.5L10 8.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 16.5L18 12.5L14 8.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const PerplexityIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="8" y="8" width="8" height="8" rx="1" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ImagenIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.25 5.75H2.75C2.33579 5.75 2 6.08579 2 6.5V17.5C2 17.9142 2.33579 18.25 2.75 18.25H21.25C21.6642 18.25 22 17.9142 22 17.5V6.5C22 6.08579 21.6642 5.75 21.25 5.75Z" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 10C16 11.1046 15.1046 12 14 12C12.8954 12 12 11.1046 12 10C12 8.89543 12.8954 8 14 8C15.1046 8 16 8.89543 16 10Z" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 18.25L12.5 12.25L22 21.75" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const GeminiIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 9.5L12 2L6.5 9.5L12 17L17.5 9.5Z" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 14.5L12 22L17.5 14.5" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const VeoIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 13L22 10L16 7V13Z" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17V7C2 6.44772 2.44772 6 3 6H11C11.5523 6 12 6.44772 12 7V17C12 17.5523 11.5523 18 11 18H3C2.44772 18 2 17.5523 2 17Z" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const LiveIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1C12 1 8 5 8 10C8 14 12 19 12 19C12 19 16 14 16 10C16 5 12 1 12 1Z" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const GoogleIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#f97316" strokeWidth="1.5">
            <path d="M21.545 11.0455C21.545 10.3636 21.4818 9.72727 21.3545 9.09091H12V12.7273H17.4364C17.25 13.7273 16.7273 14.6364 15.9273 15.1818V17.5227H18.9636C20.6 15.9636 21.545 13.8182 21.545 11.0455Z" />
            <path d="M12 21C14.6 21 16.8 20.1364 18.3364 18.7818L15.3 16.4409C14.4 17.0364 13.2636 17.4 12 17.4C9.66364 17.4 7.66364 15.8182 6.88182 13.6818L3.65455 13.6818V16.1045C5.18182 19.0364 8.33636 21 12 21Z" />
            <path d="M6.88182 13.6818C6.67273 13.0909 6.54545 12.4545 6.54545 11.8C6.54545 11.1455 6.67273 10.5091 6.88182 9.91818V7.49545L3.65455 7.49545C2.86364 8.94091 2.45455 10.5591 2.45455 11.8C2.45455 13.0409 2.86364 14.6591 3.65455 16.1045L6.88182 13.6818Z" />
            <path d="M12 6.2C13.3545 6.2 14.4545 6.65455 15.3 7.46364L18.4 4.36364C16.7273 2.83636 14.6 2 12 2C8.33636 2 5.18182 4.09091 3.65455 7L6.88182 9.42273C7.66364 7.28636 9.66364 6.2 12 6.2Z" />
        </g>
    </svg>
);