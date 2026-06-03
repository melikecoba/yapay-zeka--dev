let mevcutDurum = [2, 0, 8, 1, 3, 5, 4, 6, 7]; 
const hedefDurum = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let baslangicDurumuKopyasi = [];

let cozumYolu = [];
let guncelAdimIndeksi = 0;
let animasyonOynuyorMu = false;

const tahtaElemani = document.getElementById('oyunTahtasi');
const girdiElemani = document.getElementById('baslangicDurumuGirdisi');
const mesajElemani = document.getElementById('bilgiMesaji');

function oyunuBaslat() {
    tahtayiCiz();
}

function tahtayiCiz() {
    tahtaElemani.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const tasElemani = document.createElement('div');
        tasElemani.classList.add('tas');
        
        if (mevcutDurum[i] === 0) {
            tasElemani.classList.add('bos');
            tasElemani.innerText = '';
        } else {
            tasElemani.innerText = mevcutDurum[i];
            tasElemani.onclick = () => tasTasi(i);
        }
        tahtaElemani.appendChild(tasElemani);
    }
    girdiElemani.value = mevcutDurum.join('');
    kazanmaKontroluYapm();
}

function tasTasi(tiklananIndeks) {
    const bosKareIndeksi = mevcutDurum.indexOf(0);
    const gecerliHamleler = gecerliHamleleriAl(bosKareIndeksi);

    if (gecerliHamleler.includes(tiklananIndeks)) {
        [mevcutDurum[tiklananIndeks], mevcutDurum[bosKareIndeksi]] = [mevcutDurum[bosKareIndeksi], mevcutDurum[tiklananIndeks]];
        cozumYolu = []; 
        tahtayiCiz();
    }
}

function gecerliHamleleriAl(bosKareIndeksi) {
    const yapilabilecekHamleler = [];
    const satir = Math.floor(bosKareIndeksi / 3);
    const sutun = bosKareIndeksi % 3;

    if (satir > 0) yapilabilecekHamleler.push(bosKareIndeksi - 3); 
    if (satir < 2) yapilabilecekHamleler.push(bosKareIndeksi + 3); 
    if (sutun > 0) yapilabilecekHamleler.push(bosKareIndeksi - 1); 
    if (sutun < 2) yapilabilecekHamleler.push(bosKareIndeksi + 1); 

    return yapilabilecekHamleler;
}

function durumuAyarla() {
    const girilenDeger = girdiElemani.value;
    if (girilenDeger.length === 9 && new Set(girilenDeger.split('')).size === 9 && /^[0-8]+$/.test(girilenDeger)) {
        mevcutDurum = girilenDeger.split('').map(Number);
        cozumYolu = [];
        mesajElemani.innerText = "";
        tahtayiCiz();
    } else {
        alert("Lütfen 0'dan 8'e kadar her rakamın yalnızca 1 kez kullanıldığı 9 haneli bir sayı girin.");
    }
}

function rastgeleDurumOlustur() {
    do {
        mevcutDurum = [...hedefDurum].sort(() => Math.random() - 0.5);
    } while (!matematikselOlarakCozulebilirMi(mevcutDurum));
    cozumYolu = [];
    mesajElemani.innerText = "";
    tahtayiCiz();
}

function matematikselOlarakCozulebilirMi(dizi) {
    let terslikSayisi = 0;
    for (let i = 0; i < 9 - 1; i++) {
        for (let j = i + 1; j < 9; j++) {
            if (dizi[i] && dizi[j] && dizi[i] > dizi[j]) {
                terslikSayisi++;
            }
        }
    }
    return terslikSayisi % 2 === 0;
}

function kazanmaKontroluYapm() {
    if (mevcutDurum.join('') === hedefDurum.join('')) {
        mesajElemani.innerText = "Bulmaca Başarıyla Çözüldü! 🎉";
    }
}

async function cozmeyeBasla() {
    if (mevcutDurum.join('') === hedefDurum.join('')) {
        mesajElemani.innerText = "Tahta zaten çözülmüş durumda!";
        return;
    }

    if(!matematikselOlarakCozulebilirMi(mevcutDurum)) {
        mesajElemani.innerText = "Hata: Bu tahta dizilimi matematik kuralları gereği çözülemez!";
        mesajElemani.style.color = "#ff6b6b";
        return;
    }

    mesajElemani.style.color = "#a3f7bf";
    mesajElemani.innerText = "En kısa yol hesaplanıyor... Lütfen bekleyin.";
    
    setTimeout(() => {
        const bulunanYol = yapayZekaIleCoz(mevcutDurum);
        if (bulunanYol) {
            baslangicDurumuKopyasi = [...mevcutDurum];
            cozumYolu = bulunanYol;
            guncelAdimIndeksi = 0;
            mesajElemani.innerText = `Çözüm bulundu! Toplam ${bulunanYol.length} adım. İzlemek için Oynat butonuna bas.`;
        } else {
            mesajElemani.innerText = "Çözüm bulunamadı.";
        }
    }, 100);
}

function yapayZekaIleCoz(baslangicDurumu) {
    let aramaKuyrugu = [{ durum: baslangicDurumu, adimGecmisi: [] }];
    let ziyaretEdilenDurumlar = new Set();
    ziyaretEdilenDurumlar.add(baslangicDurumu.join(''));
    const hedefMetin = hedefDurum.join('');

    while (aramaKuyrugu.length > 0) {
        let islenenDugum = aramaKuyrugu.shift();
        
        if (islenenDugum.durum.join('') === hedefMetin) {
            return islenenDugum.adimGecmisi;
        }

        let bosIndeks = islenenDugum.durum.indexOf(0);
        let ihtimaller = gecerliHamleleriAl(bosIndeks);

        for (let hedefHamle of ihtimaller) {
            let yeniDurum = [...islenenDugum.durum];
            [yeniDurum[bosIndeks], yeniDurum[hedefHamle]] = [yeniDurum[hedefHamle], yeniDurum[bosIndeks]];
            let yeniDurumMetin = yeniDurum.join('');

            if (!ziyaretEdilenDurumlar.has(yeniDurumMetin)) {
                ziyaretEdilenDurumlar.add(yeniDurumMetin);
                aramaKuyrugu.push({ durum: yeniDurum, adimGecmisi: [...islenenDugum.adimGecmisi, yeniDurum] });
            }
        }
    }
    return null;
}

function sonrakiAdim() {
    if (cozumYolu.length > 0 && guncelAdimIndeksi < cozumYolu.length) {
        mevcutDurum = cozumYolu[guncelAdimIndeksi];
        guncelAdimIndeksi++;
        tahtayiCiz();
    }
}

function oncekiAdim() {
    if (cozumYolu.length > 0 && guncelAdimIndeksi > 0) {
        guncelAdimIndeksi--;
        if(guncelAdimIndeksi === 0) {
            mevcutDurum = [...baslangicDurumuKopyasi];
        } else {
            mevcutDurum = cozumYolu[guncelAdimIndeksi - 1];
        }
        tahtayiCiz();
    }
}

function cozumuOynat() {
    if (cozumYolu.length === 0 || guncelAdimIndeksi >= cozumYolu.length || animasyonOynuyorMu) return;
    animasyonOynuyorMu = true;
    
    const zamanlayici = setInterval(() => {
        if (guncelAdimIndeksi < cozumYolu.length) {
            mevcutDurum = cozumYolu[guncelAdimIndeksi];
            tahtayiCiz();
            guncelAdimIndeksi++;
        } else {
            clearInterval(zamanlayici);
            animasyonOynuyorMu = false;
        }
    }, 400); 
}

oyunuBaslat();