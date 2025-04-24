(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name CompanyPeriodsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyPeriodsDetailController', BasicsCompanyPeriodsDetailController);

	BasicsCompanyPeriodsDetailController.$inject = ['_', '$scope', 'platformContainerControllerService', 'basicsCompanyPeriodsService'];

	function BasicsCompanyPeriodsDetailController(_, $scope, platformContainerControllerService, basicsCompanyPeriodsService) {

		var hasChildren;
		if (basicsCompanyPeriodsService.getSelected() !== undefined && basicsCompanyPeriodsService.getSelected() !== null) {

			basicsCompanyPeriodsService.hasChildren().then(function (response) {
				hasChildren = response.data.length;
				if (hasChildren === 0) {
					_.find($scope.tools.items, {id: 'delete'}).disabled = false;
				} else {
					_.find($scope.tools.items, {id: 'delete'}).disabled = true;
				}
				$scope.tools.refresh();
			},
			function (/*error*/) {
			});
		}

		platformContainerControllerService.initController($scope, moduleName, '0d38d21d14d8475c9206c3eb346f63be', 'basicsCompanyTranslationService');
	}
})(angular);
