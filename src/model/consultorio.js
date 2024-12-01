import validador from "./validador.js";
import pacienteRepository from "../repository/pacienteRepository.js";
import consultaRepository from "../repository/consultaRepository.js";
import Result from "./result.js";
import { DateTime } from "luxon";

class Consultorio {
  static #instancia = null;
  #horaAbertura = DateTime.fromFormat("0800", "HHmm");
  #horaFechamento = DateTime.fromFormat("1900", "HHmm");

  get horaAbertura() {
    return this.#horaAbertura;
  }
  get horaFechamento() {
    return this.#horaFechamento;
  }

  constructor() {
    if (!Consultorio.#instancia) Consultorio.#instancia = this;

    return Consultorio.#instancia;
  }

  async buscarPaciente(cpf) {
    return await pacienteRepository.buscarUm(cpf);
  }

  async registrarPaciente(paciente) {
    return await pacienteRepository.registrarUm(paciente);
  }

  async #verificarAgendado(cpf) {
    const buscaPaciente = await this.buscarPaciente(cpf);
    if (buscaPaciente.isFailure) return buscaPaciente;
    const paciente = buscaPaciente.value;

    return Result.success(paciente.agendado);
  }

  async removerPaciente(paciente) {
    const verificaAgendado = await this.#verificarAgendado(cpf);
    if (verificaAgendado.isFailure) return verificaAgendado;
    if (verificaAgendado.value === true) return Result.failure(15);

    return await pacienteRepository.removerUm(paciente);
  }

