/**
 * Created by leo on 08.03.2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2CostCodeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job  entities.
	 **/
	angular.module(moduleName).controller('logisticJobPrj2CostCodeDetailController', LogisticJobPrj2CostCodeDetailController);

	LogisticJobPrj2CostCodeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPrj2CostCodeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5bc265dd5ce24bebbb8a962add4da06b', 'logisticJobTranslationService');
	}

})(angular);