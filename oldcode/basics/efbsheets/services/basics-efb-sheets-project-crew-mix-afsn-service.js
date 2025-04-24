/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	
	let moduleName = 'basics.efbsheets';
	let serviceName = 'basicsEfbsheetsProjectCrewMixAfsnService';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsProjectCrewMixAfsnService
     * @function
     *
     * @description
     * basicsEfbsheetsProjectCrewMixAfsnService is the data service for EfbSheets CrewMix AF related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetsProjectCrewMixAfsnService',
		['_', '$http', '$injector', '$translate', 'platformDataServiceFactory', 'basicsEfbsheetsProjectMainService','basicsCommonMandatoryProcessor',
			function (_, $http, $injector, $translate, platformDataServiceFactory, basicsEfbsheetsProjectMainService,basicsCommonMandatoryProcessor) {

				let canCrewMixAfsn = function canCrewMixAfsn() {
					let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
					if(selectedCrewMix){
						return true;
					}else{
						return false;
					}
				};

				let efbSheetsCrewMixAfsnService = {
					flatNodeItem: {
						module: moduleName,
						serviceName: serviceName,
						entityNameTranslationID: 'basics.efbsheets.crewmixesafsn',
						httpCreate: { route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixafsn/', endCreate: 'create' },
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixafsn/',
							initReadData: function initReadData(readData) {
								let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
								readData.estCrewMixFk = selectedItem.Id;
							},
							usePostForRead: true
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/', endUpdate: 'update'},
						actions: { create: 'flat', canCreateCallBackFunc: canCrewMixAfsn,  delete: {}, canDeleteCallBackFunc: canCrewMixAfsn },
						entitySelection: {},
						setCellFocus:true,
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
									let selectedCrewmixAfsnItem = serviceContainer.service.getSelected();
									if (selectedCrewmixAfsnItem && selectedCrewmixAfsnItem.Id > 0) {
										creationData.estCrewMixFk = selectedCrewmixAfsnItem.EstCrewMixFk;
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
						entityRole: { node: { itemName: 'EstCrewMixAfsn', moduleName: 'Crew Mixes',  parentService: basicsEfbsheetsProjectMainService}},
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

				let serviceContainer = platformDataServiceFactory.createNewComplete(efbSheetsCrewMixAfsnService);
				let service = serviceContainer.service;

				serviceContainer.data.usesCache = false;
				
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'EstCrewMixAfsnDto',
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
					$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN');

					basicsEfbsheetsProjectMainService.markItemAsModified(selectedCrewMix);
					$injector.get('basicsEfbsheetCrewmixAfsnDetailService').refreshData(selectedCrewMix,true);

					service.gridRefresh(); // Refresh UI to clear validation marks
				};


				return serviceContainer.service;
			}]);

})(angular);