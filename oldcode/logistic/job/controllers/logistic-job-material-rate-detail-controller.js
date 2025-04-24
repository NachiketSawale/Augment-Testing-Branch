/**
 * Created by baf on 08.02.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobMaterialRateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job material rate entities.
	 **/
	angular.module(moduleName).controller('logisticJobMaterialRateDetailController', LogisticJobMaterialRateDetailController);

	LogisticJobMaterialRateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobMaterialRateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '265fbb21125d4d749f72f47922a8ad4f', 'logisticJobTranslationService');
	}

})(angular);