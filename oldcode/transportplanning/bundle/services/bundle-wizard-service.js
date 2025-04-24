/**
 * Created by waz on 7/3/2018.
 */
(function () {
	'use strict';
	/* global angular, globals, _ */
	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).factory('transportplanningBundleWizardService', BundleWizardService);

	BundleWizardService.$inject = [
		'$http', '$translate', '$q',
		'platformModalService',
		'platformSidebarWizardConfigService',
		'platformSidebarWizardCommonTasksService',
		'basicsCommonChangeStatusService',
		'transportplanningBundleMainService'];

	function BundleWizardService($http, $translate, $q,
										  platformModalService,
										  platformSidebarWizardConfigService,
	                             platformSidebarWizardCommonTasksService,
	                             basicsCommonChangeStatusService,
	                             dataService) {

		function changeBundleStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
					id: 13,
					mainService: dataService,
					refreshMainService: true,
					statusField: 'TrsBundleStatusFk',
					title: 'transportplanning.requisition.wizard.changeRequisitionStatus',
					statusName: 'trsBundle',
					updateUrl: 'transportplanning/bundle/wizard/changeBundleStatus',
					supportMultiChange: true
				}
			);
		}

		var service = {};
		var wizardID = 'transportplanningBundleSidebarWizards';
		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'productionplanning.mounting.wizard.wizardGroup',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					changeBundleStatus()
				]
			}]
		};

		service.enableBundle = platformSidebarWizardCommonTasksService.provideEnableInstance(
			dataService,
			'enableBundle',
			'transportplanning.bundle.wizard.enableBundle',
			'Code',
			'transportplanning.bundle.wizard.enableBundleDone',
			'transportplanning.bundle.wizard.bundleAlreadyEnabled',
			'bundle',
			20).fn;

		service.disableBundle = platformSidebarWizardCommonTasksService.provideDisableInstance(
			dataService,
			'disableBundle',
			'transportplanning.bundle.wizard.disableBundle',
			'Code',
			'transportplanning.bundle.wizard.disableBundleDone',
			'transportplanning.bundle.wizard.bundleAlreadyDisabled',
			'bundle',
			21).fn;

		service.changeBundleStatus = changeBundleStatus().fn;


		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		function validateSelectedEntity(selected, title) {
			if (!platformSidebarWizardCommonTasksService.assertSelection(selected, title)) {
				return false;
			}
			// other validation...

			return true;
		}

		service.bookProductsToStockLocation = function (wizParam){
			var selectedEntities = _.clone(dataService.getSelectedEntities());

			var title = $translate.instant('transportplanning.bundle.wizard.bookStockLocationTitle');
			if (!validateSelectedEntity(selectedEntities[0], title)) {
				return;
			}

			var filterObj = {
				BundleIds : _.map(selectedEntities,'Id')
			};
			// there is also duplicated code in pps-product-wizard-service.js, will refactor both of them later. by zwz 2022/01/18
			$http.post(globals.webApiBaseUrl+'productionplanning/common/productwithstockinfo/list',filterObj).then(function (response){
				function showDialog(productWithStoctInfoArray){
					var modalCreateConfig = {
						width: '960px',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'productionplanning.product/templates/pps-product-book-stock-location-wizard-dialog.html',
						controller: 'productionplanningProductBookStockLocationWizardController',
						resolve: {
							'$options': function () {
								return {
									products:productWithStoctInfoArray,
									wizardParas:wizParam
								};
							}
						}
					};
					platformModalService.showDialog(modalCreateConfig);
				}

				if(response.data){
					showDialog(response.data);
				}
			});
		};



		return service;
	}

})(angular);