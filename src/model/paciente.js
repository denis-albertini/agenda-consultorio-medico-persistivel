import { Model } from "sequelize";
import validador from "./validador.js";
import Result from "./result.js";

export default class Paciente extends Model {
  static of(cpf, nome, dataNascimento) {
    const erros = [];

    const validaCpf = validador.validarCpf(cpf);
    if (validaCpf.isFailure) erros.push(...validaCpf.errors);

    const validaNome = validador.validarNome(nome);
    if (validaNome.isFailure) erros.push(...validaNome.errors);

    const validaDataNascimento =
      validador.validarDataNascimento(dataNascimento);
    if (validaDataNascimento.isFailure)
      erros.push(...validaDataNascimento.errors);

    if (erros.length > 0) return Result.failure(erros);

    dataNascimento = validaDataNascimento.value;

    return Result.success(
      Paciente.build({ cpf: cpf, nome: nome, dataNascimento: dataNascimento })
    );
  }
}
