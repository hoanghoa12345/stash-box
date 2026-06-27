import { useState } from 'react';

const LazyFadeImage = ({
  src,
  placeholderSrc,
  alt,
  className,
}: {
  src: string;
  placeholderSrc: string;
  alt: string;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-white w-full ${
        className ? className : ''
      }`}
    >
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="w-full h-auto block blur-xl scale-105 absolute top-0 left-0"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto block duration-700 ease-out transition-opacity ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default LazyFadeImage;
