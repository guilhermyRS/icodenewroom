"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase" // Corrigido o caminho do import

export default function Switch({ checked = false, onChange, roomId }) {
  const [isChecked, setIsChecked] = useState(checked)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  useEffect(() => {
    // Subscribe to real-time changes for this specific room
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          setIsChecked(payload.new.status)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const handleChange = async () => {
    try {
      setIsUpdating(true)
      const newValue = !isChecked

      // Chama o callback do pai antes de atualizar o banco de dados
      onChange?.(newValue)
    } catch (error) {
      console.error("Error updating status:", error)
      // Reverte o switch se houver um erro
      setIsChecked(isChecked)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <button
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
        isChecked ? "bg-green-500" : "bg-gray-300"
      }`}
      onClick={handleChange}
      role="switch"
      aria-checked={isChecked}
      type="button"
      disabled={isUpdating}
    >
      <span className="sr-only">Toggle status</span>
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          isChecked ? "translate-x-6" : "translate-x-1"
        } ${isUpdating ? "opacity-50" : ""}`}
      />
    </button>
  )
}

