define([
        "app/initializer"
], function(initializer) {
	'use strict'

	return {
        init: function(){
            console.log("App init");
			initializer.start();
        }
    };
});
