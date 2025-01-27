export interface Evento {
    id_evento: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    ubicacion: string;
    estado: "planeado" | "activo" | "finalizado";
  }