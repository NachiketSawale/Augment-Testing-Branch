(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).controller('trsRequisitionClerkListController', [
		'$scope', 'platformGridControllerService',
		'trsRequisitionClerkDataService',
		'trsRequisitionClerkUIService',
		'trsRequisitionClerkValidationService',
		function ($scope, platformGridControllerService,
		          dataServ,
		          uiStandardServ,
		          validationServ) {
			var gridConfig = {initCalled: false, columns: []};
			platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);
		}
	]);
})();