/**
 * $Id: sales-billing-item-numbering-configure-dialog-service.js$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesCommonItemNumberingConfigService', ['globals', '_', '$injector', '$http',
		function (globals, _, $injector, $http) {
			var service = {};

			service.getConfigById = function getConfigById(id) {
				return $http.get(globals.webApiBaseUrl + 'sales/billing/itemnoconf/getbyid?id=' + id)
					.then(function (response) {
						if (_.isObject(response.data) && _.get(response.data, 'Id') > 0) {
							var config = response.data;
							return config;
						}
						return null;
					});
			};

			service.getDefaultBillItemNoConfigHeaderFromCustomizing = function getDefaultBillItemNoConfigHeaderFromCustomizing() {
				return $injector.get('basicsLookupdataSimpleLookupService').getDefault({
					lookupModuleQualifier: 'basics.customize.billitemnumberconfigurationheader',
					displayMember: 'Description',
					valueMember: 'Id',
					filter: {
						customIntegerProperty: 'BIL_ITEMNOCONF_FK'
					}
				}).then(function (configHeader) {
					if (_.isObject(configHeader) && _.get(configHeader, 'Id') > 0) {
						return configHeader;
					} else {
						return null;
					}
				});
			};

			service.getDefaultBillItemNoConfigFromCustomizing = function getDefaultBillItemNoConfigFromCustomizing() {
				return service.getDefaultBillItemNoConfigHeaderFromCustomizing().then(function (configHeader) {
					if (configHeader && _.get(configHeader, 'BilItemnoconfFk') > 0) {
						var configId = configHeader.BilItemnoconfFk;
						return service.getConfigById(configId);
					} else {
						return null;
					}
				});
			};

			return service;
		}
	]);


	salesCommonModule.factory('salesBillingItemNumberingConfigurationService', ['globals', '_', '$injector', '$http', '$translate', 'platformSidebarWizardCommonTasksService', 'platformTranslateService', 'platformModalFormConfigService', 'platformRuntimeDataService', 'salesCommonItemNumberingConfigService',
		function (globals, _, $injector, $http, $translate, platformSidebarWizardCommonTasksService, platformTranslateService, platformModalFormConfigService, platformRuntimeDataService, salesCommonItemNumberingConfigService) {
			var service = {};

			var dataItem = {
				projectFk: 0,
				startValue: 10,
				increment: 10
			};

			function getFormLayoutConfig() {
				return {
					fid: 'sales.billing.createItemNoConfDlgTitle',
					version: '0.1.0',
					showGrouping: false,
					groups: [{
						gid: 'baseGroup',
						attributes: ['projectFk', 'startValue', 'increment']
					}],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'projectFk',
							model: 'projectFk',
							sortOrder: 1,
							label: 'Project No',
							label$tr$: 'cloud.common.entityProjectFk',
							type: 'directive',
							readonly: true,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: false,
									filterKey: 'sales-common-project-filterkey' // TODO: probably not needed because readonly
								},
							},
						},
						{
							gid: 'baseGroup',
							rid: 'startValue',
							model: 'startValue',
							label$tr$: 'sales.common.entityStartValue',
							type: 'integer',
							sortOrder: 2,
							readonly: false,
						},
						{
							gid: 'baseGroup',
							rid: 'increment',
							model: 'increment',
							label$tr$: 'sales.common.entityIncrement',
							type: 'integer',
							sortOrder: 3,
							readonly: false,
						}
					]
				};
			}

			function getLayoutForCustomizing() {
				return {
					fid: 'sales.common.editItemNoConfDlgTitle',
					version: '0.1.0',
					showGrouping: false,
					groups: [{
						gid: 'baseGroup',
						attributes: ['startValue', 'increment']
					}],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'startValue',
							model: 'Startval',
							label$tr$: 'sales.common.entityStartValue',
							type: 'integer',
							sortOrder: 1,
							readonly: false
						},
						{
							gid: 'baseGroup',
							rid: 'increment',
							model: 'Increment',
							label$tr$: 'sales.common.entityIncrement',
							type: 'integer',
							sortOrder: 2,
							readonly: false
						}
					]
				};
			}


			/* TODO: check also server side logic
			function getConfigFromCustomzing() {
				// init with default config (if available)
				salesCommonItemNumberingConfigService.getDefaultBillItemNoConfigFromCustomizing().then(function (config) {
					if (config) {
						dataItem.startValue = config.Startval;
						dataItem.increment = config.Increment;
					}
				});
			}
			*/

			function getConfigByPrjFk(prjFk) {
				dataItem.projectFk = prjFk;
				$http.get(globals.webApiBaseUrl + 'sales/billing/itemnoconf/' + 'getbyprojectid?projectId=' + prjFk).then(function (response) {
					if (response.data !== '') {
						dataItem.startValue = response.data.Startval;
						dataItem.increment = response.data.Increment;
					}
				});
			}

			service.getCurrentConfigSync = function getCurrentConfigSync() {
				var mainService = $injector.get('salesBillingService');
				var selectedEntity = mainService.getSelected();
				getConfigByPrjFk(selectedEntity.ProjectFk);
				return dataItem;
			};

			service.showDialog = function showDialog() {
				var mainService = $injector.get('salesBillingService');
				var selectedEntity = mainService.getSelected();

				// TODO: remove dependency to specific wizard / common logic needs to be moved to a common service
				var context = $injector.get('salesCommonCodeChangeWizardService').getContext();

				// Check if entity is selected
				if ($injector.get('salesCommonCodeChangeWizardService').checkAssertions(selectedEntity, context)) {
					// First try from customizing
					// TODO: getConfigFromCustomzing();

					// Getting default configuration
					getConfigByPrjFk(selectedEntity.ProjectFk);

					var dialogSettings = {
						title: $translate.instant('sales.billing.itemNoConfigDlgTitle'),
						dataItem: dataItem,
						formConfiguration: getFormLayoutConfig(),
						handleOK: function handleOK(result) {

							var postData = {
								Id: 0,
								Startval: result.data.startValue,
								Increment: result.data.increment,
								ProjectFk: result.data.projectFk
							};

							// Server request
							$http.get(globals.webApiBaseUrl + 'sales/billing/itemnoconf/' + 'getbyprojectid?projectId=' + result.data.projectFk).then(function (response) {
								// if no any existing default config available
								if (response.data === '' || response.data === null) {
									$http.post(globals.webApiBaseUrl + 'sales/billing/itemnoconf/' + 'create', postData).then(function (resp) {
										if (!resp.data.withErrors) {
											// TODO: see 118117 comments from PM => disabling this message
											// $injector.get('platformSidebarWizardCommonTasksService').showSuccessfullyDoneMessage('sales.billing.createItemNoConfDlgTitle');
										} else {
											$injector.get('platformDialogService').showErrorBox(resp.data.errors, 'sales.billing.errorHeader');
										}
									});
								} else {
									// if default config is available then update the config
									postData.Id = response.data.Id;
									$http.post(globals.webApiBaseUrl + 'sales/billing/itemnoconf/' + 'update', postData).then(function (resp) {
										if (!resp.data.withErrors) {
											// TODO: see 118117 comments from PM => disabling this message
											// $injector.get('platformSidebarWizardCommonTasksService').showSuccessfullyDoneMessage('sales.billing.updateItemNoConfDlgTitle');
										} else {
											$injector.get('platformDialogService').showErrorBox(resp.data.errors, 'sales.billing.errorHeader');
										}
									});
								}
							});
						},
						dialogOptions: {
							disableOkButton: function () {
								return (
									dialogSettings.dataItem.runningValidation ||
									platformRuntimeDataService.hasError(dialogSettings.dataItem, 'startValue') ||
									_.isNil(dialogSettings.dataItem.startValue) ||
									(_.isString(dialogSettings.dataItem.startValue) && _.size(dialogSettings.dataItem.startValue) <= 0)
								);
							},
						},
					};

					platformTranslateService.translateFormConfig(dialogSettings.formConfiguration);
					platformModalFormConfigService.showDialog(dialogSettings);
				}
			};

			// dialog for customizing (item no config)
			// TODO: clean up / translation loading (from sales billing/common in context of customizing module)
			service.showItemNoConfigDialogForCustomize = function showItemNoConfigDialogForCustomize(configEntity) {
				// just for the item no config dialog in customizing we need the schema dto loaded
				$injector.get('platformSchemaService').getSchemas([{
					typeName: 'ItemNoConfDto',
					moduleSubModule: 'Sales.Billing'
				}]).then(function () {
					var configId = configEntity.ItemNumberingConfigurationFk;
					if (configId > 0) {
						salesCommonItemNumberingConfigService.getConfigById(configId).then(function (config) {
							$injector.get('platformDataProcessExtensionHistoryCreator').processItem(config);
							var modalDialogConfig = {
								title: $injector.get('$translate').instant('basics.customize.editItemNoConfig'),
								dataItem: config,
								formConfiguration: getLayoutForCustomizing(),
								dialogOptions: {
									disableOkButton: function disableOkButton() {
									}
								},
								handleOK: function handleOK(result) {
									var updatedConfig = result.data;
									$http.post(globals.webApiBaseUrl + 'sales/billing/itemnoconf/' + 'update', updatedConfig);
								},
								handleCancel: function handleCancel() {
								}
							};

							$injector.get('platformTranslateService').translateFormConfig(modalDialogConfig.formConfiguration);
							$injector.get('platformModalFormConfigService').showDialog(modalDialogConfig);
						});
					} else if (configId === 0) {
						$injector.get('platformModalService').showMsgBox('basics.customize.editItemNoConfigSavePrompt', 'cloud.common.informationDialogHeader', 'info');
					}
				});
			};

			return service;
		}
	]);
})();
