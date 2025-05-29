'use client';

import { useRouter } from 'next/navigation';

export default function ScrollLink({ id, label, activeClass = '', currentActive = '' }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a
      href={`/#${id}`}
      onClick={handleClick}
      className={currentActive === id ? activeClass : ''}
    >
      {label}
    </a>
  );
}