/**
 * Created by alm on 1/19/2021.
 */
(function (angular) {
	'use strict';
	/* global globals,_ */

	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName).factory('hsqeCheckListGroupService',
		['$timeout', '$http', '$injector', '$translate', 'platformDataServiceFactory', 'cloudCommonGridService',
			'platformGridAPI','platformModuleStateService','hsqeCheckListGroupFilterService',
			'basicsCommonMandatoryProcessor','platformModalService',
			function ($timeout, $http, $injector, $translate, platformDataServiceFactory,  cloudCommonGridService,
				platformGridAPI, platformModuleStateService,hsqeCheckListGroupFilterService,
				basicsCommonMandatoryProcessor, platformModalService) {

				var serviceContainer = null;
				var service;
				var groupServiceOptions = {
					hierarchicalRootItem: {
						module: moduleName+'.group',
						serviceName: 'hsqeCheckListTemplateGroupService',
						entityNameTranslationID: 'hsqe.checkListTemplate.groupGridContainerTitle',
						httpRead: {
							route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/group/',
							usePostForRead: true,
							endRead: 'tree',
							initReadData: function (readData) {
								var checklistTemplateService = $injector.get('hsqeCheckListTemplateHeaderService');
								if(checklistTemplateService.filterRequest){
									readData.PageSize = checklistTemplateService.filterRequest.PageSize;
									readData.PageNumber = checklistTemplateService.filterRequest.PageNumber;
									readData.Pattern = checklistTemplateService.filterRequest.Pattern;
									readData.PinningContext = [];
								}
							},
							extendSearchFilter: function (filterRequest) {
								filterRequest.ProjectContextId = null;
								filterRequest.PinningContext = [];
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/group/',
							usePostForRead: true,
							endCreate: 'createdto'
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/group/', endUpdate: 'update'},
						httpDelete: {
							route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/group/',
							usePostForRead: true,
							endDelete: 'deletedto'
						},
						entitySelection: {supportsMultiSelection: false},
						presenter: {
							tree: {
								parentProp: 'HsqCheckListGroupFk',
								childProp: 'HsqChecklistgroupChildren',
								incorporateDataRead: function (readData, data) {

									var filterIds = hsqeCheckListGroupFilterService.getFilter();
									var readItem = _.find(readData.dtos,function (item){return _.includes(filterIds, item.Id);});
									if(!readItem && filterIds.length > 0 && service.isSelectRow === false) {
										filterIds = null;
										hsqeCheckListGroupFilterService.removeFilter();
									}
									var multiSelect = false;
									if (data.usingContainer && data.usingContainer[0]) {
										var existGrid = platformGridAPI.grids.exist(data.usingContainer[0]);
										if (existGrid) {
											var columns = platformGridAPI.columns.getColumns(data.usingContainer[0]);
											var markerColumn = _.find(columns, {'field': 'IsMarked'});
											if (markerColumn && markerColumn.editorOptions) {
												multiSelect = markerColumn.editorOptions.multiSelect;
											}
										}
									}

									if (_.isArray(filterIds)) {
										var flatList = cloudCommonGridService.flatten(readData.dtos, [], 'HsqChecklistgroupChildren');
										var filterItem = _.filter(flatList, function (item) {
											return (multiSelect ? _.includes(filterIds, item.Id) : item.Id === filterIds[0]);
										});

										if (filterItem && _.isArray(filterItem) && filterItem[0]) {
											_.each(filterItem, function (item) {
												item.IsMarked = true;
											});
											if (serviceContainer !== null) {
												var grids = serviceContainer.data.usingContainer;
												_.each(grids, function (gridId) {
													if (gridId) {
														$timeout(function () {
															// expand the selected(filtered) item
															platformGridAPI.rows.scrollIntoViewByItem(gridId, filterItem[0]);
															service.setSelected(filterItem[0]);
														});
													}
												});
											}
										}
									}

									return data.handleReadSucceeded(readData, data);
								}
							}
						},
						dataProcessor: [
							{
								processItem: function (entity) {
									if (entity.HasChildren) {
										entity.image = 'ico-folder-assemblies';
									}
								}
							}
						],
						entityRole: {
							root: {
								codeField: 'Code',
								descField: 'DescriptionInfo.Translated',
								itemName: 'HsqCheckListGroup',
								moduleName: 'Check List Template Group',
								// lastObjectModuleName: moduleName,
								rootForModule: moduleName,
								useIdentification: true
							}
						},
						translation: {
							uid: 'hsqeCheckListGroupService',
							title: 'hsqe.checklisttemplate.groupGridContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'HsqChkListTemplateDto',
								moduleSubModule: 'Hsqe.CheckListTemplate'
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(groupServiceOptions);
				serviceContainer.data.isRoot = false;
				service = serviceContainer.service;

				serviceContainer.service.deleteItem = function deleteItem(entity) {
					if (entity.HasChildren === true) {
						platformModalService.showMsgBox('hsqe.checklisttemplate.deleteChildGroupMsg', 'hsqe.checklisttemplate.deleteGroupTitle', 'warning');
					} else {
						$http.get(globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/gettemplatebygroup?mainId=' + entity.Id).then(function (result) {
							if (result.data && result.data.length > 0) {
								platformModalService.showMsgBox('hsqe.checklisttemplate.deleteGroupMsg', 'hsqe.checklisttemplate.deleteGroupTitle', 'warning');
							} else {
								return serviceContainer.data.deleteItem(entity, serviceContainer.data);
							}
						});
					}
				};

				service.isSelectRow = false;
				service.onCellChange = function (arg) {
					service.isSelectRow = true;
					var columns = arg.grid.getColumns(), columnName = columns[arg.cell].field;
					var entities = this.getList(), flatList = cloudCommonGridService.flatten(entities, [], 'HsqChecklistgroupChildren');
					if (columnName === 'IsDefault') {
						this.setDefault(entities, flatList, arg.item);
					}

				};

				service.setDefault = function (entities, flatList, entity) {
					var otherDefaultItems = [];
					_.each(flatList, function (item) {
						if (item.IsDefault && item.Id !== entity.Id) {
							otherDefaultItems.push(item);
						}
					});
					if (entity.IsDefault) {
						_.each(otherDefaultItems, function (item) {
							item.IsDefault = false;
							service.markItemAsModified(item);
						});
						if (serviceContainer.data.selectedItem && serviceContainer.data.selectedItem.Id === entity.Id) {
							service.update();
						}
					} else {
						if (otherDefaultItems.length === 0) {
							entity.IsDefault = true;
						}
					}
					var modState = platformModuleStateService.state(service.getModule());
					if (modState && modState.modifications) {
						modState.modifications.HsqCheckListGroup = null;
						modState.modifications.EntitiesCount = 0;
					}
				};


				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'HsqChkListTemplateDto',
					moduleSubModule: 'Hsqe.CheckListTemplate',
					validationService: 'hsqeCheckListGroupValidationService',
					mustValidateFields: ['Code']
				});

				service.markersChanged = function (items) {
					var keyValues = [];
					if (_.isArray(items) && _.size(items) > 0) {
						_.each(items, function (item) {
							var groups = collectionChoiceGroupItems(item);
							keyValues = keyValues.concat(groups);
						});
					}
					hsqeCheckListGroupFilterService.setFilter(keyValues);
				};

				function collectionChoiceGroupItems(group) {
					var items = [];
					items.push(group.Id);
					if (group.HasChildren && group.HsqChecklistgroupChildren) {
						for (var i = 0; i < group.HsqChecklistgroupChildren.length; i++) {
							items = items.concat(collectionChoiceGroupItems(group.HsqChecklistgroupChildren[i]));
						}
					}

					return items;
				}

				hsqeCheckListGroupFilterService.onFilterModified.register(function () {
					var tobeFilterDataService = hsqeCheckListGroupFilterService.getTobeFilterService();
					if (tobeFilterDataService !== null && tobeFilterDataService.load) {
						tobeFilterDataService.load();
					}
				});


				service.clearSelectedItem = function(){
					serviceContainer.data.selectedItem = null;
				};

				serviceContainer.service.getData = function getData() {
					return serviceContainer.data;
				};

				return service;
			}]);
})(angular);
