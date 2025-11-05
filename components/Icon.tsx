'use client';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className = '' }: IconProps) => {
  const icons = {
    heart: '❤️',
    comment: '💬',
    share: '🔗',
    home: '🏠',
    search: '🔍',
    user: '👤',
    plus: '+',
  };

  return (
    <span className={className}>
      {icons[name as keyof typeof icons] || '❓'}
    </span>
  );
};