import consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default async function pacienteListar(opcao) {
  output(await consultorio.listarPacientes(opcao));
}
