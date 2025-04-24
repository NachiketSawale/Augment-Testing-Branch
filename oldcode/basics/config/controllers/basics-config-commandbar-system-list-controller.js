/**
 * Created by sandu on 11.03.2022.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigCommandbarSystemListController
	 * @function
	 *
	 * @description
	 * Controller for the  CommandbarSystem list view
	 **/
	angModule.controller('basicsConfigCommandbarSystemListController', basicsConfigCommandbarSystemListController);

	basicsConfigCommandbarSystemListController.$inject = ['$scope', 'basicsConfigCommandbarSystemService', 'basicsConfigCommandbarSystemUIService',
		'basicsConfigCommandbarSystemValidationService', 'platformGridControllerService', 'basicsConfigNavCommandbarToggleButtonService', 'basicsConfigMainService'];

	function basicsConfigCommandbarSystemListController($scope, basicsConfigCommandbarSystemService, basicsConfigCommandbarSystemUIService,
		basicsConfigCommandbarSystemValidationService, platformGridControllerService, basicsConfigNavCommandbarToggleButtonService, basicsConfigMainService) {

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, basicsConfigCommandbarSystemUIService, basicsConfigCommandbarSystemService, basicsConfigCommandbarSystemValidationService, myGridConfig);

		$scope.$watch(function(){
			return basicsConfigMainService.getSelected();
		},function(){
			basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'CombarEnabled');
		});

		//basicsConfigNavCommandbarToggleButtonService.showToggleSwitchContainer($scope, 'CombarEnabled');
	}
})();
