Canlı site: BURAYA-VERCEL-LINKINI-YAZ

# Sprint 4 - Vite, TypeScript ve React

Bu teslimde Sprint 3 uygulaması React + TypeScript yapısına taşınmıştır. `sprint3` klasörüne dokunulmaz; yeni uygulama repository kökündeki `frontend/` klasöründedir.

## Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Vite geliştirme adresi varsayılan olarak `http://localhost:5173` olur. Bu sprintte Live Server kullanılmaz.

## Adım 2 - Dosyaların görevleri

- `frontend/package.json`: Proje adı, `dev/build/preview` komutları ve paket listesini tutar.
- `frontend/package-lock.json`: `npm install` sonrasında kurulan paket sürümlerini kilitler.
- `frontend/node_modules/`: İndirilen bağımlılıklar burada oluşur; `.gitignore` nedeniyle GitHub'a gönderilmez.
- `frontend/tsconfig*.json`: TypeScript derleme ve tip kontrolü ayarlarını içerir.
- `frontend/vite.config.ts`: Vite ve React eklentisi yapılandırmasıdır.
- `frontend/index.html`: Uygulamanın tek HTML dosyasıdır ve `div#root` içerir.
- `frontend/src/main.tsx`: React uygulamasını başlatıp `App` bileşenini `root` içine çizer.
- `frontend/src/App.tsx`: Beş sayfayı, state ile sayfa geçişini, filtrelemeyi, detayı ve formları içerir.
- `frontend/src/App.css`: Sprint 3 görünümünün React uygulamasındaki stilleridir.
- `frontend/src/index.css`: Sprint 4 yönergesine uygun olarak boştur.
- `frontend/public/`: Vite'ın olduğu gibi servis ettiği dosyaları içerir; `afis.svg` burada bulunur.
- `frontend/src/types/campus-event.ts`: `Category` union type ve `CampusEvent` interface tanımlarını içerir.
- `frontend/src/data/events.ts`: Tiplenmiş 6 etkinlik verisini içerir.
- `frontend/src/utils/filter-events.ts`: DOM'a dokunmayan `searchEvents`, `filterByCategory`, `findEventById` saf fonksiyonlarını içerir.

## Kontrol listesi

- Ana sayfa: yaklaşan 2 etkinlik.
- Etkinlikler: toplam 6 etkinlik.
- Aramaya `atölye` yazınca 2 kart.
- Kategori `Atölye` seçilince 2 kart.
- `xyz` aramasında bulunamadı mesajı.
- Event-1 detayında afiş solda, künye sağda.
- Afişi olmayan etkinliklerin detayında boş afiş kutusu yok.
- Detaydaki `Bu etkinliği güncelle` düğmesi Güncelle sayfasını açar.
- Ekle ve Güncelle aynı boş formu farklı başlıkla gösterir.
- Kaydet düğmesi sayfayı yenilemez; bu sprintte kayıt/güncelleme mantığı yoktur.
- Menü geçişlerinde adres çubuğu aynı kalır; React state kullanılır.
- Sekme başlığı `useEffect` ile değişir.

## Build

```bash
cd frontend
npm run build
npm run preview
```

`npm run build` hatasız bitmeden teslim etmeyin.

## Vercel

- Root Directory: `frontend`
- Framework Preset: `Vite`

## Git teslimi

Repository kökünde:

```bash
git add .
git commit -m "Complete sprint 4"
git tag sprint-04
git push
git push --tags
```
