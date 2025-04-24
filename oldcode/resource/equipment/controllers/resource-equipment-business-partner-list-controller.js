/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentBusinessPartnerListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of business partner entities.
	 **/
	angModule.controller('resourceEquipmentBusinessPartnerListController', ResourceEquipmentBusinessPartnerListController);

	ResourceEquipmentBusinessPartnerListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentBusinessPartnerListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c84bcfcbcb3f41eca885db0e9a08f179');
	}
})();