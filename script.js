document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. AMBIL NAMA TAMU ---
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) document.getElementById('guest-name').innerText = guestName;

    // --- 2. LOGIKA TRIGGER PLAY AUDIO & VIDEO KETIKA TOMBOL DIKLIK ---
    const btnBuka = document.getElementById('btn-buka');
    const coverScreen = document.getElementById('cover-screen');
    const mainContent = document.getElementById('main-invitation');
    
    const bgMusic = document.getElementById('bg-music');
    const scrollVideo = document.getElementById('scroll-video');

    btnBuka.addEventListener('click', function() {
        
        // PAKSA MAINKAN LAGU ROMANTIS
        if (bgMusic) {
            bgMusic.volume = 1.0;
            let playAudioPromise = bgMusic.play();
            if (playAudioPromise !== undefined) {
                playAudioPromise.catch(e => console.log("Lagu dicegah auto-play oleh browser: " + e));
            }
        }

        // PAKSA MAINKAN VIDEO (DITRIGER SAAT TOMBOL DIKLIK)
        if (scrollVideo) {
            let playVideoPromise = scrollVideo.play();
            if (playVideoPromise !== undefined) {
                playVideoPromise.catch(e => console.log("Video dicegah auto-play oleh browser: " + e));
            }
        }

        // BUKA UNDANGAN DENGAN ANIMASI MENGHILANG
        coverScreen.style.opacity = '0';
        coverScreen.style.transform = 'translateX(-50%) scale(1.03)';
        mainContent.classList.remove('hidden');
        
        setTimeout(() => { 
            coverScreen.style.display = 'none'; 
        }, 800);
    });

    // --- 3. RSVP & WISHES ---
    const board = document.getElementById('wishes-board');
    function loadWishes() {
        const saved = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
        board.innerHTML = '';
        saved.forEach(w => {
            const card = document.createElement('div');
            card.className = 'wish-card';
            card.innerHTML = `<h4>${w.nama}</h4><p>${w.pesan}</p>`;
            board.prepend(card);
        });
    }
    loadWishes();

    window.kirimRSVP = function() {
        const n = document.getElementById('nama-rsvp').value;
        const p = document.getElementById('ucapan-rsvp').value;
        const h = document.getElementById('kehadiran-rsvp').value;
        const j = document.getElementById('jumlah-tamu').value; 
        if(!n || !p || !h || !j) return alert("Lengkapi data dulu ya!");

        const saved = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
        saved.push({ nama: n, pesan: p });
        localStorage.setItem('wedding_wishes', JSON.stringify(saved));
        loadWishes();

        const wa = "6283171893048"; 
        const msg = `Halo, saya *${n}*.\nKonfirmasi: *${h}*\nJumlah: *${j} orang*\n\nUcapan: "${p}"`;
        window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
        document.getElementById('rsvp-form').reset();
    };

    // --- 4. LIGHTBOX UNTUK GALERI FOTO ---
    document.querySelectorAll('.gallery-img, .polaroid img').forEach(img => {
        img.onclick = () => {
            document.getElementById('lightbox-img').src = img.src;
            document.getElementById('lightbox').classList.add('show');
        }
    });
    document.querySelector('.close-lightbox').onclick = () => document.getElementById('lightbox').classList.remove('show');

   // --- 5. ANIMASI MUNCUL SAAT DI SCROLL ---
    const obs = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) e.target.classList.add('colored'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal-color').forEach(el => obs.observe(el));

    // --- 6. ANIMASI PINTU AL-QURAN ---
    const quranObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('door-open'); 
            } else {
                entry.target.classList.remove('door-open'); 
            }
        });
    }, { threshold: 0.6 }); 
    
    const quranSection = document.getElementById('quran-section');
    if(quranSection) quranObs.observe(quranSection);

    // --- 7. LOGIKA TIMER HITUNG MUNDUR ---
    // Diatur ke tahun 2027 biar timernya tidak minus
    const wed = new Date(2027, 0, 27, 8, 0, 0).getTime(); 
    setInterval(() => {
        const now = new Date().getTime();
        const d = wed - now;

        // Kunci agar tidak minus jika tanggal lewat
        if (d < 0) {
            document.getElementById("hari").innerText = "00";
            document.getElementById("jam").innerText = "00";
            document.getElementById("menit").innerText = "00";
            document.getElementById("detik").innerText = "00";
            return;
        }

        document.getElementById("hari").innerText = Math.floor(d / (1000 * 60 * 60 * 24));
        document.getElementById("jam").innerText = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById("menit").innerText = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("detik").innerText = Math.floor((d % (1000 * 60)) / 1000);
    }, 1000);
});

function copyRekening(id) {
    const t = document.getElementById(id).innerText;
    navigator.clipboard.writeText(t).then(() => alert("Nomor rekening disalin!"));
}