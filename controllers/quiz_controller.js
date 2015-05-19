//Este es el fichero controllador de quizes

var models = require('../models/models.js');

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
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: quiz});
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