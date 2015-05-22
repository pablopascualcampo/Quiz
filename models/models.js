var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite   DATABASE_URL = sqLite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name		= (url[6] || null);
var user		= (url[2] || null);
var pwd 		= (url[3] || null);
var protocol	= (url[1] || null);
var dialect 	= (url[1] || null);
var port 		= (url[5] || null);
var host 		= (url[4] || null);
var storage		= process.env.DATABASE_STORAGE;

//Cargar el modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgress:

var sequelize = new Sequelize(DB_name, user,pwd,
	{ dialect:  protocol,
	  protocol: protocol,
	  port: 	port,
	  host: 	host,
	  storage: 	storage,	//Solo SQLite (.env)
	  omitNull: true		//Solo Postgres
	}

	);

//Importar la definicion de la tabla 'Quiz' en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Importar definición de la tabla Comment
var user_path = path.join(__dirname, 'user');
var User = sequelize.import(user_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

//Exportar las tablas
exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	User.count().then(function(count){
		if(count === 0){//La tabla se inicializa sólo si está vacía
			User.bulkCreate(
				[ {username: 'admin', password: '1234', isAdmin: true},
				  {username: 'pepe',  password: '5678'}	//El valor por defecto de isAdmin es false
				]
			).then(function(){
				console.log('Base de datos (tabla user) inicializada');
				Quiz.count().then(function(count){
					if(count === 0){
						Quiz.bulkCreate(
							[ {pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2},	//Estos quizes pertenecen al usuario 'pepe' (2)
							  {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', UserId: 2}
							]
						).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
					}
				});
			});
		};
	});
});