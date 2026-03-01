"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ReadmeModalProps {
    project: {
        title: string;
        repo: string;
        link: string;
    } | null;
    onClose: () => void;
}

export const ReadmeModal = ({ project, onClose }: ReadmeModalProps) => {
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMouseInside, setIsMouseInside] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!project) {
            setContent(null);
            setError(null);
            return;
        }

        const fetchReadme = async () => {
            setLoading(true);
            setError(null);

            try {
                const [owner, repo] = project.repo.split("/");
                const response = await fetch(`/api/readme?owner=${owner}&repo=${repo}`);
                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                } else {
                    setContent(data.content);
                }
            } catch {
                setError("Failed to fetch README");
            } finally {
                setLoading(false);
            }
        };

        fetchReadme();
    }, [project]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (project) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [project]);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Handle scroll behavior based on mouse position
    useEffect(() => {
        if (!project) return;

        const handleWheel = (e: WheelEvent) => {
            const backdrop = backdropRef.current;
            const contentContainer = contentRef.current;

            if (!backdrop || !contentContainer) return;

            if (isMouseInside) {
                // Mouse is inside the README content - scroll within the content
                e.preventDefault();
                contentContainer.scrollTop += e.deltaY;
            }
            // When mouse is outside, the backdrop scrolls (default behavior)
        };

        document.addEventListener('wheel', handleWheel, { passive: false });
        return () => document.removeEventListener('wheel', handleWheel);
    }, [project, isMouseInside]);

    if (!project) return null;

    // Extract owner and repo for image URL transformation
    const [owner, repo] = project.repo.split("/");

    // Helper to transform image URLs
    const transformImageUrl = (src: string): string => {
        if (!src) return '';

        // Already absolute URL
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return src;
        }

        // Remove leading ./ or /
        let cleanPath = src.replace(/^\.\//, '').replace(/^\//, '');

        // Build absolute GitHub raw URL
        return `https://raw.githubusercontent.com/${owner}/${repo}/main/${cleanPath}`;
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <motion.div
            ref={backdropRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Single pixel-styled container */}
            <motion.div
                ref={contentRef}
                className="relative w-auto max-w-[80vw] max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10"
                style={{ backgroundColor: '#f4ead5' }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sticky Header */}
                <div
                    className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-foreground/20"
                    style={{ backgroundColor: '#f4ead5' }}
                >
                    <h2 className="font-display text-xl tracking-[0.02em] text-[#2a4538]">
                        {project.title}
                    </h2>
                    <div className="flex items-center gap-4">
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold uppercase tracking-[0.3em] text-accent hover:text-accent/80 transition"
                        >
                            View on GitHub ↗
                        </a>
                        <button
                            onClick={onClose}
                            className="text-[#2a4538] text-sm uppercase tracking-[0.3em] hover:text-accent transition"
                        >
                            Close ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 py-6">
                    <div className="readme-content prose prose-lg max-w-none prose-headings:text-[#2a4538] prose-p:text-[#2a4538] prose-li:text-[#2a4538] prose-a:text-accent prose-strong:text-[#2a4538]">
                        {loading && (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-muted text-sm uppercase tracking-[0.3em]">
                                    Loading README...
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-300">
                                <p className="text-sm">{error}</p>
                                <p className="text-xs text-muted mt-2">
                                    The README might not exist or the repository might be private.
                                </p>
                            </div>
                        )}

                        {content && (
                            <div className="readme-content prose prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        // Transform image URLs to absolute GitHub URLs
                                        img: ({ src, alt, ...props }) => {
                                            const absoluteSrc = transformImageUrl(typeof src === 'string' ? src : '');

                                            return (
                                                <img
                                                    src={absoluteSrc}
                                                    alt={alt || ""}
                                                    className="max-w-full h-auto rounded"
                                                    loading="lazy"
                                                    {...props}
                                                />
                                            );
                                        },
                                        // Style links
                                        a: ({ href, children, ...props }) => (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent hover:text-accent/80 underline"
                                                {...props}
                                            >
                                                {children}
                                            </a>
                                        ),
                                        // Style code blocks
                                        pre: ({ children, ...props }) => (
                                            <pre
                                                className="bg-background/60 p-4 rounded overflow-x-auto text-sm"
                                                {...props}
                                            >
                                                {children}
                                            </pre>
                                        ),
                                        code: ({ children, className, ...props }) => {
                                            const isInline = !className;
                                            return isInline ? (
                                                <code
                                                    className="bg-background/60 px-1.5 py-0.5 rounded text-accent text-sm"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        // Style headings
                                        h1: ({ children, ...props }) => (
                                            <h1
                                                className="font-display text-3xl tracking-[0.02em] text-foreground mt-8 mb-4 first:mt-0"
                                                {...props}
                                            >
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({ children, ...props }) => (
                                            <h2
                                                className="font-display text-2xl tracking-[0.02em] text-foreground mt-8 mb-3 border-b border-muted/20 pb-2"
                                                {...props}
                                            >
                                                {children}
                                            </h2>
                                        ),
                                        h3: ({ children, ...props }) => (
                                            <h3
                                                className="font-display text-xl tracking-[0.02em] text-foreground mt-6 mb-2"
                                                {...props}
                                            >
                                                {children}
                                            </h3>
                                        ),
                                        // Style paragraphs
                                        p: ({ children, ...props }) => (
                                            <p className="text-muted leading-relaxed mb-4" {...props}>
                                                {children}
                                            </p>
                                        ),
                                        // Style lists
                                        ul: ({ children, ...props }) => (
                                            <ul className="list-disc list-inside text-muted mb-4 space-y-1" {...props}>
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({ children, ...props }) => (
                                            <ol className="list-decimal list-inside text-muted mb-4 space-y-1" {...props}>
                                                {children}
                                            </ol>
                                        ),
                                        // Style tables
                                        table: ({ children, ...props }) => (
                                            <div className="overflow-x-auto mb-4">
                                                <table className="min-w-full border-collapse" {...props}>
                                                    {children}
                                                </table>
                                            </div>
                                        ),
                                        th: ({ children, ...props }) => (
                                            <th
                                                className="border border-muted/30 bg-background/40 px-4 py-2 text-left text-sm font-semibold uppercase tracking-[0.1em]"
                                                {...props}
                                            >
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children, ...props }) => (
                                            <td className="border border-muted/30 px-4 py-2 text-sm text-muted" {...props}>
                                                {children}
                                            </td>
                                        ),
                                        // Style blockquotes
                                        blockquote: ({ children, ...props }) => (
                                            <blockquote
                                                className="border-l-4 border-accent/50 pl-4 italic text-muted/80 my-4"
                                                {...props}
                                            >
                                                {children}
                                            </blockquote>
                                        ),
                                        // Style horizontal rules
                                        hr: (props) => (
                                            <hr className="border-muted/20 my-8" {...props} />
                                        ),
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
};
