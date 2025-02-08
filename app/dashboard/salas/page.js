"use client"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { FaPlus, FaEdit, FaTrash, FaFilter, FaClock, FaSun, FaCloud, FaMoon, FaCalendar } from "react-icons/fa"
import RoomModal from "@/components/RoomModal"
import Switch from "@/components/Switch"
import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"

export default function SalasManagement() {
  const [rooms, setRooms] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [modalMode, setModalMode] = useState("create")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [weather, setWeather] = useState("clear")
  const [filters, setFilters] = useState({
    turno: "",
    status: "",
    sala_aula: "",
    dia_semana: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchRooms()
    setTimeBasedFilters()
    updateWeather()

    const weatherInterval = setInterval(updateWeather, 60000)

    // Subscribe to real-time changes
    const channel = supabase
      .channel("rooms-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, handleRoomChange)
      .subscribe()

    return () => {
      clearInterval(weatherInterval)
      supabase.removeChannel(channel)
    }
  }, [])

  const updateWeather = () => {
    setWeather(getWeatherByTime())
  }

  const getWeatherByTime = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return "clear"
    else if (hour >= 12 && hour < 18) return hour % 2 === 0 ? "clear" : "cloudy"
    else return "night"
  }

  const handleRoomChange = (payload) => {
    if (payload.eventType === "INSERT") {
      setRooms((prevRooms) => [...prevRooms, payload.new])
    } else if (payload.eventType === "UPDATE") {
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room.id === payload.new.id ? { ...room, ...payload.new } : room)),
      )
    } else if (payload.eventType === "DELETE") {
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== payload.old.id))
    }
  }

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setRooms(data || [])
    } catch (error) {
      console.error("Erro ao buscar salas:", error)
      setError("Erro ao carregar as salas. Tente novamente.")
      toast.error("Erro ao buscar salas")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedRoom(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEdit = (room) => {
    setSelectedRoom(room)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDelete = (room) => {
    setSelectedRoom(room)
    setModalMode("delete")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRoom(null)
  }

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const { error } = await supabase.from("rooms").update({ status: newStatus }).eq("id", roomId)

      if (error) throw error

      toast.success("Status atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast.error("Erro ao atualizar status")
    }
  }

  const handleSave = async (roomData) => {
    try {
      if (modalMode === "create") {
        const { data, error } = await supabase
          .from("rooms")
          .insert([
            {
              ...roomData,
              dias_semana: Array.isArray(roomData.dias_semana) ? roomData.dias_semana : [],
              status: Boolean(roomData.status),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()

        if (error) throw error
        toast.success("Sala criada com sucesso!")
      } else if (modalMode === "edit") {
        const { data, error } = await supabase
          .from("rooms")
          .update({
            ...roomData,
            dias_semana: Array.isArray(roomData.dias_semana) ? roomData.dias_semana : [],
            status: Boolean(roomData.status),
            updated_at: new Date().toISOString(),
          })
          .eq("id", roomData.id)
          .select()

        if (error) throw error
        toast.success("Sala atualizada com sucesso!")
      }

      handleCloseModal()
    } catch (error) {
      console.error("Erro ao salvar sala:", error)
      toast.error("Erro ao salvar sala")
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", selectedRoom.id)

      if (error) throw error
      toast.success("Sala excluída com sucesso!")
      handleCloseModal()
    } catch (error) {
      console.error("Erro ao excluir sala:", error)
      toast.error("Erro ao excluir sala")
    }
  }

  const setTimeBasedFilters = () => {
    setFilters((prev) => ({
      ...prev,
      turno: getCurrentTurno(),
      dia_semana: getCurrentDayOfWeek(),
    }))
  }

  const getCurrentTurno = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return "Matutino"
    if (hour >= 12 && hour < 18) return "Vespertino"
    return "Noturno"
  }

  const getCurrentDayOfWeek = () => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    return days[new Date().getDay()]
  }

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

  const filteredRooms = rooms.filter((room) => {
    const matchTurno = !filters.turno || room.turno === filters.turno
    const matchStatus = !filters.status || room.status.toString() === filters.status
    const matchSala = !filters.sala_aula || room.sala_aula.toLowerCase().includes(filters.sala_aula.toLowerCase())
    const matchDiaSemana =
      !filters.dia_semana || (Array.isArray(room.dias_semana) && room.dias_semana.includes(filters.dia_semana))

    return matchTurno && matchStatus && matchSala && matchDiaSemana
  })

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando salas...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchRooms} className="btn-primary">
              Tentar Novamente
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Salas</h1>
          <div className="flex space-x-4">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center">
              <FaFilter className="mr-2" /> Filtros
            </button>
            <button onClick={handleCreate} className="btn-primary flex items-center">
              <FaPlus className="mr-2" /> Nova Sala
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FaFilter className="mr-2 text-primary" />
                Filtros Ativos
              </h2>
              <button
                onClick={setTimeBasedFilters}
                className="btn-secondary flex items-center text-sm"
                title="Usar horário atual"
              >
                <FaClock className="mr-2" />
                Usar horário atual
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.dia_semana}
                onChange={(e) => setFilters({ ...filters, dia_semana: e.target.value })}
                className="input-field"
              >
                <option value="">Todos os dias</option>
                <option value="Segunda">Segunda</option>
                <option value="Terça">Terça</option>
                <option value="Quarta">Quarta</option>
                <option value="Quinta">Quinta</option>
                <option value="Sexta">Sexta</option>
                <option value="Sábado">Sábado</option>
              </select>

              <select
                value={filters.turno}
                onChange={(e) => setFilters({ ...filters, turno: e.target.value })}
                className="input-field"
              >
                <option value="">Todos os turnos</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">Todos</option>
                <option value="true">Aberto</option>
                <option value="false">Fechado</option>
              </select>

              <input
                type="text"
                value={filters.sala_aula}
                onChange={(e) => setFilters({ ...filters, sala_aula: e.target.value })}
                placeholder="Buscar por sala..."
                className="input-field"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilters({
                    turno: "",
                    status: "",
                    sala_aula: "",
                    dia_semana: "",
                  })
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                    <Switch checked={room.status} onChange={(checked) => handleStatusChange(room.id, checked)} />
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

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors hover:bg-blue-100 rounded"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(room)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors hover:bg-red-100 rounded"
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma sala encontrada com os filtros selecionados.</p>
          </div>
        )}

        <RoomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleConfirmDelete}
          room={selectedRoom}
          mode={modalMode}
        />
      </div>
    </>
  )
}

