(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).controller('trsRouteClerkListController', [
		'$scope', 'platformGridControllerService',
		'trsRouteClerkDataService',
		'trsRouteClerkUIService',
		'trsRouteClerkValidationService',
		function ($scope, platformGridControllerService,
		          dataServ,
		          uiStandardServ,
		          validationServ) {
			var gridConfig = {initCalled: false, columns: []};
			platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);
		}
	]);
})();