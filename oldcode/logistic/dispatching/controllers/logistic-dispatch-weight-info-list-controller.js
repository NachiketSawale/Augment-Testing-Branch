/**
 * Created by Shankar on 07.09.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchWeightInfoListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic dispatching Weight Info entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchWeightInfoListController', LogisticDispatchWeightInfoListController);

	LogisticDispatchWeightInfoListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchWeightInfoListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '037f3f5b216e445f94d7f388296b04c9');
	}
})(angular);