export default async function outputAgendaListar(mapaConsultas) {
  let lista = "";

  await mapaConsultas.forEach(async (data) => {
    await data.forEach(async (consulta) => {
      let duracao = (
        Number(consulta.horaFinal.toFormat("HHmm")) -
        Number(consulta.horaInicial.toFormat("HHmm"))
      )
        .toString()
        .padStart(4, "0");

      const paciente = await consulta.getPaciente();

      lista +=
        `\n${
          data.indexOf(consulta) === 0
            ? consulta.data.toFormat("dd/MM/yyyy")
            : "          "
        }` +
        ` ${consulta.horaInicial.toFormat("HH:mm")}` +
        ` ${consulta.horaFinal.toFormat("HH:mm")}` +
        ` ${duracao.slice(0, 2) + ":" + duracao.slice(2)}` +
        ` ${paciente.nome.padEnd(21, " ")}` +
        ` ${paciente.dataNascimento.toFormat("dd/MM/yyyy")}`;
    });
  });

  const result =
    "-------------------------------------------------------------" +
    "\n   Data    H.Ini H.Fim duracao Nome                   Dt.Nasc. " +
    "\n-------------------------------------------------------------" +
    lista +
    "\n-------------------------------------------------------------";

  console.log(result);

  console.log();
}
