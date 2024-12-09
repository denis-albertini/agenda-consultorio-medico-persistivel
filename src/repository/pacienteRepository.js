import Paciente from "../model/paciente.js";
import validador from "../model/validador.js";
import Result from "../model/result.js";

class PacienteRepository {
  async registrarUm(paciente) {
    if (!(paciente instanceof Paciente)) return Result.failure(12);

    await paciente.save();

    return Result.success(1);
  }

  async removerUm(cpf) {
    await Paciente.destroy({ where: { cpf: cpf } });

    return Result.success(2);
  }

  async buscarUm(cpf) {
    const validaCpf = validador.validarCpf(cpf);
    if (validaCpf.isFailure) return validaCpf;

    const paciente = await Paciente.findOne({ where: { cpf: cpf } });

    if (paciente === null) return Result.failure(13);

    return Result.success(paciente);
  }

  async buscarTodosOrdenadosPorCpf() {
    return await Paciente.findAll({ order: [["cpf", "ASC"]] });
  }

  async buscarTodosOrdenadosPorNome() {
    return await Paciente.findAll({ order: [["nome", "ASC"]] });
  }
}

const pacienteRepository = new PacienteRepository();

export default pacienteRepository;
