document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. AMBIL NAMA TAMU ---
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) document.getElementById('guest-name').innerText = guestName;

    // --- 2. LOGIKA COVER DEPAN (FIXED & SMOOTH) ---
    const btnBuka = document.getElementById('btn-buka');
    const coverScreen = document.getElementById('cover-screen');
    const mainContent = document.getElementById('main-invitation');
    const bgMusic = document.getElementById('bg-music');

    btnBuka.addEventListener('click', function() {
        // Mainkan musik latar belakang
        bgMusic.play().catch(e => console.log("Autoplay musik tertahan browser"));
        
        // Efek transisi menghilang yang mulus
        coverScreen.style.opacity = '0';
        coverScreen.style.transform = 'translateX(-50%) scale(1.03)';
        
        // Buka konten utama undangan
        mainContent.classList.remove('hidden');
        
        // Bersihkan cover screen dari display setelah animasi selesai
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

    // --- 4. LIGHTBOX ---
    document.querySelectorAll('.gallery-img, .polaroid img').forEach(img => {
        img.onclick = () => {
            document.getElementById('lightbox-img').src = img.src;
            document.getElementById('lightbox').classList.add('show');
        }
    });
    document.querySelector('.close-lightbox').onclick = () => document.getElementById('lightbox').classList.remove('show');

   // --- 5. LOGIKA OBSERVER UMUM ---
    const obs = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) e.target.classList.add('colored'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal-color').forEach(el => obs.observe(el));

    // --- 6. LOGIKA KHUSUS PINTU AYAT SUCI ---
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

    // --- 7. TIMER ---
    const wed = new Date(2027, 0, 27, 8, 0, 0).getTime(); 
    setInterval(() => {
        const d = wed - new Date().getTime();
        document.getElementById("hari").innerText = Math.floor(d / (1000 * 60 * 60 * 24));
        document.getElementById("jam").innerText = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById("menit").innerText = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("detik").innerText = Math.floor((d % (1000 * 60)) / 1000);
    }, 1000);

    // --- 8. AUTOPLAY VIDEO SAAT SCROLL ---
    const wedVideo = document.getElementById('wedding-video');
    if (wedVideo) {
        const vidObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    wedVideo.play().catch(e => console.log("Autoplay video dicegah browser")); 
                } else {
                    wedVideo.pause(); 
                }
            });
        }, { threshold: 0.5 });
        vidObs.observe(document.querySelector('.video-section'));
    }
});

function copyRekening(id) {
    const t = document.getElementById(id).innerText;
    navigator.clipboard.writeText(t).then(() => alert("Nomor rekening disalin!"));
}