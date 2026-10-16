import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import styles from "./ScrollBar.module.css";

function ScrollBar() {
    const [page, setPage] = useState({ top: 0, height: 0, viewport: 0 });
    const dragOffset = useRef<number | null>(null);

    useEffect(() => {
        let frame = 0;
        const measure = () => {
            frame = 0;
            setPage({
                top: window.scrollY,
                height: document.documentElement.scrollHeight,
                viewport: window.innerHeight,
            });
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };
        measure();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        const observer = new ResizeObserver(schedule);
        observer.observe(document.body);
        const root = document.getElementById("root");
        if (root) observer.observe(root);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            observer.disconnect();
        };
    }, []);

    const maximum = Math.max(0, page.height - page.viewport);
    const trackHeight = Math.max(0, page.viewport - 4);
    const thumbHeight = Math.min(trackHeight, Math.max(28, trackHeight * page.viewport / (page.height || 1)));
    const travel = trackHeight - thumbHeight;
    const thumbTop = maximum ? Math.min(maximum, Math.max(0, page.top)) / maximum * travel : 0;

    const move = (event: PointerEvent<HTMLDivElement>, offset: number) => {
        const track = event.currentTarget.getBoundingClientRect();
        const position = Math.max(0, Math.min(travel, event.clientY - track.top - offset));
        window.scrollTo({ top: travel ? position / travel * maximum : 0, behavior: "instant" });
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        let destination: number;
        switch (event.key) {
            case "ArrowDown": destination = page.top + 40; break;
            case "ArrowUp": destination = page.top - 40; break;
            case "PageDown": destination = page.top + page.viewport * 0.9; break;
            case "PageUp": destination = page.top - page.viewport * 0.9; break;
            case "Home": destination = 0; break;
            case "End": destination = maximum; break;
            default: return;
        }
        event.preventDefault();
        window.scrollTo({ top: Math.max(0, Math.min(maximum, destination)), behavior: "instant" });
    };

    if (!maximum) return null;

    return (
        <div
            className={styles.track}
            role="scrollbar"
            aria-label="Desplazamiento de la página"
            aria-controls="root"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={maximum}
            aria-valuenow={Math.round(Math.max(0, Math.min(maximum, page.top)))}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.preventDefault();
                const y = event.clientY - event.currentTarget.getBoundingClientRect().top;
                dragOffset.current = y >= thumbTop && y <= thumbTop + thumbHeight
                    ? y - thumbTop : thumbHeight / 2;
                event.currentTarget.focus({ preventScroll: true });
                event.currentTarget.setPointerCapture(event.pointerId);
                move(event, dragOffset.current);
            }}
            onPointerMove={(event) => {
                if (dragOffset.current !== null) move(event, dragOffset.current);
            }}
            onPointerUp={(event) => {
                dragOffset.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }
            }}
            onPointerCancel={() => { dragOffset.current = null; }}
            onLostPointerCapture={() => { dragOffset.current = null; }}
        >
            <div
                className={styles.thumb}
                style={{ height: thumbHeight, transform: `translateY(${thumbTop}px)` }}
            />
        </div>
    );
}

export default ScrollBar;
