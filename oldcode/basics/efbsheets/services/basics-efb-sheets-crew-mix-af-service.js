/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'basics.efbsheets';
	let serviceName = 'basicsEfbsheetsCrewMixAfService';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsCrewMixAfService
     * @function
     *
     * @description
     * basicsEfbsheetsCrewMixAfService is the data service for EfbSheets CrewMix AF related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetsCrewMixAfService',
		['_', '$http', '$injector', '$translate', 'platformDataServiceFactory','basicsEfbsheetsProjectMainService', 'basicsEfbsheetsMainService','basicsCommonMandatoryProcessor',
			function (_, $http, $injector, $translate, platformDataServiceFactory,basicsEfbsheetsProjectMainService, basicsEfbsheetsMainService,basicsCommonMandatoryProcessor) {

				let canCrewMixAf = function canCrewMixAf() {
					let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
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
								let selectedItem = basicsEfbsheetsMainService.getSelected();
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
									let selectedItem = basicsEfbsheetsMainService.getSelected();
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
						entityRole: { node: { itemName: 'EstCrewMixAf', moduleName: 'Crew Mixes',  parentService: basicsEfbsheetsMainService}},
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

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'EstCrewMixAfDto',
					moduleSubModule: 'Basics.EfbSheets',
					validationService: 'basicsEfbsheetsAfValidationService'
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
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF');
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN');

					basicsEfbsheetsMainService.markItemAsModified(selectedCrewMix);
					$injector.get('basicsEfbsheetCrewmixAfDetailService').refreshData(selectedCrewMix,false);

					service.gridRefresh(); // Refresh UI to clear validation marks
				};

				return serviceContainer.service;
			}]);

})(angular);