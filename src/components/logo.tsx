import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

const Logo = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18.7 8.3a2.4 2.4 0 0 0-3.4 0" />
      <path d="M14 12h1" />
      <path d="M10.4 17.6a2.4 2.4 0 0 1 3.4 0" />
      <path d="M7 12h1" />
      <path d="M12 12h1" />
      <path d="M9 21V10C9 6.5 12.5 3 16 3" />
      <path d="M9 12h1" />
    </svg>
  );
};

export default Logo;
