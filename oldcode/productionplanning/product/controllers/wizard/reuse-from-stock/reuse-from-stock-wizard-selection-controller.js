/**
 * Created by zwz on 07/07/2022.
 */

(function (angular) {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('productionplanningProductReuseFromStockWizardSelectionController', Controller);
	Controller.$inject = ['$scope', 'platformGridAPI', 'productionplanningProductReuseFromStockWizardSelectionService'];

	function Controller($scope, platformGridAPI, service) {
		service.initial($scope);

		$scope.$on('$destroy', function () {
			service.unregisterSelectionChanged();
		});
	}
})(angular);