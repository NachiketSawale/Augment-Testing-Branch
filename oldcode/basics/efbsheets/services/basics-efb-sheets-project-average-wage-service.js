/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	
	let moduleName = 'basics.efbsheets';
	let serviceName = 'basicsEfbsheetsProjectAverageWageService';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsProjectAverageWageService
     * @function
     *
     * @description
     * basicsEfbsheetsProjectAverageWageService is the data service for EfbSheets project WageGroup related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetsProjectAverageWageService',
		['_','$q', '$http', '$injector', '$translate', 'platformDataServiceFactory', 'basicsEfbsheetsProjectMainService','basicsCommonMandatoryProcessor',
			function (_, $q,$http, $injector, $translate, platformDataServiceFactory, basicsEfbsheetsProjectMainService,basicsCommonMandatoryProcessor) {

				let canAverageWage = function canAverageWage() {
					let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
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
								let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
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
									let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
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
						entityRole: { node: { itemName: 'EstAverageWage', moduleName: 'Crew Mixes',  parentService: basicsEfbsheetsProjectMainService}},
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

				serviceContainer.data.usesCache = false;

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
					let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
					basicsEfbsheetsProjectMainService.markItemAsModified(selectedCrewMix);
					service.gridRefresh(); // Refresh UI to clear validation marks
				};

				serviceContainer.data.onDeleteDone = function(deleteParams, data, response){
					baseOnDeleteDone(deleteParams, data, response); // remove the deleted item form list

					let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'AverageWage');
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF');
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN');

					basicsEfbsheetsProjectMainService.markItemAsModified(selectedCrewMix);
					$injector.get('basicsEfbsheetsAverageWageDetailService').refreshData(selectedCrewMix,true);

					service.gridRefresh(); // Refresh UI to clear validation marks
				};

				return serviceContainer.service;
			}]);

})(angular);