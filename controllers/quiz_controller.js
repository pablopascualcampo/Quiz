//Este es el fichero controllador de quizes

var models = require('../models/models.js');

//GET /quizes
exports.index = function(req, res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes});
	})
};

//GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId)	.then(function(quiz){
		res.render('quizes.show', { quiz: quiz});
	})
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer', { quiz: quiz, respuesta: 'Correcto' });
		}else{
			res.render('quizes/answer', { quiz: quiz, respuesta: 'Incorrecto' });
		}


	})

};

//GET /quizes/autores.ejs
exports.autores = function(req, res){
	res.render('quizes/autores', {respuesta: 'Autores'});
};

//GET /quizes/busqueda
exports.busqueda = function(req, res){
	res.render('quizes/busqueda', {respuesta: 'Busqueda'});
};