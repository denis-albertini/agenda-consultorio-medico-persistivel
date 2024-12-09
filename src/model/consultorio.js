import pacienteRepository from "../repository/pacienteRepository.js";
import consultaRepository from "../repository/consultaRepository.js";
import validador from "./validador.js";
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
    const buscaPaciente = await pacienteRepository.buscarUm(paciente.cpf);
    if (buscaPaciente.isSuccess) return Result.failure(14);

    return await pacienteRepository.registrarUm(paciente);
  }

  async atualizarRegistroPaciente(paciente) {
    return await pacienteRepository.registrarUm(paciente);
  }

  async #verificarAgendado(cpf) {
    const buscaPaciente = await this.buscarPaciente(cpf);
    if (buscaPaciente.isFailure) return buscaPaciente;
    const paciente = buscaPaciente.value;

    if (paciente.ultimoAgendamento === null) return Result.failure();

    const validaHoraFutura = validador.validarHoraFutura(
      paciente.ultimoAgendamento,
      paciente.ultimoAgendamento
    );
    if (validaHoraFutura.isFailure) return validaHoraFutura;

    return Result.success(paciente.ultimoAgendamento);
  }

  async removerPaciente(cpf) {
    const verificaAgendado = await this.#verificarAgendado(cpf);
    if (verificaAgendado.isSuccess) return Result.failure(15);

    return await pacienteRepository.removerUm(cpf);
  }

  async listarPacientes(opcao) {
    let pacientes;

    if (opcao === 3)
      pacientes = await pacienteRepository.buscarTodosOrdenadosPorCpf();
    else pacientes = await pacienteRepository.buscarTodosOrdenadosPorNome();

    return pacientes;
  }

  async buscarConsulta(cpf, data, horaInicial) {
    return await consultaRepository.buscarUma(cpf, data, horaInicial);
  }

  async #validarNovaConsulta(consulta) {
    if (
      consulta.horaInicial.hour < this.#horaAbertura.hour ||
      consulta.horaInicial.hour >= this.#horaFechamento.hour ||
      consulta.horaFinal.hour > this.#horaFechamento.hour
    )
      return Result.failure(9);

    const validaConflito = await consultaRepository.buscarUmaEmConflitoCom(
      consulta
    );

    if (validaConflito.isSuccess) return Result.failure(17);

    return Result.success(consulta);
  }

  async registrarConsulta(consulta) {
    const validaNovaConsulta = this.#validarNovaConsulta(consulta);
    if (validaNovaConsulta.isFailure) return validaNovaConsulta;

    return await consultaRepository.registrarUma(consulta);
  }

  async removerConsulta(cpf, data, horaInicial) {
    const buscaConsulta = await consultaRepository.buscarUma(
      cpf,
      data,
      horaInicial
    );
    if (buscaConsulta.isFailure) return buscaConsulta;
    const consulta = buscaConsulta.value;

    return await consultaRepository.removerUma(consulta);
  }

  #mapearConsultas(consultas) {
    const mapaConsultas = consultas.reduce((mapa, consulta) => {
      let key = consulta.data.toFormat("dd/MM/yyyy");

      if (!mapa.has(key)) mapa.set(key, []);

      mapa.get(key).push(consulta);

      return mapa;
    }, new Map());

    return mapaConsultas;
  }

  async listarAgenda(dataInicial, dataFinal) {
    let consultas;

    if (arguments.length === 2)
      consultas = await consultaRepository.buscarTodasPorPeriodo(
        dataInicial,
        dataFinal
      );
    else consultas = await consultaRepository.buscarTodas();

    const mapaConsultas = this.#mapearConsultas(consultas);

    return mapaConsultas;
  }
}

const consultorio = new Consultorio();

export default consultorio;
