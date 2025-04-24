(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterCharController', [
		'$scope', 'definition', 'basicsMaterialFilterOperateService',
		function ($scope, definition, basicsMaterialFilterOperateService) {
			basicsMaterialFilterOperateService.init($scope, definition);
		}
	]);

})(angular);