import Paciente from "../model/paciente.js";
import validador from "../model/validador.js";
import Result from "../model/result.js";
import { DateTime } from "luxon";

class PacienteRepository {
  async buscarUm(cpf) {
    const validaCpf = validador.validarCpf(cpf);
    if (validaCpf.isFailure) return validaCpf;

    const paciente = await Paciente.findOne({ where: { cpf: cpf } });

    if (paciente === null) return Result.failure(13);

    paciente.dataNascimento = DateTime.fromJSDate(paciente.dataNascimento);

    return Result.success(paciente);
  }

  async registrarUm(paciente) {
    if (!(paciente instanceof Paciente)) return Result.failure(12);

    const buscaPaciente = this.buscarPaciente(paciente.cpf);
    if (buscaPaciente.isSuccess) return Result.failure(14);

    paciente.dataNascimento = new Date(
      paciente.dataNascimento.year,
      paciente.dataNascimento.month,
      paciente.dataNascimento.day
    );

    await paciente.save();

    return Result.success(1);
  }

  async removerUm(paciente) {
    paciente.dataNascimento = new Date(
      paciente.dataNascimento.year,
      paciente.dataNascimento.month,
      paciente.dataNascimento.day
    );

    await paciente.destroy();

    return Result.success(2);
  }

  async buscarTodos() {
    return await Paciente.findAll();
  }
}

const pacienteRepository = new PacienteRepository();

export default pacienteRepository;
