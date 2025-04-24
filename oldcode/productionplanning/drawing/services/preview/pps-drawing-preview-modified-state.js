(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.drawing';

	angular.module(moduleName).constant('modifiedState', {
		none: 0,
		add: 1,
		delete: 2,
		modify: 3,
	});
})(angular);