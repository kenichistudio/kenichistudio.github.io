import React, {
    createContext,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import clsx from "clsx";
import { LoaderCircle, MessageCircle, X } from "lucide-react";
import "./FeedbackAnimation.scss";

/* Exports main component for Astro use */
export default function FeedbackAnimation() {
    return (
        <div className="feedback-wrapper">
            <main>
                <Feedback />
            </main>
        </div>
    );
}

function Feedback() {
    return (
        <FeedbackProvider>
            <FeedbackForm />
        </FeedbackProvider>
    );
}

function FeedbackBase({ onSubmit, children }: Readonly<FeedbackBaseProps>) {
    const { status } = useFeedback();

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form
            className={clsx(
                "feedback__base",
                status === "submitted" && "feedback__base--hidden"
            )}
            onSubmit={submit}
        >
            {children}
        </form>
    );
}

function FeedbackButton({
    disabled,
    type = "button",
    onClick,
    children,
}: Readonly<FeedbackButtonProps>) {
    return (
        <button
            className="feedback__button"
            type={type}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function FeedbackComment() {
    const { rating, comment, setComment, status } = useFeedback();

    return (
        <div
            className={clsx(
                "feedback__comment",
                rating !== null && "feedback__comment--visible"
            )}
        >
            <div className="feedback__comment-inner">
                <label className="feedback__label" htmlFor="comment">
                    Tell us more (optional)
                </label>
                <textarea
                    className="feedback__textarea"
                    id="comment"
                    name="comment"
                    value={comment}
                    disabled={status !== "initial"}
                    onChange={(e) => setComment(e.target.value)}
                />
                <FeedbackButton type="submit" disabled={status !== "initial"}>
                    {status === "initial" ? (
                        "Submit your feedback"
                    ) : (
                        <LoaderCircle className="spin" />
                    )}
                </FeedbackButton>
            </div>
        </div>
    );
}

function FeedbackForm() {
    const { setComment, setRating, status, setStatus } = useFeedback();
    const closeRef = useRef(0);
    const statusRef = useRef(0);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    const onClose = () => {
        setIsClosing(true);
        clearTimeout(statusRef.current);
        clearTimeout(closeRef.current);
        // @ts-ignore
        closeRef.current = setTimeout(reset, 300);
    };
    const onSubmit = () => {
        if (status === "submitting") return;

        setStatus("submitting");

        // logic to send data
        try {
            // @ts-ignore
            statusRef.current = setTimeout(() => {
                setStatus("submitted");
            }, 750);
        } catch {
            setStatus("initial");
        }
    };
    const reset = () => {
        setComment("");
        setIsClosing(false);
        setIsMounted(false);
        setRating(null);
        setStatus("initial");
    };

    if (!isMounted) {
        return (
            <FeedbackButton onClick={() => setIsMounted(true)}>Reset</FeedbackButton>
        );
    }

    return (
        <div className={clsx("feedback", isClosing && "feedback--closing")}>
            <FeedbackBase onSubmit={onSubmit}>
                <FeedbackHeader onClose={onClose} />
                <FeedbackOptions />
                <FeedbackComment />
            </FeedbackBase>
            <FeedbackOverlay onClose={onClose} />
        </div>
    );
}

function FeedbackHeader({ onClose }: Readonly<FeedbackHeaderProps>) {
    return (
        <div className="feedback__header">
            <h2 className="feedback__title">Rate your experience</h2>
            <button
                className="feedback__close"
                type="button"
                aria-label="Close"
                onClick={onClose}
            >
                <X />
            </button>
        </div>
    );
}

function FeedbackOptions() {
    const { rating, setRating, status } = useFeedback();
    const options: FeedbackOption[] = [
        {
            label: "Bad",
            emoji: "😔",
            particle: "👎",
            rating: "bad",
        },
        {
            label: "Decent",
            emoji: "🙂",
            particle: "👍",
            rating: "ok",
        },
        {
            label: "Love it!",
            emoji: "😍",
            particle: "❤️",
            rating: "good",
        },
    ];

    return (
        <div className="feedback__options">
            {options.map((option) => (
                <button
                    key={option.rating}
                    className="feedback__option"
                    type="button"
                    aria-pressed={rating === option.rating}
                    name="rating"
                    value={option.rating}
                    disabled={status !== "initial"}
                    onClick={() => setRating(option.rating)}
                >
                    <FeedbackParticles particle={option.particle} />
                    <span className="feedback__emoji">{option.emoji}</span>
                    {option.label}
                </button>
            ))}
        </div>
    );
}

function FeedbackOverlay({ onClose }: Readonly<FeedbackOverlayProps>) {
    const { status } = useFeedback();
    const bubbleCount = 2;
    const bubbleArray = [];

    for (let b = 0; b < bubbleCount; ++b) {
        const bubbleKey = `bubble-${b}`;

        bubbleArray.push(
            <div key={bubbleKey} className="feedback__speech-bubble">
                <MessageCircle />
            </div>
        );
    }

    return (
        <div
            className={clsx(
                "feedback__overlay",
                status === "submitted" && "feedback__overlay--active"
            )}
        >
            <div className="feedback__circle-bg" />
            <div className="feedback__speech-bubbles">{bubbleArray}</div>
            <div className="feedback__content">
                <h2 className="feedback__title">Thank you!</h2>
                <p className="feedback__text">
                    Your feedback helps us improve. We appreciate the time you took to send
                    us the feedback!
                </p>
                <FeedbackButton onClick={onClose}>Done</FeedbackButton>
            </div>
        </div>
    );
}

function FeedbackParticles({ particle }: Readonly<FeedbackParticlesProps>) {
    const count = 3;
    const particleArray = [];

    for (let p = 0; p < count; ++p) {
        const particleKey = `particle-${p}`;

        particleArray.push(
            <span key={particleKey} className="feedback__particle" aria-hidden="true">
                {particle}
            </span>
        );
    }

    // @ts-ignore
    return particleArray;
}

function FeedbackProvider({ children }: Readonly<FeedbackProviderProps>) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState<FeedbackRating | null>(null);
    const [status, setStatus] = useState<FeedbackState>("initial");
    const providerValue = useMemo(
        () => ({
            comment,
            setComment,
            rating,
            setRating,
            status,
            setStatus,
        }),
        [comment, setComment, rating, setRating, status, setStatus]
    );

    return (
        <FeedbackContext.Provider value={providerValue}>
            {children}
        </FeedbackContext.Provider>
    );
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
    undefined
);

function useFeedback() {
    const context = useContext(FeedbackContext);

    if (!context) {
        throw new Error("`useFeedback` must be used within a `FeedbackProvider`");
    }

    return context;
}

interface FeedbackBaseProps {
    onSubmit: () => void;
    children?: React.ReactNode;
}
interface FeedbackButtonProps {
    disabled?: boolean;
    type?: FeedbackButtonType;
    onClick?: () => void;
    children?: React.ReactNode;
}
interface FeedbackContextType {
    comment: string;
    setComment: React.Dispatch<React.SetStateAction<string>>;
    rating: FeedbackRating | null;
    setRating: React.Dispatch<React.SetStateAction<FeedbackRating | null>>;
    status: FeedbackState;
    setStatus: React.Dispatch<React.SetStateAction<FeedbackState>>;
}
interface FeedbackHeaderProps {
    onClose: () => void;
}
interface FeedbackOverlayProps {
    onClose: () => void;
}
interface FeedbackParticlesProps {
    particle: FeedbackParticle;
}
interface FeedbackProviderProps {
    children: React.ReactNode;
}

type FeedbackButtonType = "button" | "submit";
type FeedbackEmoji = "😔" | "🙂" | "😍";
type FeedbackOption = {
    label: string;
    emoji: FeedbackEmoji;
    particle: FeedbackParticle;
    rating: FeedbackRating;
};
type FeedbackParticle = "👎" | "👍" | "❤️";
type FeedbackRating = "bad" | "ok" | "good";
type FeedbackState = "initial" | "submitting" | "submitted";
