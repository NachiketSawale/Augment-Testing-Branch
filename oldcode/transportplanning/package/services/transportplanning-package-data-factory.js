/**
 * Created by las on 7/10/2017.
 */
/* global globals */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name transportplanningPackageDataServiceFactory
	 * @function
	 * @requires
	 *
	 * @description
	 * Compared to TrsPackageMainService, transportplanningPackageDataServiceFactory is used for package container in other module (like package list container in PpsItem module)
	 *
	 */
	packageModule.factory('transportplanningPackageDataServiceFactory', PackageDataFactory);
	PackageDataFactory.$inject = ['_', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'transportplanningPackageFilterService',
		'platformDataServiceProcessDatesBySchemeExtension', 'transportplanningPackageDataProcessor', 'transportplanningPackageImageProcessor', 'transportplanningPackageStatusLookupService',
		'transportplanningPackageGoodsHandler', 'transportplanningPackageDataServiceBundleDocumentsExtension', 'ppsMasterDataServiceFactory', 'ppsMasterDataConfigurations'];

	function PackageDataFactory(_, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, transportplanningPackageFilterService,
	                            platformDataServiceProcessDatesBySchemeExtension, transportplanningPackageDataProcessor, transportplanningPackageImageProcessor, pkgStatusLookupServ,
	                            packageGoodsHandler, bundleDocumentsExtension, ppsMasterDataServiceFactory, ppsMasterDataConfigurations) {

		var serviceChche = {};

		function incorporateDataRead(readData, data) {
			basicsLookupdataLookupDescriptorService.attachData(readData);
			var result = {
				FilterResult: readData.FilterResult,
				dtos: readData.Main || []
			};

			packageGoodsHandler.updateGoodsDescription(result.dtos, function () {
				data.handleReadSucceeded(result, data);
			});
		}

		function createSystemOption(parentService, moduleId) {

			var systemOption = {
				hierarchicalNodeItem: {
					module: packageModule,
					serviceName: 'transportplanningPackageDataFactory',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'transportplanning/package/'

					},
					entityRole: {
						node: {
							itemName: 'TransportPackage',
							parentService: parentService
						}
					},
					actions: {
						delete: {},
						create: 'hierarchical',
						canDeleteCallBackFunc: function (selectedItem) {
							if (selectedItem.Version <= 0) {
								return true;
							}
							if (!selectedItem.TrsPkgStatusFk) {
								return false;
							}

							var statusList = pkgStatusLookupServ.getList();
							var packageStatus = _.find(statusList, {Id: selectedItem.TrsPkgStatusFk});
							if (packageStatus && packageStatus.Isdeletable) {
								return true;
							}
							else {
								return false;
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TransportPackageDto',
						moduleSubModule: 'TransportPlanning.Package'
					}), transportplanningPackageDataProcessor, transportplanningPackageImageProcessor],
					presenter: {
						tree: {
							parentProp: 'TransportPackageFk',
							childProp: 'childPackages',
							incorporateDataRead: incorporateDataRead
						}
					}
				}
			};

			if (moduleId === 'transportplanning.transport') {
				systemOption.hierarchicalNodeItem.httpCRUD.endRead = 'treebyroute';
				systemOption.hierarchicalNodeItem.entityRole.node.parentFilter = 'routeId';
			}

			else {
				systemOption.hierarchicalNodeItem.httpCRUD.endRead = 'treeForItem';
				systemOption.hierarchicalNodeItem.entityRole.node.parentFilter = 'itemFk';
			}

			return systemOption;
		}

		function getService(moduleId, parentService) {
			if (!serviceChche[moduleId]) {
				var systemOption = createSystemOption(parentService, moduleId);
				var serviceContainer = platformDataServiceFactory.createNewComplete(systemOption);
				// add bundle documents function
				bundleDocumentsExtension.addBundleDocumentsFunction(serviceContainer.service);
				// register masterDataService
				if (moduleId === 'productionplanning.item') {
					// register to masterDataService
					var masterDataServiceConfig = ppsMasterDataConfigurations.get('Event', {
						dataServiceContainer: serviceContainer,
						matchConfig: {
							'Id': 'PpsEventFk'
						}
					});
					ppsMasterDataServiceFactory.registerServiceToMasterDataService(masterDataServiceConfig);
				}

				serviceChche[moduleId] = serviceContainer.service;
			}

			transportplanningPackageFilterService.registerfilterService();
			return serviceChche[moduleId];
		}

		return {
			getService: getService
		};
	}
})(angular);