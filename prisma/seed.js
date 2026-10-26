require('dotenv/config');
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

const genreNames = [
  'Aksi', 'Anak-Anak', 'Anime', 'Britania', 'Drama', 'Fantasi Ilmiah & Fantasi',
  'Kejahatan', 'KDrama', 'Komedi', 'Petualangan', 'Perang', 'Romantis', 'Sains & Alam', 'Thriller',
  'Animasi', 'Horor', 'Musikal',
];

const castNames = [
  'Zachary Levi', 'Sam Worthington', 'Zoe Saldana', 'Halle Bailey', 'Tom Hanks',
  'Benedict Cumberbatch', 'Dwayne Johnson', 'Chris Pratt', 'Jenna Ortega', 'Park Ji-hu',
];

const moviesData = [
  {
    title: 'Shazam! Fury of the Gods',
    slug: 'shazam-fury-of-the-gods',
    type: 'movie',
    synopsis: 'Billy Batson dan saudara-saudari angkatnya, yang berubah menjadi pahlawan super dewasa saat mengucapkan kata "Shazam!", harus menghadapi para Anak Dewa yang datang ke Bumi untuk mengambil kembali kekuatan kuno yang menjadi hak mereka.',
    posterUrl: '/src/assets/images/posters/shazam-fury-of-the-gods.png',
    bannerUrl: '/src/assets/images/banners/shazam-fury-of-the-gods.png',
    ageRating: '13+',
    releaseYear: 2023,
    isTrending: false,
    duration: 130,
    videoUrl: 'https://example.com/videos/shazam-fury-of-the-gods.mp4',
    genreNames: ['Aksi', 'Fantasi Ilmiah & Fantasi', 'Komedi'],
  },
  {
    title: 'Avatar: The Way of Water',
    slug: 'avatar-the-way-of-water',
    type: 'movie',
    synopsis: 'Jake Sully dan keluarganya berjuang untuk tetap bersatu, melarikan diri dari bahaya, bertarung demi tetap hidup, dan mengalami tragedi di planet Pandora.',
    posterUrl: '/src/assets/images/posters/avatar-way-of-water.png',
    bannerUrl: '/src/assets/images/banners/avatar-way-of-water.png',
    ageRating: '13+',
    releaseYear: 2022,
    isTrending: false,
    duration: 192,
    videoUrl: 'https://example.com/videos/avatar-the-way-of-water.mp4',
    genreNames: ['Aksi', 'Fantasi Ilmiah & Fantasi', 'Petualangan'],
  },
  {
    title: 'The Little Mermaid',
    slug: 'the-little-mermaid',
    type: 'movie',
    synopsis: 'Ariel, putri duyung yang penasaran, membuat kesepakatan dengan penyihir laut jahat Ursula untuk menukar suaranya dengan kaki manusia agar dia bisa mengejar mimpinya untuk hidup di darat.',
    posterUrl: '/src/assets/images/posters/little-mermaid.png',
    bannerUrl: '/src/assets/images/banners/little-mermaid.png',
    ageRating: '13+',
    releaseYear: 2023,
    isTrending: false,
    duration: 135,
    videoUrl: 'https://example.com/videos/the-little-mermaid.mp4',
    genreNames: ['Fantasi Ilmiah & Fantasi', 'Musikal', 'Petualangan'],
  },
  {
    title: 'A Man Called Otto',
    slug: 'a-man-called-otto',
    type: 'movie',
    synopsis: 'Otto adalah seorang duda pemarah yang tidak punya lagi alasan untuk hidup. Ketika sebuah keluarga muda pindah ke sebelah rumahnya, dia mendapati hidupnya berubah karena rangkaian peristiwa tak terduga.',
    posterUrl: '/src/assets/images/posters/a-man-called-otto.png',
    bannerUrl: '/src/assets/images/banners/a-man-called-otto.png',
    ageRating: '13+',
    releaseYear: 2023,
    isTrending: true,
    duration: 126,
    videoUrl: 'https://example.com/videos/a-man-called-otto.mp4',
    genreNames: ['Drama', 'Komedi', 'Romantis'],
  },
  {
    title: 'Big Hero 6',
    slug: 'big-hero-6',
    type: 'movie',
    synopsis: 'Seorang jenius robotika muda bernama Hiro Hamada belajar mengatasi kehilangan besar dengan bantuan Baymax, robot penyembuh ciptaan kakaknya, dan sekelompok teman baru.',
    posterUrl: '/src/assets/images/posters/big-hero-6.png',
    bannerUrl: '/src/assets/images/banners/big-hero-6.png',
    ageRating: '7+',
    releaseYear: 2014,
    isTrending: false,
    duration: 108,
    videoUrl: 'https://example.com/videos/big-hero-6.mp4',
    genreNames: ['Animasi', 'Aksi', 'Komedi'],
  },
  {
    title: 'Doctor Strange in the Multiverse of Madness',
    slug: 'doctor-strange-multiverse-of-madness',
    type: 'movie',
    synopsis: 'Doctor Strange membuka pintu Multiverse yang terlarang, membangunkan musuh yang jauh lebih kuat dan berbahaya untuk mengembalikan realita yang sudah kacau.',
    posterUrl: '/src/assets/images/posters/doctor-strange-multiverse-of-madness.png',
    bannerUrl: '/src/assets/images/banners/doctor-strange-multiverse-of-madness.png',
    ageRating: '13+',
    releaseYear: 2022,
    isTrending: false,
    duration: 126,
    videoUrl: 'https://example.com/videos/doctor-strange-multiverse-of-madness.mp4',
    genreNames: ['Aksi', 'Fantasi Ilmiah & Fantasi', 'Horor'],
  },
  {
    title: 'Black Adam',
    slug: 'black-adam',
    type: 'movie',
    synopsis: 'Hampir 5.000 tahun setelah dianugerahi kekuatan dewa-dewa Mesir kuno, Black Adam dibebaskan dari makamnya di dunia modern, penuh dengan kemarahan yang belum tuntas.',
    posterUrl: '/src/assets/images/posters/black-adam.png',
    bannerUrl: '/src/assets/images/banners/black-adam.png',
    ageRating: '13+',
    releaseYear: 2022,
    isTrending: false,
    duration: 125,
    videoUrl: 'https://example.com/videos/black-adam.mp4',
    genreNames: ['Aksi', 'Fantasi Ilmiah & Fantasi'],
  },
  {
    title: 'Jurassic World Dominion',
    slug: 'jurassic-world-dominion',
    type: 'movie',
    synopsis: 'Empat tahun setelah Isla Nublar hancur, dinosaurus kini hidup dan berburu bersama manusia di seluruh dunia, memicu krisis global yang mengancam eksistensi manusia.',
    posterUrl: '/src/assets/images/posters/jurassic-world-dominion.png',
    bannerUrl: '/src/assets/images/banners/jurassic-world-dominion.png',
    ageRating: '13+',
    releaseYear: 2022,
    isTrending: false,
    duration: 147,
    videoUrl: 'https://example.com/videos/jurassic-world-dominion.mp4',
    genreNames: ['Aksi', 'Petualangan', 'Fantasi Ilmiah & Fantasi'],
  },
  {
    title: 'Guardians of the Galaxy Vol. 3',
    slug: 'guardians-of-the-galaxy-vol-3',
    type: 'movie',
    synopsis: 'Masih goyah karena kehilangan Gamora, Peter Quill mengumpulkan timnya untuk mempertahankan alam semesta dan salah satu dari mereka - sebuah misi yang bisa berarti akhir dari Penjaga jika tidak berhasil.',
    posterUrl: '/src/assets/images/posters/guardians-of-the-galaxy-vol-3.png',
    bannerUrl: '/src/assets/images/banners/guardians-of-the-galaxy-vol-3.png',
    ageRating: '13+',
    releaseYear: 2023,
    isTrending: true,
    duration: 149,
    videoUrl: 'https://example.com/videos/guardians-of-the-galaxy-vol-3.mp4',
    genreNames: ['Aksi', 'Petualangan', 'Komedi'],
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    slug: 'spider-man-across-the-spider-verse',
    type: 'movie',
    synopsis: 'Miles Morales menjelajahi Multiverse bersama Gwen Stacy dan bertemu tim baru Spider-People untuk menghadapi penjahat baru yang lebih kuat dari sebelumnya.',
    posterUrl: '/src/assets/images/posters/spider-man-across-the-spider-verse.png',
    bannerUrl: '/src/assets/images/banners/spider-man-across-the-spider-verse.png',
    ageRating: '13+',
    releaseYear: 2023,
    isTrending: true,
    duration: 140,
    videoUrl: 'https://example.com/videos/spider-man-across-the-spider-verse.mp4',
    genreNames: ['Animasi', 'Aksi', 'Petualangan'],
  },
];

