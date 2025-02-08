"use client"
import { FaCalendar, FaSun, FaCloud, FaMoon } from "react-icons/fa"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function RoomCard({ room, onClick }) {
  const [weather, setWeather] = useState("clear")
  const [status, setStatus] = useState(room.status)

  // Função para determinar o clima com base no horário
  const getWeatherByTime = () => {
    const hour = new Date().getHours()

    if (hour >= 6 && hour < 12) {
      return "clear"
    } else if (hour >= 12 && hour < 18) {
      return hour % 2 === 0 ? "clear" : "cloudy"
    } else {
      return "night"
    }
  }

  // Atualiza o clima baseado no horário
  useEffect(() => {
    const updateWeather = () => {
      setWeather(getWeatherByTime())
    }

    updateWeather()
    const interval = setInterval(updateWeather, 60000)

    // Subscribe to real-time changes for this room
    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          setStatus(payload.new.status)
        },
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [room.id, getWeatherByTime]) // Added getWeatherByTime to dependencies

  const getTurnoColor = (turno) => {
    const weatherColors = {
      clear: {
        Matutino: "bg-yellow-400",
        Vespertino: "bg-orange-500",
        Noturno: "bg-indigo-700",
      },
      cloudy: {
        Matutino: "bg-blue-300",
        Vespertino: "bg-gray-400",
        Noturno: "bg-gray-700",
      },
      night: {
        Matutino: "bg-indigo-400",
        Vespertino: "bg-indigo-600",
        Noturno: "bg-indigo-900",
      },
    }

    return weatherColors[weather]?.[turno] || "bg-gray-500"
  }

  const getWeatherIcon = () => {
    switch (weather) {
      case "clear":
        return <FaSun className="text-yellow-500" />
      case "cloudy":
        return <FaCloud className="text-gray-500" />
      case "night":
        return <FaMoon className="text-indigo-500" />
      default:
        return null
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick(room, weather)}
    >
      <div className={`${getTurnoColor(room.turno)} h-2`} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{room.sala_aula}</h3>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1 ${getTurnoColor(room.turno)}`}
            >
              {getWeatherIcon()}
              {room.turno}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                status ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {status ? "Aberto" : "Fechado"}
            </span>
          </div>
        </div>

        <div className="space-y-1 mb-2">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Disciplina:</span> {room.disciplina}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Professor:</span> {room.docente}
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <FaCalendar className="mr-1 text-primary" />
            {Array.isArray(room.dias_semana) ? room.dias_semana.join(", ") : room.dias_semana}
          </div>
        </div>
      </div>
    </div>
  )
}

