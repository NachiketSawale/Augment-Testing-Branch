/**
 * Created by sandu on 11.03.2022.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigNavbarSystemListController
	 * @function
	 *
	 * @description
	 * Controller for the  NavbarSystem list view
	 **/
	angModule.controller('basicsConfigNavbarSystemListController', basicsConfigNavbarSystemListController);

	basicsConfigNavbarSystemListController.$inject = ['$scope', 'basicsConfigNavbarSystemService', 'basicsConfigNavbarSystemUIService', 'basicsConfigNavbarSystemValidationService', 'platformGridControllerService', 'basicsConfigNavCommandbarToggleButtonService', 'platformGridAPI', 'basicsConfigMainService'];

	function basicsConfigNavbarSystemListController($scope, basicsConfigNavbarSystemService, basicsConfigNavbarSystemUIService, basicsConfigNavbarSystemValidationService, platformGridControllerService, basicsConfigNavCommandbarToggleButtonService, platformGridAPI, basicsConfigMainService) {

		let myGridConfig = {
			initCalled: false,
			columns: []
		};

		platformGridControllerService.initListController($scope, basicsConfigNavbarSystemUIService, basicsConfigNavbarSystemService, basicsConfigNavbarSystemValidationService, myGridConfig);

		$scope.$watch(function(){
			return basicsConfigMainService.getSelected();
		},function(){
			basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'NavbarEnabled');
		});

	//	basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'NavbarEnabled');
	}
})();
