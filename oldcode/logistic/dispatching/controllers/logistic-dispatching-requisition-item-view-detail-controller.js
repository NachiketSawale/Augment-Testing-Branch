/**
 * Created by nitsche on 10.09.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRequisitionItemViewDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching requisitionItemView entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingRequisitionItemViewDetailController', LogisticDispatchingRequisitionItemViewDetailController);

	LogisticDispatchingRequisitionItemViewDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingRequisitionItemViewDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fbec00a620c24d96ac392a3a260a314f');
	}

})(angular);
