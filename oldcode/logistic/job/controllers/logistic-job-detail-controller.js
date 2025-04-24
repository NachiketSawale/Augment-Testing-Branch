(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';
	/**
	 * @ngdoc controller
	 * @name logisticJobDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of job entities.
	 **/
	angular.module(moduleName).controller('logisticJobDetailController', LogisticJobDetailController);

	LogisticJobDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b0e4433e826b44c69f422d42e9788e49', 'logisticJobTranslationService');
	}

})(angular);