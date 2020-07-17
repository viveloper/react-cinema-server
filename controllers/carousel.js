const carouselItems = [
  {
    img: 'http://localhost:5000/CarouselMedia/OneDay_1920774.jpg',
    video: 'http://localhost:5000/CarouselMedia/OneDay_1280720.mp4',
    use: 'home',
  },
  {
    img: 'http://localhost:5000/CarouselMedia/SteelRain_1920774.jpg',
    video: 'http://localhost:5000/CarouselMedia/SteelRain_1280720.mp4',
    use: 'home',
  },
  {
    img: 'http://localhost:5000/CarouselMedia/Peninsula_1920774.jpg',
    video: 'http://localhost:5000/CarouselMedia/Peninsula_1280720.mp4',
    use: 'home',
  },
  {
    img: 'http://localhost:5000/CarouselMedia/OneDay_1920420.jpg',
    video: 'http://localhost:5000/CarouselMedia/OneDay_1280720.mp4',
    use: 'movie',
  },
  {
    img: 'http://localhost:5000/CarouselMedia/SteelRain_1920420.jpg',
    video: 'http://localhost:5000/CarouselMedia/SteelRain_1280720.mp4',
    use: 'movie',
  },
  {
    img: 'http://localhost:5000/CarouselMedia/Peninsula_1920420.jpg',
    video: 'http://localhost:5000/CarouselMedia/Peninsula_1280720.mp4',
    use: 'movie',
  },
];

// @desc    Get carousel items
// @route   GET /api/carousel
// @access  Public
exports.getCarousel = (req, res, next) => {
  res.status(200).json(carouselItems);
};
