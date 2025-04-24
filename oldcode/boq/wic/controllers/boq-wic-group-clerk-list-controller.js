(function () {

	'use strict';
	var moduleName = 'boq.wic';

	/**
	 * @ngdoc controller
	 * @name boqWicGroupClerkListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project locations
	 **/
	angular.module(moduleName).controller('boqWicGroupClerkListController', BoqWicGroupClerkListController);

	BoqWicGroupClerkListController.$inject = ['$scope', 'platformGridControllerService', 'boqWicGroupClerkService', 'boqWicGroupClerkConfigurationService', 'boqWicGroupClerkValidationService'];

	function BoqWicGroupClerkListController($scope, platformGridControllerService, boqWicGroupClerkService, boqWicGroupClerkConfigurationService, boqWicGroupClerkValidationService) {
		var myGridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, boqWicGroupClerkConfigurationService, boqWicGroupClerkService, boqWicGroupClerkValidationService, myGridConfig);
	}
})();