import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import TaskCard from "./TaskCard"
import { Id } from "@/convex/_generated/dataModel"

interface Task {
  _id: Id<"tasks">
  title: string
  description?: string
  status: string
  isCompleted: boolean
  _creationTime: number
}

interface TaskListProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
}

export default function TaskList({ tasks, onEditTask }: TaskListProps) {
  const updateTask = useMutation(api.endpoints.tasks.update)
  const deleteTask = useMutation(api.endpoints.tasks.remove)

  const handleToggleComplete = async (task: Task) => {
    await updateTask({
      id: task._id,
      isCompleted: !task.isCompleted,
      status: !task.isCompleted ? "completed" : "todo"
    })
  }

  const handleDelete = async (taskId: Id<"tasks">) => {
    await deleteTask({ id: taskId })
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No tasks yet. Create one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggleComplete={handleToggleComplete}
          onEdit={onEditTask}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
