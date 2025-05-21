import React, { useState, useEffect } from "react";
import { Stats } from "@/components/dashboard/stats";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { CalendarPreview } from "@/components/dashboard/calendar-preview";
import { useAuthStore } from "@/store/auth-store";
import { useTaskStore } from "@/store/task-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useTimerStore } from "@/store/timer-store";
import { Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { NotificationCard } from "@/components/dashboard/notification-card";
import TodoList from "@/components/ui/todo-list";
import { PomodoroTimer } from "@/components/dashboard/pomodoro-timer";
import ProjectCardList from "@/components/dashboard/project-card";

export function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchTasks } = useTaskStore();
  const { fetchEvents } = useCalendarStore();
  const { fetchTimerStats } = useTimerStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTasks(), fetchEvents(), fetchTimerStats()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id, fetchTasks, fetchEvents, fetchTimerStats]);

  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const name = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "there";
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting()}, {name}!
        </h1>
        <p className="text-muted-foreground">Here's an overview of your productivity today.</p>
      </div>
      <Stats />
      <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
        <PomodoroTimer />
        <CalendarPreview />
        <TodoList />
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
        <div className="grid grid-cols-1  sm:gap-6 md:grid-cols-1 lg:gap-8">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow w-full h-full" />
           <TasksOverview />
        </div>

        <NotificationCard
          className="rounded-md border shadow w-full h-full"
          notification1={{
            time: "14:00 - 16:00",
            title: "Client Call",
            description: "Discuss project timeline",
          }}
          notification2={{
            time: "16:30 - 17:30",
            title: "Code Review",
            description: "Review pull requests",
          }}
          notification3={{
            time: "18:00 - 19:00",
            title: "Team Sync",
            description: "Weekly updates",
          }}
        />
        <ProjectCardList className="rounded-md border shadow w-full h-full" />
      </div>

  
        <div >
          <NotificationCard
            notification1={{
              time: "Apr 4, 2025",
              title: "PRÉPARATION LANCEMENT PROJET W",
              description: "Entrer dans sa phase de structuration stratégique. Définir l’offre, le positionnement...",
            }}
            notification2={{
              time: "Apr 12, 2025",
              title: "RECRUTEMENT DIGITALY",
              description: "Rechercher profils passionnés, créatifs et engagés. Les premières entretiens débuteront...",
            }}
            notification3={{
              time: "Apr 25, 2025",
              title: "PROCESS SUIVI CLIENT",
              description: "Analyse chaque étape du parcours client actuel. Objectif définir et optimiser standard qualité...",
            }}
          />

      </div>
    </div>
  );
}
