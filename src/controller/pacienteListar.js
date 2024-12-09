import consultorio from "../model/consultorio.js";
import outputPacienteListar from "../view/outputPacienteListar.js";

export default async function pacienteListar(opcao) {
  await outputPacienteListar(await consultorio.listarPacientes(opcao));
}
