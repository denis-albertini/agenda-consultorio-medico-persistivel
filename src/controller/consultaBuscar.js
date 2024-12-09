import consultorio from "../model/consultorio.js";

export default async function consultaBuscar(cpf, data, horaInicial) {
  return await consultorio.buscarConsulta(cpf, data, horaInicial);
}
