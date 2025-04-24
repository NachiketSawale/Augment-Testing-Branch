/**
 * Created by sfi on 8/27/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.materialcatalog';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('materialcatalogSidebarWizardService',
		[
			'platformSidebarWizardConfigService',
			'basicsMaterialCatalogService',
			'$translate',
			'platformTranslateService',
			'platformSidebarWizardCommonTasksService',
			'basicsMaterialcatalogUpdateDiscountWizardService',
			'basicsMaterialcatalogDeepCopyWizardService',
			'basicsCharacteristicBulkEditorService',
			'basicsMaterialCatalogMaterialGroupService',
			'documentProjectDocumentsStatusChangeService',
			'platformModalService','$http','platformWizardDialogService',
			'basicsCommonAIService',

			function (platformSidebarWizardConfigService,
				dataService,
				$translate,
				platformTranslateService,
				platformSidebarWizardCommonTasksService,
				basicsMaterialcatalogUpdateDiscountWizardService,
				basicsMaterialcatalogDeepCopyWizardService,
				basicsCharacteristicBulkEditorService,
				basicsMaterialCatalogMaterialGroupService,
				documentProjectDocumentsStatusChangeService,
					  platformModalService,$http,platformWizardDialogService,
					  basicsCommonAIService) {

				var service = {};
				var wizardID = 'materialcatalogSidebarWizards';

				function disableRecord() {
					return platformSidebarWizardCommonTasksService.provideDisableInstance(dataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
						'basics.materialcatalog.disableDone', 'basics.materialcatalog.alreadyDisabled', 'code', 12);
				}

				function enableRecord() {
					return platformSidebarWizardCommonTasksService.provideEnableInstance(dataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
						'basics.materialcatalog.enableDone', 'basics.materialcatalog.alreadyEnabled', 'code', 13);
				}

				service.updateCount = function updateCount() {
					basicsMaterialcatalogUpdateDiscountWizardService.execute();
				};

				service.disableRecord = disableRecord().fn;

				service.enableRecord = enableRecord().fn;

				service.deepCopyMaterialCatalog = function deepCopyMaterial() {
					basicsMaterialcatalogDeepCopyWizardService.execute();
				};

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(dataService, 'basics.materialcatalog');
				}

				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

				var wizardConfig = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Material Catalog',
							text$tr$: 'basics.materialcatalog.moduleName',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								{
									id: 11,
									text: 'Update Discount',
									text$tr$: 'basics.materialcatalog.wizard.updateDiscount',
									type: 'item',
									showItem: true,
									fn: service.updateCount
								},
								disableRecord(),
								enableRecord(),
								changeStatusForProjectDocument()
							]
						}
					]
				};

				service.activate = function activate() {
					platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
				};

				service.deactivate = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(wizardID);
				};
				service.syncMaterialCatlogFromYtwo= function syncMaterialCatlogFromYtwo() {
					var wzConfig = {
						steps: [{
							id: 'basic',
							disallowBack: false,
							disallowNext: false,
							canFinish: false
						},{
							id: 'update',
							disallowBack: false,
							disallowNext: true,
							canFinish: true
						}]
					};
					platformWizardDialogService.translateWizardConfig(wzConfig);
					var obj = {
						selector: {},
						__selectorSettings: {}
					};
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'basics.materialcatalog/templates/wizards/sync-material-catalog-from-ytwo.html',
						resizeable: true,
						value: {
							wizard: wzConfig,
							entity:obj,
							wizardName: 'wzdlg'
						}
					});
				};

				service.materialGroupsAiMapping= function materialGroupsAiMapping() {
					var params = {
						gridId:'2f5d48cf7c53422ea7a5da317c4c04e3',
						materialGroupData:null
					};
					var materialCatalog = dataService.getSelected();
					if(!angular.isObject(materialCatalog)){
						return platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage( 'basics.materialcatalog.ai.autoMappingHeader', $translate.instant('basics.materialcatalog.ai.autoMappingError'));
					}
					basicsCommonAIService.checkPermission('ab96e568a79245fa9b1aced3a51f643f', true).then(function (canProceed) {
						if (!canProceed) {
							return;
						}
						$http.get(globals.webApiBaseUrl +'basics/materialcatalog/group/mtwoai/aimapprcstructure?mainItemId='+ materialCatalog.Id).then(function (response) {
							params.materialGroupData = response.data;
							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'basics.materialcatalog/templates/wizards/material-catalog-group-ai-mapping.html',
								backdrop: false,
								windowClass: 'form-modal-dialog',
								lazyInit: true,
								resizeable: true,
								width: '70%',
								height: '70%',
								params: params
							};
							platformModalService.showDialog(modalOptions);
						});
					});
				};

				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject(wizardConfig, ['text']);

				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('basics.materialcatalog')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				return service;
			}
		]);
})(angular);