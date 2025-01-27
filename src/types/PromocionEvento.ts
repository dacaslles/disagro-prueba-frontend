export interface PromocionEvento {
    id_promocion_evento: number,
    nombre: string,
    cantidad_requerida: number,
    monto_requerido: number,
    mismo_item: boolean,
    mismo_tipo: boolean,
    tipo_descuento: "porcentaje" | "descuento_fijo",
    valor_descuento: number,
    TipoItemComercial: { id_tipo_item_comercial: number, nombre: string };
}