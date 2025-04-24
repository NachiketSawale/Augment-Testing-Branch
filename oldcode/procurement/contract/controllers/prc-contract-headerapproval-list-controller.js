/**
 * Created by leo on 10.09.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementContractHeaderApprovalGridController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Prc contract headerapproval entities.
	 **/

	angular.module(moduleName).controller('procurementContractHeaderApprovalGridController', PrcContractHeaderapprovalListController);

	PrcContractHeaderapprovalListController.$inject = ['$scope', 'platformContainerControllerService'];

	function PrcContractHeaderapprovalListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '22307f2249d04061986c26508e5f6b1a');
	}
})(angular);