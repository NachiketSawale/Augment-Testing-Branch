/**
 * Created by las on 7/10/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningPackageMainService', PackageMainService);
	PackageMainService.$inject = ['$q', '_', 'globals', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'platformDataServiceProcessDatesBySchemeExtension',
		'ServiceDataProcessArraysExtension', 'basicsCommonMandatoryProcessor', 'transportplanningPackageDataProcessor', 'transportplanningPackageFilterService',
		'transportplanningPackageImageProcessor', '$http', 'transportplanningPackageStatusLookupService', 'transportplanningPackageTypeHelperService',
		'cloudDesktopSidebarService', 'cloudCommonGridService', 'transportplanningPackageGoodsHandler','transportplanningTransportRouteStatusLookupService', 'transportplanningPackageJobLookupdataHelper',
		'transportplanningPackageDataServiceBundleDocumentsExtension', 'transportplanningPackageNavigationExtension', '$injector'];

	function PackageMainService($q, _, globals, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, platformDataServiceProcessDatesBySchemeExtension,
		ServiceDataProcessArraysExtension, basicsCommonMandatoryProcessor, transportplanningPackageDataProcessor, transportplanningPackageFilterService,
		transportplanningPackageImageProcessor, $http, pkgStatusLookupServ, packageTypeHelperServ,
		cloudDesktopSidebarService, cloudCommonGridService, packageGoodsHandler,routeStatusServ,jobLookupdataHelper, bundleDocumentsExtension,
		navigationExtension, $injector) {
		// if (_.isNil(basicsLookupdataLookupDescriptorService.getData('TrsRoute'))) {
		// 	basicsLookupdataLookupDescriptorService.loadData('TrsRoute');
		// }
		var isRouteNotInTransport = function (selectedItem) {
			if(_.isNil(selectedItem.TrsRouteFk)){
				return false;
			}

			var statusId = selectedItem.TrsRteStatusFk;
			if (!statusId) {
				var route = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRoute', selectedItem.TrsRouteFk);
				if(route){
					statusId = route.TrsRteStatusFk;
				}
				else {
					return false;
					// remark: If the route don't belong to current company, then we cannot get it by the route id. In this case, here we return false.
				}
			}

			var statusList = routeStatusServ.getList();
			var status = _.find(statusList, {Id: statusId});
			return status && status.IsInTransport === false;
		};

		var serviceOption = {
			hierarchicalRootItem: {
				module: packageModule,
				serviceName: 'transportplanningPackageMainService',
				entityNameTranslationID: 'transportplanning.package.entityPackage',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'transportplanning/package/',
					endRead: 'customfiltered',
					usePostForRead: true,
					extendSearchFilter: function (readData) {
						readData.orderBy = [{Field: 'Code'}];
					}
				},
				processor: [new ServiceDataProcessArraysExtension(['ChildPackages'])],
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'TransportPackageDto',
					moduleSubModule: 'TransportPlanning.Package'
				}), transportplanningPackageDataProcessor, transportplanningPackageImageProcessor],
				presenter: {
					tree: {
						parentProp: 'TransportPackageFk',
						childProp: 'ChildPackages',
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};

							var routes = basicsLookupdataLookupDescriptorService.getData('TrsRoute');
							_.each(result.dtos, function (item) {
								if (item.TrsRouteFk) {
									var route = _.find(routes, {Id: item.TrsRouteFk});
									if (route) {
										item.TrsRteStatusFk = route.TrsRteStatusFk;
										setChildrenFks(item, routes);
									}
								}
							});

							packageGoodsHandler.updateGoodsDescription(result.dtos, service.gridRefresh);
							return serviceContainer.data.handleReadSucceeded(result, data);
						},
						handleCreateSucceeded: function (item) {
							if (item.Version === 0) {
								if (item.ProjectFk === 0 || item.ProjectFk === null) {
									var temp = cloudDesktopSidebarService.filterRequest.projectContextId;
									if (temp !== null && temp !== 0) {
										item.ProjectFk = temp;
									}
								}
								if (item.TrsRouteFk){
									var route = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRoute', item.TrsRouteFk);
									if (route){
										item.TrsRteStatusFk = route.TrsRteStatusFk;
									}
								}
							}
						},
						initCreationData: function (creationData) {
							creationData.PKey1 = creationData.parentId;
						}
					}
				},
				entityRole: {
					root: {
						itemName: 'TransportPackage',
						moduleName: 'cloud.desktop.moduleDisplayNameTrsPackage',
						handleUpdateDone: handleUpdateDone,
						useIdentification: true,
						descField: 'DescriptionInfo.Translated'
					}
				},
				actions: {
					delete: {},
					create: 'hierarchical',
					canCreateChildCallBackFunc: function (selectedItem) {
						if(!selectedItem){
							return false;
						}
						//check pkg type
						if(!packageTypeHelperServ.isPkg(selectedItem.TrsPkgTypeFk)){
							return false;
						}

						if (selectedItem.TrsRouteFk) {
							//check route status
							return isRouteNotInTransport(selectedItem);
						}
						else {
							return true;
						}

					},
					canDeleteCallBackFunc: function (selectedItem) {
						if (selectedItem.Version <= 0) {
							return true;
						}
						//check route status
						if (selectedItem.TrsRouteFk && !isRouteNotInTransport(selectedItem)) {
							return false;
						}

						//check selected package's status
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

				translation: {
					uid: 'transportplanningPackageMainService',
					title: 'transportplanning.package.entityPackage',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'TransportPackageDto',
						moduleSubModule: 'TransportPlanning.Package'
					}
				},

				entitySelection: true,
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						//useCurrentClient: true,
						//includeNonActiveItems: false,//package has not ISLIVE field, it needn't this option
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						pinningOptions: {
							isActive: true, showPinningContext: [{token: 'project.main', show: true}],
							setContextCallback: function (prjService) {
								cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'ProjectFk');
							}
						}
					}
				}
			}
		};
		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		//validate when new package
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'TransportPackageDto',
			moduleSubModule: 'TransportPlanning.Package',
			validationService: 'transportplanningPackageValidationService',
			mustValidateFields: true //The actual mustValidateFields(a string array) will be automatically created by validationService, if mustValidateFields is bool and the corresponding validationService does exist.
		});

		var service = serviceContainer.service;
		transportplanningPackageFilterService.registerfilterService();

		function setChildrenFks(parent, routes) {
			if (parent.ChildPackages === null) {
				return;
			}
			_.each(parent.ChildPackages, function (item) {
				if (item.TrsRouteFk) {
					var route = _.find(routes, {Id: item.TrsRouteFk});
					if (route) {
						item.TrsRteStatusFk = route.TrsRteStatusFk;
						setChildrenFks(item, routes);
					}
				}
				else if (parent.TrsRteStatusFk) {
					item.TrsRteStatusFk = parent.TrsRteStatusFk;
					setChildrenFks(item, routes);
				}
			});
		}


		service.resourceRequsitionUpdate = new Platform.Messenger();
		
		function handleUpdateDone(updateData, response, data) {
			var isRefreshPkgGrid = false;
			//If ChildPackages of the current Package has been updated in server side, refresh ChildPackages data in the UI according to the response data.
			if (updateData.TransportPackage && response.TransportPackage) {
				if (updateData.TransportPackage.ChildPackages && updateData.TransportPackage.ChildPackages.length > 0 &&
					response.TransportPackage.ChildPackages && response.TransportPackage.ChildPackages.length > 0 &&
					updateData.TransportPackage.ChildPackages[0].Version !== response.TransportPackage.ChildPackages[0].Version) {
					var list = [];
					cloudCommonGridService.flatten(response.TransportPackage.ChildPackages, list, 'ChildPackages');
					_.each(list, function (pkg) {
						var item = _.find(data.itemList, {Id: pkg.Id});
						angular.extend(item, pkg);
					});
					isRefreshPkgGrid = true;
				}
			}


			//invoking handleOnUpdateSucceeded function at first, then do the extra things
			data.handleOnUpdateSucceeded(updateData, response, data, true);

			if (isRefreshPkgGrid) {
				service.gridRefresh();
			}
			// fire messenger "updateDone" for calling registered callbacks. At the moment, messenger "updateDone" is only registered in transportplanningPackageListController. There is no other callback of "updateDone" will be called.
			serviceContainer.data.updateDone.fire(data);
			// remark: If messenger container.data.updateDone is obsoleted in the future(maybe by refactor of framework), we should define a new messenger(like "newUpdateDone") for registering our own callback.(by zwz 2020/1/19)
		}

		serviceContainer.service.SetTrsRouteFkAndRefreshGrid = function(pkg) {
			var item = _.find(serviceContainer.data.itemList, {Id: pkg.Id});
			if(item && item === pkg){

				var list = [];
				cloudCommonGridService.flatten(pkg.ChildPackages, list, 'ChildPackages');
				_.each(list, function (p) {
					p.TrsRouteFk = pkg.TrsRouteFk;
				});
				if(pkg.TrsRouteFk === null){
					pkg.TrsWaypointSrcFk = null;
					pkg.TrsWaypointDstFk = null;
					pkg.TrsRteStatusFk = null;
					_.each(list, function (p) {
						p.TrsWaypointSrcFk = null;
						p.TrsWaypointDstFk = null;
						// clear TrsRteStatusFk
						p.TrsRteStatusFk = null;
					});
				}
				else {
					// set TrsRteStatusFk
					var route = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRoute', pkg.TrsRouteFk);
					if(route){
						pkg.TrsRteStatusFk = route.TrsRteStatusFk;
						_.each(list, function (p) {
							p.TrsRteStatusFk = route.TrsRteStatusFk;
						});
					}

					$http.get(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/list?routeId=' + pkg.TrsRouteFk).then(function (respond) {
						var wayPoints = respond.data.Main;
						var srcWp = _.find(wayPoints, {IsDefaultSrc: true});
						var dstWp = _.find(wayPoints, {IsDefaultDst: true});
						if (srcWp) {
							pkg.TrsWaypointSrcFk = srcWp.Id;
							pkg.LgmJobSrcFk = srcWp.LgmJobFk;
							_.each(list, function (p) {
								p.TrsWaypointSrcFk = srcWp.Id;
								p.LgmJobSrcFk = srcWp.LgmJobFk;
							});
						}
						if (dstWp) {
							pkg.TrsWaypointDstFk = dstWp.Id;
							pkg.LgmJobDstFk = dstWp.LgmJobFk;
							_.each(list, function (p) {
								p.TrsWaypointDstFk = dstWp.Id;
								p.LgmJobDstFk = dstWp.LgmJobFk;
							});

							jobLookupdataHelper.checkAndLoadJobByKey(dstWp.LgmJobFk);
						}
						serviceContainer.service.gridRefresh();
					});
				}

				serviceContainer.service.gridRefresh();
			}
		};

		bundleDocumentsExtension.addBundleDocumentsFunction(service);
		navigationExtension.addNavigation(service);

		service.LoadCustomColumns = function () {
			var customColumnsServiceFactory = $injector.get('ppsCommonCustomColumnsServiceFactory');
			var ppsCommonTranslationSrv = $injector.get('productionplanningCommonTranslationService');
			var pkgCustomColumnsService = customColumnsServiceFactory.getService(moduleName);
			var trsPkgTranslationSrv = $injector.get('transportplanningPackageTranslationService');

			var promises = [];
			promises.push(customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
				ppsCommonTranslationSrv.setTranslationForCustomColumns();
			}));
			promises.push(pkgCustomColumnsService.init('transportplanning/package/customcolumn').then(function () {
				trsPkgTranslationSrv.setTranslationForCustomColumns();
			}));
			return $q.all(promises).then(function () {
				transportplanningPackageDataProcessor.registCustomColumns();
			});
		};

		return service;
	}
})(angular);