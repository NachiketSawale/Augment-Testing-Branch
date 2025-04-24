/**
 * Created by baf on 2016-05-04.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardContainerListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of generic wizard container entities.
	 **/
	angModule.controller('basicsConfigGenericWizardContainerListController', BasicsConfigGenericWizardContainerListController);

	BasicsConfigGenericWizardContainerListController.$inject = ['$scope', 'platformGridControllerService', 'basicsConfigGenWizardContainerDataService', 'basicsConfigGenericWizardContainerLayoutService', 'basicsConfigGenWizardValidationService', 'platformFileUtilControllerFactory'];


	function BasicsConfigGenericWizardContainerListController($scope, platformGridControllerService, dataService, basicsConfigGenericWizardContainerLayoutService, basicsConfigGenWizardValidationService, fileUtil) {

		var myGridConfig = { initCalled: false, columns: [] };
		var toolItems = [];

		platformGridControllerService.initListController($scope, basicsConfigGenericWizardContainerLayoutService, dataService, basicsConfigGenWizardValidationService, myGridConfig);

		fileUtil.initFileController($scope, dataService.mainService, dataService);

		toolItems.push(
			{
				id: 't1',
				caption: 'cloud.common.toolbarAddFile',
				type: 'item',
				iconClass: 'tlb-icons ico-new',
				fn: $scope.setClick,
				disabled: isDisabled
			}
		);
		$scope.addTools(toolItems);

		function isDisabled(){
			return dataService.isReadonly() || !dataService.mainService.getSelected();
		}
	}
})();