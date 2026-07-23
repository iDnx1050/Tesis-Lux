'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function VedetoNotFound() {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      
      <section className="min-h-[70vh] flex items-center justify-center py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
            <Search className="w-10 h-10 text-[#D4AF37]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#F5F5F5] mb-4">
            Vedeto <span className="text-[#D4AF37]">No Encontrado</span>
          </h1>
          
          <p className="text-[#A0A0A0] font-sans text-lg mb-8">
            El vedeto que buscas no existe o fue removido de nuestra
            coleccion exclusiva.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/vedetos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] font-sans text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-[#E8C34A] transition-colors duration-300"
              >
                <span>Ver Vedetos</span>
              </motion.button>
            </Link>
            
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-sans text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-[#D4AF37]/10 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ir al Inicio</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
      
      <Footer />
    </main>
  )
}
