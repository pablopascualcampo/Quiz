//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login');
	}
};

//MW de auto-logout
exports.auto_logout = function(req, res, next){
	var minutes = (new Date()).getMinutes();
	console.log("auto_logout");

	if(req.session.user){
		console.log("Usuario:", req.session.user.username);
		console.log("ahora", minutes);
		console.log("minutos del usuario:", req.session.time);

		if((minutes-req.session.time)>1 || (minutes-req.session.time)<0){
			console.log("logout");
			req.session.time = undefined;
			res.redirect('/logout');
		}else{
			req.session.time = (new Date()).getMinutes();
			console.log("else de auto_logout");
			console.log("Usuario:", req.session.user.username);
			console.log("minutos del usuario", req.session.time);
			next();
		}
	}else{
		next();
	}
};

//GET /login	-- Formulario de login
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
}

//POST /login	-- Crea la sesión si usuario se identifica
exports.create = function(req, res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){

		if(error){
			req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
			res.redirect('/login');
			return;
		}

		//Crear req.session.user y guardar campos id y username
		//La sesión se define por la existencia de: req.session.user
		req.session.user = { id: user.id, username: user.username, isAdmin: user.isAdmin};

		res.redirect(req.session.redir.toString());	//Redirección a path anterior a login

	});
};

//DELETE /logout	-- Destruir sesión
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString());	//Redirect a path anterior a logout
};