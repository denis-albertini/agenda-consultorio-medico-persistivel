import consultorio from "../model/consultorio.js";
import pacienteRegistrarForm from "../view/pacienteRegistrarForm.js";
import Paciente from "../model/paciente.js";
import output from "../view/output.js";

export default async function pacienteRegistrar(cpfForm) {
  const cpf = cpfForm.cpf;

  const validaCpf = await consultorio.buscarPaciente(cpf);
  if (validaCpf.isFailure && !validaCpf.errors.find((erro) => erro === 13)) {
    output(validaCpf);
    return;
  }

  const pacienteForm = pacienteRegistrarForm();
  const nome = pacienteForm.nome;
  const dataNascimento = pacienteForm.dataNascimento;

  const validaPaciente = Paciente.of(cpf, nome, dataNascimento);
  if (validaPaciente.isFailure) {
    output(validaPaciente);
    return;
  }
  const paciente = validaPaciente.value;

  output(await consultorio.registrarPaciente(paciente));
}
