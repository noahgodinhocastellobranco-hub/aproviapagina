import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

interface StudyBlock {
  id: string;
  subject: string;
  time: string;
}

type Schedule = Record<string, StudyBlock[]>;

const AppRotina = () => {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    const saved = localStorage.getItem("study-schedule");
    return saved ? JSON.parse(saved) : DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
  });

  const [newSubject, setNewSubject] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);

  const save = (updated: Schedule) => {
    setSchedule(updated);
    localStorage.setItem("study-schedule", JSON.stringify(updated));
  };

  const addBlock = () => {
    if (!newSubject.trim()) return;
    const block: StudyBlock = {
      id: Date.now().toString(),
      subject: newSubject.trim(),
      time: newTime || "08:00",
    };
    const updated = { ...schedule, [selectedDay]: [...schedule[selectedDay], block].sort((a, b) => a.time.localeCompare(b.time)) };
    save(updated);
    setNewSubject("");
    setNewTime("");
  };

  const removeBlock = (day: string, id: string) => {
    const updated = { ...schedule, [day]: schedule[day].filter((b) => b.id !== id) };
    save(updated);
  };

  const totalHours = Object.values(schedule).flat().length;

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Rotina de Estudos</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Monte seu cronograma semanal • {totalHours} blocos programados
      </p>

      {/* Add Block */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex flex-wrap gap-2 items-end rounded-xl border p-3">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="h-9 px-3 rounded-md border bg-background text-sm"
          >
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <Input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Matéria"
            className="flex-1 min-w-[120px]"
          />
          <Input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-24"
          />
          <Button onClick={addBlock} disabled={!newSubject.trim()} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Schedule */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-3xl w-full">
        {DAYS.map((day) => (
          <div key={day} className={`rounded-xl border p-3 ${schedule[day].length > 0 ? "border-primary/20" : "border-dashed"}`}>
            <h3 className="text-sm font-semibold mb-2">{day}</h3>
            {schedule[day].length === 0 ? (
              <p className="text-xs text-muted-foreground py-1">Nenhum bloco</p>
            ) : (
              <div className="space-y-1.5">
                {schedule[day].map((block) => (
                  <div key={block.id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-muted/50 text-sm">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs font-mono text-muted-foreground">{block.time}</span>
                      <span className="text-sm truncate">{block.subject}</span>
                    </div>
                    <button onClick={() => removeBlock(day, block.id)} className="text-destructive hover:text-destructive/80 shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppRotina;
