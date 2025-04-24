/**
 * Created by Shankar on 19.07.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchLoadingInfoDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatch loading info entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchLoadingInfoDetailController', LogisticDispatchLoadingInfoDetailController);

	LogisticDispatchLoadingInfoDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchLoadingInfoDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'da4c7efade4f4713bb323e8bae7a20a8');
	}

})(angular);