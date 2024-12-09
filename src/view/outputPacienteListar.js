import consultaBuscar from "../controller/consultaBuscar.js";
import { DateTime } from "luxon";

export default async function outputPacienteListar(pacientes) {
  let lista = "";
  let agendamento;

  await pacientes.forEach(async (paciente) => {
    agendamento = null;
    if (paciente.ultimoAgendamento !== null) {
      agendamento = await consultaBuscar(
        paciente.cpf,
        paciente.ultimoAgendamento.data,
        paciente.ultimoAgendamento.horaInicial
      );
    }

    lista +=
      `\n${paciente.cpf} ${paciente.nome.padEnd(32, " ")}` +
      ` ${paciente.dataNascimento.toFormat("dd/MM/yyyy")}` +
      `  ${Math.trunc(
        DateTime.now().diff(paciente.dataNascimento, "years").years
      )
        .toString()
        .padStart(3, "0")}`;

    if (agendamento !== null) {
      lista +=
        `\n            Agendado para: ${agendamento.data.toFormat(
          "dd/MM/yyyy"
        )}` +
        `\n            ${agendamento.horaInicial.toFormat(
          "HH:mm"
        )} às ${agendamento.horaFinal.toFormat("HH:mm")}`;
    }
  });

  const result =
    "\n------------------------------------------------------------" +
    "\nCPF         Nome                              Dt.Nacs. Idade" +
    "\n------------------------------------------------------------" +
    lista +
    "\n------------------------------------------------------------";

  console.log(result);

  console.log();
}
