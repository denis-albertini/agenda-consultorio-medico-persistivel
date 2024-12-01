import padroes from "./padroes.js";
import Result from "./result.js";
import { DateTime } from "luxon";

class Validador {
  validarCpf(cpf) {
    const erros = [];

    let J = (() => {
      let sum = 0;
      for (let i = 0; i <= 8; i++) sum += Number(cpf[i]) * Math.abs(i - 10);

      if (sum % 11 === 0 || sum % 11 === 1) return 0;

      if (sum % 11 >= 2 || sum % 11 <= 10) return 11 - (sum % 11);

      return null;
    })();

    let K = (() => {
      let sum = 0;

      for (let i = 0; i <= 9; i++) sum += Number(cpf[i]) * Math.abs(i - 11);

      if (sum % 11 === 0 || sum % 11 === 1) return 0;

      if (sum % 11 >= 2 || sum % 11 <= 10) return 11 - (sum % 11);

      return null;
    })();

    if (!padroes.padraoCpf.test(cpf)) erros.push(1);

    if (cpf[9] != J || cpf[10] != K) erros.push(2);

    if (erros.length > 0) return Result.failure(erros);

    return Result.success(cpf);
  }

  validarNome(nome) {
    const erros = [];

    if (!padroes.padraoNome.test(nome)) erros.push(3);

    if (erros.length > 0) return Result.failure(erros);

    return Result.success(nome);
  }

  validarData(data) {
    if (data instanceof DateTime) return Result.success(data);

    const erros = [];

    if (!padroes.padraoData.test(data)) erros.push(4);

    if (erros.length > 0) return Result.failure(erros);

    data = DateTime.fromFormat(data, "dd/MM/yyyy");

    return Result.success(data);
  }

  validarDataFutura(data) {
    const dataAtual = DateTime.now();

    const validaData = this.validarData(data);
    if (validaData.isFailure) return validaData;
    data = validaData.value;

    const erros = [];

    if (
      data.year < dataAtual.year ||
      (data.year === dataAtual.year && data.month < dataAtual.month) ||
      (data.year === dataAtual.year &&
        data.month === dataAtual.month &&
        data.day < dataAtual.day)
    )
      erros.push(5);

    if (erros.length > 0) return Result.failure(erros);

    return Result.success(data);
  }

  validarDataNascimento(data) {
    const dataAtual = DateTime.now();

    const validaData = this.validarData(data);
    if (validaData.isFailure) return validaData;
    data = validaData.value;

    const erros = [];

    if (dataAtual.diff(data, "years").years < 13) erros.push(6);

    if (erros.length > 0) return Result.failure(erros);

    return Result.success(data);
  }

  validarHora(hora) {
    if (hora instanceof DateTime) return Result.success(hora);

    const erros = [];

    if (!padroes.padraoHora.test(hora)) erros.push(7);

    if (erros.length > 0) return Result.failure(erros);

    hora = DateTime.fromFormat(hora, "HHmm");

    return Result.success(hora);
  }

  validarHoraFutura(hora, data) {
    const dataAtual = DateTime.now();

    const validaHora = this.validarHora(hora);
    if (validaHora.isFailure) return validaHora;
    hora = validaHora.value;

    const validaDataFutura = this.validarDataFutura(data);
    if (validaDataFutura.isFailure) return Result.failure(8);
    data = validaDataFutura.value;

    if (
      data.year !== dataAtual.year ||
      data.month !== dataAtual.month ||
      data.day !== dataAtual.day
    )
      return Result.success({ hora: hora, data: data });

    if (hora.hour < dataAtual.hour) return Result.failure(8);

    if (hora.hour !== dataAtual.hour)
      return Result.success({ hora: hora, data: data });

    if (hora.minute <= dataAtual.minute) return Result.failure(8);

    return Result.success({ hora: hora, data: data });
  }

  validarHoraInicial(hora, data) {
    const validaHoraFutura = this.validarHoraFutura(hora, data);
    if (validaHoraFutura.isFailure) return validaHoraFutura;
    hora = validaHoraFutura.value.hora;
    data = validaHoraFutura.value.data;

    const erros = [];

    if (hora.minute % 15 !== 0) erros.push(10);

    if (erros.length > 0) return Result.failure(erros);

    return Result.success({ hora: hora, data: data });
  }

  validarHoraFinal(horaFinal, horaInicial) {
    const validaHoraInicial = this.validarHora(horaInicial);
    if (validaHoraInicial.isFailure) return validaHoraInicial;
    horaInicial = validaHoraInicial.value;

    const validaHoraFinal = this.validarHora(horaFinal);
    if (validaHoraFinal.isFailure) return validaHoraFinal;
    horaFinal = validaHoraFinal.value;

    const erros = [];

    if (horaFinal <= horaInicial) erros.push(11);

    if (horaFinal.minute % 15 !== 0) erros.push(10);

    if (erros.length > 0) return Result.failure(erros);

    return Result.success({ horaFinal: horaFinal, horaInicial: horaInicial });
  }
}

const validador = new Validador();

export default validador;
