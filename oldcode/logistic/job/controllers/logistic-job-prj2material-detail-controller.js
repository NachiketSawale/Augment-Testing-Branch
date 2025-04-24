/**
 * Created by leo on 08.03.2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2MaterialDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job  entities.
	 **/
	angular.module(moduleName).controller('logisticJobPrj2MaterialDetailController', LogisticJobPrj2MaterialDetailController);

	LogisticJobPrj2MaterialDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPrj2MaterialDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '34673772740a46fda71000928bf0eb7d', 'logisticJobTranslationService');
	}

})(angular);