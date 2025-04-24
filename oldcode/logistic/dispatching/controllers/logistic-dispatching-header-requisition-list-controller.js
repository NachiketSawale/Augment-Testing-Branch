/**
 * Created by baf on 21.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingHeaderRequisitionListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic dispatching headerRequisition entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchingHeaderRequisitionListController', LogisticDispatchingHeaderRequisitionListController);

	LogisticDispatchingHeaderRequisitionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingHeaderRequisitionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5b0a0644da9245058c4ab36d46f418fc');
	}
})(angular);