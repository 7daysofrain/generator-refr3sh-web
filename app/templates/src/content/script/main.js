require.config({
	baseUrl: "content/script",
	paths: {
		jQuery: "../components/jquery/dist/jquery",
		jquery: "../components/jquery/dist/jquery",
		<% if (includeGSAP) { %>"TweenMax": "../components/gsap/src/uncompressed/TweenMax",
		"TweenLite": "../components/gsap/src/uncompressed/TweenLite",
		"TimelineMax": "../components/gsap/src/uncompressed/TimelineMax",
		<% } if (includeSignals) { %>"signals": "../components/signals/dist/signals",
		<% } if (includeModernizr) { %>"modernizr":"../components/modernizr/modernizr",<% } %>
	},
	shim: {
		jQuery: {
			exports: "jQuery"
		}
	}
});
var app;

require(["app/app"], function (application) {
	window.app = app = application;
	app.init();
});
