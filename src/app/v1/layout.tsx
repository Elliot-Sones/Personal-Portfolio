import { PixelSoccerField } from "@/components/PixelSoccerField";
import { ThemeProvider } from "@/components/ThemeContext";

export default function V1Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <div className="bg-field text-foreground min-h-screen">
        <PixelSoccerField />
        {children}
      </div>
    </ThemeProvider>
  );
}