const seriesData = [
  {
    title: 'Wednesday',
    slug: 'wednesday',
    type: 'series',
    synopsis: 'Wednesday Addams yang cerdas dan sarkastis menyelidiki serangkaian pembunuhan sambil menjalin teman dan musuh baru di Nevermore Academy.',
    posterUrl: '/src/assets/images/posters/wednesday.png',
    bannerUrl: '/src/assets/images/banners/wednesday.png',
    ageRating: '16+',
    releaseYear: 2022,
    isTrending: true,
    genreNames: ['Komedi', 'Kejahatan', 'Fantasi Ilmiah & Fantasi'],
    casts: [{ name: 'Jenna Ortega', role: 'Wednesday Addams' }],
    episodes: [
      { title: "Wednesday's Child Is Full of Woe", duration: 59 },
      { title: 'Woe Is the Loneliest Number', duration: 50 },
      { title: 'Friend or Woe', duration: 47 },
    ],
  },
  {
    title: 'All of Us Are Dead',
    slug: 'all-of-us-are-dead',
    type: 'series',
    synopsis: 'Sebuah SMA menjadi titik awal wabah virus zombi. Para siswa yang terjebak harus berjuang keluar atau berubah menjadi salah satu dari mereka.',
    posterUrl: '/src/assets/images/posters/all-of-us-are-dead.png',
    bannerUrl: '/src/assets/images/banners/all-of-us-are-dead.png',
    ageRating: '18+',
    releaseYear: 2022,
    isTrending: false,
    genreNames: ['KDrama', 'Horor', 'Thriller'],
    casts: [{ name: 'Park Ji-hu', role: 'Nam On-jo' }],
    episodes: [
      { title: 'Episode 1', duration: 66 },
      { title: 'Episode 2', duration: 62 },
      { title: 'Episode 3', duration: 64 },
    ],
  },
];

