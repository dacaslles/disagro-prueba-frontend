export interface ItemComercial {
    id_item_comercial: number;
    nombre: string;
    descripcion: string;
    fecha_registro: string;
    TipoItemComercial: { id_tipo_item_comercial: number, nombre: string };
    PrecioItemComercials: { precio: number }[];
  }