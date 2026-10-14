import { useEffect, useState } from "react";
import "./App.css";
import { events } from "./data/events";
import type { CampusEvent, Category } from "./types/campus-event";
import {
  filterByCategory,
  findEventById,
  searchEvents,
} from "./utils/filter-events";

type PageName = "home" | "events" | "detail" | "add" | "update";

const menuItems: { label: string; page: PageName }[] = [
  { label: "Ana Sayfa", page: "home" },
  { label: "Etkinlikler", page: "events" },
  { label: "Ekle", page: "add" },
];

function formatDate(dateText: string): string {
  const [day, month, year] = dateText.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function dateKey(dateText: string): string {
  const [day, month, year] = dateText.split("-");
  return `${year}-${month}-${day}`;
}

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  function go(next: PageName, id: string | null = null): void {
    setPage(next);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const selected = selectedId
    ? findEventById(events, selectedId)
    : undefined;

  const categories = [...new Set(events.map((event) => event.category))];

  const filtered = filterByCategory(
    searchEvents(events, searchText),
    category,
  );

  const upcoming = [...events]
    .sort((a, b) => dateKey(a.date).localeCompare(dateKey(b.date)))
    .slice(0, 2);

  const title =
    page === "home"
      ? "Ana Sayfa"
      : page === "events"
        ? "Tüm Etkinlikler"
        : page === "add"
          ? "Etkinlik Ekle"
          : page === "update"
            ? "Etkinlik Güncelle"
            : selected?.title ?? "Etkinlik Bulunamadı";

  const headerTitle = page === "home" ? "Kampüs Etkinlikleri" : title;

  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${title}`;
  }, [title]);

  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        <h2>{event.title}</h2>
        <p className="kategori-etiketi">{event.category}</p>

        <dl className="kart-kunye">
          <div>
            <dt>Tarih</dt>
            <dd>{formatDate(event.date)}</dd>
          </div>
          <div>
            <dt>Saat</dt>
            <dd>{event.time}</dd>
          </div>
          <div>
            <dt>Yer</dt>
            <dd>{event.location}</dd>
          </div>
          <div>
            <dt>Kontenjan</dt>
            <dd>{event.capacity}</dd>
          </div>
        </dl>

        <p>{event.description}</p>

        <a
          className="buton"
          href={`#${event.id}`}
          onClick={(clickEvent) => {
            clickEvent.preventDefault();
            go("detail", event.id);
          }}
        >
          Detayları gör
        </a>
      </article>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="header-icerik">
          <h1>{headerTitle}</h1>

          <nav className="site-nav" aria-label="Ana menü">
            {menuItems.map((item) => (
              <a
                key={item.page}
                href={`#${item.page}`}
                aria-current={page === item.page ? "page" : undefined}
                onClick={(clickEvent) => {
                  clickEvent.preventDefault();
                  go(item.page);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {page === "home" && (
          <>
            <section className="intro">
              <h2>Yaklaşan Etkinlikler</h2>
              <p>
                Tarihi en yakın iki kampüs etkinliğini aşağıda
                görebilirsiniz.
              </p>
            </section>

            <section className="etkinlik-listesi">
              {upcoming.map(renderCard)}
            </section>
          </>
        )}

        {page === "events" && (
          <>
            <form
              className="filtre"
              onSubmit={(submitEvent) => submitEvent.preventDefault()}
            >
              <div className="alan-grubu">
                <label htmlFor="arama">Etkinlik ara</label>
                <input
                  type="search"
                  id="arama"
                  placeholder="atölye, kariyer, yapay..."
                  value={searchText}
                  onChange={(changeEvent) =>
                    setSearchText(changeEvent.target.value)
                  }
                />
              </div>

              <div className="alan-grubu">
                <label htmlFor="kategori-filtre">Kategori</label>
                <select
                  id="kategori-filtre"
                  value={category}
                  onChange={(changeEvent) =>
                    setCategory(changeEvent.target.value as Category | "")
                  }
                >
                  <option value="">Tümü</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <p id="sonuc" role="status" aria-live="polite">
              {filtered.length === 0
                ? "Aramanıza uygun etkinlik bulunamadı."
                : `${filtered.length} etkinlik listeleniyor.`}
            </p>

            <section className="etkinlik-listesi">
              {filtered.length > 0 ? (
                filtered.map(renderCard)
              ) : (
                <p className="bos-sonuc">
                  Aramanıza uygun etkinlik bulunamadı.
                </p>
              )}
            </section>
          </>
        )}

        {page === "detail" && !selected && (
          <section className="mesaj hata-kutusu">
            <h2>Etkinlik bulunamadı</h2>
            <p>Seçilen etkinlik bulunamadı veya etkinlik seçilmedi.</p>
            <a
              className="buton"
              href="#events"
              onClick={(clickEvent) => {
                clickEvent.preventDefault();
                go("events");
              }}
            >
              Listeye dön
            </a>
          </section>
        )}

        {page === "detail" && selected && (
          <article
            className={`detay-karti${selected.image ? "" : " detay-afissiz"}`}
          >
            {selected.image && (
              <figure className="afis-figure">
                <img
                  className="afis-gorsel"
                  src={selected.image}
                  alt={`${selected.title} afişi`}
                />
                <figcaption>{selected.title} afişi</figcaption>
              </figure>
            )}

            <div className="detay-icerik">
              <section className="kunye-karti">
                <h2>Etkinlik Künyesi</h2>
                <dl>
                  <div>
                    <dt>Tarih</dt>
                    <dd>{formatDate(selected.date)}</dd>
                  </div>
                  <div>
                    <dt>Saat</dt>
                    <dd>{selected.time}</dd>
                  </div>
                  <div>
                    <dt>Yer</dt>
                    <dd>{selected.location}</dd>
                  </div>
                  <div>
                    <dt>Kategori</dt>
                    <dd>{selected.category}</dd>
                  </div>
                  <div>
                    <dt>Kontenjan</dt>
                    <dd>{selected.capacity} kişi</dd>
                  </div>
                </dl>
              </section>

              <section className="aciklama">
                <h2>Açıklama</h2>
                <p>{selected.description}</p>
              </section>

              <div className="detay-butonlari">
                <a
                  className="buton ikincil"
                  href="#events"
                  onClick={(clickEvent) => {
                    clickEvent.preventDefault();
                    go("events");
                  }}
                >
                  Listeye dön
                </a>
                <a
                  className="buton"
                  href="#update"
                  onClick={(clickEvent) => {
                    clickEvent.preventDefault();
                    go("update", selected.id);
                  }}
                >
                  Bu etkinliği güncelle
                </a>
              </div>
            </div>
          </article>
        )}

        {(page === "add" || page === "update") && (
          <>
            <p className="form-aciklama">
              {page === "add"
                ? "Yeni etkinlik bilgilerini girin. Bu sprintte form yalnızca görünüm amaçlıdır."
                : "Etkinlik bilgilerini düzenleyin. Bu sprintte form doldurulmaz ve veri kaydedilmez."}
            </p>

            <form
              className="form-karti"
              onSubmit={(submitEvent) => submitEvent.preventDefault()}
            >
              <div className="form-alan">
                <label htmlFor="title">Etkinlik Adı *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  maxLength={80}
                  placeholder="Örn. Kariyer Günleri 2026"
                />
              </div>

              <div className="form-alan">
                <label htmlFor="category">Kategori *</label>
                <select id="category" name="category" defaultValue="">
                  <option value="" disabled>
                    Seçiniz
                  </option>
                  <option value="Seminer">Seminer</option>
                  <option value="Atölye">Atölye</option>
                  <option value="Söyleşi">Söyleşi</option>
                  <option value="Yarışma">Yarışma</option>
                </select>
              </div>

              <div className="form-alan">
                <label htmlFor="date">Tarih *</label>
                <input type="date" id="date" name="date" />
              </div>

              <div className="form-alan">
                <label htmlFor="time">Saat *</label>
                <input type="time" id="time" name="time" />
              </div>

              <div className="form-alan">
                <label htmlFor="location">Yer *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Örn. A Blok Konferans Salonu"
                />
              </div>

              <div className="form-alan">
                <label htmlFor="capacity">Kontenjan</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min={1}
                  max={1000}
                />
              </div>

              <div className="form-alan">
                <label htmlFor="description">Açıklama</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                />
              </div>

              <button className="buton" type="submit">
                Kaydet
              </button>
            </form>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-icerik">
          2416501039 - Muhammed Kerim Şahin - 2026
        </div>
      </footer>
    </>
  );
}

export default App;
