import { Model } from "sequelize";
import validador from "./validador.js";
import Result from "./result.js";

export default class Paciente extends Model {
  constructor(cpf, nome, dataNascimento) {
    const erros = [];

    const validaCpf = validador.validarCpf(cpf);
    if (validaCpf.isFailure) erros.push(...validaCpf.errors);
    cpf = validaCpf.value;

    const validaNome = validador.validarNome(nome);
    if (validaNome.isFailure) erros.push(...validaNome.errors);
    nome = validaNome.value;

    const validaDataNascimento =
      validador.validarDataNascimento(dataNascimento);
    if (validaDataNascimento.isFailure)
      erros.push(...validaDataNascimento.errors);
    dataNascimento = validaDataNascimento.value;

    if (erros.length > 0) return Result.failure(erros);

    return Result.success(Paciente.build({ cpf, nome, dataNascimento }));
  }
}
