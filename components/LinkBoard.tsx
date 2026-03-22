"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import {
  createLinksDocuments,
  deleteLinksDocuments,
  listDocuments,
  updateLinksDocuments,
} from "@/services/crudService";
import LinkCard from "./LinkCard";
import { toast } from "sonner";
import { ID } from "appwrite";

export default function LinkBoard({
  userId,
  currentPlan,
}: {
  userId?: string;
  currentPlan: string;
}) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isUpdateLink, setIsUpdateLink] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [linkData, setLinkData] = useState<{
    $id?: string;
    title: string;
    href: string;
    position?: number;
  }>({ $id: undefined, title: "", href: "" });

  useEffect(() => {
    async function getLinks() {
      if (!userId) {
        return;
      }
      try {
        const data = await listDocuments(userId);
        setTasks(data);
      } catch (error) {
        console.log(error);

        toast.error("Failed to fetch links");
      }
    }
    getLinks();
  }, [userId]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.$id === active.id);
    const newIndex = tasks.findIndex((t) => t.$id === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);

    try {
      await Promise.all(
        newTasks.map((task, idx) =>
          updateLinksDocuments(task.$id, { position: idx })
        )
      );
    } catch (err) {
      console.log(err);

      toast.error("Failed to update positions");
    }
  };

  const handleLinks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinkData((prev) => ({ ...prev, [name]: value }));
  };

  const onEditLink = ($id: string, title: string, href: string) => {
    setLinkData({ $id, title, href });
    setIsUpdateLink(true);
  };

  const manageLinks = async () => {
    if (!userId) {
      toast.error("Unauthorized user");
      return;
    }

    const { $id: linkId, href, title } = linkData;

    if (!title || !href) {
      toast.warning("Complete all fields");
      return;
    }

    if (!href.startsWith("https://")) {
      toast.warning("URL must start with https://");
      return;
    }

    setLoading(true);
    try {
      if (linkId) {
        await updateLinksDocuments(linkId, { title, href });
        const updated = tasks.map((t) =>
          t.$id === linkId ? { ...t, title, href } : t
        );
        setTasks(updated);
      } else {
        if (tasks.length >= 4 && currentPlan !== "pro") {
          toast.warning("🔒 Upgrade your plan for unlock unlimited links.");
          return;
        }

        const newId = ID.unique();
        await createLinksDocuments(newId, {
          position: tasks.length,
          title,
          href,
          users: userId,
          userId,
        });
        setTasks((prev) => [
          ...prev,
          { $id: newId, position: tasks.length, title, href },
        ]);
      }

      setIsUpdateLink(false);
      setLinkData({ $id: undefined, title: "", href: "" });
    } catch (err) {
      console.log(err);

      toast.error("Failed to submit link");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!userId) {
      toast.error("Unauthorized user");
      return;
    }
    if (!id) return;
    try {
      await deleteLinksDocuments(id);
      setTasks((prev) => prev.filter((task) => task.$id !== id));
      toast.success("Link removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the link");
    }
  };

  const showDeleteConfirmation = (id: string) => {
    toast("Are you sure?", {
      description: "This action cannot be undone.",
      action: {
        label: "Yes, Delete",
        onClick: () => handleDeleteLink(id),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          console.log("Deletion cancelled");
        },
      },
      duration: 10000,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task.$id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 py-4">
          {isUpdateLink && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2">
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative z-[10000] bg-white p-6 rounded shadow-lg w-full max-w-md grid gap-3">
                <div className="text-xl font-semibold flex justify-between items-center">
                  <span className="text-[#686565]">
                    Manage <span className="text-[#6398CA]">Link</span>
                  </span>
                  <button
                    onClick={() => setIsUpdateLink(false)}
                    className="text-sm hover:text-red-500"
                  >
                    Cancel
                  </button>
                </div>
                <input
                  name="title"
                  value={linkData.title}
                  onChange={handleLinks}
                  type="text"
                  placeholder="Title"
                  className="shadow px-4 py-2 bg-[#f0e9e9] rounded w-full outline-none"
                />
                <input
                  name="href"
                  value={linkData.href}
                  onChange={handleLinks}
                  type="text"
                  placeholder="https://example.com"
                  className="shadow px-4 py-2 bg-[#f0e9e9] rounded w-full outline-none"
                />
                <button
                  onClick={manageLinks}
                  disabled={loading}
                  className="w-full rounded bg-[#6398CA] text-white py-2 hover:bg-[#63a1ca] active:scale-95"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
          {tasks.map((task) => (
            <LinkCard
              key={task.$id}
              id={task.$id}
              data={task}
              onEdit={() => onEditLink(task.$id, task.title, task.href)}
              onDelete={() => showDeleteConfirmation(task.$id)}
            />
          ))}
          {tasks.length >= 4 && currentPlan !== "pro" ? (
            <p className="text-sm font-extrabold text-red-500 mt-3 w-max m-auto">
              🔒 Upgrade your plan to unlock unlimited links.
            </p>
          ) : (
            <button
              disabled={tasks.length >= 4 && currentPlan !== "pro"}
              onClick={() => setIsUpdateLink(true)}
              className="rounded-md w-1/2 my-2 text-sm text-[#275DC2] border border-[#2059d4b2] shadow px-4 py-1 self-center hover:bg-[#f0f6ff]"
            >
              Add Link 🔗
            </button>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
