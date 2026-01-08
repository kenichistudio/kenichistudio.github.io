import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import {
    Asterisk,
    Circle,
    FlagTriangleLeft,
    TriangleRight,
    Star,
} from "lucide-react";
import "./NotFoundAnimation.scss";

// Main export for Astro
export default function NotFoundAnimation() {
    return (
        <div className="not-found-wrapper">
            <NotFound />
        </div>
    );
}

function NotFound() {
    // 0
    const R0: SlotSymbol = { symbol: "star", color: "red" };
    const Y0: SlotSymbol = { symbol: "circle", color: "yellow" };
    const G0: SlotSymbol = { symbol: "asterisk", color: "green" };
    const B0: SlotSymbol = { symbol: "0", color: "blue" };
    // 4
    const R4: SlotSymbol = { symbol: "flag-triangle-left", color: "red" };
    const Y4: SlotSymbol = { symbol: "right-triangle", color: "yellow" };
    const G4: SlotSymbol = { symbol: "4", color: "green" };
    const B4: SlotSymbol = { symbol: "4", color: "blue" };

    const duration = 6000;
    const slots: SlotProps[] = [
        {
            slot: [B4, Y4, R4, G4, B4, Y4, R4, G4, B4, Y4, R4, G4],
            duration,
        },
        {
            slot: [Y0, G0, B0, R0, Y0, G0, B0, R0, Y0, G0, B0, R0],
            duration,
            delay: 100,
        },
        {
            slot: [G4, R4, Y4, B4, G4, R4, Y4, B4, G4, R4, Y4, B4],
            duration,
            delay: 200,
        },
    ];

    return (
        <div className="main-content">
            <h1 className="slots">
                {slots.map((slot, i) => (
                    <Slot key={i + 1} {...slot} />
                ))}
                <span className="slots__sr">404</span>
            </h1>
            <a className="btn-link" href="#">
                Go Back Home
            </a>
        </div>
    );
}

function Slot({ slot, duration, delay = 0 }: Readonly<SlotProps>) {
    const slotRef = useRef<HTMLSpanElement | null>(null);
    const getSymbol = (symbol: string) => {
        const size = { width: "1em", height: "1em" };

        switch (symbol) {
            case "asterisk":
                return <Asterisk {...size} strokeWidth={1.5} />;
            case "circle":
                return <Circle {...size} strokeWidth={2.5} />;
            case "flag-triangle-left":
                return <FlagTriangleLeft {...size} strokeWidth={2.5} />;
            case "right-triangle":
                return <TriangleRight {...size} strokeWidth={2.5} />;
            case "star":
                return <Star {...size} strokeWidth={2.5} />;
            default:
                // Render 0 or 4 as text
                return symbol;
        }
    };
    // for a seamless loop, add the first item as the last
    const slotSeamless = [...slot, slot[0]];
    const symbolElements = slotSeamless.map((item) => {
        const symbolKey = `symbol-${Utils.randomHash()}`;
        const symbolColor = `slots__symbol--${item.color}`;

        return (
            <span key={symbolKey} className={clsx("slots__symbol", symbolColor)}>
                {getSymbol(item.symbol)}
            </span>
        );
    });

    useEffect(() => {
        const itemCount = slotSeamless.length;
        const percent = 100 / itemCount;
        const easing = "cubic-bezier(0.45, 0, 0.55, 1.2)";
        const options = {
            delay,
            duration,
            iterations: Infinity,
        };
        const rollAmount = 3;
        const stopIndexes: number[] = [];
        const translateYs: number[] = [];
        // add the multipliers or keyframe stops
        for (let i = 0; i < itemCount; ++i) {
            if (i % rollAmount === 0) {
                stopIndexes.push(i);
            }
        }
        // then the keyframes themselves
        for (const s of stopIndexes) {
            const translateY = +(-100 + percent + percent * s).toFixed(2);

            translateYs.push(translateY, translateY);
        }
        // no duplicate first keyframe
        translateYs.shift();
        // last keyframe must end in 0 y-translation
        const lastKeyframe = translateYs.at(-1) || 0;

        if (lastKeyframe < 0) {
            translateYs.push(0, 0);
        }

        const animation = slotRef.current?.animate(
            translateYs.map((y) => ({
                transform: `translateY(${y}%)`,
                easing,
            })),
            options
        );

        return () => animation?.cancel();
    }, [delay, duration, slotSeamless.length]);

    return (
        <span className="slots__slot" aria-hidden="true">
            <span className="slots__slot-inner" ref={slotRef}>
                {symbolElements}
            </span>
        </span>
    );
}

class Utils {
    static randomHash(): string {
        const random = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;

        return Math.round(random * 0xffff).toString(16);
    }
}

// interfaces
interface SlotProps {
    slot: SlotSymbol[];
    duration: number;
    delay?: number;
}

// types
type SlotSymbol = {
    symbol: string;
    color: SlotSymbolColor;
};
type SlotSymbolColor = "red" | "yellow" | "green" | "blue";
