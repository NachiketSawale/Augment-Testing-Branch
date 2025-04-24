/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateAssembliesModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainCopySourceAssembliesLookupService
	 * @function
	 *
	 * @description
	 * estimateMainCopySourceAssembliesLookupService is the data service for all assemblies related functionality of Copy Source Assemblies Container.
	 */
	angular.module(moduleName).factory('estimateMainCopySourceAssembliesLookupService',
		['$injector', 'platformDataServiceFactory', 'platformPermissionService', 'permissions', 'estimateMainCopySourceProcessService', 'mainViewService', 'estimateMainAssemblycatTemplateService',
			function ($injector, platformDataServiceFactory, platformPermissionService, permissions, estimateMainCopySourceProcessService, mainViewService, estimateMainAssemblycatTemplateService) {

				let selectedAssemblyCatagoryId = null,
					searchText = '',
					pageSize = 200;

				function initReadData(filterRequest){
					let selectedAssemblyCat = estimateMainAssemblycatTemplateService.getItemById(selectedAssemblyCatagoryId);
					estimateMainAssemblycatTemplateService.setSelected(selectedAssemblyCat);

					let categoryIds =  estimateMainAssemblycatTemplateService.getAssemblyCategoryIds().join(',');
					filterRequest.itemsPerPage = pageSize;
					filterRequest.filterByCatStructure = categoryIds;
					filterRequest.SearchValue = searchText;

					if (mainViewService.getCurrentModuleName() === moduleName) {
						filterRequest.ProjectId = $injector.get('estimateMainService').getSelectedProjectId();
					}
					else if (mainViewService.getCurrentModuleName() === 'project.main'){
						filterRequest.ProjectId = $injector.get('projectMainService').getSelected().Id;
					}
					else{
						filterRequest.ProjectId = null;
					}

					return filterRequest;
				}

				// The instance of the main service - to be filled with functionality below
				let estimateMainAssembliesServiceOptions = {
					flatRootItem: {
						module: estimateAssembliesModule,
						serviceName: 'estimateMainCopySourceAssembliesLookupService',
						entityNameTranslationID: 'estimate.assemblies.containers.assemblies',
						httpRead: {
							initReadData: initReadData,
							route: globals.webApiBaseUrl + 'estimate/assemblies/',
							endRead: 'getsearchlist',
							usePostForRead: true,
						},
						entityRole: {
							root: {
								codeField: 'Code',
								descField: 'Description',
								itemName: 'EstCopySourceAssemblies',
								moduleName: 'cloud.desktop.moduleDisplayNameEstimate'
							}
						},
						entitySelection: {supportsMultiSelection: true},
						useItemFilter: true,
						dataProcessor: [estimateMainCopySourceProcessService],
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									let estResourceTypeLookupService = $injector.get('estimateMainResourceTypeLookupService');
									if(estResourceTypeLookupService){
										estResourceTypeLookupService.loadLookupData();
									}

									$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
										basicsCostGroupAssignmentService.process(readData, service, {
											mainDataName: 'dtos',
											attachDataName: 'Assembly2CostGroups',
											dataLookupType: 'Assembly2CostGroups',
											identityGetter: function identityGetter(entity){
												return {
													EstHeaderFk: entity.RootItemId,
													Id: entity.MainItemId
												};
											}
										});
									}]);

									$injector.get('estimateMainResourceAssemblyLookupService').clear();

									$injector.get('estimateAssembliesRuleFormatterService')
										.loadRuleRelationsAsync( readData.dtos, 'estimateMainCopySourceAssembliesLookupService', 'estimateAssembliesMdcRuleRelationService')
										.then(function() {
											let result = serviceContainer.data.handleReadSucceeded(readData.dtos, data);
											return result;
										});

									// return serviceContainer.data.handleReadSucceeded(readData.dtos, data);
								},

								// add the rules information for new created items
								handleCreateSucceeded: function (newItem) {

									newItem.Rule = [];
									newItem.RuleRelationServiceNames = {
										m: 'estimateAssembliesService',
										r: 'estimateAssembliesMdcRuleRelationService',
										mainEntityIsNew: true
									};

									// create the cost group reference to the lineitem
									let costGroupsStructureMainDataServiceFactory = $injector.get('costGroupsStructureMainDataServiceFactory');
									let costGroupsStructureMainDataService =costGroupsStructureMainDataServiceFactory.getService();
									if(costGroupsStructureMainDataService && costGroupsStructureMainDataService.assignCostGrpSturcutre2LineItem) {
										costGroupsStructureMainDataService.assignCostGrpSturcutre2LineItem(newItem);
									}
									return newItem;
								}
							}
						},
						translation: {
							uid: 'estimateMainCopySourceAssembliesLookupService',
							title: 'estimate.assemblies.containers.assemblies',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
						}
					}
				};

				/* jshint -W003 */
				let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainAssembliesServiceOptions);

				let service = serviceContainer.service;

				// Set container UUID of the container related to this service instance
				// service.setContainerUUID('78461ce0d4eb4666bcf04886fccd80fb');
				//
				// // This service is supposed to be readonly
				// service.setReadOnly(true);
				serviceContainer.data.updateOnSelectionChanging = null; // Avoid triggering update for this service

				serviceContainer.data.isRoot = false; // Avoid resetting object permission by selection change for this service

				serviceContainer.data.updateOnSelectionChanging = null; // Avoid triggering update for this service

				serviceContainer.data.isRoot = false; // Avoid resetting object permission by selection change for this service

				serviceContainer.data.containerUUID = serviceContainer.data.gridId = service.gridId = '35b7329abce3483abaffd5a437c392dc';

				service.loadSourceAssemblies = function (filter) {
					if(!filter){
						serviceContainer.data.itemList = [];
						serviceContainer.data.listLoaded.fire();
					}else{
						selectedAssemblyCatagoryId = filter.AssemblyCategoryId;
						searchText = filter.SearchText;
						pageSize = filter.Records;
						service.load();
					}
				};

				return service;

			}]);
})();
