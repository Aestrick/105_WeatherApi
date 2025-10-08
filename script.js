// --- ELEMEN-ELEMEN DARI HTML ---
const searchButton = document.getElementById('searchButton');
const lokasiInput = document.getElementById('lokasiInput');
const card = document.querySelector('.card');
const notFound = document.querySelector('.not-found');

// =================================================================
// --- FUNGSI BARU UNTUK MENGUBAH BACKGROUND ---
// =================================================================
const updateBackground = (kondisiCuaca) => {
    const body = document.body;
    const kondisi = kondisiCuaca.toLowerCase();
    body.className = '';

    if (kondisi.includes('sun') || kondisi.includes('clear')) {
        body.classList.add('weather-sunny');
    } else if (kondisi.includes('cloud') || kondisi.includes('overcast')) {
        body.classList.add('weather-cloudy');
    } else if (kondisi.includes('rain') || kondisi.includes('drizzle')) {
        body.classList.add('weather-rainy');
    } else if (kondisi.includes('mist') || kondisi.includes('fog') || kondisi.includes('haze')) {
        body.classList.add('weather-misty');
    }
};

// =================================================================
// --- FUNGSI UTAMA UNTUK MENGAMBIL DATA CUACA ---
// =================================================================
const getWeatherData = async () => {
    const apiKey = '43406cc911304fe0b2000903250810';
    const lokasi = lokasiInput.value;

    if (lokasi === '') return;

    // Sembunyikan hasil sebelumnya sebelum fetch baru
    card.classList.remove('visible');
    notFound.classList.remove('visible');

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lokasi}&aqi=no`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            document.body.className = '';
            notFound.classList.add('visible'); // Tampilkan pesan not found
            return;
        }
        
        // --- PANGGIL FUNGSI UNTUK UPDATE BACKGROUND ---
        updateBackground(data.current.condition.text);

        // --- Mengisi data ke elemen HTML ---
        // Kolom Kiri
        document.getElementById('kecamatan-main').innerText = data.location.name;
        document.getElementById('weatherIcon').src = `https:${data.current.condition.icon}`;
        document.getElementById('weatherIcon').alt = data.current.condition.text;
        document.getElementById('suhu').innerText = Math.round(data.current.temp_c);
        document.getElementById('deskripsiCuaca').innerText = data.current.condition.text;

        // Kolom Kanan (Detail)
        document.getElementById('negara').innerText = data.location.country;
        document.getElementById('provinsi').innerText = data.location.region;
        document.getElementById('kecamatan').innerText = data.location.name;
        document.getElementById('suhu-detail').innerText = `${data.current.temp_c}°C / ${data.current.temp_f}°F`;
        document.getElementById('latitude').innerText = data.location.lat;
        document.getElementById('longitude').innerText = data.location.lon;

        // Tampilkan kartu hasil dengan animasi
        card.classList.add('visible');

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        alert("Gagal mengambil data. Cek koneksi internetmu.");
    }
};


// --- EVENT LISTENERS ---
searchButton.addEventListener('click', getWeatherData);
lokasiInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        getWeatherData();
    }
});