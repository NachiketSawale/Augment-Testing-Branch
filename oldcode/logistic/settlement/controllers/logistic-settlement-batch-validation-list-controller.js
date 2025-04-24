/**
 * Created by baf on 27.06.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBatchValidationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement batchValidation entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementBatchValidationListController', LogisticSettlementBatchValidationListController);

	LogisticSettlementBatchValidationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementBatchValidationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2a2dace70a434dbbb8a3f1d654923ad6');
	}
})(angular);