import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckSquare, ListTodo, Clock, Calendar } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useTimerStore } from "@/store/timer-store";

export function Stats() {
  const { tasks, tasksStats } = useTaskStore();
  const { events } = useCalendarStore();
  const { timerStats } = useTimerStore();

  const completedTasksToday = tasksStats?.completedToday || 0;
  const completedYesterday = tasksStats?.completedYesterday || 0;
  const completedDiff = completedTasksToday - completedYesterday;
  const inProgressCount = tasks?.filter((task) => !task.completed).length || 0;
  const dueTodayCount =
    tasks?.filter((task) => {
      if (task.completed) return false;
      if (!task.dueDate) return false;

      const dueDate = new Date(task.dueDate);
      const today = new Date();

      return dueDate.toDateString() === today.toDateString();
    }).length || 0;

  const formatFocusTime = (minutes: any) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const focusTimeToday = timerStats?.focusTimeToday || 0;
  const focusTimeYesterday = timerStats?.focusTimeYesterday || 0;
  const focusTimeDiff = focusTimeToday - focusTimeYesterday;

  interface Event {
    startTime: string;
    title?: string;
  }

  const now = new Date();

  const upcomingEvents: Event[] = Array.isArray(events)
    ? events
        .filter((event: Event) => {
          const eventDate = new Date(event.startTime);
          return eventDate > now;
        })
        .sort((a: Event, b: Event) => {
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        })
    : [];

  const nextEvent = upcomingEvents[0];
  const nextEventTime = nextEvent
    ? new Date(nextEvent.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasksToday}</div>
          <p className="text-xs text-muted-foreground">
            {completedDiff > 0 ? `+${completedDiff}` : completedDiff} from
            yesterday
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressCount}</div>
          <p className="text-xs text-muted-foreground">
            {dueTodayCount} due today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatFocusTime(focusTimeToday)}
          </div>
          <p className="text-xs text-muted-foreground">
            {focusTimeDiff > 0
              ? `+${formatFocusTime(focusTimeDiff)}`
              : `-${formatFocusTime(Math.abs(focusTimeDiff))}`}{" "}
            from yesterday
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingEvents.length}</div>
          <p className="text-xs text-muted-foreground">
            {nextEvent
              ? `Next: ${nextEvent.title} (${nextEventTime})`
              : "No upcoming events"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}