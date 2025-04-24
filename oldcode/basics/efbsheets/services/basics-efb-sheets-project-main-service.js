/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	/* global globals */

	let moduleName = 'basics.efbsheets';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsProjectMainService
     * @function
     *
     * @description
     * basicsEfbsheetsProjectMainService is the data service for all Efb Sheets project crewmixes related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsEfbsheetsProjectMainService', ['_', '$injector','projectMainService','PlatformMessenger','platformDataServiceFactory', 'platformModalService',
		'basicsCommonMandatoryProcessor',
		function (_,$injector, projectMainService,PlatformMessenger,platformDataServiceFactory, platformModalService,
			basicsCommonMandatoryProcessor) {

			let canProjectCrewMix = function canAverageWage() {
				let selectedProject = projectMainService.getSelected();
				if(selectedProject){
					return true;
				}else{
					return false;
				}
			};

			let efbSheetProjectMainServiceOptions = {
				flatNodeItem: {
					module: moduleName,
					serviceName: 'basicsEfbsheetsProjectMainService',
					entityNameTranslationID: 'basics.efbsheets.crewMixes',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/', endCreate: 'create' },
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/',
						endRead : 'listbyproject',
						initReadData: function initReadData(readData) {
							let selectedProjectItem = projectMainService.getSelected();
							$injector.get('basicsEfbsheetsProjectCrewMixCostCodeService').resetDataList();
							readData.ProjectFk = selectedProjectItem.Id;
							$injector.get('estimateMainLookupService').clearCache();
							$injector.get('estimateMainLookupService').setSelectedProjectId(selectedProjectItem.Id);
							$injector.get('estimateMainLookupService').getPrjCostCodesTree().then( function(response) {
								var list =[];
								$injector.get('cloudCommonGridService').flatten(response, list, 'ProjectCostCodes');
								$injector.get('basicsLookupdataLookupDescriptorService').updateData('estprjcostcodes', list);
							});							
						},
						usePostForRead: true
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'project/main/', endUpdate: 'update'},
					httpDelete: {route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/', endUpdate: 'delete'},
					actions: { create: 'flat', canCreateCallBackFunc: canProjectCrewMix,  delete: {}, canDeleteCallBackFunc: canProjectCrewMix },
					entitySelection: {},
					setCellFocus:true,
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedProjectItem = projectMainService.getSelected();
								if (selectedProjectItem && selectedProjectItem.Id > 0) {
									creationData.projectFk = selectedProjectItem.Id;
								}
							},
							handleCreateSucceeded : function(newData){
								return newData;
							}
						}
					},
					entityRole: { node: { itemName: 'EstCrewMix', moduleName: 'Crew Mixes',  parentService: projectMainService}},
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

			let serviceContainer = platformDataServiceFactory.createNewComplete(efbSheetProjectMainServiceOptions);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'EstCrewMixDto',
				moduleSubModule: 'Basics.EfbSheets',
				validationService: 'basicsEfbsheetsValidationService'
			});

			let service = serviceContainer.service;

			service.isEnableTools = function isEnableTools(){
				let selectedProjectItem = projectMainService.getSelected();
				if(selectedProjectItem){
					return true;
				}else{
					return false;
				}
			};

			service.copyMasterCrewMix = function copyMasterCrewMix(){
				let selectedProjectItem = projectMainService.getSelected();
				if(selectedProjectItem){
					$injector.get('basicsEfbsheetsCopyMasterCrewMixService').showMasterCrewMixDialog(selectedProjectItem);
				}
			};

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			service.addList = function addList(data) {
				let list = serviceContainer.data.itemList;
				let containerData = serviceContainer.data;
				let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

				if (data && data.length) {
					angular.forEach(data, function (d) {
						let item = _.find(list, {Id: d.Id});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							serviceContainer.data.itemList.push(d);
						}
					});
					angular.forEach(list, function (li) {
						platformDataServiceDataProcessorExtension.doProcessItem(li, containerData);
					});
				}
			}

			return service;
		}]);

})(angular);