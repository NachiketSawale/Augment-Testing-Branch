/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).factory('controllingConfigVersionCompareDetailDialogDataService',
		['_', 'platformDataServiceFactory','$translate', '$http', 'controllingConfigColumnFormulaLookupService',
			function (_, platformDataServiceFactory, $translate, $http, controllingConfigColumnFormulaLookupService) {
				let serviceOptions = {
					flatRootItem: {
						module: moduleName,
						serviceName: 'controllingConfigVersionCompareDetailDialogDataService',
						entityNameTranslationID: 'controlling.configuration.versionCompareTitle',
						httpRead: {
							route: globals.webApiBaseUrl + 'controlling/configuration/versioncompdetail/',
							endRead: 'getlist',
							initReadData: function (readData) {
								if(currentCompareHeader) {
									readData.filter = '?mdcContrCompareHeaderId='+ currentCompareHeader.Id;
								}else{
									readData.filter = '?mdcContrCompareHeaderId=0';
								}
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'controlling/configuration/versioncompdetail/', endCreate: 'create'
						},
						presenter: {
							list: {
								incorporateDataRead:function (readData, data) {
									return data.handleReadSucceeded(readData && readData.dtos ? readData.dtos : [], data);
								}
							}
						},
						entityRole: {
							root: {
								itemName: 'MdcContrVersionCompareDetail',
								moduleName: 'controlling.configuration.versionCompareTitle',
								mainItemName: 'controllingConfigurationVersionCompareDetailConfig',
								descField: 'Description.Translated'
							}
						},
						entitySelection: {supportsMultiSelection: true},
						actions: {
							delete: true,
							create: 'flat',
							canDeleteCallBackFunc: function () {
								if(service && service.getSelectedEntities){
									let selectedItems = service.getSelectedEntities();

									return selectedItems && selectedItems.length > 0;
								}
							}
						},
						dataProcessor: [
							{
								processItem: function (entity) {
									if(entity.MdcContrColumnPropdefFk){
										entity.ReferenceColumn = controllingConfigColumnFormulaLookupService.getColumnId(entity.MdcContrColumnPropdefFk);
									}
									if(entity.MdcContrFormulaPropdefFk){
										entity.ReferenceColumn = controllingConfigColumnFormulaLookupService.getFormulaId(entity.MdcContrFormulaPropdefFk);
									}
									if(service.readonly){
										entity.__rt$data = entity.__rt$data || {};
										entity.__rt$data.entityReadonly = true;
									}
								}
							}
						],
						translation: {
							uid: 'controllingConfigVersionCompareDetailDialogDataService',
							title: 'controlling.configuration.versionCompareTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'Description'}],
							dtoScheme: {
								typeName: 'MdcContrCompareConfDetailDto',
								moduleSubModule: 'Controlling.Configuration'
							}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				let service = serviceContainer.service;
				serviceContainer.data.updateOnSelectionChanging = null;
				serviceContainer.data.doUpdate = null;
				service.markItemAsModified = null;

				service.loadData = function loadData(){
					minId = -1;
					return service.load();
				};

				service.markItemAsModified = function (){};

				let currentCompareHeader = null;
				service.setCurrentCompareHeader = function (header){
					currentCompareHeader = header;
				};

				let minId = -1;
				let originlaObj = {
					Id: 0,
					ReferenceColumn: null,
					DescriptionAInfo: {Description: null, Translated: null},
					DescriptionBInfo: {Description: null, Translated: null},
					DescriptionDiffInfo: {Description: null, Translated: null},
					LabelAFormat: null,
					LabelBFormat: null,
					LabelDiffFormat: null,
					MdcContrCompareConfigFk:0,
					__rt$data: {
						errors: {
							ReferenceColumn: {error: generateEmptyRefColumnError()}
						}
					}
				};

				function generateEmptyRefColumnError(){
					return $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('controlling.configuration.referenceColumn')});
				}

				service.hasAnyError = function (){
					let list = service.getList();
					let anyEmptyOrErrorCu = false;
					_.forEach(list, function (item){
						anyEmptyOrErrorCu = (anyEmptyOrErrorCu)
							|| (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.ReferenceColumn && item.__rt$data.errors.ReferenceColumn.error)
							|| !! _.find(list, i => { return i.ReferenceColumn === item.ReferenceColumn && i.Id !== item.Id })
					});

					return anyEmptyOrErrorCu;
				};

				service.createItem = function createItem(){
					let newItem = angular.copy(originlaObj);
					newItem.Id = minId--;
					newItem.MdcContrCompareConfigFk = currentCompareHeader.Id;

					let list = service.getList();
					let newList = [];
					_.forEach(list, function (item){newList.push(angular.copy(item));});
					newList.push(newItem);

					let data = serviceContainer.data;
					serviceContainer.data.handleReadSucceeded(newList, data);
					service.setSelected(newItem);
				};

				service.deleteItem = function (){
					let selectedIds = _.map(service.getSelectedEntities(), 'Id');

					let list = service.getList();

					let newList = [];
					_.forEach(list, function (item){
						selectedIds.indexOf(item.Id) < 0  && newList.push(angular.copy(item));
					});


					let data = serviceContainer.data;
					serviceContainer.data.handleReadSucceeded(newList, data);
					if(newList.length > 0){
						service.setSelected(newList[newList.length - 1]);
					}
				};

				service.saveEntities = function saveEntities(){
					let list = service.getList();
					if(list && list.length) {
						return $http.post(globals.webApiBaseUrl + 'controlling/configuration/versioncompdetail/updatedatas', list);
					}else{
						return $http.post(globals.webApiBaseUrl + 'controlling/configuration/versioncompdetail/deleteallbyheader', currentCompareHeader);
					}
				};

				service.readonly = false;

				return service;
			}]);
})(angular);