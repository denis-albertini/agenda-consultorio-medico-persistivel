import cpfForm from "./cpfForm.js";
import menuAgendaListar from "./menuAgendaListar.js";
import PromptSync from "prompt-sync";

const prompt = PromptSync();

const menu =
  "Agenda" +
  "\n1-Agendar consulta" +
  "\n2-Cancelar agendamento" +
  "\n3-Listar agenda" +
  "\n4-Voltar p/ menu principal";

export default async function menuAgenda() {
  console.log(menu);

  console.log();

  let opcao = prompt("Opção: ");

  console.log();

  switch (Number(opcao)) {
    case 1:
      await cpfForm(2.1);
      break;
    case 2:
      await cpfForm(2.2);
      break;
    case 3:
      await menuAgendaListar();
      break;
    case 4:
      break;
    default:
      break;
  }
}
