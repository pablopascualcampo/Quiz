//Este es el fichero controllador de quizes

var models = require('../models/models.js');

//MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado
exports.ownershipRequired = function(req, res, next){
	var objQuizOwner = req.quiz.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if(isAdmin || objQuizOwner === logUser){
		next();
	}else{
		res.redirect('/');
	}
};

//Autoload :id
exports.load = function(req, res, next, quizId){

	models.Quiz.find({
		where: { id: Number(quizId)},
		include: [{ model: models.Comment}]
	}).then(function(quiz){

			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error){next(error);});
};

//GET /quizes
exports.index = function(req, res){
	if(req.query.search === undefined){
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
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

			res.render('quizes/index.ejs', {quizes: quizes, errors: []});

		}).catch(function(error){next(new Error("No se puede buscar"));})
	}
};

//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', { quiz: req.quiz, errors: []});
};	//req.quiz: instancia de quiz cargada con autoload

//GET /quizes/:id/answer
exports.answer = function(req, res){	
	var resultado = 'Incorrecto';

	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}

	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes/new
exports.new = function(req, res){

	var quiz = models.Quiz.build(//Crea objeto quiz
		{pregunta: "", respuesta: ""}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res){
	req.body.quiz.UserId = req.session.user.id;
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}else{
				quiz.save({fields: ["pregunta", "respuesta", "UserId"]})//save: guarda en DB campos pregunta y respuesta de quiz
				.then(function(){
					res.redirect('/quizes')//res.redirect: Redirección HTTP a lista de preguntas
				})
			}
		}
	).catch(function(error){next(error);});
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz;	//req.quiz: autoload de instancia quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		}else{
			req.quiz.save( {fields: ["pregunta", "respuesta"]})	//Save: Guarda campos pregunta y respuesta en BD
			.then(function(){
				res.redirect('/quizes');	//Redireccion HTTP a lista de preguntas (URL relativo)
			});
		}
	}).catch(function(error){next(error);});
};

// DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error);});
};