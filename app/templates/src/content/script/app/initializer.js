/**
 * Created by 7daysofrain on 11/3/15.
 */
define([
], function()
{
	var args = arguments;
	var obj = {
		start: function(){
			for(var i = 0 ; i < args.length ; i++){
				args[i].init();
			}
		}
	};
	return obj;
});
