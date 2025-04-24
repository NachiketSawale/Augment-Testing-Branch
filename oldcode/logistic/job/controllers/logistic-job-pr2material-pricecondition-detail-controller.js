/**
 * Created by leo on 12.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2MaterialPriceConditionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job project 2 material price condition entities.
	 **/

	angular.module(moduleName).controller('logisticJobPrj2MaterialPriceConditionDetailController', LogisticJobPrj2MaterialPriceConditionDetailController);

	LogisticJobPrj2MaterialPriceConditionDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPrj2MaterialPriceConditionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9618d193861547efa8a8b233ed80c00d', 'logisticJobTranslationService');
	}
})(angular);