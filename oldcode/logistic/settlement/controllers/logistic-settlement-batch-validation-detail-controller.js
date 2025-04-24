/**
 * Created by baf on 27.06.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBatchValidationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement batchValidation entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementBatchValidationDetailController', LogisticSettlementBatchValidationDetailController);

	LogisticSettlementBatchValidationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementBatchValidationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '46ca8d13fd514512b56421c72101040a');
	}

})(angular);