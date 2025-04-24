/*
 * Copyright(c) RIB Software GmbH
 */

(function () {

	'use strict';
	const moduleName = 'basics.config';
	const module = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigModuleViewListController
	 * @function
	 *
	 * @description
	 *
	 **/
	module.controller('basicsConfigDashboardXModuleListController', basicsConfigDashboardXModuleListController);

	basicsConfigDashboardXModuleListController.$inject = ['$scope', '_', '$timeout', '$http', 'basicsConfigDashboardXModuleService', 'basicsConfigDashboardXModuleUIService', 'basicsConfigDashboardXModuleValidationService', 'platformGridControllerService', 'mainViewService', 'platformDialogService', 'basicsConfigMainService'];

	function basicsConfigDashboardXModuleListController($scope, _, $timeout, $http, dataService, uiService, validationService, platformGridControllerService, mainViewService, platformDialogService, basicsConfigMainService) {

		function getModulesBlacklist() {
			const containerId = $scope.$parent.getContainerUUID();
			const containerDef = mainViewService.getContainerByUuid(containerId);

			$scope.blackList = _.get(containerDef, 'moduleBlacklist', []);
		}

		function updateTools() {
			$timeout($scope.tools.update, 0, true);
		}

		function isDashboardAssignable(selectedModule) {
			return selectedModule && !$scope.blackList.includes(selectedModule.InternalName);
		}

		const myGridConfig = {
			initCalled: false,
			grouping: true,
			columns: []
		};

		platformGridControllerService.initListController($scope,
			uiService,
			dataService,
			validationService,
			myGridConfig);

		getModulesBlacklist();

		const createButton = {
			id: 'create',
			type: 'item',
			caption: 'cloud.common.toolbarInsert',
			iconClass: 'tlb-icons ico-rec-new',
			fn: function () {
				const selectedModule = basicsConfigMainService.getSelected();

				if (!selectedModule) {
					platformDialogService.showMsgBox('basics.config.dashboardToModuleDialogNoModule', 'basics.config.dashboardToModuleDialogHeaderInfo', 'info');
				} else if (!isDashboardAssignable(selectedModule)) {
					platformDialogService.showMsgBox('basics.config.dashboardToModuleDialogNotAssignable', 'basics.config.dashboardToModuleDialogHeaderInfo', 'info');
				} else {
					dataService.createItem(selectedModule.Id);
				}
			},
			disabled: function () {
				const selectedModule = basicsConfigMainService.getSelected();

				if(selectedModule) {
					return !isDashboardAssignable(selectedModule);
				}

				return false;
			}
		};

		$scope.addTools([createButton]);
		updateTools();
	}
})();
