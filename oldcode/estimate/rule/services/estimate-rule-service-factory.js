/**
 * Created by joshi on 26.11.2015.
 */
(function (angular) {

	/* global globals */
	'use strict';

	let moduleName = 'estimate.rule';
	let estimateRuleModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateRuleServiceFactory
	 * @function
	 * @description
	 * estimateRuleServiceFactory  is the data service for project estimate rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	estimateRuleModule.factory('estimateRuleServiceFactory',
		['_', '$injector','estimateMainService', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'cloudCommonGridService',
			function (_, $injector,estimateMainService, platformDataServiceFactory, ServiceDataProcessArraysExtension, cloudCommonGridService) {
				let service = {};
				service.createNewPrjRuleService = function(options, parentService){

					let canCreateDelete = function canCreateDelete() {
						return false;
					};

					let getProjectId = function getProjectId(){
						let project = $injector.get('projectMainService').getSelected();
						if (project && project.Id > 0){
							return project.Id;
						}
						else {
							let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
							let item = cloudDesktopPinningContextService.getPinningItem('project.main');
							if (item) {
								return item.id;
							} else {
								return estimateMainService.getSelectedProjectId();
							}
						}
					};

					let estimateRulePrjEstRuleServiceOption = {
						hierarchicalNodeItem: {
							module: options.moduleName,
							serviceName: options.serviceName,
							httpCreate: { route: globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/', endCreate: 'createitem' },

							httpRead: {
								route: globals.webApiBaseUrl + options.readRoute,
								endRead: options.endRead,
								initReadData: function initReadData(readData) {
									readData.projectFk = (parentService.getSelectedProjectId && parentService.getSelectedProjectId>0) ? parentService.getSelectedProjectId() : getProjectId();
								},
								usePostForRead: true
							},
							httpUpdate: options.httpUpdate,
							actions: {
								create: 'hierarchical',
								canCreateCallBackFunc: options && options.canCreate ? options.canCreate :canCreateDelete,
								canCreateChildCallBackFunc: options && options.canCreateChild ? options.canCreateChild : canCreateDelete,
								delete: {},
								canDeleteCallBackFunc:  options && options.canDelete ? options.canDelete : canCreateDelete },
							entitySelection: {},
							presenter: {
								tree: {
									parentProp:  options.parentProp ,
									childProp: options.childProp ,
									childSort : true,
									isInitialSorted:true, sortOptions: {initialSortColumn: {field: 'Sorting', id: 'sorting'}, isAsc: true},

									initCreationData: function initCreationData(creationData) {
										let seletcedItem = service.getSelected();
										creationData.projectFk = parentService.getSelectedProjectId ? parentService.getSelectedProjectId() : parentService.getIfSelectedIdElse(null);
										creationData.parentId = creationData.parentId && seletcedItem ? seletcedItem.MainId : null;
										creationData.lastCode = seletcedItem && seletcedItem.Version === 0 ? seletcedItem.Code : '';
									},
									incorporateDataRead: function incorporateDataRead(readItems, data) {
										let result = {};
										if(options.incorporateDataRead){
											result = options.incorporateDataRead(readItems,data);
										}else{
											result = readItems;
										}
										result.sort(function(a,b){return a.Sorting - b.Sorting;});
										return serviceContainer.data.handleReadSucceeded(result, data);
									},
									handleCreateSucceeded: function handleCreateSucceeded(item) {
										if(options.handleCreateSucceeded){
											// change id and add mainid
											item.MainId = angular.copy(item.Id);
											let selectedPrj = parentService.getSelected();
											if(selectedPrj && selectedPrj.Id){
												item.BasRubricCategoryFk = selectedPrj.RubricCategoryFk;
											}
											let items = service.getList();
											let lastId = 0;
											if(items && items.length){
												cloudCommonGridService.sortList(items, 'Id');// check for sorting order ..as per sorting field
												lastId = items[items.length-1].Id;
											}
											item.Id = ++lastId;
										}
									}
								}
							},

							dataProcessor: [new ServiceDataProcessArraysExtension([options.childProp])],
							entityRole: {
								node:
								{
									descField: 'DescriptionInfo',
									itemName: 'PrjEstRule',
									moduleName: options.moduleName,
									parentService: parentService,
									handleUpdateDone: function (updateData, response, data) {

										data.handleOnUpdateSucceeded(updateData, response, data, true);
										serviceContainer.service.onUpdated.fire();
									}
								}
							},
							translation: {
								uid: options.serviceName,
								title: 'estimate.rule.estimateRule',
								columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo', maxLength : 255}],
								dtoScheme: {
									typeName: 'PrjEstRuleDto',
									moduleSubModule: options.moduleName
								}
							},
						}
					};

					if(options.dataProcessor){
						angular.extend(estimateRulePrjEstRuleServiceOption.hierarchicalNodeItem.dataProcessor[0], options.dataProcessor);
					}

					if(options.entityRole){
						estimateRulePrjEstRuleServiceOption.hierarchicalNodeItem.entityRole = options.entityRole;
					}

					let serviceContainer = platformDataServiceFactory.createNewComplete(estimateRulePrjEstRuleServiceOption);
					let service = serviceContainer.service;

					service.findItemToMerge = function findItemToMerge(updateItem) {
						updateItem.MainId = angular.copy(updateItem.Id);
						let oldItem = _.find(serviceContainer.data.itemList, {MainId: updateItem.Id});
						if(oldItem){
							updateItem.Id = angular.copy(oldItem.Id);
						}else{
							updateItem.Id = 1;
						}
						return oldItem;
					};

					return serviceContainer;
				};

				return service;
			}]);
})(angular);
