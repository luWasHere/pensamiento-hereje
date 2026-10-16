import { Fragment } from "react";
import styles from "./Home.module.css";
import wallpaper from "../../assets/wallpaper1.jpg";
import introduction from "./introduction";

const quotes: Record<number, string> = {
    1: "La verdadera herejía no está en una discusión metafísica, sino en una discusión de nuestros valores terrenales.",
    3: "Que cada hereje sea el arquitecto de sus propias luces y sombras.",
    6: "Conquistar una realidad de la cual jamás se desearía escapar.",
};

function renderEmphasis(text: string) {
    return text.split(/(_[^_]+_)/g).map((part, index) =>
        part.startsWith("_") && part.endsWith("_")
            ? <strong key={index} className={styles.emphasis}><em>{part.slice(1, -1)}</em></strong>
            : part,
    );
}

function Home() {
    return (
        <main className={styles.home}>
            <img src={wallpaper} alt="" className={styles.image} />
            <article className={styles.content} aria-labelledby="introduction-title">
                <header className={styles.introHeader}>
                    <span className={styles.eyebrow}>Una declaración de intenciones</span>
                    <h1 id="introduction-title">Pensamiento Hereje</h1>
                    <span className={styles.rule} aria-hidden="true" />
                </header>
                <div className={styles.prose}>
                    {introduction.slice(0, -1).map((paragraph, index) => (
                        <Fragment key={index}>
                            {quotes[index] && (
                                <blockquote
                                    aria-hidden="true"
                                    className={[styles.pullQuote, index === 3 ? styles.quoteLeft : ""].join(" ")}
                                >
                                    <span className={styles.quoteMark}>“</span>
                                    {quotes[index]}
                                </blockquote>
                            )}
                            <p className={index === 0 ? styles.lead : undefined}>
                                {renderEmphasis(paragraph)}
                            </p>
                        </Fragment>
                    ))}
                </div>
                <footer className={styles.closing}>
                    <p>{introduction.at(-1)}</p>
                </footer>
            </article>
        </main>
    );
}

export default Home;
