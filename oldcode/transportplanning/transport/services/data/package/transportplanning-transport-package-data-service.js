(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name transportplanningBundlePackageMainDataService
	 * @function
	 *
	 * @description
	 * transportplanningBundlePackageMainDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);

	transportModule.factory('transportplanningTransportPackageDataService', transportplanningTransportPackageDataService);

	transportplanningTransportPackageDataService.$inject = [
		'$injector', 'cloudCommonGridService',
		'globals',
		'_',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'transportplanningTransportMainService',
		'ServiceDataProcessArraysExtension',
		'platformDataServiceProcessDatesBySchemeExtension',
		'transportplanningPackageDataProcessor',
		'transportplanningPackageImageProcessor',
		'transportplanningTransportPackageProcessor',
		'transportplanningTransportPackageReadOnlyProcessor',
		'transportplanningTransportRouteStatusLookupService',
		'transportplanningPackageStatusLookupService',
		'transportplanningPackageTypeLookupService',
		'transportplanningPackageTypeHelperService',
		'$http',
		'transportplanningPackageGoodsHandler',
		'transportplanningPackageDataServiceBundleDocumentsExtension',
		'platformPermissionService'];

	function transportplanningTransportPackageDataService($injector, cloudCommonGridService,
														  globals,
														  _,
														  basicsCommonMandatoryProcessor,
														  basicsLookupdataLookupDescriptorService,
														  platformDataServiceFactory,
														  parentService,
														  ServiceDataProcessArraysExtension,
														  platformDataServiceProcessDatesBySchemeExtension,
														  packageDataProcessor,
														  packageImageProcessor,
														  routePkgProcessor,
														  packageReadOnlyProcessor,
														  routeStatusServ,
														  pkgStatusLookupServ,
														  pkgTypeLookupServ,
														  packageTypeHelperServ,
														  $http,
														  packageGoodsHandler,
														  bundleDocumentsExtension,
														  platformPermissionService) {

		var isRouteNotInTransport = function () {
			var route = parentService.getSelected();
			// if (route.readonly) {//remark:field "readonly" of route entity is set in transportplanningTransportReadOnlyProcessor
			// 	return false;
			// }

			if (!route.TrsRteStatusFk) {
				return false;
			}
			var statusList = routeStatusServ.getList();
			var status = _.find(statusList, {Id: route.TrsRteStatusFk});
			return status && status.IsInTransport === false;
		};
		var systemOption = {
			hierarchicalNodeItem: {
				serviceName: 'transportplanningTransportPackageDataService',
				entityNameTranslationID: 'transportplanning.package.entityPackage',
				httpCreate: {
					route: globals.webApiBaseUrl + 'transportplanning/package/',
					endCreate: 'createpackage'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'transportplanning/package/',
					endRead: 'treebyroute'
				},
				entityRole: {
					node: {
						itemName: 'TransportPackage',
						parentService: parentService,
						parentFilter: 'routeId'
					}
				},
				actions: {
					delete: {},
					create: 'hierarchical',
					canCreateCallBackFunc: isRouteNotInTransport,
					canCreateChildCallBackFunc: function (selectedItem) {
						if (!selectedItem) {
							return false;
						}
						//check pkg type
						if (!packageTypeHelperServ.isPkg(selectedItem.TrsPkgTypeFk)) {
							return false;
						}
						//check route status
						return isRouteNotInTransport();
					},
					canDeleteCallBackFunc: function (selectedItem) {
						if (selectedItem.Version <= 0) {
							return true;
						}

						//check route status
						if (!isRouteNotInTransport()) {
							return false;
						}

						// check package type, return false if type do not have delete permission.
						var pkgTypeList = pkgTypeLookupServ.getList();
						var pkgType = _.find(pkgTypeList, {'Id': selectedItem.TrsPkgTypeFk});
						if (pkgType && pkgType.AccessrightDescriptorFk) {
							if (!platformPermissionService.hasDelete(pkgType.AccessrightDescriptorFk)) {
								return false;
							}
						}

						//check selected package's status
						if (!selectedItem.TrsPkgStatusFk) {
							return false;
						}
						var statusList = pkgStatusLookupServ.getList();
						var packageStatus = _.find(statusList, {Id: selectedItem.TrsPkgStatusFk});
						if (packageStatus && packageStatus.Isdeletable) {
							return true;
						} else {
							return false;
						}
					}
				},
				processor: [new ServiceDataProcessArraysExtension(['ChildPackages'])],
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'TransportPackageDto',
					moduleSubModule: 'TransportPlanning.Package'
				}), packageDataProcessor, packageImageProcessor, routePkgProcessor],
				presenter: {
					tree: {
						parentProp: 'TransportPackageFk',
						childProp: 'ChildPackages',
						initCreationData: function (creationData) {
							if(creationData.parentId === null)
							{
								creationData.parent = { Code: 'No Parent' };
							}
							creationData.MainItem = parentService.getSelected();
						},
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);

							var result = {
								FilterResult: undefined,
								dtos: []
							};
							if (readData && readData.Main) {
								result.dtos = readData.Main;
							}
							if (readData && readData.FilterResult) {
								result.FilterResult = readData.FilterResult;
							}
							serviceContainer.service.updateProperties(result.dtos);
							var ret = serviceContainer.data.handleReadSucceeded(result, data);
							serviceContainer.service.appendUnSavedNewItems();
							return ret;
						},
						handleCreateSucceeded: function (newItem) {
							$injector.get('transportplanningPackageJobLookupdataHelper').checkAndLoadJobByKey(newItem.LgmJobDstFk);
						}
					}
				},
				entitySelection: {supportsMultiSelection: true},
				modification: true,
				translation: {
					uid: 'transportplanningTransportPackageDataService',
					title: 'transportplanning.package.entityPackage',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'TransportPackageDto',
						moduleSubModule: 'TransportPlanning.Package'
					}
				}
			}
		};
		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(systemOption);

		//validate when new package
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'TransportPackageDto',
			moduleSubModule: 'TransportPlanning.Package',
			validationService: 'transportplanningTransportPackageValidationService',
			mustValidateFields: true //The actual mustValidateFields(a string array) will be automatically created by validationService, if mustValidateFields is bool and the corresponding validationService does exist.
		});


		serviceContainer.service.registerEntityDeleted(function (e, entities) {
			var packageTypes = $injector.get('packageTypes');
			var storage = $injector.get('basicsCommonBaseDataServiceReferenceActionExtension');
			_.forEach(entities, function (entity) {
				// record transport goods has been assigned, for transport goods data filter
				var options = packageTypes.properties[entity.TrsPkgTypeFk];
				if (_.get(options, 'assignedRecordKey') && entity.Good) {
					storage.removeAssignedItemsRecord(options.assignedRecordKey, [entity.Good]);
				}
			});
		});

		function setChildrenRteStatusFk(pkg) {
			if (pkg.ChildPackages === null) {
				return;
			}
			_.each(pkg.ChildPackages, function (item) {
				item.TrsRteStatusFk = pkg.TrsRteStatusFk;
				setChildrenRteStatusFk(item);
			});
		}

		serviceContainer.service.getPkgs4CraneReservation = function (waypointIds) {
			return $http.post(globals.webApiBaseUrl + 'transportplanning/package/wizard/getCraneReservationPkgs', waypointIds)
				.then(function (response) {
					return response.data;
				});
		};

		serviceContainer.service.appendUnSavedNewItems = function (dtos, delay) {
			serviceContainer.data.unSavedNewItems = dtos || serviceContainer.data.unSavedNewItems;
			if (serviceContainer.data.unSavedNewItems) {
				var selectedRoute = parentService.getSelected();
				if (selectedRoute && selectedRoute.isAddingTrsGood) {
					serviceContainer.service.updateProperties(serviceContainer.data.unSavedNewItems);
					onCreateSucceeded(serviceContainer.data.unSavedNewItems, undefined, selectedRoute);
				}
				if (!delay) {
					serviceContainer.data.unSavedNewItems = null;
				}
			}
		};

		function onCreateSucceeded(dtos, parent, selectedRoute) {
			if (dtos) {
				_.forEach(dtos, function (dto) {
					if (dto && selectedRoute.Id === dto.TrsRouteFk) {
						serviceContainer.data.onCreateSucceeded(dto, serviceContainer.data, {parent: parent});
						onCreateSucceeded(dto.ChildPackages, dto, selectedRoute);
					}
				});
			}
		}

		//note: override 'getTree()' to set data source for the tree exactly.
		//serviceContainer.service.getTree = function getTree() {
		//    return [];
		//};

		serviceContainer.service.updateProperties = function (dtos) {
			//set TrsRteStatusFk(for setting readonly in package data processor)
			var routeItem = parentService.getSelected();
			if (routeItem) {
				_.each(dtos, function (item) {
					if (item.TrsRouteFk && item.TrsRouteFk) {
						item.TrsRteStatusFk = routeItem.TrsRteStatusFk;
						setChildrenRteStatusFk(item);
					}
				});
			}
			//packageGoodsHandler.updateGoodsDescription(dtos, serviceContainer.service.gridRefresh); // this caust performance issue when hundreds of packages loaded, because inside, it send web request base on every package --zov
		};

		bundleDocumentsExtension.addBundleDocumentsFunction(serviceContainer.service);

		return serviceContainer.service;

		/*selectedItemProcess: function (item) {
		 item.TrsHeaderFk = serviceContainer.data.parentService.getSelected().Id;
		 }*/
		//var service = dataServiceFactory.createDataService(serviceContainer, factoryConfig);


		//return service;
	}
})(angular);
