/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals,_ */

	const modelMeasurementsModule = angular.module('model.measurements');

	modelMeasurementsModule.factory('modelMeasurementGroupDataService',
		modelMeasurementGroupDataService);

	modelMeasurementGroupDataService.$inject = ['_', '$injector', 'platformDataServiceFactory',
		'modelProjectPinnableEntityService', 'platformRuntimeDataService', 'PlatformMessenger', 'modelMeasurementGroupFilterService',
		'platformGridAPI', 'cloudCommonGridService', 'platformModuleStateService', '$timeout', 'modelMeasurementDataService', 'projectMainPinnableEntityService'];

	function modelMeasurementGroupDataService(_, $injector, platformDataServiceFactory,
		modelProjectPinnableEntityService, platformRuntimeDataService, PlatformMessenger, modelMeasurementGroupFilterService,
		platformGridAPI, cloudCommonGridService, platformModuleStateService, $timeout, modelMeasurementDataService, projectMainPinnableEntityService) {

		let serviceContainer = null;
		let service = null;
		const groupServiceOptions = {
			hierarchicalRootItem: {
				module: modelMeasurementsModule,
				serviceName: 'modelMeasurementGroupDataService',
				entityNameTranslationID: 'model.measurements.modelMeasurementGroupEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/measurement/group/',
					usePostForRead: true
				},
				presenter: {
					tree: {
						parentProp: 'MeasurementGroupFk',
						childProp: 'MdlMeasurementEntities',
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = projectMainPinnableEntityService.getPinned();
							creationData.PKey2 = creationData.parentId;
						},
						incorporateDataRead: function (readData, data) {
							const pinnedProject = projectMainPinnableEntityService.getPinned();
							let multiSelect = false;// default single mode

							if (pinnedProject) {
								const flatList = cloudCommonGridService.flatten(readData.dtos, [], 'MdlMeasurementEntities');
								const itemMap = _.keyBy(flatList, 'Id');
								const addedToMdlMeasurementEntities = new Set();

								const filterItem = _.filter(flatList, function (item) {
									if (item.MeasurementGroupFk) {
										const parentItem = itemMap[item.MeasurementGroupFk];
										if (parentItem) {
											if (!Array.isArray(parentItem.MdlMeasurementEntities)) {
												parentItem.MdlMeasurementEntities = [];
											}
											parentItem.MdlMeasurementEntities.push(item);
											addedToMdlMeasurementEntities.add(item);
										}
									}
									return (Array.isArray(multiSelect) ? _.includes(multiSelect, item.Id) : item.ProjectFk === pinnedProject);
								});
								const finalFilterItem = _.reject(filterItem, item => addedToMdlMeasurementEntities.has(item));
								readData = finalFilterItem;

								if (finalFilterItem && _.isArray(finalFilterItem) && finalFilterItem[0]) {
									if (serviceContainer !== null) {
										const grids = serviceContainer.data.usingContainer;
										_.each(grids, function (gridId) {
											if (gridId) {
												$timeout(function () {
													// expand the selected(filtered) item
													platformGridAPI.rows.scrollIntoViewByItem(gridId, finalFilterItem[0]);
													service.setSelected(finalFilterItem[0]);
												});
											}
										});
									}
								}
							}
							return data.handleReadSucceeded(readData, data);
						}
					}},
				dataProcessor: [
					{
						processItem: function () {
						}
					}],
				entityRole: {
					root: {
						descField: 'DescriptionInfo.Translated',
						itemName: 'ModelMeasurementsGroup',
						moduleName: 'cloud.desktop.moduleDisplayNameModelMeasurements',
						lastObjectModuleName: modelMeasurementsModule,
						rootForModule: modelMeasurementsModule
					}},
				actions: {
					create: 'hierarchical',
					canCreateChildCallBackFunc: canCreateChildCallBackFunc,
					delete: {},
					//canDeleteCallBackFunc: canDeleteCallBackFunc
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(groupServiceOptions);
		service = serviceContainer.service;

		modelMeasurementGroupFilterService.onFilterModified.register(function () {
			const tobeFilterDataService = modelMeasurementGroupFilterService.getTobeFilterService();
			if (tobeFilterDataService !== null && tobeFilterDataService.load) {
				tobeFilterDataService.load();
			}
		});

		service.markersChanged = function (items) {
			if (_.isArray(items) && _.size(items) > 0) {
				let keyValues = [];
				_.each(items, function (item) {
					const groups = collectionChoiceGroupItems(item);
					keyValues = keyValues.concat(groups);
				});
				modelMeasurementGroupFilterService.setFilter(keyValues);
			} else {
				modelMeasurementGroupFilterService.setFilter(items);
			}
		};

		service.onCellChange = function (arg) {
			const columns = arg.grid.getColumns(), columnName = columns[arg.cell].field;
			const allEntities = this.getList();
			const visibleEntities = allEntities.filter(entity => entity.Visible);
			const entities = visibleEntities, flatList = cloudCommonGridService.flatten(entities, [], 'MdlMeasurementEntities');
			if (columnName === 'Filter') {
				this.setDefault(entities, flatList, arg.item);
			}
		};

		service.setDefault = function (entities, flatList, entity) {
			let otherDefaultItems = [];
			_.each(flatList, function (item) {
				if (item.Id !== entity.Id) {
					otherDefaultItems.push(item);
				}
			});
		};

		function canCreateChildCallBackFunc() {
			return !!service.getSelected();
		}

		function collectionChoiceGroupItems(group) {
			let items = [];

			items.push(group.Id);
			if (group.HasChildren && group.GroupChildren) {
				for (let i = 0; i < group.GroupChildren.length; i++) {
					items = items.concat(collectionChoiceGroupItems(group.GroupChildren[i]));
				}
			}
			return items;
		}

		service.load();

		const onItemsDeleted = new PlatformMessenger();

		serviceContainer.service.registerItemsDeleted = function (handler) {
			onItemsDeleted.register(handler);
		};

		serviceContainer.service.unregisterItemsDeleted = function (handler) {
			onItemsDeleted.unregister(handler);
		};

		const originalOnDeleteDone = serviceContainer.data.onDeleteDone;
		serviceContainer.data.onDeleteDone = function (deleteParams) {
			const delItems = Array.isArray(deleteParams.entities) ? deleteParams.entities : [deleteParams.entity];
			onItemsDeleted.fire(delItems);
			serviceContainer.service.gridRefresh();
			return originalOnDeleteDone.apply(this, arguments);
		};

		return serviceContainer.service;
	}
})(angular);