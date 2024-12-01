import Consulta from "../model/consulta.js";
import validador from "../model/validador.js";
import Result from "../model/result.js";
import { DateTime } from "luxon";

class ConsultaRepository {
  async buscarUma(cpf, data, horaInicial) {
    const erros = [];

    const validaCpf = validador.validarCpf(cpf);
    if (validaCpf.isFailure) erros.push(...validaCpf.errors);

    const validaHora = validador.validarHoraInicial(horaInicial, data);
    if (validaHora.isFailure) erros.push(...validaHora.errors);

    if (erros.length > 0) return Result.failure(erros);

    data = validaHora.value.data;
    data = new Date(data.year, data.month, data.day);

    const consulta = await Consulta.findOne({
      where: { cpf: cpf, data: data, horaInicial: horaInicial },
    });

    if (consulta === null) return Result.failure(18);

    consulta.data = DateTime.fromJSDate(consulta.data);
    consulta.hora = DateTime.fromFormat(consulta.hora, "HHmm");

    return Result.success(consulta);
  }

  async buscarTodas() {
    return await Consulta.findAll();
  }

  async registrarUma(consulta) {
    if (!(consulta instanceof Consulta)) return Result.failure(16);

    consulta.data = new Date(
      consulta.data.year,
      consulta.data.month,
      consulta.data.day
    );
    consulta.horaInicial = DateTime.fromISO(consulta.horaInicial).toFormat(
      "HHmm"
    );
    consulta.horaFinal = DateTime.fromISO(consulta.horaFinal).toFormat("HHmm");

    await consulta.save();

    return Result.success(3);
  }

  async removerUma(consulta) {
    consulta.data = new Date(
      consulta.data.year,
      consulta.data.month,
      consulta.data.day
    );
    consulta.horaInicial = DateTime.fromISO(consulta.horaInicial).toFormat(
      "HHmm"
    );
    consulta.horaFinal = DateTime.fromISO(consulta.horaFinal).toFormat("HHmm");

    consulta.destroy();

    return Result.success(4);
  }
}

const consultaRepository = new ConsultaRepository();

export default consultaRepository;
