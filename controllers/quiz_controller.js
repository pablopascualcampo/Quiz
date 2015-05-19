//Este es el fichero controllador de quizes

var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error('No existe quizId=' + quizId));
			}
		}
	)catch(function(error){next(error);});
};

//GET /quizes
exports.index = function(req, res){
	if(req.query.search === undefined){
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs', {quizes: quizes});
		}).catch(function(error){next(error);})
	}else{
		var texto = req.query.search || '';
		var like = "%" + texto.replace(/ /g, '%') + "%";

		models.Quiz.findAll({where: ["pregunta like ?", like]}).then(function(quizes){
			
			var orden = new Array();

			for(var i = 0; i<quizes.length; i++){
				orden[i]=quizes[i].pregunta;
			}

			orden.sort();

			for(var i = 0; i<quizes.length; i++){
				quizes[i].pregunta = orden[i];
			}

			res.render('quizes/index.ejs', {quizes: quizes});

		}).catch(function(error){next(new Error("No se puede buscar"));})
	}
};

//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', { quiz: req.quiz});
};

//GET /quizes/:id/answer
exports.answer = function(req, res){	
	var resultado = 'Incorrecto';

	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}

	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

//GET /quizes/autores.ejs
exports.autores = function(req, res){
	res.render('quizes/autores', {respuesta: 'Autores'});
};