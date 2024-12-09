import { Model } from "sequelize";
import Paciente from "./paciente.js";
import Result from "./result.js";
import validador from "./validador.js";

export default class Consulta extends Model {
  static of(data, horaInicial, horaFinal, paciente) {
    const erros = [];

    const validaData = validador.validarDataFutura(data);
    if (validaData.isFailure) erros.push(...validaData.errors);

    const validahoraInicial = validador.validarHoraInicial(horaInicial, data);
    if (validahoraInicial.isFailure) erros.push(...validahoraInicial.errors);

    const validaHoraFinal = validador.validarHoraFinal(horaFinal, horaInicial);
    if (validaHoraFinal.isFailure) erros.push(...validaHoraFinal.errors);

    if (erros.length > 0) return Result.failure(erros);

    if (!(paciente instanceof Paciente)) return Result.failure(12);

    data = validaData.value;
    horaInicial = validahoraInicial.value.hora;
    horaFinal = validaHoraFinal.value.horaFinal;

    return Result.success(
      Consulta.build({
        data: data,
        horaInicial: horaInicial,
        horaFinal: horaFinal,
        PacienteId: paciente.id,
      })
    );
  }
}
