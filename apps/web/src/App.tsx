import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import "./globals.css"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TaskList from "./components/TaskList"
import KanbanBoard from "./components/KanbanBoard"
import TaskDialog from "./components/TaskDialog"

export default function App() {
  const tasks = useQuery(api.endpoints.tasks.list)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)

  const handleAddTask = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <TaskList
              tasks={tasks || []}
              onEditTask={handleEditTask}
            />
          </TabsContent>

          <TabsContent value="kanban" className="mt-6">
            <KanbanBoard
              tasks={tasks || []}
              onEditTask={handleEditTask}
            />
          </TabsContent>
        </Tabs>

        <TaskDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          task={editingTask}
        />
      </div>
    </div>
  )
}
