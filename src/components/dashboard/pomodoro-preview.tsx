import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTimerStore } from "@/store/timer-store";
import { toast } from "sonner";

export function PomodoroPreview() {
  const { startTimer, pauseTimer, resetTimer, saveSession, timerSettings } = useTimerStore((state) => state);

  const [timeLeft, setTimeLeft] = useState<number>(timerSettings?.focusTime || 25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedFocuses, setCompletedFocuses] = useState(0);

  const intervalRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/timer-end.mp3");

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);

            if (audioRef.current) {
              audioRef.current.play().catch((e) => {
                console.error("Error playing audio:", e);
              });
            }

            toast(isBreak ? "Break finished!" : "Focus session completed!", {
              description: isBreak ? "Time to focus again!" : "Take a well-deserved break!",
              duration: 5000,
            });

            if (!isBreak) {
              saveSession({
                duration: timerSettings?.focusTime || 25 * 60,
                timestamp: new Date().toISOString(),
                completed: true,
              });
              setCompletedFocuses((prev) => prev + 1);
            }

            const nextIsBreak = !isBreak;
            setIsBreak(nextIsBreak);

            let nextDuration = nextIsBreak
              ? (completedFocuses + 1) % 4 === 0
                ? timerSettings?.longBreakTime || 15 * 60
                : timerSettings?.shortBreakTime || 5 * 60
              : timerSettings?.focusTime || 25 * 60;

            setTimeLeft(nextDuration);
            setIsActive(false);
            return 0;
          }

          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isBreak, completedFocuses, timerSettings, saveSession]);

  useEffect(() => {
    if (!isActive) {
      const newTime = isBreak
        ? completedFocuses % 4 === 0
          ? timerSettings?.longBreakTime || 15 * 60
          : timerSettings?.shortBreakTime || 5 * 60
        : timerSettings?.focusTime || 25 * 60;
      setTimeLeft(newTime);
    }
  }, [timerSettings, isActive, isBreak, completedFocuses]);

  const toggleTimer = () => {
    setIsActive((prev) => {
      if (!prev) startTimer();
      else pauseTimer();
      return !prev;
    });
  };

  const handleResetTimer = () => {
    setIsActive(false);
    resetTimer();

    const resetTime = isBreak
      ? completedFocuses % 4 === 0
        ? timerSettings?.longBreakTime || 15 * 60
        : timerSettings?.shortBreakTime || 5 * 60
      : timerSettings?.focusTime || 25 * 60;

    setTimeLeft(resetTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalTime = isBreak
    ? completedFocuses % 4 === 0
      ? timerSettings?.longBreakTime || 15 * 60
      : timerSettings?.shortBreakTime || 5 * 60
    : timerSettings?.focusTime || 25 * 60;

  const progress = 100 - (timeLeft / totalTime) * 100;

  return (
    <Card className="max-w-[320px] bg-gradient-to-br from-purple-900 to-blue-900 text-white rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Focus Mode</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isBreak
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {isBreak ? "Break" : "Focus"}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-300">
          {isBreak ? "Take a break and recharge" : "Lancer Session"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative flex justify-center items-center">
          <svg className="w-32 h-32" viewBox="0 0 100 100">
            <circle
              className="text-gray-700 stroke-current"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            <circle
              className={`${isBreak ? "text-blue-500" : "text-blue-400"} stroke-current`}
              strokeWidth="5"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute text-4xl font-bold">{formatTime(timeLeft)}</div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetTimer}
            className="text-white border-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
          </Button>
          <Button
            size="sm"
            onClick={toggleTimer}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isActive ? (
              <Pause className="h-4 w-4 mr-1" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {isActive ? "Pause" : "Start"}
          </Button>
        </div>

        <div className="flex justify-between text-xs text-gray-300 mt-2">
          <div>Focus sessions: {completedFocuses}</div>
          <div>{isBreak ? (completedFocuses % 4 === 0 ? "Long break" : "Short break") : "Focus time"}</div>
        </div>
      </CardContent>
    </Card>
  );
}