"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Separator } from "@radix-ui/react-separator"
import { CheckIcon } from "@radix-ui/react-icons" // For checkbox checked state
import { useState } from "react"

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: "todo-1", text: "Finish project proposal", checked: false },
    { id: "todo-2", text: "Call client", checked: true },
  ])
  const [newTodo, setNewTodo] = useState("")

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setTodos([...todos, { id: `todo-${todos.length + 1}`, text: newTodo, checked: false }])
    setNewTodo("")
  }

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, checked: !todo.checked } : todo)))
  }

  return (
    <div
      className="bg-[#322c72] text-white rounded-lg border p-4 sm:p-6 w-full h-full"
      style={{ backgroundColor: "#322c72" }}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Todo List</h1>
        <Button variant="ghost" size="icon" className="text-white hover:bg-[#4a418f]">
          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Add Todo</span>
        </Button>
      </div>
      <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100%-8rem)]">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2 sm:gap-3">
            <Checkbox
              id={todo.id}
              checked={todo.checked}
              onCheckedChange={() => handleToggleTodo(todo.id)}
              className="group flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded border border-white bg-white data-[state=checked]:bg-[#4a418f] data-[state=checked]:border-[#4a418f]"
            >
              <span className="hidden group-data-[state=checked]:block">
                <CheckIcon className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
              </span>
            </Checkbox>
            <label
              htmlFor={todo.id}
              className={`flex-1 text-sm sm:text-base ${todo.checked ? "line-through text-gray-400" : "text-white"}`}
            >
              {todo.text}
            </label>
          </div>
        ))}
      </div>
      <Separator className="my-4 sm:my-6 bg-gray-400" />
      <form className="flex gap-2" onSubmit={handleAddTodo}>
        <Input
          type="text"
          placeholder="Add a new todo"
          className="flex-1 bg-white text-black placeholder-gray-500 text-sm sm:text-base h-8 sm:h-10"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-[#4a418f] text-white hover:bg-[#5b50a1] text-sm sm:text-base h-8 sm:h-10 px-2 sm:px-4"
        >
          Add
        </Button>
      </form>
    </div>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
