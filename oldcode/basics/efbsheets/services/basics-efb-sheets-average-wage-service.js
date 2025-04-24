/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'basics.efbsheets';
	let serviceName = 'basicsEfbsheetsAverageWageService';
	/* global globals */

	/**
     * @ngdoc service
     * @name basicsEfbsheetsAverageWageService
     * @function
     *
     * @description
     * basicsEfbsheetsAverageWageMainService is the data service for EfbSheets WageGroup related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetsAverageWageService',
		['_', '$injector','$translate', 'platformDataServiceFactory','basicsEfbsheetsProjectMainService', 'basicsEfbsheetsMainService', 'basicsCommonMandatoryProcessor',
			function (_,$injector, $translate, platformDataServiceFactory,basicsEfbsheetsProjectMainService, basicsEfbsheetsMainService, basicsCommonMandatoryProcessor) {

				let canAverageWage = function canAverageWage() {
					let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
					if(selectedCrewMix){
						return true;
					}else{
						return false;
					}
				};

				let efbSheetsAverageWageServiceOption = {
					flatNodeItem: {
						module: moduleName,
						serviceName: serviceName,
						entityNameTranslationID: 'basics.efbsheets.averageWage',
						httpCreate: { route: globals.webApiBaseUrl + 'basics/efbsheets/averagewages/', endCreate: 'create' },
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/efbsheets/averagewages/',
							initReadData: function initReadData(readData) {
								let selectedItem = basicsEfbsheetsMainService.getSelected();
								readData.estCrewMixFk = selectedItem.Id;
							},
							usePostForRead: true
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/', endUpdate: 'update'},
						actions: { create: 'flat', canCreateCallBackFunc: canAverageWage,  delete: {}, canDeleteCallBackFunc: canAverageWage },
						entitySelection: {},
						setCellFocus:true,
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									let selectedItem = basicsEfbsheetsMainService.getSelected();
									let selectedAverageWageItem = serviceContainer.service.getSelected();
									if (selectedAverageWageItem && selectedAverageWageItem.Id > 0) {
										creationData.estCrewMixFk = selectedAverageWageItem.EstCrewMixFk;
									}
									else if (selectedItem && selectedItem.Id > 0) {
										creationData.estCrewMixFk = selectedItem.Id;
									}
								},
								handleCreateSucceeded : function(newData){
									return newData;
								}
							}
						},
						entityRole: { node: { itemName: 'EstAverageWage', moduleName: 'Crew Mixes',  parentService: basicsEfbsheetsMainService}},
						sidebarSearch: {
							options: {
								moduleName: moduleName,
								enhancedSearchEnabled: false,
								pattern: '',
								pageSize: 100,
								useCurrentClient: null,
								includeNonActiveItems: null,
								showOptions: false,
								showProjectContext: false,
							}
						},
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(efbSheetsAverageWageServiceOption);
				let service = serviceContainer.service;

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'EstAverageWageDto',
					moduleSubModule: 'Basics.EfbSheets',
					validationService: 'basicsEfbsheetsAverageWageValidationService'
				});

				service.hasToLoadOnSelectionChange = function hasToLoadOnSelectionChange(crewmix) {
					if(crewmix){
						serviceContainer.data.doNotLoadOnSelectionChange = false;
					}
				};

				let baseOnDeleteDone = serviceContainer.data.onDeleteDone;

				serviceContainer.data.onDeleteDone = function(deleteParams, data, response){
					baseOnDeleteDone(deleteParams, data, response); // remove the deleted item form list

					let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'AverageWage');
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF');
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN');

					basicsEfbsheetsMainService.markItemAsModified(selectedCrewMix);
					$injector.get('basicsEfbsheetsAverageWageDetailService').refreshData(selectedCrewMix,false);

					service.gridRefresh(); // Refresh UI to clear validation marks
				};

				return serviceContainer.service;
			}]);

})(angular);