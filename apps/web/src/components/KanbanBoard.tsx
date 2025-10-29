import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useState } from "react"

interface Task {
  _id: Id<"tasks">
  title: string
  description?: string
  status: string
  isCompleted: boolean
  _creationTime: number
}

interface KanbanBoardProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
}

const STATUSES = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
]

export default function KanbanBoard({ tasks, onEditTask }: KanbanBoardProps) {
  const updateTask = useMutation(api.endpoints.tasks.update)
  const deleteTask = useMutation(api.endpoints.tasks.remove)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: any) => {
    setDraggedTaskId(event.active.id)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedTaskId(null)

    if (!over) return

    const taskId = active.id as Id<"tasks">
    const newStatus = over.id as string

    const task = tasks.find((t) => t._id === taskId)
    if (task && task.status !== newStatus) {
      await updateTask({
        id: taskId,
        status: newStatus,
        isCompleted: newStatus === "completed",
      })
    }
  }

  const handleDelete = async (taskId: Id<"tasks">) => {
    await deleteTask({ id: taskId })
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            tasks={getTasksByStatus(status.id)}
            onEditTask={onEditTask}
            onDeleteTask={handleDelete}
            draggedTaskId={draggedTaskId}
          />
        ))}
      </div>
    </DndContext>
  )
}

interface KanbanColumnProps {
  status: { id: string; label: string }
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: Id<"tasks">) => void
  draggedTaskId: string | null
}

function KanbanColumn({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  draggedTaskId,
}: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col bg-muted/50 rounded-lg p-4 min-h-[500px]"
      data-status={status.id}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{status.label}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>

      <div className="space-y-3 flex-1">
        {tasks.map((task) => (
          <div
            key={task._id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "move"
              e.dataTransfer.setData("text/plain", task._id)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = "move"
            }}
            onDrop={(e) => {
              e.preventDefault()
            }}
            className={`cursor-move ${
              draggedTaskId === task._id ? "opacity-50" : ""
            }`}
          >
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {task.description}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEditTask(task)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDeleteTask(task._id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
