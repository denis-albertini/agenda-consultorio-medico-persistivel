import consultorio from "../model/consultorio.js";
import outputAgendaListar from "../view/outputAgendaListar.js";

export default async function agendaListar(formulario) {
  const opcao = formulario.opcao;

  if (opcao !== "P") {
    await outputAgendaListar(await consultorio.listarAgenda());
    return;
  }

  const dataInicial = formulario.dataInicial;
  const dataFinal = formulario.dataFinal;

  await outputAgendaListar(
    await consultorio.listarAgenda(dataInicial, dataFinal)
  );
}
