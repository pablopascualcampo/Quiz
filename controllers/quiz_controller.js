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
	var options = {};

	if(req.user){
		options.where = {UserId: req.user.id}
	}

	if(req.session && req.session.user){	//Se ha echo el refresco al darle a borrar o crear favorito
		options.include = {model: models.User, as: "Fans"};
	}

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

			if(req.session.user){
				quizes.forEach(function(quiz){
					quiz.selected = quiz.Fans.some(function(fan){
						return fan.id == req.session.user.id;	//Comprobamos que ese fav corresponda al usuario
					});
				});
			}

			res.render('quizes/index.ejs', {quizes: quizes, errors: []});

		}).catch(function(error){next(new Error("No se puede buscar"));})
	}
};

//GET /quizes/:id
exports.show = function(req, res){

	models.Quiz.findAll({where: {id: req.params.quizId}, include: {model: models.User, as: "Fans"}})
	.then(function(quizes){
		if(req.session.user){
			quizes.forEach(function(quiz){
				req.quiz.selected = quiz.Fans.some(function(fan){
					return fan.id === req.session.user.id
				});

				res.render('quizes/show', {quiz: req.quiz, errors: []});
			});
		}else{
			res.render('quizes/show', {quiz: req.quiz, errors: []});
		}
	});
};

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

	if(req.files.image){
		req.body.quiz.image = req.files.image.name;
	}

	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}else{
				quiz.save({fields: ["pregunta", "respuesta", "UserId", "image"]})//save: guarda en DB campos pregunta y respuesta de quiz
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

	if(req.files.image){
		req.quiz.image = req.files.image.name;
	}

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		}else{
			req.quiz.save( {fields: ["pregunta", "respuesta", "image"]})	//Save: Guarda campos pregunta y respuesta en BD
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