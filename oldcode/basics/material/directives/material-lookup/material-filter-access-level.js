(function (){
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).constant('materialFilterAccessLevel', {
		user: 1,
		role: 2,
		system: 3
	});

})();