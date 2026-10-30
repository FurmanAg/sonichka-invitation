const images = {
  heart: '/images/pusheen-heart.jpg',
  cookie: '/images/pusheen-cookie.jpg',
  eyes: '/images/cat-eyes.jpg',
};

// Щоб замінити фото, покладіть новий файл у public/images і змініть шлях вище.
export default function Pusheen({ variant = 'heart', className = '', alt }) {
  const labels = {
    heart: 'Пушин із сердечком',
    cookie: 'Пушин із печенькою',
    eyes: 'Котик із великими очима',
  };

  return <img className={`pusheen pusheen-${variant} ${className}`} src={images[variant]} alt={alt ?? labels[variant]} />;
}
