import Head from "next/head";
import Link from "next/link";
import styles from "../styles/LandingPage.module.css";
import { useState } from "react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Head>
        <title>Notes</title>
      </Head>

      <div>
        <nav className={styles.header}>
          <div className={styles.logoGroup}>
            <img className={styles.icons} src="icons.svg" alt="..." />
            <h1 className={styles.logo}>otes</h1>
          </div>

          <div className={styles.burgerContainer} onClick={toggleMenu}>
            <div className={styles.burgerButton}></div>
            <div className={styles.burgerButton}></div>
            <div className={styles.burgerButton}></div>
          </div>

          <div className={`${styles.navbar} ${isMenuOpen ? styles.open : ""}`}>
            <ul className={styles.navLinks}>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
            </ul>
            <Link className={styles.signIn} href="/login">
              Sign In
            </Link>
            <Link className={styles.getStarted} href="/signup">
              Get started
            </Link>
          </div>
        </nav>

        <main className={styles.main} id="home">
          <section className={styles.hero}>
            <div className={styles.textContent}>
              <h2>
                Jadwalkan
                <br />
                kegiatan hari Anda
              </h2>
              <p>Notes, membantu anda untuk menjalani hari lebih teratur</p>
            </div>
            <div className={styles.icon}>
              <img src="clipboard-icon.svg" alt="Clipboard Icon" />
            </div>
          </section>
        </main>

        <div className={styles.containerList} id="about">
          <section className={styles.aboutContainer}>
            <div className={styles.about}>
              <h2>
                Mengelola hari lebih <br /> mudah dan terorganisir
              </h2>
            </div>

            <div className={styles.taskList}>
              <div className={styles.taskItem}>
                <img
                  className={styles.iconCheck}
                  src="checklist.svg"
                  alt="..."
                />
                <p>Mengatur aktivitas harian dengan mudah</p>
              </div>
              <div className={styles.taskItem}>
                <img
                  className={styles.iconCheck}
                  src="checklist.svg"
                  alt="..."
                />
                <p>Memprioritaskan tugas sesuai kebutuhan</p>
              </div>
              <div className={styles.taskItem}>
                <img
                  className={styles.iconCheck}
                  src="checklist.svg"
                  alt="..."
                />
                <p>Memantau perkembangan dan pencapaian anda</p>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.containerList} id="blog">
          <section className={styles.aboutContainer2}>
            <div className={styles.about}>
              <h2>Kenapa memilih kami?</h2>
            </div>

            <div className={styles.taskList}>
              <div className={styles.taskItem}>
                <img
                  className={styles.iconCheck}
                  src="checklist.svg"
                  alt="..."
                />
                <p>
                  {" "}
                  <span className="font-bold">
                    Fleksibel dan mudah digunakan{" "}
                  </span>
                  <br />
                  Sesuaikan jadawal dan daftar tugas Anda kapan saja
                </p>
              </div>
              <div className={styles.taskItem}>
                <img
                  className={styles.iconCheck}
                  src="checklist.svg"
                  alt="..."
                />
                <p>
                  <span className="font-bold">Dukungan komunitas</span>
                  <br />
                  Kami selalu terbuka terhadap masukan untuk terus berkembang
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.footerContainer}>
          <footer className={styles.footer}>
            <p>&copy; Copyright 2024, notes app kelompok 4</p>
          </footer>
        </div>
      </div>
    </>
  );
}
