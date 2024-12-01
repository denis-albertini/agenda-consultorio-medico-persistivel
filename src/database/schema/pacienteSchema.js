export default function criarModelPaciente(paciente, sequelize, dataTypes) {
  paciente.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cpf: { type: dataTypes.STRING(11), allowNull: false },
      nome: { type: dataTypes.STRING, allowNull: false },
      data_nascimento: { type: dataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: "Paciente",
      tableName: "pacientes",
      indexes: [{ unique: true, fields: ["cpf"] }],
    }
  );
}
