const carouselItems = [
  {
    img: '/CarouselMedia/OneDay_1920774.jpg',
    video: '/CarouselMedia/OneDay_1280720.mp4',
    use: 'home',
  },
  {
    img: '/CarouselMedia/SteelRain_1920774.jpg',
    video: '/CarouselMedia/SteelRain_1280720.mp4',
    use: 'home',
  },
  {
    img: '/CarouselMedia/Peninsula_1920774.jpg',
    video: '/CarouselMedia/Peninsula_1280720.mp4',
    use: 'home',
  },
  {
    img: '/CarouselMedia/OneDay_1920420.jpg',
    video: '/CarouselMedia/OneDay_1280720.mp4',
    use: 'movie',
  },
  {
    img: '/CarouselMedia/SteelRain_1920420.jpg',
    video: '/CarouselMedia/SteelRain_1280720.mp4',
    use: 'movie',
  },
  {
    img: '/CarouselMedia/Peninsula_1920420.jpg',
    video: '/CarouselMedia/Peninsula_1280720.mp4',
    use: 'movie',
  },
];

// @desc    Get carousel items
// @route   GET /api/carousel
// @access  Public
exports.getCarousel = (req, res, next) => {
  res.status(200).json(carouselItems);
};
