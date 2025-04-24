/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'basics.efbsheets';
	let serviceName = 'basicsEfbsheetsProjectCrewMixAfService';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsProjectCrewMixAfService
     * @function
     *
     * @description
     * basicsEfbsheetsProjectCrewMixAfService is the data service for EfbSheets Project CrewMix AF related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetsProjectCrewMixAfService',
		['_', '$http', '$injector', '$translate', 'platformDataServiceFactory', 'basicsEfbsheetsProjectMainService','basicsCommonMandatoryProcessor',
			function (_, $http, $injector, $translate, platformDataServiceFactory, basicsEfbsheetsProjectMainService,basicsCommonMandatoryProcessor) {

				let canCrewMixAf = function canCrewMixAf() {
					let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
					if(selectedCrewMix){
						return true;
					}else{
						return false;
					}
				};

				let efbSheetsCrewMixAfService = {
					flatNodeItem: {
						module: moduleName,
						serviceName: serviceName,
						entityNameTranslationID: 'basics.efbsheets.crewmixesaf',
						httpCreate: { route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixaf/', endCreate: 'create' },
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixaf/',
							initReadData: function initReadData(readData) {
								let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
								readData.estCrewMixFk = selectedItem.Id;
							},
							usePostForRead: true
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/', endUpdate: 'update'},
						actions: { create: 'flat', canCreateCallBackFunc: canCrewMixAf,  delete: {}, canDeleteCallBackFunc: canCrewMixAf },
						entitySelection: {},
						setCellFocus:true,
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
									let selectedCrewmixAfItem = serviceContainer.service.getSelected();
									if (selectedCrewmixAfItem && selectedCrewmixAfItem.Id > 0) {
										creationData.estCrewMixFk = selectedCrewmixAfItem.EstCrewMixFk;
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
						entityRole: { node: { itemName: 'EstCrewMixAf', moduleName: 'Crew Mixes',  parentService: basicsEfbsheetsProjectMainService}},
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
								withExecutionHints: true
							}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(efbSheetsCrewMixAfService);
				let service = serviceContainer.service;

				serviceContainer.data.usesCache = false;

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'EstCrewMixAfDto',
					moduleSubModule: 'Basics.EfbSheets',
					validationService: 'basicsEfbsheetsValidationService'
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
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF');
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN');

					basicsEfbsheetsProjectMainService.markItemAsModified(selectedCrewMix);
					$injector.get('basicsEfbsheetCrewmixAfDetailService').refreshData(selectedCrewMix,true);

					service.gridRefresh(); // Refresh UI to clear validation marks
				};

				return serviceContainer.service;
			}]);

})(angular);