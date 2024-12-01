import { Model } from "sequelize";
import Paciente from "./paciente.js";
import Result from "./result.js";
import validador from "./validador.js";

export default class Consulta extends Model {
  static of(data, horaInicial, horaFinal, paciente) {
    const erros = [];

    const validaData = validador.validarDataFutura(data);
    if (validaData.isFailure) erros.push(...validaData.errors);
    data = validaData.value;

    const validahoraInicial = validador.validarHoraInicial(horaInicial, data);
    if (validahoraInicial.isFailure) erros.push(...validahoraInicial.errors);
    horaInicial = validahoraInicial.value.hora;

    const validaHoraFinal = validador.validarHoraFinal(horaFinal, horaInicial);
    if (validaHoraFinal.isFailure) erros.push(...validaHoraFinal.errors);
    horaFinal = validaHoraFinal.value.horaFinal;

    if (!(paciente instanceof Paciente)) erros.push(12);

    if (erros.length > 0) return Result.failure(erros);

    return Result.success(
      Consulta.build({ data, horaInicial, horaFinal, paciente })
    );
  }
}
