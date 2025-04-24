/**
 * Created by welss on 12.04.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobTaskDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job task entities.
	 **/
	angular.module(moduleName).controller('logisticJobTaskDetailController', LogisticJobTaskDetailController);

	LogisticJobTaskDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobTaskDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '173d56eae5954d47a7f63559dcc0076b', 'logisticJobTranslationService');
	}

})(angular);