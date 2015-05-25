var express = require('express');
var multer = require('multer');
var router = express.Router();

var author = require('../controllers/author');

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

var statisticsController = require('../controllers/statistics_controller');

var favouritesController = require('../controllers/favourites_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con ids
router.param('quizId', quizController.load);	//autoload :quizId
router.param('commentId', commentController.load);	//autoload :commentId
router.param('userId', userController.load);

//Definición de rutas de sesion
router.get('/login', sessionController.auto_logout, sessionController.new);	//Formulario de login
router.post('/login', sessionController.auto_logout, sessionController.create);	//Crear sesión
router.get('/logout', sessionController.auto_logout, sessionController.destroy);	//Destruir sesión

//Definición de rutas de cuenta
router.get('/user', sessionController.auto_logout, userController.new);	//Formulario sign un
router.post('/user', sessionController.auto_logout, userController.create);	//Registrar usuario
router.get('/user/:userId(\\d+)/edit', sessionController.auto_logout, sessionController.loginRequired, userController.ownershipRequired, userController.edit);	//Editar información
router.put('/user/:userId(\\d+)', sessionController.auto_logout, sessionController.loginRequired, userController.ownershipRequired, userController.update);	//Actualiza información de cuenta
router.delete('/user/:userId(\\d+)', sessionController.auto_logout, sessionController.loginRequired,userController.ownershipRequired, userController.destroy);	//Eliminta cuenta
router.get('/user/:userId(\\d+)/quizes', sessionController.auto_logout, quizController.index);	//Ver las preguntas de un usuario

//Definición de rutas de /quizes
router.get('/quizes', sessionController.auto_logout, quizController.index);
router.get('/quizes/:quizId(\\d+)', sessionController.auto_logout, quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', sessionController.auto_logout, quizController.answer);

router.get('/quizes/new', sessionController.auto_logout, sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.auto_logout, sessionController.loginRequired, multer({dest: './public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.auto_logout, sessionController.loginRequired,quizController.ownershipRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.auto_logout, sessionController.loginRequired, quizController.ownershipRequired, multer({dest: './public/media/'}), quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.auto_logout, sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);

//Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.auto_logout, commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', sessionController.auto_logout, commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.auto_logout, sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);

//Definición de ruta de autores
router.get('/author', sessionController.auto_logout, author.author);

//Definición de rutas de estadísticas
router.get('/quizes/statistics', sessionController.auto_logout, statisticsController.statistics);

//Definición de rutas de favourites
router.get('/user/:userId(\\d+)/favourites', favouritesController.index);
router.put('/user/:userId(\\d+)/favourites/:quizId(\\d+)', favouritesController.select);
router.delete('/user/:userId(\\d+)/favourites/:quizId(\\d+)', favouritesController.quit);

module.exports = router;
