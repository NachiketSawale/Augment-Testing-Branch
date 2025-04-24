/**
 * Created by leo on 14.09.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementContractHeaderApprovalDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of prc contract headerapproval entities.
	 **/
	angular.module(moduleName).controller('procurementContractHeaderApprovalDetailController', PrcContractHeaderapprovalDetailController);

	PrcContractHeaderapprovalDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function PrcContractHeaderapprovalDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0e76058ee10645f186195895a9502b7a', 'procurementContractTranslationService');
	}

})(angular);