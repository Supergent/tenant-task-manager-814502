import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2 } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"

interface Task {
  _id: Id<"tasks">
  title: string
  description?: string
  status: string
  isCompleted: boolean
  _creationTime: number
}

interface TaskCardProps {
  task: Task
  onToggleComplete: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: Id<"tasks">) => void
}

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className={task.isCompleted ? "opacity-60" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.isCompleted}
            onCheckedChange={() => onToggleComplete(task)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={`text-lg font-semibold ${
                  task.isCompleted ? "line-through" : ""
                }`}
              >
                {task.title}
              </h3>
              <Badge
                className={`${getStatusColor(task.status)} text-white`}
                variant="secondary"
              >
                {task.status}
              </Badge>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task._id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  )
}
