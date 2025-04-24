/**
 * Created by baf on 21.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingLinkageListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic dispatching linkage entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchingLinkageListController', LogisticDispatchingLinkageListController);

	LogisticDispatchingLinkageListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingLinkageListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c581784ef4234a629b1a6b0af272e416');
	}
})(angular);