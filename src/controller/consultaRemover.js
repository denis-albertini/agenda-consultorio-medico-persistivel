import consultorio from "../model/consultorio.js";
import consultaRemoverForm from "../view/consultaRemoverForm.js";
import output from "../view/output.js";

export default async function consultaRemover(cpfForm) {
  const cpf = cpfForm.cpf;

  const validaCpf = await consultorio.buscarPaciente(cpf);
  if (validaCpf.isFailure) {
    output(validaCpf);
    return;
  }

  const consultaForm = consultaRemoverForm();
  const data = consultaForm.data;
  const horaInicial = consultaForm.horaInicial;

  output(await consultorio.removerConsulta(cpf, data, horaInicial));
}
