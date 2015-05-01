//Este es el fichero controllador de quizes

//GET /quizes/question
exports.question = function(req, res){
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

//GET /quizes/answer
exports.answer = function(req, res){
	if(req.query.respuesta === "Roma"){
		res.render('quizes/answer', {respuesta: 'Correcto'});
	}else{
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
};

//GET /autores.ejs
exports.autores = function(req, res){
	res.render('quizes/autores', {respuesta: 'Autores'});
};