/**
 * Created by baf on 21.09.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingHeaderRequisitionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching headerRequisition entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingHeaderRequisitionDetailController', LogisticDispatchingHeaderRequisitionDetailController);

	LogisticDispatchingHeaderRequisitionDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingHeaderRequisitionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4757ca2faa614e59934611e2193cae95');
	}

})(angular);