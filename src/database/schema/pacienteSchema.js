import { DateTime } from "luxon";

export default function criarModelPaciente(paciente, sequelize, dataTypes) {
  paciente.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      cpf: { type: dataTypes.STRING(11), allowNull: false },
      nome: { type: dataTypes.STRING, allowNull: false },
      dataNascimento: {
        type: dataTypes.DATEONLY,
        allowNull: false,
        get() {
          return DateTime.fromISO(this.getDataValue("dataNascimento"));
        },
        set(data) {
          if (data instanceof DateTime) data = data.toISODate();
          this.setDataValue("dataNascimento", data);
        },
      },
      ultimoAgendamento: {
        type: dataTypes.DATE,
        get() {
          const ultimoAgendamento = this.getDataValue("ultimoAgendamento");
          return ultimoAgendamento !== null
            ? DateTime.fromJSDate(ultimoAgendamento)
            : null;
        },
        set(agendamento) {
          if (agendamento instanceof DateTime)
            agendamento = agendamento.toJSDate();
          this.setDataValue("ultimoAgendamento", agendamento);
        },
      },
    },
    {
      sequelize,
      indexes: [{ unique: true, fields: ["cpf"] }],
      modelName: "Paciente",
      tableName: "Pacientes",
    }
  );
}
