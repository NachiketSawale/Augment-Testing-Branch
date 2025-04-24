/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentBusinessPartnerDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of business partner entities
	 **/
	angModule.controller('resourceEquipmentBusinessPartnerDetailController', ResourceEquipmentBusinessPartnerDetailController);

	ResourceEquipmentBusinessPartnerDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentBusinessPartnerDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '442c8df8e82346ae942d9c50fc495bb7');
	}
})();