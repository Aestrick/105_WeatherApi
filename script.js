// --- ELEMEN-ELEMEN DARI HTML ---
const card = document.querySelector('.card');
const searchButton = document.getElementById('searchButton');
const lokasiInput = document.getElementById('lokasiInput');
const weatherContent = document.querySelector('.weather-content');
const extraInfo = document.querySelector('.extra-info');
const coordsInfo = document.querySelector('.coords-info');
const notFound = document.querySelector('.not-found');

// =================================================================
// --- FUNGSI BARU UNTUK MENGUBAH BACKGROUND ---
// =================================================================
const updateBackground = (kondisiCuaca) => {
    const body = document.body;
    // Ubah teks kondisi menjadi huruf kecil untuk memudahkan pengecekan
    const kondisi = kondisiCuaca.toLowerCase();

    // Hapus semua kelas cuaca sebelumnya agar tidak bentrok
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
    // Jika tidak ada yang cocok, body akan menggunakan background default (gelap)
};

// =================================================================
// --- FUNGSI UTAMA UNTUK MENGAMBIL DATA CUACA ---
// =================================================================
const getWeatherData = async () => {
    // API Key kamu
    const apiKey = '43406cc911304fe0b2000903250810';
    const lokasi = lokasiInput.value;

    if (lokasi === '') return;

    // URL untuk request ke API
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lokasi}&aqi=no`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            // Jika lokasi tidak ditemukan, reset background ke default
            document.body.className = '';
            card.style.height = '400px';
            weatherContent.classList.remove('fadeIn');
            extraInfo.classList.remove('fadeIn');
            coordsInfo.classList.remove('fadeIn');
            notFound.classList.add('fadeIn');
            return;
        }

        notFound.classList.remove('fadeIn');
        
        // --- PANGGIL FUNGSI UNTUK UPDATE BACKGROUND ---
        updateBackground(data.current.condition.text);

        // --- Mengisi data ke elemen HTML ---
        document.getElementById('weatherIcon').src = `https:${data.current.condition.icon}`;
        document.getElementById('weatherIcon').alt = data.current.condition.text;
        document.getElementById('suhu').innerText = Math.round(data.current.temp_c);
        document.getElementById('deskripsiCuaca').innerText = data.current.condition.text;
        document.getElementById('negara').innerText = data.location.country;
        document.getElementById('provinsi').innerText = data.location.region;
        document.getElementById('kecamatan').innerText = data.location.name;
        document.getElementById('latitude').innerText = data.location.lat;
        document.getElementById('longitude').innerText = data.location.lon;

        // --- Atur Tampilan Setelah Data Didapat ---
        card.style.height = '600px';
        weatherContent.classList.add('fadeIn');
        extraInfo.classList.add('fadeIn');
        coordsInfo.classList.add('fadeIn');

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