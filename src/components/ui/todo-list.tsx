"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Complete project proposal", completed: false },
     { id: 2, text: "Schedule team meeting", completed: false },
  
  ]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = { id: Date.now(), text: input, completed: false };
    setTodos((prev) => [...prev, newTodo]);
    setInput("");
  };
  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="p-2 text-md">
        <CardTitle className="text-md">📝 My Todo List</CardTitle>
      </CardHeader>
      <CardContent className="p-2 ">
        <div className="flex space-x-2 mb-3">
          <Input placeholder="Add a new task..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <ScrollArea className=" w-full rounded-md border p-2">
          <ul className="space-y-2">
            {todos.length === 0 && <p className="text-sm text-muted-foreground">No tasks yet.</p>}
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between bg-muted p-2 rounded-lg h-11">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={todo.completed} onCheckedChange={() => toggleComplete(todo.id)} />
                  <Label className={todo.completed ? "line-through text-muted-foreground" : ""}>{todo.text}</Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
