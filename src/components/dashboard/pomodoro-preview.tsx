import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTimerStore } from "@/store/timer-store";
import { toast } from "sonner";

export function PomodoroPreview() {
  const { startTimer, pauseTimer, resetTimer, saveSession, timerSettings } =
    useTimerStore((state) => state);

  const [timeLeft, setTimeLeft] = useState<number>(
    timerSettings?.focusTime || 25 * 60
  );
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

            // Play sound
            if (audioRef.current) {
              audioRef.current.play().catch((e) => {
                console.error("Error playing audio:", e);
              });
            }

            toast(isBreak ? "Break finished!" : "Focus session completed!", {
              description: isBreak
                ? "Time to focus again!"
                : "Take a well-deserved break!",
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalTime = isBreak
    ? completedFocuses % 4 === 0
      ? timerSettings?.longBreakTime || 15 * 60
      : timerSettings?.shortBreakTime || 5 * 60
    : timerSettings?.focusTime || 25 * 60;

  const progress = 100 - (timeLeft / totalTime) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pomodoro Timer</span>
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
        <CardDescription>
          {isBreak
            ? "Take a break and recharge"
            : "Stay focused on your current task"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative flex justify-center items-center">
          <svg className="w-32 h-32" viewBox="0 0 100 100">
            <circle
              className="text-muted stroke-current"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            <circle
              className={`${
                isBreak ? "text-blue-500" : "text-primary"
              } stroke-current`}
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
          <div className="absolute text-2xl font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={toggleTimer}>
            {isActive ? (
              <Pause className="h-4 w-4 mr-1" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleResetTimer}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <div>Focus sessions: {completedFocuses}</div>
          <div>
            {isBreak
              ? completedFocuses % 4 === 0
                ? "Long break"
                : "Short break"
              : "Focus time"}
          </div>
        </div>
      </CardContent>
         <CardContent className="grid gap-4">
        
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">Due: May 30, 2025</p>
            <p className="text-sm font-medium leading-none">Marketing Campaign</p>
            <p className="text-sm text-muted-foreground">Launch a new social media marketing </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
