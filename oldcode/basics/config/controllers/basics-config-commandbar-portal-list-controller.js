/**
 * Created by sandu on 11.03.2022.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigCommandbarPortalListController
	 * @function
	 *
	 * @description
	 * Controller for the  CommandbarPortal list view
	 **/
	angModule.controller('basicsConfigCommandbarPortalListController', basicsConfigCommandbarPortalListController);

	basicsConfigCommandbarPortalListController.$inject = ['$scope', 'basicsConfigCommandbarPortalService', 'basicsConfigCommandbarPortalUIService', 'basicsConfigCommandbarPortalValidationService',
		'platformGridControllerService', 'basicsConfigNavCommandbarToggleButtonService', 'basicsConfigMainService'];

	function basicsConfigCommandbarPortalListController($scope, basicsConfigCommandbarPortalService, basicsConfigCommandbarPortalUIService,
		basicsConfigCommandbarPortalValidationService, platformGridControllerService, basicsConfigNavCommandbarToggleButtonService, basicsConfigMainService) {

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, basicsConfigCommandbarPortalUIService, basicsConfigCommandbarPortalService, basicsConfigCommandbarPortalValidationService, myGridConfig);

		$scope.$watch(function(){
			return basicsConfigMainService.getSelected();
		},function(){
			basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'CombarPortalEnabled');
		});

		//basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'CombarPortalEnabled');
	}
})();
