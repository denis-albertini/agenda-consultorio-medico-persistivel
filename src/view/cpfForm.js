import pacienteRegistrar from "../controller/pacienteRegistrar.js";
import pacienteRemover from "../controller/pacienteRemover.js";
import consultaRegistrar from "../controller/consultaRegistrar.js";
import consultaRemover from "../controller/consultaRemover.js";
import PromptSync from "prompt-sync";

const prompt = PromptSync({ sigint: true });

export default async function cpfForm(opcao) {
  const cpf = prompt("CPF: ");

  const formulario = { cpf: cpf };

  switch (opcao) {
    case 1.1:
      await pacienteRegistrar(formulario);
      break;
    case 1.2:
      await pacienteRemover(formulario);
      break;
    case 2.1:
      await consultaRegistrar(formulario);
      break;
    case 2.2:
      await consultaRemover(formulario);
      break;
    default:
      break;
  }
}
