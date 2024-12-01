import { Sequelize } from "sequelize";
import Paciente from "../model/paciente.js";
import Consulta from "../model/consulta.js";
import databaseConfig from "./databaseConfig.js";
import criarModelPaciente from "./schema/pacienteSchema.js";
import criarModelConsulta from "./schema/consultaSchema.js";

class Database {
  #sequelize;

  get sequelize() {
    return this.#sequelize;
  }

  async init() {
    this.#sequelize = new Sequelize(
      databaseConfig.database,
      databaseConfig.username,
      databaseConfig.password,
      {
        host: databaseConfig.host,
        dialect: databaseConfig.dialect,
        logging: false,
      }
    );

    try {
      await this.#sequelize.authenticate();
    } catch (error) {
      return false;
    }

    criarModelPaciente(Paciente, this.#sequelize, Sequelize.DataTypes);
    criarModelConsulta(Consulta, this.#sequelize, Sequelize.DataTypes);

    Paciente.hasMany(Consulta, {
      foreignKey: "paciente_id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    Consulta.belongsTo(Paciente, {
      foreignKey: "paciente_id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    return true;
  }
}

const database = new Database();

export default database;
