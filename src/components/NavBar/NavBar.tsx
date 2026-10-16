import { useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import heroLogo from "../../assets/PH-LOGO.png";
import styles from "./NavBar.module.css";

function NavBar() {
    const { pathname } = useLocation();
    const linksRef = useRef<HTMLDivElement>(null);
    const [indicator, setIndicator] = useState<{
        x: number; y: number; width: number;
    } | null>(null);

    useLayoutEffect(() => {
        const container = linksRef.current;
        if (!container) return;
        let disposed = false;

        const updateIndicator = () => {
            if (disposed) return;
            const text = container.querySelector<HTMLElement>('a[aria-current="page"] span');
            if (!text) {
                setIndicator(null);
                return;
            }
            const bounds = text.getBoundingClientRect();
            const parent = container.getBoundingClientRect();
            const textStyle = getComputedStyle(text);
            const paddingLeft = parseFloat(textStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(textStyle.paddingRight) || 0;
            const next = {
                x: bounds.left - parent.left + paddingLeft,
                y: bounds.bottom - parent.top,
                width: Math.max(0, bounds.width - paddingLeft - paddingRight),
            };
            setIndicator(previous => previous &&
                previous.x === next.x && previous.y === next.y &&
                previous.width === next.width
                ? previous : next);
        };

        updateIndicator();
        const observer = new ResizeObserver(updateIndicator);
        observer.observe(container);
        container.querySelectorAll('a span').forEach(text => observer.observe(text));
        void document.fonts.ready.then(updateIndicator);
        document.fonts.addEventListener("loadingdone", updateIndicator);

        return () => {
            disposed = true;
            observer.disconnect();
            document.fonts.removeEventListener("loadingdone", updateIndicator);
        };
    }, [pathname]);

    const links = [
        { nombre: "Inicio", ruta: "/" },
        { nombre: "Ensayos", ruta: "/ensayos" },
        { nombre: "Tienda", ruta: "/tienda" },
    ];

    return (
        <header className={styles.header}>
            <NavLink to="/" className={styles.heroBrand} aria-label="Pensamiento Hereje — Inicio">
                <img src={heroLogo} alt="" className={styles.heroLogo} />
            </NavLink>
            <nav
                className={styles.navbar}
                aria-label="Navegación principal"
            >

                <div className={styles.links} ref={linksRef}>
                    {indicator && (
                        <span
                            aria-hidden="true"
                            className={styles.indicator}
                            style={{
                                transform: `translate(${indicator.x}px, ${indicator.y}px)`,
                                width: indicator.width,
                            }}
                        />
                    )}
                    {links.map((link) => (
                        <NavLink
                            key={link.ruta}
                            to={link.ruta}
                            end={link.ruta === "/"}
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.active : ""}`
                            }
                        >
                            <span className={styles.text}>
                                {link.nombre}
                            </span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
