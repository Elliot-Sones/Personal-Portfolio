"use client";

/**
 * PixelSoccerField - A pixel art style soccer field background
 * Uses discrete rectangles to create a retro game aesthetic
 * Matches the existing pixel UI styling in globals.css
 * 
 * Responsive Design:
 * - Uses CSS clamp() for adaptive sizing across all screen sizes
 * - Mobile (320px): smaller elements for better proportions
 * - Desktop (1200px+): larger elements for visual impact
 */
export function PixelSoccerField() {
    // Pixel size for the grid (matches --pixel-size in CSS)
    // Responsive: 6px on mobile, 8px on desktop
    const pixelSize = 8;

    // Field colors - matching the Stardew Valley cozy palette
    const colors = {
        grass1: "#3a5f4a",      // Main grass
        grass2: "#4a7a5f",      // Lighter grass stripe
        grass3: "#2a4538",      // Darker accent
        line: "rgba(244, 234, 213, 0.5)", // Warm cream lines
        lineAccent: "rgba(244, 234, 213, 0.35)",
    };

    // Responsive size values using CSS clamp()
    // Format: clamp(min, preferred, max)
    const responsiveSizes = {
        // Center circle: 80px on mobile → 160px on desktop
        centerCircle: "clamp(80px, 12vw, 160px)",
        // Corner arcs: 16px on mobile → 32px on desktop
        cornerArc: "clamp(16px, 2.5vw, 32px)",
        // Center spot: 8px on mobile → 12px on desktop
        centerSpot: "clamp(8px, 1vw, 12px)",
        // Penalty spots: 6px on mobile → 8px on desktop
        penaltySpot: "clamp(6px, 0.75vw, 8px)",
        // Border width: 2px on mobile → 4px on desktop
        borderWidth: "clamp(2px, 0.35vw, 4px)",
        // Center line height: 2px on mobile → 4px on desktop
        centerLineHeight: "clamp(2px, 0.35vw, 4px)",
        // Field container top/bottom padding: 100px on mobile → 250px on desktop
        fieldPadding: "clamp(100px, 15vh, 250px)",
    };

    return (
        <div
            className="absolute inset-x-0 top-0 z-[-5] pointer-events-none overflow-hidden"
            style={{ height: "100%", minHeight: "100vh" }}
        >
            {/* Grass base with pixel stripes */}
            <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                style={{ imageRendering: "pixelated" }}
            >
                <defs>
                    {/* Grass stripe pattern - horizontal bands like old games */}
                    <pattern
                        id="grassStripes"
                        patternUnits="userSpaceOnUse"
                        width={pixelSize * 2}
                        height={pixelSize * 12}
                    >
                        <rect width="100%" height={pixelSize * 6} fill={colors.grass1} />
                        <rect y={pixelSize * 6} width="100%" height={pixelSize * 6} fill={colors.grass2} />
                    </pattern>

                    {/* Pixel grid overlay for authentic look */}
                    <pattern
                        id="pixelGrid"
                        patternUnits="userSpaceOnUse"
                        width={pixelSize}
                        height={pixelSize}
                    >
                        <rect width={pixelSize} height={pixelSize} fill="transparent" />
                        <rect
                            width={pixelSize - 1}
                            height={pixelSize - 1}
                            fill="transparent"
                            stroke="rgba(0,0,0,0.03)"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>

                {/* Base grass fill */}
                <rect width="100%" height="100%" fill="url(#grassStripes)" />

                {/* Subtle pixel grid */}
                <rect width="100%" height="100%" fill="url(#pixelGrid)" />
            </svg>

            {/* Pixel soccer field markings */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="relative"
                    style={{
                        width: "clamp(320px, 95%, 1600px)",
                        height: `calc(100% - ${responsiveSizes.fieldPadding})`,
                    }}
                >
                    {/* Outer boundary - thick pixel line */}
                    <PixelRect
                        className="absolute inset-0"
                        borderWidth={responsiveSizes.borderWidth}
                        borderColor={colors.line}
                    />

                    {/* Center line - horizontal (splits field into two halves) */}
                    <div
                        className="absolute left-0 right-0 top-1/2"
                        style={{
                            height: responsiveSizes.centerLineHeight,
                            transform: "translateY(-50%)",
                            backgroundColor: colors.line,
                            boxShadow: `0 2px 0 ${colors.lineAccent}`,
                        }}
                    />

                    {/* Center circle - made of pixel segments */}
                    <ResponsivePixelCircle
                        className="absolute top-1/2 left-1/2"
                        size={responsiveSizes.centerCircle}
                        borderWidth={responsiveSizes.borderWidth}
                        borderColor={colors.line}
                        style={{ transform: "translate(-50%, -50%)" }}
                    />

                    {/* Center spot */}
                    <div
                        className="absolute top-1/2 left-1/2"
                        style={{
                            width: responsiveSizes.centerSpot,
                            height: responsiveSizes.centerSpot,
                            transform: "translate(-50%, -50%)",
                            backgroundColor: colors.line,
                            boxShadow: `0 0 8px ${colors.lineAccent}`,
                        }}
                    />

                    {/* Top penalty area */}
                    <PixelRect
                        className="absolute top-0 left-1/2"
                        style={{
                            transform: "translateX(-50%)",
                            width: "50%",
                            height: "25%",
                        }}
                        borderWidth={responsiveSizes.borderWidth}
                        borderColor={colors.line}
                        noTop
                    />

                    {/* Top goal box (6-yard) */}
                    <PixelRect
                        className="absolute top-0 left-1/2"
                        style={{
                            transform: "translateX(-50%)",
                            width: "25%",
                            height: "10%",
                        }}
                        borderWidth={responsiveSizes.borderWidth}
                        borderColor={colors.line}
                        noTop
                    />

                    {/* Top penalty spot */}
                    <div
                        className="absolute left-1/2"
                        style={{
                            top: "18%",
                            width: responsiveSizes.penaltySpot,
                            height: responsiveSizes.penaltySpot,
                            transform: "translateX(-50%)",
                            backgroundColor: colors.line,
                        }}
                    />

                    {/* Bottom penalty area */}
                    <PixelRect
                        className="absolute bottom-0 left-1/2"
                        style={{
                            transform: "translateX(-50%)",
                            width: "50%",
                            height: "25%",
                        }}
                        borderWidth={responsiveSizes.borderWidth}
                        borderColor={colors.line}
                        noBottom
                    />

                    {/* Bottom goal box (6-yard) */}
                    <PixelRect
                        className="absolute bottom-0 left-1/2"
                        style={{
                            transform: "translateX(-50%)",
                            width: "25%",
                            height: "10%",
                        }}
                        borderWidth={responsiveSizes.borderWidth}
                        borderColor={colors.line}
                        noBottom
                    />

                    {/* Bottom penalty spot */}
                    <div
                        className="absolute left-1/2"
                        style={{
                            bottom: "18%",
                            width: responsiveSizes.penaltySpot,
                            height: responsiveSizes.penaltySpot,
                            transform: "translateX(-50%)",
                            backgroundColor: colors.line,
                        }}
                    />

                    {/* Corner arcs - pixel style quarter circles */}
                    <ResponsivePixelCornerArc position="top-left" size={responsiveSizes.cornerArc} color={colors.line} borderWidth={responsiveSizes.borderWidth} />
                    <ResponsivePixelCornerArc position="top-right" size={responsiveSizes.cornerArc} color={colors.line} borderWidth={responsiveSizes.borderWidth} />
                    <ResponsivePixelCornerArc position="bottom-left" size={responsiveSizes.cornerArc} color={colors.line} borderWidth={responsiveSizes.borderWidth} />
                    <ResponsivePixelCornerArc position="bottom-right" size={responsiveSizes.cornerArc} color={colors.line} borderWidth={responsiveSizes.borderWidth} />
                </div>
            </div>

            {/* Atmospheric overlay - cozy evening feel */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
            linear-gradient(180deg, rgba(50, 70, 60, 0.2), rgba(0, 0, 0, 0.4) 85%),
            radial-gradient(circle at 50% 100%, rgba(218, 160, 109, 0.12), transparent 50%)
          `,
                }}
            />
        </div>
    );
}

// Pixel-style rectangle with chunky borders (no border-radius)
// Supports responsive borderWidth values using CSS clamp()
function PixelRect({
    className = "",
    style = {},
    borderWidth = "4px",
    borderColor = "white",
    noTop = false,
    noBottom = false,
    noLeft = false,
    noRight = false,
}: {
    className?: string;
    style?: React.CSSProperties;
    borderWidth?: string | number;
    borderColor?: string;
    noTop?: boolean;
    noBottom?: boolean;
    noLeft?: boolean;
    noRight?: boolean;
}) {
    // Normalize borderWidth to string with unit
    const borderValue = typeof borderWidth === "number" ? `${borderWidth}px` : borderWidth;

    return (
        <div
            className={className}
            style={{
                ...style,
                boxSizing: "border-box",
                borderTop: noTop ? "none" : `${borderValue} solid ${borderColor}`,
                borderBottom: noBottom ? "none" : `${borderValue} solid ${borderColor}`,
                borderLeft: noLeft ? "none" : `${borderValue} solid ${borderColor}`,
                borderRight: noRight ? "none" : `${borderValue} solid ${borderColor}`,
                boxShadow: `2px 2px 0 rgba(26, 48, 40, 0.3)`,
            }}
        />
    );
}

// Pixel-style circle using SVG for clean edges
function PixelCircle({
    className = "",
    style = {},
    size = 100,
    borderWidth = 4,
    borderColor = "white",
}: {
    className?: string;
    style?: React.CSSProperties;
    size?: number;
    borderWidth?: number;
    borderColor?: string;
}) {
    // Create a pixelated circle using stepped path
    const radius = size / 2 - borderWidth;
    const segments = 16; // Number of segments for pixel look

    const points: string[] = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        // Snap to grid for pixel effect
        const x = Math.round((Math.cos(angle) * radius + size / 2) / 4) * 4;
        const y = Math.round((Math.sin(angle) * radius + size / 2) / 4) * 4;
        points.push(`${x},${y}`);
    }

    return (
        <svg
            className={className}
            style={{ ...style, width: size, height: size }}
            viewBox={`0 0 ${size} ${size}`}
        >
            <polygon
                points={points.join(" ")}
                fill="none"
                stroke={borderColor}
                strokeWidth={borderWidth}
                strokeLinejoin="miter"
            />
        </svg>
    );
}

// Pixel corner arc for field corners
function PixelCornerArc({
    position,
    size = 32,
    color = "white",
}: {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    size?: number;
    color?: string;
}) {
    const positionStyles: Record<string, React.CSSProperties> = {
        "top-left": { top: 0, left: 0 },
        "top-right": { top: 0, right: 0 },
        "bottom-left": { bottom: 0, left: 0 },
        "bottom-right": { bottom: 0, right: 0 },
    };

    // Create quarter arc with pixel steps
    const getArcPath = () => {
        const steps = 4;
        const pathParts: string[] = [];

        switch (position) {
            case "top-left":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (1 - i / steps);
                    const x = Math.round((1 - Math.cos(angle)) * size / 4) * 4;
                    const y = Math.round((1 - Math.sin(angle)) * size / 4) * 4;
                    pathParts.push(`${x},${y}`);
                }
                break;
            case "top-right":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (i / steps);
                    const x = Math.round(Math.cos(angle) * size / 4) * 4;
                    const y = Math.round((1 - Math.sin(angle)) * size / 4) * 4;
                    pathParts.push(`${size - x},${y}`);
                }
                break;
            case "bottom-left":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (i / steps);
                    const x = Math.round((1 - Math.cos(angle)) * size / 4) * 4;
                    const y = Math.round(Math.sin(angle) * size / 4) * 4;
                    pathParts.push(`${x},${size - y}`);
                }
                break;
            case "bottom-right":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (1 - i / steps);
                    const x = Math.round(Math.cos(angle) * size / 4) * 4;
                    const y = Math.round(Math.sin(angle) * size / 4) * 4;
                    pathParts.push(`${size - x},${size - y}`);
                }
                break;
        }

        return pathParts.join(" ");
    };

    return (
        <svg
            className="absolute"
            style={{
                ...positionStyles[position],
                width: size,
                height: size,
            }}
            viewBox={`0 0 ${size} ${size}`}
        >
            <polyline
                points={getArcPath()}
                fill="none"
                stroke={color}
                strokeWidth={4}
                strokeLinejoin="miter"
            />
        </svg>
    );
}

// Responsive pixel-style circle using CSS for sizing
// Uses a fixed viewBox but CSS-controlled dimensions
function ResponsivePixelCircle({
    className = "",
    style = {},
    size = "100px",
    borderWidth = "4px",
    borderColor = "white",
}: {
    className?: string;
    style?: React.CSSProperties;
    size?: string;
    borderWidth?: string;
    borderColor?: string;
}) {
    // Use a fixed internal size for consistent pixelation
    const internalSize = 160;
    const internalBorder = 4;
    const radius = internalSize / 2 - internalBorder;
    const segments = 16; // Number of segments for pixel look

    const points: string[] = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        // Snap to grid for pixel effect
        const x = Math.round((Math.cos(angle) * radius + internalSize / 2) / 4) * 4;
        const y = Math.round((Math.sin(angle) * radius + internalSize / 2) / 4) * 4;
        points.push(`${x},${y}`);
    }

    return (
        <svg
            className={className}
            style={{ ...style, width: size, height: size }}
            viewBox={`0 0 ${internalSize} ${internalSize}`}
            preserveAspectRatio="xMidYMid meet"
        >
            <polygon
                points={points.join(" ")}
                fill="none"
                stroke={borderColor}
                strokeWidth={internalBorder}
                strokeLinejoin="miter"
            />
        </svg>
    );
}

// Responsive pixel corner arc for field corners
function ResponsivePixelCornerArc({
    position,
    size = "32px",
    color = "white",
    borderWidth = "4px",
}: {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    size?: string;
    color?: string;
    borderWidth?: string;
}) {
    const positionStyles: Record<string, React.CSSProperties> = {
        "top-left": { top: 0, left: 0 },
        "top-right": { top: 0, right: 0 },
        "bottom-left": { bottom: 0, left: 0 },
        "bottom-right": { bottom: 0, right: 0 },
    };

    // Use fixed internal size for consistent pixelation
    const internalSize = 32;

    // Create quarter arc with pixel steps
    const getArcPath = () => {
        const steps = 4;
        const pathParts: string[] = [];

        switch (position) {
            case "top-left":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (1 - i / steps);
                    const x = Math.round((1 - Math.cos(angle)) * internalSize / 4) * 4;
                    const y = Math.round((1 - Math.sin(angle)) * internalSize / 4) * 4;
                    pathParts.push(`${x},${y}`);
                }
                break;
            case "top-right":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (i / steps);
                    const x = Math.round(Math.cos(angle) * internalSize / 4) * 4;
                    const y = Math.round((1 - Math.sin(angle)) * internalSize / 4) * 4;
                    pathParts.push(`${internalSize - x},${y}`);
                }
                break;
            case "bottom-left":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (i / steps);
                    const x = Math.round((1 - Math.cos(angle)) * internalSize / 4) * 4;
                    const y = Math.round(Math.sin(angle) * internalSize / 4) * 4;
                    pathParts.push(`${x},${internalSize - y}`);
                }
                break;
            case "bottom-right":
                for (let i = 0; i <= steps; i++) {
                    const angle = (Math.PI / 2) * (1 - i / steps);
                    const x = Math.round(Math.cos(angle) * internalSize / 4) * 4;
                    const y = Math.round(Math.sin(angle) * internalSize / 4) * 4;
                    pathParts.push(`${internalSize - x},${internalSize - y}`);
                }
                break;
        }

        return pathParts.join(" ");
    };

    return (
        <svg
            className="absolute"
            style={{
                ...positionStyles[position],
                width: size,
                height: size,
            }}
            viewBox={`0 0 ${internalSize} ${internalSize}`}
            preserveAspectRatio="xMidYMid meet"
        >
            <polyline
                points={getArcPath()}
                fill="none"
                stroke={color}
                strokeWidth={4}
                strokeLinejoin="miter"
            />
        </svg>
    );
}

