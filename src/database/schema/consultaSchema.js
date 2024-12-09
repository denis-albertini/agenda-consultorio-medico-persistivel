import { DateTime } from "luxon";

export default function criarModelConsulta(consulta, sequelize, dataTypes) {
  consulta.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      data: {
        type: dataTypes.DATEONLY,
        allowNull: false,
        get() {
          return DateTime.fromISO(this.getDataValue("data"));
        },
        set(data) {
          if (data instanceof DateTime) data = data.toISODate();
          this.setDataValue("data", data);
        },
      },
      horaInicial: {
        type: dataTypes.TIME,
        allowNull: false,
        get() {
          return DateTime.fromISO(this.getDataValue("horaInicial"));
        },
        set(hora) {
          if (hora instanceof DateTime) hora = hora.toISOTime();
          this.setDataValue("horaInicial", hora);
        },
      },
      horaFinal: {
        type: dataTypes.TIME,
        allowNull: false,
        get() {
          return DateTime.fromISO(this.getDataValue("horaFinal"));
        },
        set(hora) {
          if (hora instanceof DateTime) hora = hora.toISOTime();
          this.setDataValue("horaFinal", hora);
        },
      },
    },
    {
      sequelize,
      modelName: "Consulta",
      tableName: "Consultas",
    }
  );
}
