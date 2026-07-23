/**
 * Datos geográficos y lógica de precios por zona para Chile.
 *
 * La sede central de Luxx está en Santiago (Región Metropolitana): el precio
 * base del plan aplica ahí, con recargos por comunas periféricas. El resto de
 * las regiones tiene un precio fijo que ya contempla el traslado del elenco.
 *
 * Compartido entre el perfil del vedeto y el checkout para mantener una única
 * fuente de verdad sobre precios y ubicaciones.
 */

export type Commune = { name: string; surcharge?: number }

export interface Region {
  id: string
  name: string
  /** Precio fijo del show en esta región. `null` = usa precio base del plan (Metropolitana). */
  price: number | null
  /** Nota de traslado mostrada al usuario. */
  note: string
  /** Si el traslado requiere pasajes aéreos coordinados aparte. */
  flight: boolean
}

/** Regiones ordenadas de norte a sur. */
export const REGIONS: Region[] = [
  { id: 'arica',         name: 'Arica y Parinacota',                       price: 220000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'tarapaca',      name: 'Tarapacá',                                 price: 220000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'antofagasta',   name: 'Antofagasta',                              price: 220000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'atacama',       name: 'Atacama',                                  price: 220000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'coquimbo',      name: 'Coquimbo',                                 price: 240000, note: 'Incluye pasaje en bus',     flight: false },
  { id: 'valparaiso',    name: 'Valparaíso',                               price: 180000, note: 'Recargo por traslado',      flight: false },
  { id: 'metropolitana', name: 'Metropolitana de Santiago',                price: null,   note: '',                          flight: false },
  { id: 'ohiggins',      name: "Lib. Gral. B. O'Higgins",                  price: 180000, note: 'Recargo por traslado',      flight: false },
  { id: 'maule',         name: 'Maule',                                    price: 240000, note: 'Incluye pasaje en bus',     flight: false },
  { id: 'nuble',         name: 'Ñuble',                                    price: 240000, note: 'Incluye pasaje en bus',     flight: false },
  { id: 'biobio',        name: 'Biobío',                                   price: 240000, note: 'Incluye pasaje en bus',     flight: false },
  { id: 'araucania',     name: 'La Araucanía',                             price: 230000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'losrios',       name: 'Los Ríos',                                 price: 230000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'loslagos',      name: 'Los Lagos',                                price: 230000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'aysen',         name: 'Aysén del Gral. Carlos Ibáñez del Campo',  price: 230000, note: '+ pasajes en avión aparte', flight: true  },
  { id: 'magallanes',    name: 'Magallanes y Antártica Chilena',           price: 230000, note: '+ pasajes en avión aparte', flight: true  },
]

