/**
 * Created by wed on 6/19/2017.
 */
(function (angular) {
	'use strict';
	/* global globals,_ */

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterGroupService',
		['$timeout', 'platformDataServiceFactory', 'constructionSystemMasterGroupFilterService', 'cloudCommonGridService', 'platformGridAPI','platformModuleStateService','basicsCommonMandatoryProcessor',
			'constructionSystemMainInstanceService','constructionSystemCommonContextService',
			function ($timeout, platformDataServiceFactory, constructionSystemMasterGroupFilterService, cloudCommonGridService, platformGridAPI, platformModuleStateService,basicsCommonMandatoryProcessor,
				constructionSystemMainInstanceService,constructionSystemCommonContextService) {

				var serviceContainer = null;
				var service;
				var groupServiceOptions = {
					hierarchicalRootItem: {
						module: moduleName+'.group',
						serviceName: 'constructionSystemMasterGroupService',
						entityNameTranslationID: 'constructionsystem.master.groupGridContainerTitle',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/master/group/',
							usePostForRead: true
						},
						presenter: {
							tree: {
								parentProp: 'CosGroupFk',
								childProp: 'GroupChildren',
								incorporateDataRead: function (readData, data) {
									// expand the filter item and make it selected
									var filterIds = constructionSystemMasterGroupFilterService.getFilter();
									var multiSelect = false;// default single mode
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
										var flatList = cloudCommonGridService.flatten(readData.dtos, [], 'GroupChildren');
										var filterItem = _.filter(flatList, function (item) {
											return (multiSelect ? _.includes(filterIds, item.Id) : item.Id === filterIds[0]);
										});

										if (filterItem && _.isArray(filterItem) && filterItem[0]) {
											// IsMarked used by the UI config service as filter field
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
									var mainService = constructionSystemCommonContextService.getMainService();
									var mainServiceName = mainService ? mainService.getServiceName() : '';
									if(mainServiceName === 'constructionSystemMainInstanceService'){
										$timeout(function () {
											constructionSystemMainInstanceService.onContextUpdated.fire();
										}, 0, false);
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
								codeField: 'Group',
								descField: 'DescriptionInfo.Translated',
								itemName: 'CosGroup',
								moduleName: 'Construction System Group',
								lastObjectModuleName: moduleName,
								rootForModule: moduleName
							}
						},
						translation: {
							uid: 'constructionSystemMasterGroupService',
							title: 'constructionsystem.master.groupGridContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'CosGroupDto',
								moduleSubModule: 'ConstructionSystem.Master'
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(groupServiceOptions);
				service = serviceContainer.service;

				constructionSystemMasterGroupFilterService.onFilterModified.register(function () {
					var tobeFilterDataService = constructionSystemMasterGroupFilterService.getTobeFilterService();
					if (tobeFilterDataService !== null && tobeFilterDataService.load) {
						tobeFilterDataService.load();
					}
				});

				service.markersChanged = function (items) {
					if (_.isArray(items) && _.size(items) > 0) {
						var keyValues = [];
						_.each(items, function (item) {
							var groups = collectionChoiceGroupItems(item);
							keyValues = keyValues.concat(groups);
						});
						constructionSystemMasterGroupFilterService.setFilter(keyValues);
					}
				};

				service.onCellChange = function (arg) {
					var columns = arg.grid.getColumns(), columnName = columns[arg.cell].field;
					var entities = this.getList(), flatList = cloudCommonGridService.flatten(entities, [], 'GroupChildren');
					if (columnName === 'IsDefault') {
						this.setDefault(entities, flatList, arg.item);
					}
				};

				service.setDefault = function (entities, flatList, entity) {
					// var data = serviceContainer.data;
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
						// eslint-disable-next-line no-unused-vars
						var elemState = service.assertPath(modState.modifications, false, entity);
						modState.modifications.CosGroup = null;
						modState.modifications.EntitiesCount = 0;
					}
				};

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'CosGroupDto',
					moduleSubModule: 'ConstructionSystem.Master',
					validationService: 'constructionSystemMasterGroupValidationService',
					mustValidateFields: ['Code']
				});

				service.getDefatulGroup = function () {
					let dataList = serviceContainer.data.getList();
					let defaultGroup = _.find(dataList, item => {
						return item.IsDefault === true;
					});
					if (!defaultGroup){
						defaultGroup = _.minBy(dataList, 'Id');
					}
					return defaultGroup;
				};

				function collectionChoiceGroupItems(group) {
					var items = [];

					items.push(group.Id);
					if (group.HasChildren && group.GroupChildren) {
						for (var i = 0; i < group.GroupChildren.length; i++) {
							items = items.concat(collectionChoiceGroupItems(group.GroupChildren[i]));
						}
					}

					return items;
				}

				service.load();

				return service;
			}]);
})(angular);
