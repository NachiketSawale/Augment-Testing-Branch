/**
 * Created by nitsche on 10.09.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRequisitionItemViewListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching requistionItemView entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingRequisitionItemViewListController', LogisticDispatchingRequisitionItemViewListController);

	LogisticDispatchingRequisitionItemViewListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingRequisitionItemViewListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4262b2464d744610ad69a30f4ee182dc');
	}

})(angular);
