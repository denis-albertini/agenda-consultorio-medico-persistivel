import consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default async function agendaListar(formulario) {
  const opcao = formulario.opcao;

  if (opcao !== "P") {
    output(await consultorio.listarAgenda());
    return;
  }

  const dataInicial = formulario.dataInicial;
  const dataFinal = formulario.dataFinal;

  output(await consultorio.listarAgenda(dataInicial, dataFinal));
}
