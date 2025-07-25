import { Link } from "@tanstack/react-router"
import { Circle, CopyPlus, Ellipsis, Heart, Pencil, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu"

import { GetProjectsResponseDto } from "@/apiClient"
import { useSidebarContext } from "@/modules/core/components/AppSidebar/SidebarContext"
import { DialogWrapper } from "@core/components/DialogWrapper"
import { useSidebar } from "@ui/sidebar"
import { useDeleteProject } from "../../api/useDeleteProject"
import { ProjectForm } from "../ProjectForm/ProjectForm"

export function Project({ project }: { project: GetProjectsResponseDto }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [showProjectSettings, setShowProjectSettings] = useState(false)
  const [openProjectSettings, setOpenProjectSettings] = useState(false)
  const [openEditProjectDialog, setOpenEditProjectDialog] = useState(false)
  const [openDeleteProjectDialog, setOpenDeleteProjectDialog] = useState(false)
  const [openEditProjectContextDialog, setOpenEditProjectContextDialog] = useState(false)
  const [openDeleteProjectContextDialog, setOpenDeleteProjectContextDialog] = useState(false)
  const { activeSidebarItem, setActiveSidebarItem } = useSidebarContext()

  const { mutate: deleteProjectMutate } = useDeleteProject()
  const taskCountRef = useRef<HTMLSpanElement>(null)

  const { id, name, taskCount, colour } = project

  useEffect(() => {
    if (taskCountRef.current) {
      taskCountRef.current.removeAttribute("aria-expanded")
    }
  }, [showProjectSettings])

  useEffect(() => {
    if (!openProjectSettings) {
      setShowProjectSettings(false)
    }
  }, [openProjectSettings])

  const handleMouseLeave = () => {
    if (showProjectSettings && !openProjectSettings) {
      setShowProjectSettings(false)
    }
  }

  const handleLinkClick = () => {
    setActiveSidebarItem(`projectId${id}`)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={`block h-full p-1 pl-4 ${activeSidebarItem === `projectId${id}` ? "bg-slate-300 hover:bg-slate-300 dark:bg-slate-800 hover:dark:bg-slate-800" : ""}`}
    >
      <li key={id}>
        <ContextMenu modal={false}>
          <ContextMenuTrigger asChild>
            <div
              className="flex items-center"
              onMouseEnter={() => setShowProjectSettings(true)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/app/projects/$projectId"
                params={{ projectId: id.toString() }}
                key={id}
                className="flex flex-1 items-center gap-x-5 p-2"
                onClick={handleLinkClick}
              >
                <Circle color={colour} fill={colour} size={12} />
                <span className="text-[clamp(0.95rem,0.9071rem+0.2143vw,1.1rem)]">{name}</span>
              </Link>
              <DropdownMenu open={openProjectSettings} onOpenChange={setOpenProjectSettings}>
                <DropdownMenuTrigger asChild>
                  {showProjectSettings || openProjectSettings ? (
                    <Button size="icon" variant="icon" className="p-2" aria-label="Toggle project settings">
                      <Ellipsis size={20} />
                    </Button>
                  ) : (
                    <span ref={taskCountRef} className="px-3 py-2">
                      {taskCount}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-y-2">
                  <DropdownMenuItem
                    className="flex gap-x-4 p-[0.6rem]"
                    onClick={() => {
                      setOpenEditProjectDialog(true)
                      setOpenProjectSettings(false)
                    }}
                    aria-haspopup="dialog"
                  >
                    <Pencil size={18} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-x-4 p-[0.6rem]"
                    onClick={() => {
                      setOpenDeleteProjectDialog(true)
                      setOpenProjectSettings(false)
                    }}
                    aria-haspopup="dialog"
                  >
                    <Trash size={18} />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-x-4 p-[0.6rem]">
                    <Heart size={18} />
                    Add to favourites
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-x-4 p-[0.6rem]">
                    <CopyPlus size={18} />
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="flex flex-col gap-y-2 p-2">
            <ContextMenuItem
              className="flex gap-x-4 p-[0.6rem]"
              onClick={() => {
                setOpenEditProjectContextDialog(true)
                setOpenProjectSettings(false)
              }}
              aria-haspopup="dialog"
            >
              <Pencil size={18} />
              Edit
            </ContextMenuItem>
            <ContextMenuItem
              className="flex gap-x-4 p-[0.6rem]"
              onClick={() => {
                setOpenDeleteProjectContextDialog(true)
                setOpenProjectSettings(false)
              }}
              aria-haspopup="dialog"
            >
              <Trash size={18} />
              Delete
            </ContextMenuItem>
            <ContextMenuItem className="flex gap-x-4 p-[0.6rem]">
              <Heart size={18} />
              Add to favourites
            </ContextMenuItem>
            <ContextMenuItem className="flex gap-x-4 p-[0.6rem]">
              <CopyPlus size={18} />
              Duplicate
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <DialogWrapper
          open={openEditProjectDialog}
          onOpenChange={setOpenEditProjectDialog}
          title={"Edit project"}
          description={"Edit project name and color"}
        >
          <ProjectForm project={project} setOpenDialog={setOpenEditProjectDialog} />
        </DialogWrapper>
        <DialogWrapper
          open={openDeleteProjectDialog}
          onOpenChange={setOpenDeleteProjectDialog}
          title={"Delete project"}
          description={`Are you sure you want to delete ${name}
            project?`}
        >
          <div className="flex justify-center gap-x-4">
            <Button
              onClick={() => {
                deleteProjectMutate(id)
                setOpenDeleteProjectDialog(false)
              }}
            >
              Confirm
            </Button>
            <Button variant="destructive" onClick={() => setOpenDeleteProjectDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogWrapper>
        <DialogWrapper
          open={openEditProjectContextDialog}
          onOpenChange={setOpenEditProjectContextDialog}
          title={"Edit project"}
          description={"Edit project name and color"}
        >
          <ProjectForm project={project} setOpenDialog={setOpenEditProjectContextDialog} />
        </DialogWrapper>
        <DialogWrapper
          open={openDeleteProjectContextDialog}
          onOpenChange={setOpenDeleteProjectContextDialog}
          title={"Delete project"}
          description={`Are you sure you want to delete ${name}
            project?`}
        >
          <div className="flex justify-center gap-x-4">
            <Button
              onClick={() => {
                deleteProjectMutate(id)
                setOpenDeleteProjectContextDialog(false)
              }}
            >
              Confirm
            </Button>
            <Button variant="destructive" onClick={() => setOpenDeleteProjectContextDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogWrapper>
      </li>
    </Button>
  )
}
