// Como usamos typescript aqui tenemos nuestros typos de datos.

export type Deuda = {
  id: number
  descripcion: string
  monto: number
  tasa_interes_anual: number
  pago_minimo: number
  created_at?: Date
}

export type ProyeccionDeuda = {
  meses: number
  total_intereses: number
  total_a_pagar: number
  error?: string
}

export type ResumenTotal = {
  total_adeudado: number
  total_intereses: number
  tiempo_pago_minimo: number
  total_a_pagar: number
}
