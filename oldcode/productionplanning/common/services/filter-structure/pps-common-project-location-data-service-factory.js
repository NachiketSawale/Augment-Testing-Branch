/**
 * Created by zov on 15/05/2019.
 */
(function () {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonProjectLocationFilterDataServiceFactory', [
		'cloudDesktopSidebarService', 'ServiceDataProcessArraysExtension',
		'projectLocationMainImageProcessor', 'productionplanningCommonStructureFilterService',
		'basicsLookupdataLookupDescriptorService', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor', 'ppsCommonProjectLocationValidationServiceFactory',

		function (cloudDesktopSidebarService, ServiceDataProcessArraysExtension,
				  projectLocationMainImageProcessor, ppsCommonStructureFilterService,
				  basicsLookupdataLookupDescriptorService, platformDataServiceFactory,
				  basicsCommonMandatoryProcessor, projectLocationValidationServiceFactory) {

			var serviceCache = {};

			function getPrjLocationFilterService(mainService, isEditable) {
				var mainServiceName = mainService.getServiceName();
				var service = serviceCache[mainServiceName];
				if (!service) {
					initMainService(mainService);

					var setItemMarkers = function setItemMarkers(ppsItems, markerIds) {
						_.each(ppsItems, function (ProjectLocation) {
							ProjectLocation.IsMarked = markerIds.indexOf(ProjectLocation.Id) >= 0;
							setItemMarkers(ProjectLocation.ChildItems, markerIds);
						});
					};

					var serviceOption = {
						hierarchicalRootItem: {
							module: angular.module(moduleName),
							serviceName: mainServiceName + '_ProjectLocationDataService',
							httpRead: {
								route: globals.webApiBaseUrl + 'project/location/',
								initReadData: function (readData) {
									readData.filter = '?projectId=' + mainService.getSelectedProjectId();
								}
							},
							dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor],
							useItemFilter: true,
							presenter: {
								tree: {
									parentProp: 'LocationParentFk',
									childProp: 'Locations',
									incorporateDataRead: function (readData, data) {
										var allIds = ppsCommonStructureFilterService.getAllFilterIds(mainServiceName);
										if (allIds) {
											// Must be Upper Case and equal to filterName in CommonLogic
											var filterKey = 'PEOJECTLOCATION';
											var markerIds = allIds[filterKey];
											if (markerIds && markerIds.length > 0) {
												setItemMarkers(readData, markerIds);
											}
										}
										basicsLookupdataLookupDescriptorService.attachData(readData);
										return  data.handleReadSucceeded(readData, data);
									},
									initCreationData: function (creationData) {
										creationData.Id = mainService.getSelectedProjectId();
										var parentId = creationData.parentId;
										delete creationData.MainItemId;
										delete creationData.parentId;
										if(!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
											creationData.PKey1 = parentId;
										}
									}
								}
							},
							entityRole: {
								root: {
									moduleName: 'productionplanning.common',
									itemName: 'ProjectLocation'
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
									readData.filter = '?projectId=' + mainService.getSelectedProjectId();
								}
							}
						});
					}
					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

					service = serviceContainer.service;

					var validationService = projectLocationValidationServiceFactory.create(service);
					serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'LocationDto',
						moduleSubModule: 'Project.Location',
						validationService: validationService,
						mustValidateFields: ['Code']
					});

					service.setShowHeaderAfterSelectionChanged(null);

					service.collectPrjLocationIds = function collectPrjLocationIds(SelectedPrjLocation) {
						return _.map(ppsCommonStructureFilterService.collectItems(SelectedPrjLocation, 'Locations'), 'Id');
					};

					extendByFilter(mainServiceName, mainServiceName + '_ProjectLocation', service, ppsCommonStructureFilterService);
					serviceCache[mainServiceName] = service;

					if (mainService.getSelectedProjectId() > 0) {
						service.load();
					}
				}
				return service;
			}

			function initMainService(mainService) {
				if (mainService.getSelectedProjectId === undefined) {
					mainService.getSelectedProjectId = function () {
						return cloudDesktopSidebarService.filterRequest.projectContextId || -1;
					};
				}
				if(mainService.getPrjLocationList === undefined){
					mainService.getPrjLocationList = function () {
						var serviceName = mainService.getServiceName();
						return getPrjLocationList(serviceName);
					};
				}
			}

			function getPrjLocationList(mainServiceName) {
				var list = [];
				var prjLocationFilterService = serviceCache[mainServiceName];
				if(prjLocationFilterService){
					list = prjLocationFilterService.getList();
				}
				return list;
			}

			function extendByFilter(mainServiceName, id, service, filterService) {

				var PrjLocationFk = 'PrjLocationFk';
				var allIds = [];

				// filter leading structure by line items
				if (angular.isFunction(filterService.addLeadingStructureFilterSupport)) {
					filterService.addLeadingStructureFilterSupport(mainServiceName, service, PrjLocationFk);
				}

				service.markersChanged = function markersChanged(itemList) {
					// Must be Upper Case and equal to filterName in CommonLogic
					var filterKey = 'PEOJECTLOCATION';
					if (_.isArray(itemList) && _.size(itemList) > 0) {
						allIds.length = 0;
						// get all child prj cost group (for each item)
						_.each(itemList, function (item) {
							var Ids = service.collectPrjLocationIds(item);
							allIds = allIds.concat(Ids);
						});
						if (_.isFunction(filterService.setFilterIds)) {
							filterService.setFilterIds(mainServiceName, filterKey, allIds);
						}
						filterService.addFilter(id, service, function (lineItem) {
							return allIds.indexOf(lineItem[PrjLocationFk]) >= 0;
						}, {
							id: filterKey,
							iconClass: 'tlb-icons ico-filter-location',
							captionId: 'prjLocationFilter'
						}, PrjLocationFk);
					} else {
						if (_.isFunction(filterService.setFilterIds)) {
							filterService.setFilterIds(mainServiceName, filterKey, []);
						}
						filterService.removeFilter(id);
					}
				};
			}

			return {
				getPrjLocationFilterService: getPrjLocationFilterService
			};
		}
	]);
})();
