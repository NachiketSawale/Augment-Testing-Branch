/**
 * Created by zov on 15/05/2019.
 */
(function () {
	/*global angular, globals*/
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonProjectLocationSideloadFilterDataServiceFactory', [
		'cloudDesktopSidebarService', 'ServiceDataProcessArraysExtension',
		'projectLocationMainImageProcessor', 'productionplanningCommonStructureFilterService',
		'basicsLookupdataLookupDescriptorService', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor', 'ppsCommonProjectLocationValidationServiceFactory', '_',
		'platformGridAPI', 'platformDataServiceDataProcessorExtension',
		'platformDataServiceFieldReadonlyProcessorFactory',
		'basicsCompanyNumberGenerationInfoService',
		'productionplanningCommonLocationInfoService',
		'platformRuntimeDataService', 'projectLocationLookupDataService', '$http',

		function (
			cloudDesktopSidebarService, ServiceDataProcessArraysExtension,
			projectLocationMainImageProcessor, ppsCommonStructureFilterService,
			basicsLookupdataLookupDescriptorService, platformDataServiceFactory,
			basicsCommonMandatoryProcessor, projectLocationValidationServiceFactory, _,
			platformGridAPI, platformDataServiceDataProcessorExtension,
			platformDataServiceFieldReadonlyProcessorFactory,
			basicsCompanyNumberGenerationInfoService,
			locationInfoService,
			platformRuntimeDataService, locationLookupDataService, $http) {

			var serviceCache = {};

			// Must be Upper Case and equal to filterName in CommonLogic
			var filterKey = 'PEOJECTLOCATION';
			var filterLocationIds = [];
			let treeByJob = false;

			function getPrjLocationFilterService(mainService, isEditable, filterType) {
				treeByJob = filterType === 'byJob';
				var mainServiceName = mainService.getServiceName();
				var service = serviceCache[mainServiceName];
				var serviceContainer;

				if (!service) {
					initMainService(mainService);

					var setItemMarkers = function setItemMarkers(ppsItems, markerIds) {
						_.each(ppsItems, function (ProjectLocation) {
							ProjectLocation.IsMarked = markerIds.indexOf(ProjectLocation.Id) >= 0;
							setItemMarkers(ProjectLocation.ChildItems, markerIds);
						});
					};

					var collectMarkedLocations = function collectMarkedLocations(locationData) {
						var allLocations = [];
						serviceContainer.data.flatten(locationData, allLocations, serviceContainer.data.treePresOpt.childProp);
						var filteredLocations = _.filter(allLocations, 'IsMarked');
						return _.map(filteredLocations, 'Id');
					};

					var serviceOption = {
						hierarchicalRootItem: {
							module: angular.module(moduleName),
							serviceName: mainServiceName + '_ProjectLocationDataService',
							httpRead: {
								route: globals.webApiBaseUrl + 'project/location/',
								initReadData: function (readData) {
									//last filter
									service.lastProjectFilterFk = mainService.getSelectedProjectId();
									readData.filter = '?projectId=' + service.lastProjectFilterFk;
								}
							},
							dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor,
								platformDataServiceFieldReadonlyProcessorFactory.createProcessor([
									{
										field: 'Code', evaluate: function (item) {
											if (item.Version === 0) {
												var projectId = mainService.getProjectID() ? mainService.getProjectID() : mainService.getSelectedProjectId();
												var project = basicsLookupdataLookupDescriptorService.getLookupItem('Project', projectId);

												if (project && project.RubricCatLocationFk && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService').hasToGenerateForRubricCategory(project.RubricCatLocationFk)) {
													item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService').provideNumberDefaultText(project.RubricCatLocationFk, item.Code);
													return true;
												} else {
													return false;
												}
											} else {
												return false;
											}
										}
									}]),
								{
									processItem: function setRowReadOnlyByPermission(item) {
										if (service.readOnly) {
											platformRuntimeDataService.readonly(item, true);
											if (item.Locations !== null && item.Locations.length > 0) {
												_.forEach(item.Locations, function (Location) {
													platformRuntimeDataService.readonly(Location, true);
												});
											}
										}
									}
								}
							],
							useItemFilter: true,
							presenter: {
								tree: {
									parentProp: 'LocationParentFk',
									childProp: 'Locations',
									incorporateDataRead: function (readData, data) {
										if (filterLocationIds) {
											// Must be Upper Case and equal to filterName in CommonLogic
											if (filterLocationIds && filterLocationIds.length > 0) {
												setItemMarkers(readData, filterLocationIds);
												//reset marked locations
												filterLocationIds = collectMarkedLocations(readData);
											}
										}
										locationLookupDataService.setCache({}, readData);
										return data.handleReadSucceeded(readData, data);
									},
									initCreationData: function (creationData) {
										creationData.Id = mainService.getSelectedProjectId();
										var parentId = creationData.parentId;
										delete creationData.MainItemId;
										delete creationData.parentId;
										if (!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
											creationData.PKey1 = parentId;
										}
									}

								}
							},
							entityRole: {
								root: {
									moduleName: 'productionplanning.common',
									itemName: 'ProjectLocation',
									handleUpdateDone: function handleUpdateDone(updateData, response) {
										locationInfoService.loadData(response.ProjectLocation).then(function(items){
											if(mainService && mainService.resetLocationInfoItems){
												mainService.resetLocationInfoItems();
											}
										});
										service.refresh();
									}
								}
							},
							actions: {} // no create/delete actions
						}
					};

					if (isEditable === true) {
						delete serviceOption.hierarchicalRootItem.actions;
						delete serviceOption.hierarchicalRootItem.httpRead;
						serviceOption.hierarchicalRootItem = _.merge(serviceOption.hierarchicalRootItem, {
							httpCRUD: {
								route: globals.webApiBaseUrl + 'project/location/',
								initReadData: function (readData) {
									//last filter
									service.lastProjectFilterFk = mainService.getSelectedProjectId();
									readData.filter = '?projectId=' + service.lastProjectFilterFk;
								}
							}
						});
					}

					serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;

					var validationService = projectLocationValidationServiceFactory.create(service);
					serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'LocationDto',
						moduleSubModule: 'Project.Location',
						validationService: validationService,
						mustValidateFields: ['Code']
					});

					serviceContainer.data.doCallHTTPDelete = function doCallHTTPDelete(deleteParams, data, onDeleteDone) {
						let prjLocationToDelete = [deleteParams.entity];
						let deleteEntities = [];
						if(deleteParams.entity && deleteParams.entity.HasChildren === true){
							serviceContainer.data.flatten(prjLocationToDelete, deleteEntities, serviceContainer.data.treePresOpt.childProp);
							prjLocationToDelete = deleteEntities;
						}
						let prjLocationToDeleteIds = _.map(prjLocationToDelete, 'Id');
						return $http.post(globals.webApiBaseUrl + 'productionplanning/common/location/delete', prjLocationToDeleteIds).then(function (response) {
							onDeleteDone(deleteParams, data, response.data);
							return true;
						}, function () {
							platformRuntimeDataService.removeMarkAsBeingDeletedFromList([deleteParams.entity]);
						});
					}

					service.setShowHeaderAfterSelectionChanged(null);

					service.collectPrjLocationIds = function collectPrjLocationIds(SelectedPrjLocations) {
						var allLocations = [];
						serviceContainer.data.flatten(SelectedPrjLocations, allLocations, serviceContainer.data.treePresOpt.childProp);
						return _.map(allLocations, 'Id');
					};


					serviceCache[mainServiceName] = service;

					if (mainService.getSelectedProjectId() > 0) {
						service.load();
					}


					service.markersChanged = function markersChanged(itemList) {
						var projectLocationIds = service.collectPrjLocationIds(itemList);
						service.setFilter(projectLocationIds);
					};

					service.removeFilter = function removeFilter() {
						_.each(service.getList(), function (item) {
							item.IsMarked = false;
						});
						service.setFilter([]);
					};

					service.isFilter = function () {
						return true;
					};


					service.setFilter = function (filterValue) {
						filterLocationIds = filterValue;

						var sideLoadFilter = mainService.getSideloadFilter(filterType);
						_.remove(sideLoadFilter.FurtherFilters, {Token: 'FILTER_BY_STRUCTURE:' + filterKey});

						if (!_.isEmpty(filterValue)) {
							var prjLocationFilter = {
								Token: 'FILTER_BY_STRUCTURE:' + filterKey,
								Value: filterValue.toString(',')
							};
							//initalise if necessary
							sideLoadFilter.FurtherFilters = sideLoadFilter.FurtherFilters || [];
							sideLoadFilter.FurtherFilters.push(prjLocationFilter);
						}

						if (mainService.getSelectedProjectId() > 0) {
							mainService.setSideloadFilter(filterType, sideLoadFilter);
							mainService.sideloadData(filterType);

							if(mainService.getServiceName() === 'productionplanningItemDataService' && filterType === 'byJob' && treeByJob){
								mainService.setSideloadFilter('treeByJob', sideLoadFilter);
								mainService.sideloadData('treeByJob');
							}
						}
					};


					// parentProp: 'LocationParentFk',	childProp: 'Locations',
					var tree = [];
					var CHILD_PROP = serviceOption.hierarchicalRootItem.presenter.tree.childProp,//'Locations',
						PARENT_PROP = serviceOption.hierarchicalRootItem.presenter.tree.parentProp; //'LocationParentFk';
					service.upgradeLocation = function upgradeLocation(uuid) {
						var destination, itemToMove, oldParent, parentFk;
						itemToMove = service.getSelected();
						tree = tree.length === 0 ? service.getTree() : tree;

						if (itemToMove && itemToMove.Id) {
							parentFk = itemToMove[PARENT_PROP];
							if (parentFk) {
								oldParent = service.getItemById(itemToMove[PARENT_PROP]);
								destination = service.getItemById(oldParent[PARENT_PROP]);

								if (destination && destination.Id) {
									itemToMove.LocationParentFk = oldParent.LocationParentFk;
									destination.Locations.push(itemToMove);

									_.remove(oldParent[CHILD_PROP], function (treeItem) {
										return treeItem.Id === itemToMove.Id;
									});

								} else {
									itemToMove.LocationParentFk = null;
									tree.push(itemToMove);

									_.remove(oldParent[CHILD_PROP], function (treeItem) {
										return treeItem.Id === itemToMove.Id;
									});
								}
							}
							serviceContainer.data.markItemAsModified(itemToMove, serviceContainer.data);
							service.refreshNodeInfo(tree);
							var grid = platformGridAPI.grids.element('id', uuid);
							grid.dataView.setItems(tree);
							//service.gridRefresh();
						}
					};

					service.downgradeLocation = function downgradeLocation(uuid) {
						var locations, index, itemToMove, newParent, oldParent;
						itemToMove = service.getSelected();
						tree = tree.length === 0 ? service.getTree() : tree;

						if (itemToMove && itemToMove.Id) {
							if (itemToMove.LocationParentFk) {
								oldParent = service.getItemById(itemToMove.LocationParentFk);
								locations = oldParent.Locations;
							} else {
								locations = tree;
							}

							index = locations.indexOf(itemToMove);
							if (index > 0) {
								newParent = locations[index - 1];
							}

							if (newParent && newParent.Id) {
								newParent.Locations.push(itemToMove);
								itemToMove.LocationParentFk = newParent.Id;

								if (oldParent) {
									_.remove(oldParent[CHILD_PROP], function (treeItem) {
										return treeItem.Id === itemToMove.Id;
									});
								} else {
									_.remove(tree, function (treeItem) {
										return treeItem.Id === itemToMove.Id;
									});
								}

								serviceContainer.data.markItemAsModified(itemToMove, serviceContainer.data);
								service.refreshNodeInfo(tree);
								var grid = platformGridAPI.grids.element('id', uuid);
								grid.dataView.setItems(tree);
								//service.gridRefresh();
							}
						}
					};

					/**
					 * refreshs the nodeInfo Objects and the hasChildren flag of an item
					 * @param itemsList
					 * @param level
					 */
					service.refreshNodeInfo = function (itemsList, level) {
						var nodeLevel = level ? level : 0;

						_.each(itemsList, function (item) {
							// set the item level
							item.nodeInfo = item.nodeInfo ? item.nodeInfo : {};
							item.nodeInfo.level = _.clone(nodeLevel);
							// set the nodeInfo
							if (!_.isEmpty(item[CHILD_PROP])) {

								item.nodeInfo.children = true;
								item.HasChildren = true;
								item.nodeInfo.isLastItem = false;
								service.refreshNodeInfo(item[CHILD_PROP], nodeLevel + 1);

							} else {
								item.nodeInfo.children = false;
								item.HasChildren = false;
							}
							platformDataServiceDataProcessorExtension.doProcessItem(item, serviceContainer.data);
						});
					};

					service.setNewSelected = function setNewSelected(locations, dragEndId) {
						var locationList = service.getList();
						var selectedLocation = _.find(locationList, {Id: locations[0].Id});
						var targetLocation = _.find(locationList, {Id: dragEndId});
						while (targetLocation.LocationParentFk !== null) {
							targetLocation.nodeInfo.collapsed = false;
							targetLocation = _.find(locationList, {Id: targetLocation.LocationParentFk});
						}
						service.setSelected(selectedLocation);
						service.refresh();
					};

				}
				return service;
			}

			function initMainService(mainService) {
				if (mainService.getSelectedProjectId === undefined) {
					mainService.getSelectedProjectId = function () {
						return cloudDesktopSidebarService.filterRequest.projectContextId || -1;
					};
				}
				if (mainService.getPrjLocationList === undefined) {
					mainService.getPrjLocationList = function () {
						var serviceName = mainService.getServiceName();
						return getPrjLocationList(serviceName);
					};
				}
			}

			function getPrjLocationList(mainServiceName) {
				var list = [];
				var prjLocationFilterService = serviceCache[mainServiceName];
				if (prjLocationFilterService) {
					list = prjLocationFilterService.getList();
				}
				return list;
			}

			return {
				getPrjLocationFilterService: getPrjLocationFilterService
			};
		}
	]);
})();
