import consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default async function pacienteRemover(cpfForm) {
  const cpf = cpfForm.cpf;

  output(await consultorio.removerPaciente(cpf));
}
