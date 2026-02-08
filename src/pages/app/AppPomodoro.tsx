import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

type Mode = "focus" | "short_break" | "long_break";

const MODES: Record<Mode, { label: string; minutes: number; icon: typeof Brain }> = {
  focus: { label: "Foco", minutes: 25, icon: Brain },
  short_break: { label: "Pausa Curta", minutes: 5, icon: Coffee },
  long_break: { label: "Pausa Longa", minutes: 15, icon: Coffee },
};

const AppPomodoro = () => {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const currentMode = MODES[mode];

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(MODES[mode].minutes * 60);
  }, [mode]);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsRunning(false);
    setSecondsLeft(MODES[newMode].minutes * 60);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (mode === "focus") {
            setSessions((s) => s + 1);
            const next = (sessions + 1) % 4 === 0 ? "long_break" : "short_break";
            switchMode(next);
          } else {
            switchMode("focus");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, sessions]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / (MODES[mode].minutes * 60);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Timer className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Pomodoro</h1>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Estude com foco usando a técnica Pomodoro • {sessions} sessões
      </p>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-8">
        {(Object.entries(MODES) as [Mode, typeof MODES.focus][]).map(([key, m]) => (
          <Button
            key={key}
            variant={mode === key ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode(key)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      {/* Timer */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 * (1 - progress)}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-black tabular-nums tracking-tight">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-sm text-muted-foreground">{currentMode.label}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button size="lg" onClick={() => setIsRunning(!isRunning)} className="gap-2 px-8">
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? "Pausar" : "Iniciar"}
        </Button>
        <Button size="lg" variant="outline" onClick={reset}>
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default AppPomodoro;
