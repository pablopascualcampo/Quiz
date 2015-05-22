var models = require('../models/models.js');

//GET /quizes/statistics
exports.statistics = function(req, res){
	models.Quiz.findAll().then(function(quizes){
		var nPreguntas = quizes.length;
		models.Comment.findAll().then(function(comments){
			var nComentarios = comments.length;
			var media = nComentarios/nPreguntas;
			var sinComments = 0;
			var conComments = 0;
			var i = 0;
			var array = [];

			for(i=0; i<nComentarios; i++){
				if(array[comments[i].QuizId]){
					array[comments[i].QuizId]++;
				}else{
					array[comments[i].QuizId] = 1;
				}
			}

			for(i=0; i<nPreguntas; i++){
				if(array[i]){
					conComments++;
				}else{
					sinComments++;
				}
			}
			res.render('quizes/statistics', {quizes: quizes, preguntas: nPreguntas, comentarios: nComentarios, media: media, sinComments: sinComments, conComments: conComments, errors: []});
		}).catch(function(error) {next(error);});
	}).catch(function(error){next(error);});
};