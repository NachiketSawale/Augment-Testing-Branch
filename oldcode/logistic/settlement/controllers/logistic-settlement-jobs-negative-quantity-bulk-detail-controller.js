/**
 * Created by chin-han.lai on 08/09/2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementJobsNegativeQuantityBulkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement BulkNegativeLocationsVEntity entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementJobsNegativeQuantityBulkDetailController', LogisticSettlementJobsNegativeQuantityBulkDetailController);

	LogisticSettlementJobsNegativeQuantityBulkDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticSettlementConstantValues'];

	function LogisticSettlementJobsNegativeQuantityBulkDetailController($scope, platformContainerControllerService,logisticSettlementConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, logisticSettlementConstantValues.uuid.container.jobsWithNegativeQuantityForBulkDetail);
	}

})(angular);