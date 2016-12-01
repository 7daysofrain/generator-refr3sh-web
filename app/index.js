"use strict";
var yeoman = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var spawn = require('child_process').spawnSync;

// TODO PHP & .NET support
// TODO Bourbon, Compass or Free Soul

var props = {};

module.exports = yeoman.generators.Base.extend({
	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);
		this.option('folders');
	},
	initializing: function () {
		this.pkg = require("../package.json");
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			"This is a terrific output by " + chalk.green("Refr3sh") + ". Websites to kill your mind and mind your kill!"
		));
		if(!this.options.folders){
			var questions = [
				{
					type    : "input",
					name    : "projectName",
					message : "Nombre del proyecto (Cliente-Nombre_proyecto)",
					default : this.appname // Default to current folder name
				},
				{
					type: "checkbox",
					name: "features",
					message: "¿Qué más quieres instalar?",
					choices: [
						{
							name: "GSAP",
							value: "includeGSAP",
							checked: true
						},
						{
							name: "Signals",
							value: "includeSignals",
							checked: true
						},
						{
							name: "Modernizr",
							value: "includeModernizr",
							checked: true
						},
						{
							name: "Bourbon",
							value: "includeBourbon",
							checked: true
						}
					]
				},
				{
					type    : "confirm",
					name    : "sass",
					message : "¿Quieres usar SASS?",
					default : true
				},
				{
					type    : "confirm",
					name    : "plainStructure",
					message : "¿Quieres una estructura sencilla?",
					default : false
				},
				{
					type    : "confirm",
					name    : "svn",
					message : "¿Quieres crear y hacer checkout en el SVN (se usa el nombre del proyecto)?",
					default : true
				}
			];

			this.prompt(questions, function (answers) {
				var features = answers.features;

				function hasFeature(feat) {
					return features && features.indexOf(feat) !== -1;
				}

				props.includeGSAP = hasFeature("includeGSAP");
				props.includeSignals = hasFeature("includeSignals");
				props.includeModernizr = hasFeature("includeModernizr");
				props.includeBourbon = hasFeature("includeBourbon");
				props.projectName = answers.projectName;
				props.useSass = answers.sass;
				props.usePlain = answers.plainStructure;
				props.svn = answers.svn;

				done();

			}.bind(this));
		}
		else{
			done();
		}

	},

	writing: {
		app: function () {

			// Folder structure

			this.mkdir("design/previews");
			this.mkdir("design/sources");
			this.mkdir("docs");
			this.mkdir("material");
			this.mkdir("src/content/imgs");
			this.mkdir("src/content/script");
			if(!props.usePlain){
				this.mkdir("src/content/script/app");
			}
			this.mkdir("src/content/styles");

			if(this.options.folders){
				this.log(chalk.bgYellow.black("OPTION: Scaffolding only folders!"));
				return;
			}
			// Misc files

			this.fs.copy(
				this.templatePath("package.json"),
				this.destinationPath("package.json")
			);
			this.fs.copy(
				this.templatePath(".editorconfig"),
				this.destinationPath(".editorconfig")
			);
			this.fs.copy(
				this.templatePath(".jshintrc"),
				this.destinationPath(".jshintrc")
			);
			this.fs.copy(
				this.templatePath("src/robots.txt"),
				this.destinationPath("src/robots.txt")
			);

			// Index.html

			this.fs.copyTpl(
				this.templatePath("src/index.html"),
				this.destinationPath("src/index.html"),
				props
			);

			// CSS Support

			if(props.useSass){
				var vendors = "";
				var postimports = "";
				if(props.includeBourbon){
					vendors += '@import "../components/bourbon/app/assets/stylesheets/bourbon";\n';
				}
				if(!props.usePlain){
					this.directory(
							this.templatePath("sass"),
							this.destinationPath("src/content/styles"),
							{nodir:false}
					);
					this.fs.copyTpl(
							this.templatePath("main.scss"),
							this.destinationPath("src/content/styles/main.scss"),
							{
								vendors:vendors,
								postimports:postimports
							}
					);
				}
				else{
					this.fs.copyTpl(
							this.templatePath("main_plain.scss"),
							this.destinationPath("src/content/styles/main.scss"),
							{
								vendors:vendors,
								postimports:postimports
							}
					);
					this.fs.copyTpl(
							this.templatePath("sass/base/_text.scss"),
							this.destinationPath("src/content/styles/_text.scss"),
							{}
					);
					this.fs.copyTpl(
							this.templatePath("sass/base/_reset.scss"),
							this.destinationPath("src/content/styles/_reset.scss"),
							{}
					);
					
				}
			}
			else{
				var preimports = "";
				var extension = ".css";
				this.fs.copy(
					this.templatePath("src/content/styles/reset.css"),
					this.destinationPath("src/content/styles/reset" + extension),
					props
				);
				this.write(this.destinationPath("src/content/styles/fonts" + extension), "/* For CSS Fonts declarations */");

				preimports += '@import "reset.css";\n';
				preimports += '@import "fonts.css";\n';
				
				if(!props.usePlain){
					this.write(this.destinationPath("src/content/styles/animations" + extension), "/* For CSS Animations declarations */");
					this.write(this.destinationPath("src/content/styles/layout" + extension), "/* For CSS Layout */");
					preimports += '@import "animations.css";\n';
					preimports += '@import "layout.css";\n';
				}
				this.fs.copyTpl(
					this.templatePath("src/content/styles/global.css"),
					this.destinationPath("src/content/styles/global" + extension	),
					{
						preimports:preimports
					}
				);
			}

			// Javascript + AMD
			this.fs.copy(
					this.templatePath("build.js"),
					this.destinationPath("build.js")
			);

			this.fs.copy(
					this.templatePath("r.js"),
					this.destinationPath("r.js")
			);

			this.fs.copyTpl(
				this.templatePath("src/content/script/main.js"),
				this.destinationPath("src/content/script/main.js"),
				props
			);
			this.fs.copy(
				this.templatePath("src/content/script/app/app.js"),
				this.destinationPath("src/content/script/app/app.js")
			);
			this.fs.copy(
				this.templatePath("src/content/script/app/initializer.js"),
				this.destinationPath("src/content/script/app/initializer.js")
			);

			// Setup Grunt
			this.fs.copy(
				this.templatePath("Gruntfile.js"),
				this.destinationPath("Gruntfile.js")
			);


		}
  	},
	bower: function () {
		if(this.options.folders){
			return;
		}
		var bower = {
			name: props.projectName,
			private: true,
			dependencies: {}
		};
		bower.dependencies.jquery = "latest";
		bower.dependencies.requirejs = "latest";
		bower.dependencies.refr3shjslib = "https://github.com/7daysofrain/refr3sh-jslib.git";

		if (props.includeModernizr) {
			bower.dependencies.modernizr = "latest";
		}

		if (props.includeGSAP) {
			bower.dependencies.gsap = "latest";
		}

		if (props.includeSignals) {
			bower.dependencies.signals = "latest";
		}

		if (props.includeBourbon) {
			bower.dependencies.bourbon = "latest";
		}

		this.copy(".bowerrc", ".bowerrc");
		this.write("bower.json", JSON.stringify(bower, null, 2));
	},

	install: function () {

		// SVN
		if(props.svn){
			spawn('svn', ['mkdir','-m','""','svn://madrid.refr3sh.es/refr3sh/' + props.projectName]);
			spawn('svn', ['mkdir','-m','""','svn://madrid.refr3sh.es/refr3sh/' + props.projectName + "/trunk"]);
			spawn('svn', ['checkout','svn://madrid.refr3sh.es/refr3sh/' + props.projectName + '/trunk','./']);

			spawn('svn', ['propset','svn:ignore','dist']);
			spawn('svn', ['propset','svn:ignore','node_modules']);
			spawn('svn', ['propset','svn:ignore','.DS_Store']);
			spawn('svn', ['propset','svn:ignore','.sass-cache']);

			spawn('svn', ['commit']);
		}

		this.bowerInstall();
		if(!this.options.folders) {
			//this.installDependencies();
		}
	}
});
