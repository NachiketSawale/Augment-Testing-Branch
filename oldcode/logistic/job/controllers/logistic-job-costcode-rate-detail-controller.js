/**
 * Created by leo on 12.03.2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobCostCodeRateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job cost code rate entities.
	 **/
	angular.module(moduleName).controller('logisticJobCostCodeRateDetailController', LogisticJobCostCodeRateDetailController);

	LogisticJobCostCodeRateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobCostCodeRateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bf85675ae414422f91d2a916a418b447', 'logisticJobTranslationService');
	}

})(angular);