export default function criarModelConsulta(consulta, sequelize, dataTypes) {
  consulta.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      data: { type: dataTypes.DATEONLY, allowNull: false },
      hora_inicial: { type: dataTypes.STRING(4), allowNull: false },
      hora_final: { type: dataTypes.STRING(4), allowNull: false },
      paciente_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "pacientes",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Consulta",
      tableName: "consultas",
    }
  );
}
