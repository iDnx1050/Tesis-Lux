'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { AvailabilitySlot } from '@/lib/types'

interface AvailabilityCalendarProps {
  availability: AvailabilitySlot[]
  onDateSelect?: (date: string, time: string) => void
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function AvailabilityCalendar({ availability, onDateSelect }: AvailabilityCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilitySlot>()
    availability.forEach((s) => map.set(s.date, s))
    return map
  }, [availability])

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells: (number | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewYear, viewMonth])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const handleDayClick = (day: number) => {
    const key = toDateKey(viewYear, viewMonth, day)
    const slot = availabilityMap.get(key)
    if (slot?.available) {
      setSelectedDate(key)
      setSelectedSlot(slot)
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedDate && onDateSelect) onDateSelect(selectedDate, time)
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

  const isToday = (day: number) => {
    return day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
  }

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t
  }

  return (
    <>
      <div className="rounded-2xl border border-white/8 bg-black/20 backdrop-blur-sm overflow-hidden">
        {/* Legend */}
        <div className="flex items-center gap-5 px-5 pt-5 pb-4 border-b border-white/6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#D4AF37]/35 border border-[#D4AF37]/50" />
            <span className="text-white/55 font-sans text-xs">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FF4444]/18 border border-[#FF4444]/35" />
            <span className="text-white/55 font-sans text-xs">No Disponible</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-white/30">
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="font-sans text-xs">Haz clic en una fecha</span>
          </div>
        </div>

        <div className="p-4 md:p-5">
          {/* Header nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80 transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            <h3 className="font-serif text-[#F5F5F5] text-base font-semibold tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </h3>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80 transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center py-1.5 text-white/40 font-sans text-[10px] font-semibold tracking-widest uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px">
            {days.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />

              const key = toDateKey(viewYear, viewMonth, day)
              const slot = availabilityMap.get(key)
              const past = isPast(day)
              const todayCell = isToday(day)
              const available = !past && slot?.available === true
              const unavailable = !past && slot?.available === false
              const isSelected = selectedDate === key

              return (
                <button
                  key={key}
                  onClick={() => handleDayClick(day)}
                  disabled={!available}
                  className={[
                    'relative flex items-center justify-center rounded-lg aspect-square text-xs font-sans transition-all duration-200',
                    available ? 'cursor-pointer' : 'cursor-not-allowed',
                    isSelected
                      ? 'bg-[#D4AF37] text-[#0A0A0A] font-bold shadow-[0_0_14px_rgba(212,175,55,0.45)]'
                      : available
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 hover:border-[#D4AF37]/55'
                        : unavailable
                          ? 'bg-[#FF4444]/8 text-white/25 border border-[#FF4444]/15'
                          : past
                            ? 'text-white/15'
                            : 'text-white/50 hover:bg-white/5',
                    todayCell && !isSelected ? 'ring-1 ring-[#D4AF37]/50' : '',
                  ].join(' ')}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Time Selection Modal */}
      <AnimatePresence>
        {selectedDate && selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0a1e]/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-[#F5F5F5] font-serif text-lg leading-tight">Elige un horario</h4>
                  <p className="text-[#D4AF37] font-sans text-xs mt-1 capitalize">{formatDate(selectedDate)}</p>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/45 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {selectedSlot.times?.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleTimeSelect(time)}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-all duration-250 ${
                      selectedTime === time
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0A] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.4)]'
                        : 'bg-white/4 border-white/10 text-white/75 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]'
                    }`}
                  >
                    <Clock size={13} />
                    <span className="font-sans text-sm">{time}</span>
                  </motion.button>
                ))}
              </div>

              {selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3.5 bg-[#D4AF37]/8 rounded-xl border border-[#D4AF37]/22"
                >
                  <p className="text-[#D4AF37] font-sans text-xs text-center leading-relaxed">
                    ✓ Seleccionado: {formatDate(selectedDate)} a las {selectedTime}
                  </p>
                </motion.div>
              )}

              <button
                onClick={() => setSelectedDate(null)}
                className="mt-4 w-full py-2.5 rounded-xl border border-white/8 text-white/40 font-sans text-xs hover:text-white/60 transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
