import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

type Mode = "focus" | "short_break" | "long_break";

const MODES: Record<Mode, { label: string; minutes: number; color: string; icon: typeof Brain }> = {
  focus: { label: "Foco", minutes: 25, color: "text-red-500", icon: Brain },
  short_break: { label: "Pausa Curta", minutes: 5, color: "text-green-500", icon: Coffee },
  long_break: { label: "Pausa Longa", minutes: 15, color: "text-blue-500", icon: Coffee },
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
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Timer className="w-5 h-5 text-red-500" />
          </div>
          Pomodoro
        </h1>
        <p className="text-muted-foreground">
          Estude com foco usando a técnica Pomodoro • {sessions} sessões concluídas
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 justify-center">
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
      <Card>
        <CardContent className="py-12 text-center space-y-8">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-56 h-56 -rotate-90" viewBox="0 0 200 200">
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
              <span className="text-5xl md:text-6xl font-black tabular-nums tracking-tight">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <span className={`text-sm font-medium ${currentMode.color}`}>
                {currentMode.label}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button size="lg" onClick={() => setIsRunning(!isRunning)} className="gap-2 px-8">
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? "Pausar" : "Iniciar"}
            </Button>
            <Button size="lg" variant="outline" onClick={reset}>
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppPomodoro;
