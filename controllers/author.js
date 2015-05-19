//GET /quizes/autores.ejs
exports.author = function(req, res){
	res.render('author', {errors: []});
};