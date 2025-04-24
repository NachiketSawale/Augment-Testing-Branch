(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectControlsPackageListDataService',
		['$translate', '$injector', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'controllingProjectcontrolsDashboardService', 'cloudCommonGridService', 'basicsLookupdataLookupDescriptorService',
			function ($translate, $injector, platformDataServiceFactory, ServiceDataProcessDatesExtension, parentService, cloudCommonGridService, basicsLookupdataLookupDescriptorService) {
				let reloadFunc = null;
				let selectedGroupingStructure = null;
				let serviceOptions = {
					flatLeafItem: {
						module: moduleName,
						serviceName: 'controllingProjectControlsPackageListDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'controlling/projectcontrols/package/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								let project = parentService.getProjectInfo();
								if (!project) {
									return readData;
								}

								let newRequest = {
									PrjProjectId: project.Id,
									StructureInfos: [{
										PrcPackageId: -1,
										MdcControllingUnitId: -1
									}]
								}

								let selectedDashboardItem = parentService.getSelected();
								let groupingStructureList = parentService.getGroupingStructureList();
								selectedGroupingStructure = _.find(groupingStructureList, function (d) {
									for (let i = 1; i <= selectedDashboardItem.StructureLevel; i++) {
										if (d['StructureLevel' + i + 'Id'] !== selectedDashboardItem['StructureLevel' + i + 'Id'] || selectedDashboardItem.StructureIdId !== d.StructureIdId || selectedDashboardItem.StructureLevel !== d.StructureLevel) {
											return false;
										}
									}
									return true;
								});

								let groupingStructureTree = [];
								if (selectedGroupingStructure) {
									newRequest.StructureInfos = [];
									if (_.isArray(selectedGroupingStructure.Children)) {
										cloudCommonGridService.flatten([selectedGroupingStructure], groupingStructureTree, 'Children');
									}

									groupingStructureTree.push(selectedGroupingStructure);
								} else {
									/*
									* if selectedGroupingStructure is empty, it means the grouping struncture info is laoding, need to reload the data after it done
									* */
									reloadFunc = service.load;
									parentService.registerGroupingStructureInfoLoaded(reloadFunc);
								}

								_.forEach(groupingStructureTree, (item) => {
									let itemInfo = {
										PrcPackageId: item.PrcPackageFk,
										MdcControllingUnitId: item.MdcControllingunitFk
									};

									if (!_.find(newRequest.StructureInfos, itemInfo)) {
										newRequest.StructureInfos.push(itemInfo);
									}
								})

								Object.assign(readData, {
									PrjProjectId: project.Id,
									StructureInfos: newRequest.StructureInfos
								});

								return readData;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									if(!!selectedGroupingStructure && _.isFunction(reloadFunc)){
										parentService.unregisterGroupingStructureInfoLoaded(reloadFunc);
										reloadFunc = null;
									}

									return serviceContainer.data.handleReadSucceeded(readData, data);
								}
							}
						},
						entityRole: {
							leaf: {itemName: 'controllingProjectControlsPackage', parentService: parentService}
						},
						actions: {delete: false, create: false, bulk: false}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				serviceContainer.data.usesCache = false;
				serviceContainer.service.canLoad = function () {
					return !!parentService.getSelected();
				};
				serviceContainer.data.markItemAsModified = angular.noop;
				serviceContainer.service.markItemAsModified = angular.noop;

				basicsLookupdataLookupDescriptorService.loadData(['ConStatus']);

				let service = serviceContainer.service;
				return service;
			}]);
})();
