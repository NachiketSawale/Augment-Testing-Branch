/**
 * Created by zwz on 07/07/2022.
 */

(function (angular) {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('productionplanningProductReuseFromStockWizardRemainderSettingController', Controller);
	Controller.$inject = ['$scope', 'productionplanningProductReuseFromStockWizardRemainderSettingService'];

	function Controller($scope, service) {
		service.initial($scope);

		$scope.$on('$destroy', function () {
		});
	}
})(angular);