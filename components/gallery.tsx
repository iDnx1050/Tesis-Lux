'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, EffectFade } from 'swiper/modules'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

import 'swiper/css'

// Placeholder oscuro para blur durante carga
const BLUR_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

interface GalleryProps {
  images: string[]
  name: string
}

export function Gallery({ images, name }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <div className="space-y-5 md:space-y-6">
        <h3 className="text-[#F5F5F5] font-serif text-2xl md:text-3xl">Galeria</h3>

        <Swiper
          modules={[Autoplay]}
          grabCursor={true}
          loop={true}
          speed={prefersReducedMotion ? 0 : 6500}
          spaceBetween={14}
          autoplay={prefersReducedMotion ? false : {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0:    { slidesPerView: 1.15, spaceBetween: 12 },
            480:  { slidesPerView: 1.4,  spaceBetween: 14 },
            640:  { slidesPerView: 1.7,  spaceBetween: 16 },
            768:  { slidesPerView: 2.2,  spaceBetween: 18 },
            1200: { slidesPerView: 2.7,  spaceBetween: 22 },
          }}
          className="!overflow-hidden !py-4"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="h-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(index)}
                className="group relative aspect-[4/4.9] overflow-hidden rounded-xl cursor-pointer md:rounded-2xl"
              >
                <Image
                  src={image}
                  alt={`${name} imagen de galeria ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 45vw, 33vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/30 transition-colors duration-300" />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 rounded-xl border-2 border-[#D4AF37] md:rounded-2xl"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Lightbox — las imágenes solo existen en el DOM cuando el modal está abierto */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/95 p-3 backdrop-blur-lg md:p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#262626] text-[#F5F5F5] transition-colors duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] md:right-6 md:top-6 md:h-12 md:w-12"
              aria-label="Cerrar galeria"
            >
              <X size={20} className="md:h-6 md:w-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-[10/13] w-full max-w-6xl md:aspect-[16/10]"
            >
              <Swiper
                modules={[Navigation, EffectFade]}
                effect="fade"
                initialSlide={selectedImage}
                navigation={{
                  prevEl: '.lightbox-prev',
                  nextEl: '.lightbox-next',
                }}
                className="h-full rounded-lg overflow-hidden"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={`${name} imagen de galeria ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                className="lightbox-prev absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#262626] bg-[#1A1A1A]/80 text-[#F5F5F5] transition-colors duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] md:left-4 md:h-12 md:w-12"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={20} className="md:h-6 md:w-6" />
              </button>
              <button
                className="lightbox-next absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#262626] bg-[#1A1A1A]/80 text-[#F5F5F5] transition-colors duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] md:right-4 md:h-12 md:w-12"
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={20} className="md:h-6 md:w-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
