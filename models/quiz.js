//Definición del modelo de Quiz con validación de preguntas

module.exports = function(sequelize, DataTypes){

	return sequelize.define('Quiz',
			{ pregunta: {type: DataTypes.STRING,
						 validate: { notEmpty: {msg: "-> Falta pregunta"}}			
			},respuesta:{type: DataTypes.STRING,
						 validate: { notEmpty: {msg: "-> Falta respuesta"}}
			}
		});
}