export const COMMUNES: Record<string, Commune[]> = {
  arica:         ['Arica','Camarones','Putre','General Lagos'].map(n => ({ name: n })),
  tarapaca:      ['Iquique','Alto Hospicio','Pozo Almonte','Camiña','Colchane','Huara','Pica'].map(n => ({ name: n })),
  antofagasta:   ['Antofagasta','Mejillones','Sierra Gorda','Taltal','Calama','Ollagüe','San Pedro de Atacama','Tocopilla','María Elena'].map(n => ({ name: n })),
  atacama:       ['Copiapó','Caldera','Tierra Amarilla','Chañaral','Diego de Almagro','Vallenar','Alto del Carmen','Freirina','Huasco'].map(n => ({ name: n })),
  coquimbo:      ['La Serena','Coquimbo','Andacollo','La Higuera','Paihuano','Vicuña','Illapel','Canela','Los Vilos','Salamanca','Ovalle','Combarbalá','Monte Patria','Punitaqui','Río Hurtado'].map(n => ({ name: n })),
  valparaiso:    ['Valparaíso','Casablanca','Concón','Juan Fernández','Puchuncaví','Quintero','Viña del Mar','Isla de Pascua','Los Andes','Calle Larga','Rinconada','San Esteban','La Ligua','Cabildo','Papudo','Petorca','Zapallar','Quillota','La Calera','Hijuelas','La Cruz','Nogales','San Antonio','Algarrobo','Cartagena','El Quisco','El Tabo','Santo Domingo','San Felipe','Catemu','Llaillay','Panquehue','Putaendo','Santa María','Quilpué','Limache','Olmué','Villa Alemana'].map(n => ({ name: n })),
  metropolitana: [
    ...['Santiago','Cerrillos','Cerro Navia','Conchalí','El Bosque','Estación Central','Huechuraba','Independencia','La Cisterna','La Florida','La Granja','La Pintana','La Reina','Las Condes','Lo Barnechea','Lo Espejo','Lo Prado','Macul','Maipú','Ñuñoa','Pedro Aguirre Cerda','Peñalolén','Providencia','Quilicura','Quinta Normal','Recoleta','Renca','San Joaquín','San Miguel','San Ramón','Vitacura','Puente Alto','Pirque','San José de Maipo','San Bernardo','Calera de Tango','Paine','Melipilla','Alhué','Curacaví','María Pinto','San Pedro','Talagante','El Monte','Isla de Maipo','Padre Hurtado','Peñaflor'].map(n => ({ name: n })),
    { name: 'Pudahuel', surcharge: 20000 },
    { name: 'Colina',   surcharge: 20000 },
    { name: 'Lampa',    surcharge: 20000 },
    { name: 'Tiltil',   surcharge: 30000 },
    { name: 'Buin',     surcharge: 20000 },
  ],
  ohiggins:      ['Rancagua','Codegua','Coinco','Coltauco','Doñihue','Graneros','Las Cabras','Machalí','Malloa','Mostazal','Olivar','Peumo','Pichidegua','Quinta de Tilcoco','Rengo','Requínoa','San Vicente','San Fernando','Chépica','Chimbarongo','Lolol','Nancagua','Palmilla','Peralillo','Placilla','Pumanque','Santa Cruz','Pichilemu','La Estrella','Litueche','Marchihue','Navidad','Paredones'].map(n => ({ name: n })),
  maule:         ['Talca','Constitución','Curepto','Empedrado','Maule','Pelarco','Pencahue','Río Claro','San Clemente','San Rafael','Cauquenes','Chanco','Pelluhue','Curicó','Hualañé','Licantén','Molina','Rauco','Romeral','Sagrada Familia','Teno','Vichuquén','Linares','Colbún','Longaví','Parral','Retiro','San Javier','Villa Alegre','Yerbas Buenas'].map(n => ({ name: n })),
  nuble:         ['Chillán','Bulnes','Chillán Viejo','El Carmen','Pemuco','Pinto','Quillón','San Ignacio','Yungay','Quirihue','Cobquecura','Coelemu','Ninhue','Portezuelo','Ránquil','Trehuaco','San Carlos','Coihueco','Ñiquén','San Fabián','San Nicolás'].map(n => ({ name: n })),
  biobio:        ['Concepción','Coronel','Chiguayante','Florida','Hualqui','Lota','Penco','San Pedro de la Paz','Santa Juana','Talcahuano','Tomé','Hualpén','Lebu','Arauco','Cañete','Contulmo','Curanilahue','Los Álamos','Tirúa','Los Ángeles','Antuco','Cabrero','Laja','Mulchén','Nacimiento','Negrete','Quilaco','Quilleco','San Rosendo','Santa Bárbara','Tucapel','Yumbel','Alto Biobío'].map(n => ({ name: n })),
  araucania:     ['Temuco','Carahue','Cholchol','Cunco','Curarrehue','Freire','Galvarino','Gorbea','Lautaro','Loncoche','Melipeuco','Nueva Imperial','Padre Las Casas','Perquenco','Pitrufquén','Pucón','Saavedra','Teodoro Schmidt','Toltén','Vilcún','Villarrica','Angol','Collipulli','Curacautín','Ercilla','Lonquimay','Los Sauces','Lumaco','Purén','Renaico','Traiguén','Victoria'].map(n => ({ name: n })),
  losrios:       ['Valdivia','Corral','Lanco','Los Lagos','Máfil','Mariquina','Paillaco','Panguipulli','La Unión','Futrono','Lago Ranco','Río Bueno'].map(n => ({ name: n })),
  loslagos:      ['Puerto Montt','Calbuco','Cochamó','Fresia','Frutillar','Los Muermos','Llanquihue','Maullín','Puerto Varas','Castro','Ancud','Chonchi','Curaco de Vélez','Dalcahue','Puqueldón','Queilén','Quellón','Quemchi','Quinchao','Osorno','Puerto Octay','Purranque','Puyehue','Río Negro','San Juan de la Costa','San Pablo','Chaitén','Futaleufú','Hualaihué','Palena'].map(n => ({ name: n })),
  aysen:         ['Coyhaique','Lago Verde','Aysén','Cisnes','Guaitecas','Chile Chico','Río Ibáñez','Cochrane','O\'Higgins','Tortel'].map(n => ({ name: n })),
  magallanes:    ['Punta Arenas','Laguna Blanca','Río Verde','San Gregorio','Natales','Torres del Paine','Porvenir','Primavera','Timaukel','Cabo de Hornos','Antártica'].map(n => ({ name: n })),
}

/** Región Metropolitana como fallback seguro. */
export const DEFAULT_REGION = REGIONS.find(r => r.id === 'metropolitana')!

export function findRegion(id: string): Region {
  return REGIONS.find(r => r.id === id) ?? DEFAULT_REGION
}

export function findCommune(regionId: string, name: string): Commune | undefined {
  const list = COMMUNES[regionId] ?? []
  return list.find(c => c.name === name) ?? list[0]
}

export interface LocationPricing {
  region: Region
  commune: Commune | undefined
  /** Precio base del plan (sin ajustes). */
  base: number
  /** Precio del show ya ajustado por la ubicación (plan + zona/comuna). */
  effective: number
  /** Recargo por comuna periférica (solo Metropolitana). */
  communeSurcharge: number
  /** Diferencia por zona respecto al precio base (regiones fuera de Santiago). */
  zoneCharge: number
}

/**
 * Calcula el precio de un show según el plan base y la ubicación elegida.
 * - Metropolitana: precio base + recargo de comuna (si aplica).
 * - Otras regiones: precio fijo regional; `zoneCharge` = diferencia vs. base.
 */
export function locationPricing(basePrice: number, regionId: string, communeName: string): LocationPricing {
  const region = findRegion(regionId)
  const commune = findCommune(regionId, communeName)

  if (region.id === 'metropolitana') {
    const communeSurcharge = commune?.surcharge ?? 0
    return {
      region,
      commune,
      base: basePrice,
      effective: basePrice + communeSurcharge,
      communeSurcharge,
      zoneCharge: 0,
    }
  }

  const effective = region.price ?? basePrice
  return {
    region,
    commune,
    base: basePrice,
    effective,
    communeSurcharge: 0,
    zoneCharge: effective - basePrice,
  }
}