  async #buscarTodosPacientes() {
    return await pacienteRepository.buscarTodos();
  }

  async #ordenarPacientesCpf() {
    return await this.#buscarTodosPacientes().sort((paciente1, paciente2) => {
      return Number(paciente1.cpf) - Number(paciente2.cpf);
    });
  }

  async #ordenarPacientesNome() {
    return await this.#buscarTodosPacientes().sort((paciente1, paciente2) => {
      if (paciente1.nome.toLowerCase() < paciente2.nome.toLowerCase())
        return -1;
      if (paciente1.nome.toLowerCase() > paciente2.nome.toLowerCase()) return 1;
      return 0;
    });
  }

  async listarPacientes(opcao) {
    let ordenados;

    if (opcao === 3) ordenados = await this.#ordenarPacientesCpf();
    else if (opcao === 4) ordenados = await this.#ordenarPacientesNome();
    else return Result.failure(19);

    let listados = "";

    ordenados.forEach((paciente) => {
      listados +=
        `\n${paciente.cpf} ${paciente.nome.padEnd(32, " ")}` +
        ` ${DateTime.fromISO(paciente.dataNascimento).toFormat("dd/MM/yyyy")}` +
        `  ${Math.trunc(
          DateTime.now().diff(paciente.dataNascimento, "years").years
        )
          .toString()
          .padStart(3, "0")}`;
    });

    const result =
      "\n------------------------------------------------------------" +
      "\nCPF         Nome                              Dt.Nacs. Idade" +
      "\n------------------------------------------------------------" +
      listados +
      "\n------------------------------------------------------------";

    return Result.success(result);
  }

  async #buscarConsulta(cpf, data, horaInicial) {
    return await consultaRepository.buscarUma(cpf, data, horaInicial);
  }

  async #buscarTodasConsultas() {
    return await consultaRepository.buscarTodas();
  }

  async #validarNovaConsulta(consulta) {
    let result = Result.success(consulta);

    if (
      consulta.horaInicial.hour < this.#horaAbertura.hour ||
      consulta.horaInicial.hour >= this.#horaFechamento.hour ||
      consulta.horaFinal.hour > this.#horaFechamento.hour
    )
      return Result.failure(9);

    await this.#buscarTodasConsultas().forEach((outraConsulta) => {
      if (!consulta.data.equals(outraConsulta.data)) return;

      if (
        (consulta.horaInicial.hour >= outraConsulta.horaInicial.hour &&
          consulta.horaInicial.hour <= outraConsulta.horaFinal.hour) ||
        (consulta.horaFinal.hour >= outraConsulta.horaFinal.hour &&
          consulta.horaFinal.hour <= outraConsulta.horaFinal.hour)
      )
        result = Result.failure(17);
    });

    return result;
  }

  async registrarConsulta(consulta) {
    const validaNovaConsulta = this.#validarNovaConsulta(consulta);
    if (validaNovaConsulta.isFailure) return validaNovaConsulta;

    return await consultaRepository.registrarUma(consulta);
  }

  async removerConsulta(cpf, data, horaInicial) {
    const buscaConsulta = await this.#buscarConsulta(cpf, data, horaInicial);
    if (buscaConsulta.isFailure) return buscaConsulta;
    const consulta = buscaConsulta.value;

    return await consultaRepository.removerUma(consulta);
  }

  async #ordenarConsultas() {
    let mapDatas = (async () => {
      return await consultaRepository.buscarTodas().reduce((map, consulta) => {
        let key = DateTime.fromISO(consulta.data).toFormat("dd/MM/yyyy");

        if (!map.has(key)) map.set(key, []);

        map.get(key).push(consulta);

        return map;
      }, new Map());
    })();

    mapDatas.forEach((value, key) => {
      mapDatas.set(
        key,
        (() => {
          return value.sort((consulta1, consulta2) => {
            return (
              Number(DateTime.fromISO(consulta1.horaInicial).toFormat("HHmm")) -
              Number(DateTime.fromISO(consulta2.horaInicial).toFormat("HHmm"))
            );
          });
        })()
      );
    });

    return mapDatas;
  }

  async listarAgenda(dataInicial, dataFinal) {
    let listados = "";
    let ordenados = await this.#ordenarConsultas();
    let filtrados;

    if (arguments.length === 2) {
      const erros = [];

      const validaDataInicial = validador.validarData(dataInicial);
      if (validaDataInicial.isFailure) erros.push(...validaDataInicial.errors);
      dataInicial = validaDataInicial.value;

      const validaDataFinal = validador.validarData(dataFinal);
      if (validaDataFinal.isFailure) erros.push(...validaDataFinal.errors);
      dataFinal = validaDataFinal.value;

      if (erros.length > 0) return Result.failure(erros);

      filtrados = new Map(
        Array.from(ordenados).filter(
          ([key]) =>
            DateTime.fromFormat(key, "dd/MM/yyyy") >= dataInicial &&
            DateTime.fromFormat(key, "dd/MM/yyyy") <= dataFinal
        )
      );
    } else filtrados = ordenados;

    filtrados.forEach((value) => {
      value.forEach((consulta) => {
        let tempo = (
          Number(DateTime.fromISO(consulta.horaFinal).toFormat("HHmm")) -
          Number(DateTime.fromISO(consulta.horaInicial).toFormat("HHmm"))
        )
          .toString()
          .padStart(4, "0");

        listados +=
          `\n${
            value.indexOf(consulta) === 0
              ? DateTime.fromISO(consulta.data).toFormat("dd/MM/yyyy")
              : "          "
          }` +
          ` ${DateTime.fromISO(consulta.horaInicial).toFormat("HH:mm")}` +
          ` ${DateTime.fromISO(consulta.horaFinal).toFormat("HH:mm")}` +
          ` ${tempo.slice(0, 2) + ":" + tempo.slice(2)}` +
          ` ${consulta.paciente.nome.padEnd(21, " ")}` +
          ` ${DateTime.fromISO(consulta.paciente.dataNascimento).toFormat(
            "dd/MM/yyyy"
          )}`;
      });
    });

    const result =
      "\n-------------------------------------------------------------" +
      "\n   Data    H.Ini H.Fim Tempo Nome                   Dt.Nasc. " +
      "\n-------------------------------------------------------------" +
      listados +
      "\n-------------------------------------------------------------";

    return Result.success(result);
  }
}

const consultorio = new Consultorio();

export default consultorio;
