/**
 * Created by Shankar on 19.07.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchLoadingInfoListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic dispatching Loading Info entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchLoadingInfoListController', LogisticDispatchLoadingInfoListController);

	LogisticDispatchLoadingInfoListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchLoadingInfoListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '642ef917134447A097bd7aec8f59979e');
	}
})(angular);