import { ReactNode } from 'react';

type Direction = 'row' | 'col';

interface ListProps {
  children: ReactNode;
  direction?: Direction;
  className?: string;
}

export function List({
  children,
  direction = 'col',
  className = '',
}: ListProps) {
  const flexDirection = direction === 'row' ? 'flex-row' : 'flex-col';

  return (
    <ul className={`flex ${flexDirection} gap-1 ${className}`}>
      {children}
    </ul>
  );
}