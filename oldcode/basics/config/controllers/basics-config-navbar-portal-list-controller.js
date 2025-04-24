/**
 * Created by sandu on 11.03.2022.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigNavbarPortalListController
	 * @function
	 *
	 * @description
	 * Controller for the  NavbarPortal list view
	 **/
	angModule.controller('basicsConfigNavbarPortalListController', basicsConfigNavbarPortalListController);

	basicsConfigNavbarPortalListController.$inject = ['$scope', 'basicsConfigNavbarPortalService', 'basicsConfigNavbarPortalUIService', 'basicsConfigNavbarPortalValidationService',
		'platformGridControllerService', 'basicsConfigNavCommandbarToggleButtonService', 'basicsConfigMainService'];

	function basicsConfigNavbarPortalListController($scope, basicsConfigNavbarPortalService, basicsConfigNavbarPortalUIService, basicsConfigNavbarPortalValidationService,
		platformGridControllerService, basicsConfigNavCommandbarToggleButtonService, basicsConfigMainService) {

		let myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, basicsConfigNavbarPortalUIService, basicsConfigNavbarPortalService, basicsConfigNavbarPortalValidationService, myGridConfig);

		$scope.$watch(function(){
			return basicsConfigMainService.getSelected();
		},function(){
			basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'NavbarPortalEnabled');
		});

		//basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'NavbarPortalEnabled');

	}
})();
