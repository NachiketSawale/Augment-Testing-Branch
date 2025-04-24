/**
 * Created by Shankar on 07.09.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchWeightInfoDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatch loading info entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchWeightInfoDetailController', LogisticDispatchWeightInfoDetailController);

	LogisticDispatchWeightInfoDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchWeightInfoDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6bc53b650de7400f8565366b862274c9');
	}

})(angular);