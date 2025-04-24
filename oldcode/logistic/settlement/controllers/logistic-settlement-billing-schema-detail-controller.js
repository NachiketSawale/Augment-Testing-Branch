/**
 * Created by baf on 14.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBillingSchemaDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement item entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementBillingSchemaDetailController', LogisticSettlementBillingSchemaDetailController);

	LogisticSettlementBillingSchemaDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementBillingSchemaDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '40b035b436d0442bb069bafc41c2e868');
	}

})(angular);