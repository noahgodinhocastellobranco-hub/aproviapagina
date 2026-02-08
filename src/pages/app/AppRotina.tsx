import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-pink-500" />
          </div>
          Rotina de Estudos
        </h1>
        <p className="text-muted-foreground">
          Monte seu cronograma semanal • {totalHours} blocos de estudo programados
        </p>
      </div>

      {/* Add Block */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium">Dia</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="h-9 px-3 rounded-md border bg-background text-sm"
              >
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label className="text-xs font-medium">Matéria</label>
              <Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Ex: Matemática" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Horário</label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-28" />
            </div>
            <Button onClick={addBlock} disabled={!newSubject.trim()} size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DAYS.map((day) => (
          <Card key={day} className={schedule[day].length > 0 ? "border-primary/20" : "border-dashed"}>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">{day}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {schedule[day].length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">Nenhum bloco</p>
              ) : (
                schedule[day].map((block) => (
                  <div key={block.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs font-mono text-muted-foreground">{block.time}</span>
                      <span className="text-sm font-medium truncate">{block.subject}</span>
                    </div>
                    <button onClick={() => removeBlock(day, block.id)} className="text-destructive hover:text-destructive/80 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppRotina;
