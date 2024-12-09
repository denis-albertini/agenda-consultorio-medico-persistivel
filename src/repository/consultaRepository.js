import Consulta from "../model/consulta.js";
import validador from "../model/validador.js";
import Result from "../model/result.js";
import { Op } from "sequelize";

class ConsultaRepository {
  async registrarUma(consulta) {
    if (!(consulta instanceof Consulta)) return Result.failure(16);

    await consulta.save();

    return Result.success(3);
  }

  async removerUma(consulta) {
    if (!(consulta instanceof Consulta)) return Result.failure(16);

    consulta.destroy();

    return Result.success(4);
  }

  async buscarUma(cpf, data, horaInicial) {
    const erros = [];

    const validaCpf = validador.validarCpf(cpf);
    if (validaCpf.isFailure) erros.push(...validaCpf.errors);

    const validaHora = validador.validarHoraInicial(horaInicial, data);
    if (validaHora.isFailure) erros.push(...validaHora.errors);

    if (erros.length > 0) return Result.failure(erros);

    data = validaHora.value.data.toISODate();
    horaInicial = validaHora.value.horaInicial.toISOTime();

    const consulta = await Consulta.findOne({
      where: { cpf: cpf, data: data, horaInicial: horaInicial },
    });

    if (consulta === null) return Result.failure(18);

    return Result.success(consulta);
  }

  async buscarUmaEmConflitoCom(consulta) {
    if (!(consulta instanceof Consulta)) return Result.failure(16);

    const consultaConflitante = await Consulta.findOne({
      where: {
        data: consulta.data.toISODate(),
        [Op.or]: [
          {
            [Op.and]: {
              horaInicial: { [Op.lte]: consulta.horaFinal.toISOTime() },
              horaFinal: { [Op.gte]: consulta.horaInicial.toISOTime() },
            },
          },
          {
            horaInicial: {
              [Op.between]: [
                consulta.horaInicial.toISOTime(),
                consulta.horaFinal.toISOTime(),
              ],
            },
          },
          {
            horaFinal: {
              [Op.between]: [
                consulta.horaInicial.toISOTime(),
                consulta.horaFinal.toISOTime(),
              ],
            },
          },
        ],
      },
    });

    if (consultaConflitante === null) return Result.failure();

    return Result.success();
  }

  async buscarTodas() {
    const consultas = await Consulta.findAll({
      group: ["id", "data"],
      order: [["data", "ASC"]],
    });

    return consultas;
  }

  async buscarTodasPorPeriodo(dataInicial, dataFinal) {
    const erros = [];

    const validaDataInicial = validador.validarData(dataInicial);
    if (validaDataInicial.isFailure) erros.push(...validaDataInicial.errors);

    const validaDataFinal = validador.validarData(dataFinal);
    if (validaDataFinal.isFailure) erros.push(...validaDataFinal.errors);

    if (erros.length > 0) return Result.failure(erros);

    dataInicial = validaDataInicial.value.toISODate();
    dataFinal = validaDataFinal.value.toISODate();

    const consultas = await Consulta.findAll({
      where: { data: { [Op.between]: [dataInicial, dataFinal] } },
      group: ["id", "data"],
      order: [["data", "ASC"]],
    });

    return consultas;
  }
}

const consultaRepository = new ConsultaRepository();

export default consultaRepository;