const movieCasts = {
  'shazam-fury-of-the-gods': [{ name: 'Zachary Levi', role: 'Shazam' }],
  'avatar-the-way-of-water': [
    { name: 'Sam Worthington', role: 'Jake Sully' },
    { name: 'Zoe Saldana', role: "Neytiri" },
  ],
  'the-little-mermaid': [{ name: 'Halle Bailey', role: 'Ariel' }],
  'a-man-called-otto': [{ name: 'Tom Hanks', role: 'Otto Anderson' }],
  'doctor-strange-multiverse-of-madness': [{ name: 'Benedict Cumberbatch', role: 'Doctor Strange' }],
  'black-adam': [{ name: 'Dwayne Johnson', role: 'Black Adam' }],
  'guardians-of-the-galaxy-vol-3': [
    { name: 'Chris Pratt', role: 'Peter Quill' },
    { name: 'Zoe Saldana', role: 'Gamora' },
  ],
};

async function main() {
  // Reset data katalog agar seed bisa dijalankan berulang (relasi anak ikut terhapus lewat cascade)
  await prisma.$transaction([
    prisma.content.deleteMany(),
    prisma.cast.deleteMany(),
    prisma.genre.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'testinguser@localhost.com' },
    update: { passwordHash },
    create: { name: 'Testing User', email: 'testinguser@localhost.com', passwordHash },
  });

  const genreMap = {};
  for (const name of genreNames) {
    const genre = await prisma.genre.create({ data: { name } });
    genreMap[name] = genre.id;
  }

  const castMap = {};
  for (const name of castNames) {
    const cast = await prisma.cast.create({ data: { name } });
    castMap[name] = cast.id;
  }

  const toGenres = (names) => ({ create: names.map((name) => ({ genreId: genreMap[name] })) });
  const toCasts = (casts = []) => ({ create: casts.map(({ name, role }) => ({ castId: castMap[name], role })) });

  for (const { genreNames: names, ...data } of moviesData) {
    await prisma.content.create({
      data: { ...data, genres: toGenres(names), casts: toCasts(movieCasts[data.slug]) },
    });
  }

  for (const { genreNames: names, casts, episodes, ...data } of seriesData) {
    await prisma.content.create({
      data: {
        ...data,
        genres: toGenres(names),
        casts: toCasts(casts),
        episodes: {
          create: episodes.map((episode, index) => ({
            ...episode,
            episodeNumber: index + 1,
            videoUrl: `https://example.com/videos/${data.slug}-e${index + 1}.mp4`,
          })),
        },
      },
    });
  }

  console.log(`Seed selesai: ${genreNames.length} genre, ${moviesData.length} movie, ${seriesData.length} series, ${castNames.length} cast`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
