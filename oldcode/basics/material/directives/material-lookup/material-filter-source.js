(function (angular){
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).constant('basicsMaterialFilterSource', {
		custom: 0,
		materialEntity: 1,
		attribute: 2
	});

})(angular);