(function (angular){
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).constant('basicsMaterialFilterType', {
		numeric: 1,
		char: 2,
		boolean: 3,
		list: 4,
		grid: 5,
		date: 6
	});

})(angular);