/* global  globals */
(function (angular) {
	'use strict';
	let qtoMainModule = angular.module('qto.main');

	// jshint -W072
	qtoMainModule.factory('qtoMainHeaderProjectDataService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
			'platformRuntimeDataService', 'ServiceDataProcessDatesExtension', 'platformContextService', 'PlatformMessenger',
			'basicsCommonCreateDialogConfigService', 'qtoHeaderReadOnlyProcessor', '$q', '$injector', '$http', 'cloudDesktopSidebarService',
			'$translate', 'qtoMainHeaderCreateDialogDataService', 'cloudDesktopInfoService', 'platformModalService', 'projectMainService',
			function (platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
				basicsLookupdataLookupFilterService, runtimeDataService, DatesProcessor,
				platformContextService, PlatformMessenger, createDialogConfigService, readOnlyProcessor,
				$q, $injector, $http, cloudDesktopSidebarService, $translate, qtoMainHeaderCreateDialogDataService, cloudDesktopInfoService, platformModalService, projectMainService
			) {

				let service = {};
				let serviceContainer = {};

				let qtoMainHeaderServiceOptions = {
					flatRootItem: {
						module: qtoMainModule,
						serviceName: 'qtoMainHeaderProjectDataService',
						entityNameTranslationID: 'qto.main.tab.header',
						httpCreate: {route: globals.webApiBaseUrl + 'qto/main/header/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'qto/main/header/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.ProjectId = projectMainService.getSelected().Id;
								readData.IsFilterVersionQto = service.getFilterVersion();
							}
						},
						dataProcessor: [
							readOnlyProcessor, new DatesProcessor(['QtoDate', 'PerformedFrom', 'PerformedTo'])
						],
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.Value = projectMainService.getSelected().Id;
								},
								incorporateDataRead: function (readData, data) {
									angular.forEach(readData.Main, function (item) {
										service.updateReadOnly(item, 'PrcBoqFk', item.PrcBoqFk);
										service.updateReadOnly(item, 'QtoTargetType', item.QtoTargetType);
										service.updateReadOnly(item, 'ContractCode', item.ContractCode);
										service.updateReadOnly(item, 'PrcStructureFk', item.PrcStructureFk);
										service.updateReadOnly(item, 'ProjectFk', item.ProjectFk);
										service.updateReadOnly(item, 'BasGoniometerTypeFk', item.BasGoniometerTypeFk);
									});

									return serviceContainer.data.handleReadSucceeded(readData, data);
								},
								handleCreateSucceeded: function (newData) {
									service.updateReadOnly(newData, 'PrcBoqFk', newData.PrcBoqFk);
									service.updateReadOnly(newData, 'QtoTargetType', newData.QtoTargetType);
									service.updateReadOnly(newData, 'IsWQ', !(newData.QtoTargetType === 3 || newData.QtoTargetType === 4));
									service.updateReadOnly(newData, 'IsAQ', !(newData.QtoTargetType === 3 || newData.QtoTargetType === 4));
									service.updateReadOnly(newData, 'IsBQ', !(newData.QtoTargetType === 1 || newData.QtoTargetType === 2));
									service.updateReadOnly(newData, 'IsIQ', !(newData.QtoTargetType === 1 || newData.QtoTargetType === 2));
									return newData;
								}
							}
						},
						entityRole: {
							leaf: {
								codeField: 'DescriptionInfo.Translated',
								itemName: 'QtoHeader',
								moduleName: 'cloud.desktop.moduleDisplayNameQTO',
								parentService: projectMainService
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(qtoMainHeaderServiceOptions);

				service = serviceContainer.service;

				service.getCellEditable = function getCellEditable(item, model) {
					let editable = true;
					if (model === 'PackageFk' && (!item.ProjectFk || item.ConHeaderFk)) {
						editable = false;
					} else if (model === 'Package2HeaderFK' && !item.PackageFk) {
						editable = false;
					} else if (model === 'PrcBoqFk' && !item.Package2HeaderFK) {
						editable = false;
					} else if (model === 'BasRubricCategoryFk') {
						editable = false;
					} else if (model === 'BasGoniometerTypeFk') {
						editable = !item.hasQtoDetal;
					} else if (model === 'QtoTypeFk') {
						editable = false;
					} else if (model === 'QtoTargetType') {
						editable = false;
					} else if (model === 'ProjectFk') {
						editable = false;
					}

					return editable;
				};
				service.updateReadOnly = function (item, model) {
					let editable = service.getCellEditable(item, model);
					runtimeDataService.readonly(item, [
						{field: model, readonly: !editable}
					]);
				};

				service.createItem = function createItem() {
					$http.get(globals.webApiBaseUrl + 'qto/main/header/preparedatabeforecreateqtoheader')
						.then(function (response) {
							if (response && response.data) {
								qtoMainHeaderCreateDialogDataService.setIsGeneratedState(response.data.HasCodeGenerated);

								if (response && response.data && response.data.DefaultQtoPurposeType) {
									qtoMainHeaderCreateDialogDataService.setDefaultQtoPurposeTypeId(response.data.DefaultQtoPurposeType.Id);
								}

								if (response.data.QtoTypeFk > 0) {
									qtoMainHeaderCreateDialogDataService.setQtoTypeInfo(response.data.QtoTypeFk, response.data.BasRubricCategoryFk, response.data.BasGoniometerTypeFk);
								}
							}

							qtoMainHeaderCreateDialogDataService.showDialog(serviceContainer.data,projectMainService.getSelected().Id);
						});
				};

				service.getGoniometer = function (item) {
					if (item && item.QtoTypeFk) {
						$http.get(globals.webApiBaseUrl + 'qto/main/header/getGoniometer?QtoTypeFk=' + item.QtoTypeFk).then(function (response) {
							if (response && response.data) {
								item.BasGoniometerTypeFk = response.data;
								service.gridRefresh();
							}
						});
					}
				};

				service.setFilterVersion = function (value){
					service.isFilterVersion = value;
				};

				service.getFilterVersion = function (){
					return service.isFilterVersion;
				};

				return serviceContainer.service;
			}]);
})(angular);