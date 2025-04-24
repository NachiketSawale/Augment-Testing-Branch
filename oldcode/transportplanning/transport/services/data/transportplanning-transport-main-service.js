/* global angular, globals, _*/
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportMainService
	 * @function
	 *
	 * @description
	 * transportplanningTransportMainService is the data service for transport.
	 */

	transportModule.factory('transportplanningTransportMainService', transportplanningTransportMainService);
	transportplanningTransportMainService.$inject = [
		'$injector',
		'$http', '$q', 'moment',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformPermissionService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'cloudDesktopSidebarService',
		'transportplanningTransportProcessor',
		'transportplanningTransportReadOnlyProcessor',
		'basicsLookupdataLookupFilterService',
		'transportplanningTransportRouteStatusLookupService',
		'productionplanningCommonStructureFilterService',
		'transportplanningTransportSiteFilterDataService',
		'cloudCommonGridService',
		'transportplanningTransportUtilService',
		'transportplanningTransportAdditionalButtonsExtension',
		'transportplanningTransportLogExtension',
		'transportplanningTransportNavigationExtension',
		'transportplanningTransportPinningContextExtension',
		'transportplanningTransportUpdateModuleHeaderInfoExtension',
		'ppsCommonDataserviceWorkflowCallbackExtension',
		'platformGridAPI',
		'ServiceDataProcessDatesExtension',
		'basicsCompanyNumberGenerationInfoService',
		'ppsCommonCodGeneratorConstantValue',
		'platformRuntimeDataService'];

	function transportplanningTransportMainService($injector,
												   $http, $q, moment,
												   platformDataServiceFactory,
												   platformDataServiceProcessDatesBySchemeExtension,
												   platformPermissionService,
												   basicsLookupdataLookupDescriptorService,
												   basicsCommonMandatoryProcessor,
												   cloudDesktopSidebarService,
												   transportProcessor,
												   transportReadOnlyProcessor,
												   basicsLookupdataLookupFilterService,
												   routeStatusServ,
												   ppsCommonStructureFilterService,
												   siteFilterDataService,
												   cloudCommonGridService,
												   trsUtil,
												   additionalButtonsExtension,
												   logExtension,
												   navigationExtension,
												   pinningContextExtension,
												   updateModuleHeaderInfoExtension,
												   workflowCallbackExtension,
												   platformGridAPI,
												   DatesProcessor,
												   basicsCompanyNumberGenerationInfoService,
												   ppsCommonCodGeneratorConstantValue,
													platformRuntimeDataService) {

		// load UoM lookup data in advance, these lookup data use in method updateSumInfo() (by zwz 2019/7/30)
		if (_.isUndefined(basicsLookupdataLookupDescriptorService.getData('UoM'))) {
			basicsLookupdataLookupDescriptorService.loadData('UoM');
		}
		var lastFilter = null;

		var updateRequisitions = {};
		var updateReservations = {};
		var deleteRequisitions = {};
		var deleteReservations = {};
		var deleteResource = false;
		var truckTypes = [];
		var driverTypes = [];
		var sumDistance = 0, sumActualDistance = 0;
		var isRouteNotInTransport = function () {
			var route = container.service.getSelected();
			if (!route.TrsRteStatusFk) {
				return false;
			}
			var statusList = routeStatusServ.getList();
			var status = _.find(statusList, {Id: route.TrsRteStatusFk});
			return status && status.IsInTransport === false;
		};
		let characteristicColumn = '';

		var serviceInfo = {
			flatRootItem: {
				module: transportModule,
				serviceName: 'transportplanningTransportMainService',
				entityNameTranslationID: 'transportplanning.transport.entityRoute',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'TrsRouteDto',
					moduleSubModule: 'TransportPlanning.Transport'
				}),
					transportProcessor,
					transportReadOnlyProcessor,
					{
						processItem: function (item) {
							item.getType = function () {
								return item.EventTypeFk;
							};
							if(item.Version === 0){
								var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(item.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportRoute);
								if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').hasToGenerateForRubricCategory(categoryId) )
								{
									item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').provideNumberDefaultText(categoryId);
									platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
								}
							}
							else{
								platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: false}]);
							}
						}
					},new DatesProcessor(['PlannedDeliveryTime', 'PlannedDeliveryDate', 'PlannedDeliveryDay'])],
				httpRead: {
					route: globals.webApiBaseUrl + 'transportplanning/transport/route/',
					usePostForRead: true,
					endRead: 'customfiltered',
					extendSearchFilter: function extendSearchFilter(readData) {

						readData.orderBy = [{Field: 'Code'}];

						if (service.isSearchByNavigation) {
							service.isSearchByNavigation = false;
						} else {
							ppsCommonStructureFilterService.extendSearchFilterAssign('transportplanningTransportMainService', readData);
							ppsCommonStructureFilterService.setFilterRequest('transportplanningTransportMainService', readData);
						}
						lastFilter = readData;

						// remark: Now we don't need to adjust PKeys because the corresponding code about PKeys has been refactored in platformDataServiceFactory. (Created by zwz on 7/19/2018)
						// //adjust PKeys according to the latest change of parameter FilterRequest in server side
						// if (readData.PKeys) {
						// 	//var temp = readData.PKeys;
						// 	var array = [];
						// 	_.each(readData.PKeys, function (item) {
						// 		var tmpId = null;
						// 		if(_.isNumber(item)){
						// 			tmpId = item;
						// 		}
						// 		else if(item && _.isNumber(item.Id)){
						// 			tmpId = item.Id;
						// 		}
						// 		if(tmpId){
						// 			array.push({Id: tmpId, PKey1: tmpId});
						// 		}
						// 	});
						// 	if(array.length >0){
						// 		readData.PKeys = array;
						// 	}
						//
						// }
					}
				},
				httpCreate: {
					route: globals.webApiBaseUrl + 'transportplanning/transport/route/',
					usePostForRead: true,
					endCreate: 'createroute'
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'transportplanning/transport/route/',
					usePostForRead: true,
					endUpdate: 'updateroute'
				},
				httpDelete: {
					route: globals.webApiBaseUrl + 'transportplanning/transport/route/',
					usePostForRead: true,
					endDelete: 'multidelete'
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'TrsRoutes',
						moduleName: 'cloud.desktop.moduleDisplayNameTransport',
						descField: 'DescriptionInfo.Translated',
						useIdentification: true,//will set each pinningItem -> pItem.id = {Id: pItem.id}
						handleUpdateDone: handleUpdateDone,
						addToLastObject: true,
						lastObjectModuleName: moduleName
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							$injector.get('basicsLookupdataLookupDataService').unregisterDataProvider('logisticjobEx');//fixed the crash issue when refresh
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							_.forEach(result.dtos, function (dto) {
								dto.PlannedDeliveryTime = dto.PlannedDelivery;
								dto.PlannedDeliveryDate = dto.PlannedDelivery;
								dto.PlannedDeliveryDay = dto.PlannedDelivery;
							});
							const dataRead = container.data.handleReadSucceeded(result, data);
							handleCharacteristic(result.dtos);
							service.isBusy = false;
							return dataRead;
						},
						initCreationData: function (creationData) {
							creationData.projectId = cloudDesktopSidebarService.filterRequest.projectContextId;

							var siteItem = siteFilterDataService.getSelectedItem();
							if (siteItem) {
								creationData.SiteFk = siteItem.Id;
							}
						},
						handleCreateSucceeded: function (newItem) {
							// var temp1 = basicsLookupdataLookupDescriptorService.getData("logisticJobLookupByProjectDataService");
							// //set default value of ProjectFk for new Item
							// if(newItem.Version === 0 && cloudDesktopSidebarService.filterRequest.projectContextId){
							// newItem.ProjectFk = cloudDesktopSidebarService.filterRequest.projectContextId;
							// }

							// fix issue for avoiding unnecessary job lookup-request(when value is 0)
							if (newItem.Version === 0 && newItem.DefSrcWaypointJobFk === 0) {
								newItem.DefSrcWaypointJobFk = null;
							}

							if (newItem.Version === 0 && newItem.EventTypeFk === 0) {
								newItem.PlannedStart = null;
								newItem.PlannedFinish = null;
								newItem.EarliestStart = null;
								newItem.EarliestFinish = null;
								newItem.LatestStart = null;
								newItem.LatestFinish = null;
							}
							handleCharacteristic(newItem, true);
						}
					}
				},
				actions: {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function () {
						//For creation, both create-permissions of the original route accessright and the new route accessright need to be set.
						if (!platformPermissionService.has('a78a23e2b050418cb19df541ab9bf028', platformPermissionService.permissionsFromString('c')) ||
							!platformPermissionService.has('849c2206bc204a2a9684343007ce4f31', platformPermissionService.permissionsFromString('c'))) {
							return false;
						}
						return true;
					},
					canDeleteCallBackFunc: function (selectedItem) {
						//First, exclude situtation of "selected item is new unsaved"
						if (selectedItem.Version <= 0) {
							return true;
						}

						//For deletion, both delete-permissions of the original route accessright and the new route accessright need to be set.
						if (!platformPermissionService.has('a78a23e2b050418cb19df541ab9bf028', platformPermissionService.permissionsFromString('d')) ||
							!platformPermissionService.has('849c2206bc204a2a9684343007ce4f31', platformPermissionService.permissionsFromString('d'))) {
							return false;
						}

						//Then, exclude situtation of "the status of selected item is invalid"
						if (!selectedItem.TrsRteStatusFk) {
							return false;
						}
						var platformContextService = $injector.get('platformContextService');
						if (selectedItem.CompanyId !== platformContextService.clientId) {
							return false;
						}

						//At last, return result(true or false) according to the valid status of selected item
						var statusList = routeStatusServ.getList();//var statusList = basicsLookupdataLookupDescriptorService.getData('TrsRteStatus');
						var status = _.find(statusList, {Id: selectedItem.TrsRteStatusFk});
						return status && status.IsDeletable;
					}
				},
				translation: {
					uid: 'transportplanningTransportMainService',
					title: 'transportplanning.transport.entityRoute',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'TrsRouteDto',
						moduleSubModule: 'TransportPlanning.Transport'
					}
				},
				sidebarWatchList: {active: true}, // enable watchlist for this module
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						pattern: '',
						pageSize: 100,
						//useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						pinningOptions: pinningContextExtension.createPinningOptions()
					}
				},
				useItemFilter: true
			}
		};

		initialize();
		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		var service = container.service;
		var data = container.data;
		data.fireSelectionChangedEventAlways = false; // Prevents an unexpected reset of the grid selection which is triggered by default when the saving is completed
		service.isSearchByNavigation = false;
		navigationExtension.addNavigation(service);
		additionalButtonsExtension.addFunctionsForAdditionalButtons(service, data);
		workflowCallbackExtension.addWorkflowCallbackExtension(container);
		logExtension.addLogMethods(service);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'TrsRouteDto',
			moduleSubModule: 'TransportPlanning.Transport',
			validationService: 'transportplanningTransportValidationService',
			//mustValidateFields: ['Code','LgmJobFk','ProjectFk']
			mustValidateFields: true //The actual mustValidateFields(a string array) will be automatically created by validationService, if mustValidateFields is bool and the corresponding validationService does exist.
		});

		// connect to filter service
		//ppsCommonStructureFilterService.setServiceToBeFiltered(container.service);
		ppsCommonStructureFilterService.setFilterFunction('transportplanningTransportMainService', ppsCommonStructureFilterService.getCombinedFilterFunction); // default filter

		container.service.getLastFilter = function () {
			if (_.isNil(lastFilter)) {
				lastFilter = {};
				ppsCommonStructureFilterService.extendSearchFilterAssign('transportplanningTransportMainService', lastFilter);
			}
			return lastFilter;
		};

		container.service.updateActivityForFilterDragDrop = function (itemOnDragEnd) {
			container.service.markItemAsModified(itemOnDragEnd);
			container.service.update();
		};

		container.service.updateSumInfo = function (type) {
			var route = container.service.getSelected();
			var wayList = $injector.get('transportplanningTransportWaypointDataService').getList();
			var lengthUoms = _.filter(basicsLookupdataLookupDescriptorService.getData('UoM'), {LengthDimension: 1});
			switch (type) {
				case 'Distance':
					route.SumDistance = _.reduce(wayList, function (memo, wayPoint) {
						var routeUom = _.find(lengthUoms, function (uom) {
							return route.UomFk ? uom.Id === route.UomFk :
								(wayPoint.UomFk ? uom.Id === wayPoint.UomFk : (uom.IsBase && uom.Factor === 1));
						});
						var wayPointUom = _.find(lengthUoms, function (uom) {
							return wayPoint.UomFk > 0 ? uom.Id === wayPoint.UomFk : (uom.IsBase && uom.Factor === 1);
						});
						return memo + wayPoint.Distance * wayPointUom.Factor / routeUom.Factor;
					}, 0);
					container.service.gridRefresh();
					break;
				case 'ActualDistance':
					route.SumActualDistance = _.reduce(wayList, function (memo, wayPoint) {
						var routeUom = _.find(lengthUoms, function (uom) {
							return route.UomFk ? uom.Id === route.UomFk :
								(wayPoint.UomFk ? uom.Id === wayPoint.UomFk : (uom.IsBase && uom.Factor === 1));
						});
						var wayPointUom = _.find(lengthUoms, function (uom) {
							return wayPoint.UomFk ? uom.Id === wayPoint.UomFk : (uom.IsBase && uom.Factor === 1);
						});
						return memo + wayPoint.ActualDistance * wayPointUom.Factor / routeUom.Factor;
					}, 0);
					container.service.gridRefresh();
					break;
				case 'Expenses':
					var expensesValues = _.map(wayList, _.iteratee('Expenses'));
					route.SumExpenses = _.reduce(expensesValues, function (memo, num) {
						return memo + num;
					}, 0);
					container.service.gridRefresh();
			}
		};

		container.service.createDispatchingNote = function (wizParams, routes) {
			if (routes && (routes instanceof Array) && routes.length > 0) {
				var ids = routes.map(function (route) {
					return route.Id;
				});
				var parm = {
					routeIds: ids,
					currentRouteId: container.service.getSelected().Id,
					wizParams: wizParams
				};
				return $http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createDispatchingNote', parm);
			}
		};

		container.service.handleResourceInfo = function (entity, previousItem, selectedItem, type) {
			if (previousItem && selectedItem) {
				container.service.updateResourceInfo(entity, type, true);
			} else if (!previousItem && selectedItem) {
				if (type === 'Truck') {
					var index = -1;
					if (_.isArray(updateRequisitions[entity.Id]) && updateRequisitions[entity.Id].length > 0) {
						for (var i = 0; i < updateRequisitions[entity.Id].length; i++) {
							var requisition = updateRequisitions[entity.Id][i];
							if (requisition.Description === 'Truck' && !requisition.ResourceFk && requisition.Version === 0) {
								index = i;
							}
						}
					}
					if (index >= 0) {
						updateRequisitions[entity.Id].splice(index, 1);
						entity.TruckTypeFk = selectedItem.TypeFk;
					}
				}
				container.service.updateResourceInfo(entity, type, false);
			} else if (previousItem && !selectedItem) {
				deleteResource = true;
				container.service.updateResourceInfo(entity, type, true, previousItem);
			}
		};

		container.service.updateResourceInfo = function (route, type, update, previousItem) {
			var entity = _.clone(route);
			if (previousItem) {
				if (type === 'Truck') {
					entity.TruckFk = previousItem.Id;
				} else if (type === 'Driver') {
					entity.DriverFk = previousItem.Id;
				}
			}

			// for passing validation of DefSrcWaypointJobFk of TrsRouteDto, just avoid error about "Error converting value {null} to type 'System.Int32'. Path 'DefSrcWaypointJobFk'."
			if (_.isNil(entity.DefSrcWaypointJobFk)) {
				entity.DefSrcWaypointJobFk = 0; // 0 is a invalid value of job, it means nothing that is the same as null.
			}

			let isDeleteResource = deleteResource;
			deleteResource = false; //must reset before async request
			var postData = {Route: entity, Type: type, Update: update};
			var promise = $http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/updateresource', postData);
			promise.then(function (response) {
				if(response.data.length == 0) { // means it's empty after load, fill once before save, and change to another one
					if(_.isArray(updateRequisitions[entity.Id])){
						let req = _.find(updateRequisitions[entity.Id], req => !!req['IsRequisitionFor' + type]);
						if (req) {
							if (isDeleteResource) {
								_.remove(updateRequisitions[entity.Id], req => !!req['IsRequisitionFor' + type]);
							} else {
								if(type !== 'TruckType') {
									req.ResourceFk = type === 'Truck' ? route.TruckFk : route.DriverFk;
								}
								else {
									req.TypeFk = route.TruckTypeFk;
								}
							}
						}
					}
					if(_.isArray(updateReservations[entity.Id])) {
						let rsv = _.find(updateReservations[entity.Id], rsv => !!rsv['IsReservationFor' + type]);
						if (rsv) {
							if (isDeleteResource) {
								_.remove(updateReservations[entity.Id], rsv => !!rsv['IsReservationFor' + type]);
							} else {
								rsv.ResourceFk = type === 'Truck' ? route.TruckFk : route.DriverFk;
							}
						}
					}
				}
				else {
					var projectFk = container.service.getSelected() ?
						container.service.getSelected().ProjectFk : null;
					_.forEach(response.data, function (item) {
						item.ProjectFk = projectFk;
						 if (!isDeleteResource) {
							 if (item.RequisitionStatusFk) {
								 syncToUpdateRequisition(entity.Id, type, item);
								 if(route.Version === 0 && type === 'Truck') {
									 route.TruckTypeFk = item.TypeFk;
								 }
							 } else {
								 syncToUpdateReservation(entity.Id, type, item);
							 }
						} else { // isDeleteResource === true
							if(item.RequisitionStatusFk) {
								removeFromRequisition(entity.Id, item);
							} else {
								removeFromReservation(entity.Id, item);
							}

							if(type === 'TruckType') { // delete res_requisition
								removeFromDeleteRequisition(entity.Id, item);
								 // check if this requisition linked to reservation, only delete req when it's not linked to reservation
								$http.get(globals.webApiBaseUrl + 'resource/reservation/getForResRequisition?resRequisitionId=' + item.Id).then((response) => {
									if(response.data.length === 0) {
										syncToDeleteRequisition(entity.Id, type, item);
										synchronizeResRequisitions(deleteRequisitions[entity.Id]);
									}else {
										item.TypeFk = null; // set to reservation res_type when truck type is empty
										syncToUpdateRequisition(entity.Id, type, item);
									}
								});
							} else { // delete res_reservation
								syncToDeleteReservation(entity.Id, type, item);
								synchronizeResReservations(deleteReservations[entity.Id]);
							}
						}

						//Handle copy multiple-route and set truck/driver for one of them
						if(!update) {
							if (type === 'Truck') {
								route.TruckReqId = item.Id;
							}
							else if (type === 'Driver') {
								route.DriverReqId = item.Id;
							}
							else if (type === 'TruckType') {
								route.TruckTypeReqId = item.Id;
							}
						}
					});
				}
			});
			registerAsyncCall(promise);
			return promise;
		};

		function removeFromRequisition(routeId, requisition) {
			if(_.isArray(updateRequisitions[routeId])) {
				_.remove(updateRequisitions[routeId], req => req.Id === requisition.Id);
			}
		}

		function removeFromReservation(routeId, reservation) {
			if(_.isArray(updateReservations[routeId])) {
				_.remove(updateReservations[routeId], req => req.Id === reservation.Id);
			}
		}

		function removeFromDeleteRequisition(routeId, requisition) {
			if(_.isArray(deleteRequisitions[routeId])) {
				_.remove(deleteRequisitions[routeId], req => req.Id === requisition.Id);
			}
		}

		function removeFromDeleteReservation(routeId, reservation) {
			if(_.isArray(deleteReservations[routeId])) {
				_.remove(deleteReservations[routeId], req => req.Id === reservation.Id);
			}
		}

		function syncToUpdateRequisition(routeId, type, requisition) {
			if(_.isArray( updateRequisitions[routeId])) {
				_.remove(updateRequisitions[routeId], req => req.Id === requisition.Id);
			} else {
				updateRequisitions[routeId] = [];
			}
			requisition['IsRequisitionFor' + type] = true;
			updateRequisitions[routeId].push(requisition);
		}

		function syncToUpdateReservation(routeId, type, reservation) {
			if(_.isArray(updateReservations[routeId])) {
				_.remove(updateReservations[routeId], res => res.Id === reservation.Id);
			} else {
				updateReservations[routeId] = [];
			}
			reservation['IsReservationFor' + type] = true;
			updateReservations[routeId].push(reservation);
		}

		function syncToDeleteRequisition(routeId, type, requisition) {
			if(_.isArray(deleteRequisitions[routeId])) {
				_.remove(deleteRequisitions[routeId], res => res.Id === requisition.Id);
			} else {
				deleteRequisitions[routeId] = [];
			}
			deleteRequisitions[routeId].push(requisition);
		}

		function syncToDeleteReservation(routeId, type, reservation) {
			if(_.isArray(deleteReservations[routeId])) {
				_.remove(deleteReservations[routeId], res => res.Id === reservation.Id);
			} else {
				deleteReservations[routeId] = [];
			}
			deleteReservations[routeId].push(reservation);
		}

		function registerAsyncCall(asyncCall) {
			if (!container.asyncCalls) {
				container.asyncCalls = [];
			}
			container.asyncCalls.push(asyncCall);
		}

		function handleWaypointUpdate() {
			var trackServ  = $injector.get('platformDataServiceModificationTrackingExtension');
			var updateData = trackServ.getModifications(container.service);
			if(updateData.TrsRoutes && updateData.TrsRoutes.length === 1 && updateData.TrsRoutes[0].PDChanged === true){
				var selected = _.find(container.service.getList(), {Id:updateData.TrsRoutes[0].Id});
				var needReset = false;
				if(updateData.TrsWaypointToSave){
					 var errorWaypoints = _.filter(updateData.TrsWaypointToSave, function (waypoint){
						return waypoint.TrsWaypoint.TrsRouteFk !== selected.Id;
					});
					 needReset = errorWaypoints.length > 0;
					 if(needReset){
						 _.remove(updateData.TrsWaypointToSave, function (item){
							 return item.TrsWaypoint.TrsRouteFk !== selected.Id;
						 });
					 }
				}
				if(needReset || _.isNil(updateData.TrsWaypointToSave)){
					var extension = $injector.get('transportplanningTransportMainServiceEntityPropertychangedExtension');
					var waypointServ = $injector.get('transportplanningTransportWaypointDataService');
					var wpList = waypointServ.getList();
					if(wpList.length > 0 && wpList[0].TrsRouteFk === selected.Id){
						extension.shiftTimeforWaypoints(selected, 'PlannedDelivery', waypointServ.parentService(),wpList, waypointServ);
					} else {
						var promise = $http.get(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/list?routeId=' + selected.Id);
						promise.then(function (response) {
							if(response.data.Main) {
								waypointServ.waypoint4Update = response.data.Main;
								extension.shiftTimeforWaypoints(selected, 'PlannedDelivery', waypointServ.parentService(),response.data.Main, waypointServ);
								waypointServ.waypoint4Update = [];
							}
						});
						registerAsyncCall(promise);
					}
				}
			}
		}

		container.data.waitForOutstandingDataTransfer = function waitForOutstandingDataTransfer() {
			handleWaypointUpdate();
			return $q.all(_.map(container.asyncCalls, function (call) {
				return call;
			}));
		};

		container.service.doPrepareUpdateCall = function (updateData) {
			container.asyncCalls = [];
			if(updateData.TrsRoutes){
				updateData.TrsRoutes.forEach((updRoute) => {
					if (!_.isEmpty(updateRequisitions[updRoute.Id])) {
						var completeRequisitions = [];
						_.forEach(updateRequisitions[updRoute.Id], function (item) {
							item = {
								ResRequisition: item
							};
							completeRequisitions.push(item);
						});
						updateData.ResRequisitionToSave = updateData.ResRequisitionToSave ?
							updateData.ResRequisitionToSave.concat(completeRequisitions)
							: completeRequisitions;
					}
					if (!_.isEmpty(updateReservations[updRoute.Id])) {
						updateData.ResReservationToSave = updateData.ResReservationToSave ?
							updateData.ResReservationToSave.concat(updateReservations[updRoute.Id])
							: updateReservations[updRoute.Id];
					}
					if (!_.isEmpty(deleteRequisitions[updRoute.Id])) {
						updateData.ResRequisitionToDelete = updateData.ResRequisitionToDelete ?
							updateData.ResRequisitionToDelete.concat(deleteRequisitions[updRoute.Id])
							: deleteRequisitions[updRoute.Id];
					}
					if (!_.isEmpty(deleteReservations[updRoute.Id])) {
						updateData.ResReservationToDelete = updateData.ResReservationToDelete ?
							updateData.ResReservationToDelete.concat(deleteReservations[updRoute.Id])
							: deleteReservations[updRoute.Id];
					}
				})
			}
			if (updateData.TrsRoute) {
				if (updateData.TrsRoute.SumDistance > 0) {
					sumDistance = updateData.TrsRoute.SumDistance;
				}
				if (updateData.TrsRoute.SumActualDistance > 0) {
					sumActualDistance = updateData.TrsRoute.SumActualDistance;
				}
			}
			if(updateData.TrsRoutes && updateData.TrsRoutes.length === 1 && updateData.TrsWaypointToSave){
				//remove the waypoints that didn't belong to the TrsRoute
				var selected = updateData.TrsRoutes[0];
				_.remove(updateData.TrsWaypointToSave, function (item){
					return item.TrsWaypoint.TrsRouteFk !== selected.Id;
				});
			}
			if (updateData.ResRequisitionToSave) {
				_.forEach(updateData.ResRequisitionToSave, function (item) {
					item.Requisition = item.ResRequisition;
					item.ResRequisition = null;
				});
			}
			if (updateData.SpecialRequisitionToSave) {
				_.forEach(updateData.SpecialRequisitionToSave, function (item) {
					item.Requisition = item.SpecialRequisition;
					item.SpecialRequisition = null;
				});
			}

			// for passing validation of DefSrcWaypointJobFk of TrsRouteDto, just avoid error about "Error converting value {null} to type 'System.Int32'. Path 'DefSrcWaypointJobFk'."
			if (updateData.TrsRoutes && updateData.TrsRoutes.length > 0) {
				updateData.TrsRoutes.forEach(rte => {
					if (_.isNil(rte.DefSrcWaypointJobFk)) {
						rte.DefSrcWaypointJobFk = 0; // 0 is a invalid value of job, it means nothing that is the same as null.
					}
				});
			}

			container.service.cleanupTruckDriver();
		};

		container.service.getTruckTypes = function () {
			return truckTypes;
		};

		container.service.getDriverTypes = function () {
			return driverTypes;
		};

		container.service.updateJobRelatedProperties = function (entity, selected) {
			if (entity) {
				selected = selected || {};
				var relatedProperties = ['BusinessPartnerFk', 'DeliveryAddressContactFk', 'SubsidiaryFk', 'CustomerFk'];
				relatedProperties.forEach(function (item) {
					entity[item] = selected[item];
				});
				//update ProjectDefFk by selected job's ProjectFk, if ProjectDefFk has no value
				if (selected.ProjectFk && (_.isNil(entity.ProjectDefFk) || entity.ProjectDefFk === 0)) {
					entity.ProjectDefFk = selected.ProjectFk;
				}
				container.data.markItemAsModified(entity, container.data);
				container.data.mergeItemAfterSuccessfullUpdate(entity, entity, true, container.data);
			}
		};

		container.service.appendNewItem = function (newItem) {
			$injector.get('basicsLookupdataLookupDataService').unregisterDataProvider('logisticjobEx');//fixed the crash issue when refresh
			var data = container.data;
			$injector.get('platformDataServiceDataProcessorExtension').doProcessItem(newItem, data);
			data.itemList.push(newItem);
			$injector.get('platformDataServiceActionExtension').fireEntityCreated(data, newItem);
			return $injector.get('platformDataServiceSelectionExtension').doSelect(newItem, data);
		};

		container.service.appendUnSavedNewItem = function (newItem, isUpdate, isDelay) {
			var fn = function () {
				if (newItem.Route.AlternateTruckTypeFk) {
					newItem.oldRoute.TruckTypeFk = newItem.Route.AlternateTruckTypeFk;
					newItem.Route.AlternateTruckTypeFk = null;
					container.service.updateResourceInfo(newItem.oldRoute, 'TruckType', false);
				}
				//container.data.mergeItemAfterSuccessfullUpdate(newItem.oldRoute, newItem.Route, true, container.data);
				container.service.markItemAsModified(newItem.oldRoute);
				newItem.oldRoute.isAddingTrsGood = true;
				var wps = _.map(newItem.TrsWaypointToSave, 'TrsWaypoint');
				var wpService = $injector.get('transportplanningTransportWaypointDataService');
				wpService.appendUnSavedNewItems(wps, isDelay);
				$injector.get('basicsLookupdataLookupDescriptorService').addData('transportplanningTransportWaypointLookupDataService', wps);
				var wpLUService = $injector.get('transportplanningTransportWaypointLookupDataService');
				wpLUService.setFilter(newItem.Route.Id);
				wpLUService.setCache(null, _.sortBy(wpLUService.getListSync().concat(_.map(newItem.TrsWaypointToSave, 'TrsWaypoint')), 'PlannedTime'));
				wpLUService.transientData = {
					routeFn: function () {
						return container.service.getSelected();
					}, items: wps
				};
				var packageService = $injector.get('transportplanningTransportPackageDataService');
				packageService.appendUnSavedNewItems(_.map(newItem.PackageToSave, 'TransportPackage'), isDelay);
			};
			if (!isUpdate) {
				container.data.unloadSubEntities(container.data);
				container.data.selectedItem = newItem.Route;
				return container.data.onCreateSucceeded(newItem.Route, container.data).then(function () {
					fn();
				});
			} else {
				fn();
			}
		};

		container.service.setRouteDistanceUom = function (type, selectedUom) {
			var route = container.service.getSelected();
			switch (type) {
				case 'route':
					route.UomFk = selectedUom ? selectedUom.Id : null;
					break;
				case 'waypoint':
					if (route.UomFk === null) {
						var wpService = $injector.get('transportplanningTransportWaypointDataService');
						var wp = wpService.getFirstWaypoint();
						if (wp && wp.UomFk !== null) {
							route.UomFk = wp.UomFk;
						}
					}
			}
			if (route.UomFk) {
				container.data.markItemAsModified(route, container.data);
				container.data.mergeItemAfterSuccessfullUpdate(route, route, true, container.data);
			}
		};

		container.service.registerListLoaded(getResourceTypes);

		container.service.registerItemModified(function (e, item) {
			//just for validating old route data(their LgmJobFk are null) --by zweig 2018/11/05
			if (item && item.Version > 0 && item.LgmJobFk === null) {
				var modState = $injector.get('platformModuleStateService').state(container.service.getModule());
				if (_.findIndex(modState.validation.issues, function (err) {
					return err.entity.Id === item.Id && err.model === 'LgmJobFk';
				}) === -1) {
					$injector.get('transportplanningTransportValidationService').validateLgmJobFk(item, item.LgmJobFk, 'LgmJobFk');
				}
			}
		});

		container.service.updateRouteDeliveryFieldsByWaypoint = function () {
			var selectedRoute = container.service.getSelected();
			var wp = _.find($injector.get('transportplanningTransportWaypointDataService').getList(), {IsDefaultDst: true});
			//set readonly for PlannedDelivery/ActualDelivery
			selectedRoute.HasDefaultDstWaypoint = !!wp;
			//$injector.get('transportplanningTransportReadOnlyProcessor').processItemPlannedDeliveryOrActualDelivery(selectedRoute);

			if (wp) {
				selectedRoute.PlannedDelivery = wp.PlannedTime;
				selectedRoute.ActualDelivery = wp.ActualTime;
			} else {
				selectedRoute.PlannedDelivery = null;
				selectedRoute.ActualDelivery = null;
			}
			$injector.get('transportplanningTransportValidationService').validatePlannedDelivery(selectedRoute, selectedRoute.PlannedDelivery, 'PlannedDelivery');
			container.service.gridRefresh();
		};

		container.service.updateRouteDeliveryFieldByWaypoint = function (waypoint, field) {
			if (waypoint.IsDefaultDst === true) {
				//sync corresponding route's PlannedDelivery/ActualDelivery
				var selectedRoute = container.service.getSelected();
				if (selectedRoute) {
					var prop = {
						'PlannedTime': 'PlannedDelivery',
						'ActualTime': 'ActualDelivery'
					}[field];
					selectedRoute[prop] = waypoint[field];
					if (field === 'PlannedDelivery') {
						$injector.get('transportplanningTransportValidationService').validatePlannedDelivery(selectedRoute, selectedRoute.PlannedDelivery, 'PlannedDelivery');
					}
					container.service.gridRefresh();
				}
			}
		};

		container.service.fieldChanged = new Platform.Messenger();

		container.service.handleFieldChanged = function (entity, field) {
			$injector.get('transportplanningTransportMainServiceEntityPropertychangedExtension').onPropertyChanged(entity, field, container.service);
			container.service.fieldChanged.fire(entity, field);
		};

		container.service.handlePlannedDeliveryTimeChanged = function (entity, field) {
			entity.PlannedDelivery.set({
				hour: entity[field].hour(),
				minute: entity[field].minute()
			});
			// container.service.gridRefresh();
		};

		container.service.handlePlannedDeliveryDateChanged = function (entity, field) {
			entity.PlannedDelivery.set({
				year: entity[field].year(),
				month: entity[field].month(),
				date: entity[field].date()
			});
			entity.PlannedDeliveryDay = entity.PlannedDelivery;
			// container.service.gridRefresh();
		};

		container.service.syncPlannedDelivery = function (entity, field) {
			entity.PlannedDeliveryTime = moment(entity[field]);
			entity.PlannedDeliveryDate = moment(entity[field]);
			entity.PlannedDeliveryDay = moment(entity[field]);
			// container.service.gridRefresh();
		};

		container.service.setShowHeaderAfterSelectionChanged(updateModuleHeaderInfoExtension.updateModuleHeaderInfo);

		container.service.refreshSelectedRow = function () {
			var selectedItem = container.service.getSelected();
			if (!_.isNil(selectedItem)) {
				platformGridAPI.rows.refreshRow({gridId: '1293102b4ee84cb5bd1b538fdf2ae90a', item: selectedItem});
			}
		};

		container.service.ChildServiceOptions = {
			canCreateCallBackFunc: isRouteNotInTransport,
			canDeleteCallBackFunc: isRouteNotInTransport,
			canCreateReferenceCallBackFunc: isRouteNotInTransport,
			canDeleteReferenceCallBackFunc: isRouteNotInTransport
		};


		container.service.showAddGoodsWizard = function() {
			var wizardService = $injector.get('transportplanningTransportRouteWizardService');
			wizardService.addGoods2TransportRoute();
			service.triggerAddGoodsWizard = false;
		};

		container.service.getContainerData = () => container.data;

		container.service.mergeItemAfterSuccessfullUpdate = function(oldItem, newItem, handleItem) {
			return data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, handleItem, data);
		};

		container.service.refreshSelected = function refreshSelected(selected){
			if(_.isNil(selected)){
			   selected = container.service.getSelected(); // previously selected item
			}
			if(selected){
			   let selectedEntities = container.service.getSelectedEntities();
			   let foundSelected = !!selectedEntities.find(s => s.Id === selected.Id);
			   if(!foundSelected){
				  // if previously selected item not found in list of currently selected - add manually
				  selectedEntities.push(selected);
				  container.data.selectedItem = selectedEntities.at(0);
			   }
			   container.service.refreshSelectedEntities().then(result => {
				  if(!foundSelected){
					 // delete manually added after update!
					 selectedEntities.pop();
				  }
			   });
			}
		 };

		container.service.cleanupTruckDriverForSelection = () => {
			let rteIds = container.service.getSelectedEntities().map(rte => rte.Id);
			container.service.cleanupTruckDriver(rteIds);
		}

		container.service.cleanupTruckDriver = (routeIds) => {
			if(!routeIds) {
				updateRequisitions = {};
				updateReservations = {};
				deleteReservations = {};
				deleteRequisitions = {};
			}
			else {
				routeIds.forEach((rId) => {
					updateRequisitions[rId] = [];
					updateReservations[rId] = [];
					deleteReservations[rId] = [];
					deleteRequisitions[rId] = [];
				})
			}
			deleteResource = false;
		};

		// "override" method mergeInUpdateData for case about multi-update if supports multi (by zwz on 2022/7/20 for HP-ALM #133072)
		if (container.data.supportsMultiSelection()) {
			let mergeInParentUpdateDataFn = (service, data, updateData, handleMe) => {
				if (handleMe && updateData[data.itemName]) {
					let mergeSingleItemFn = (newItem, data) => {
						let oldItem = service.findItemToMerge(newItem);
						if (oldItem) {
							data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, data);
						}
					};
					let updateItem = updateData[data.itemName];
					if (_.isArray(updateItem)) {
						_.each(updateItem, (item) => {
							mergeSingleItemFn(item, data);
						});
					} else {
						mergeSingleItemFn(updateItem);
					}
				}
				let children = service.getChildServices();
				_.forEach(children, function (childService) {
					childService.mergeInUpdateData(updateData);
				});
			};

			container.service.mergeInUpdateData = function (updateData) {
				mergeInParentUpdateDataFn(container.service, container.data, updateData, true);
			};
		}

		service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		service.refreshLogs = function refreshLogs() {
			var utilSrv = $injector.get('transportplanningTransportUtilService');
			/* transport log list container is special. It's implemented by ppsCommonLogListController container and it has already registered UpdateDone(of parentService transportplanningTransportMainService) Messenger, then when handleUpdateDone of transportplanningTransportMainService is called, refreshing transport log list container will also be called, we don't need to refresh refresh transport log list container additionally.
			// refresh log-list
			if (utilSrv.hasShowContainerInFront('transportplanning.transport.log.list')) {
				var logListDataSrv = $injector.get('ppsCommonLogSourceDataServiceFactory').createDataService('transportplanning.transport', { dto: 'PpsLogReportVDto' }); // before this moment, data service has created, just get it
				logListDataSrv.load();
			}
			*/
			// refresh log-pinboard
			if (utilSrv.hasShowContainerInFront('transportplanning.transport.log.pinboard')) {
				var logPinboardSrv = $injector.get('basicsCommonCommentDataServiceFactory').get('transportplanning.transport.manuallog', service.getServiceName());
				logPinboardSrv.load();
			}
		};

		return container.service;

		function initialize() {
			var filters = [
				{
					key: 'transportplanning-transport-route-eventtype-filter',
					fn: function (item) {
						if (item) {
							return item.PpsEntityFk !== null && item.PpsEntityFk === 2 && item.IsLive;
						}
						return false;
					}
				},
				{
					key: 'logistic-job-business-partner-contact-filter',
					serverSide: true,
					serverKey: 'business-partner-contact-filter-by-simple-business-partner',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartnerFk
						};
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);
		}

		function handleUpdateDone(updateData, response, data) {
			//set client-side value
			if (response.TrsRoute) {
				if (sumDistance > 0) {
					response.TrsRoute.SumDistance = sumDistance;
					sumDistance = 0;
				}
				if (sumActualDistance > 0) {
					response.TrsRoute.SumActualDistance = sumActualDistance;
					sumActualDistance = 0;
				}

				service.refreshLogs();
			}

			if(response.TransportPackageToDelete || response.TransportPackageToSave){
				service.refreshSelected();
			}

			if (response.ResRequisitionToSave) {
				_.forEach(response.ResRequisitionToSave, function (item) {
					item.ResRequisition = item.Requisition;
					item.Requisition = null;
				});
			}
			if (response.SpecialRequisitionToSave) {
				_.forEach(response.SpecialRequisitionToSave, function (item) {
					item.SpecialRequisition = item.Requisition;
					item.Requisition = null;
				});
			}

			if (response.NewRequisitionToShow) {
				_.forEach(response.NewRequisitionToShow, function (item) {
					response.RequisitionToSave = response.RequisitionToSave ? response.RequisitionToSave : [];
					var completeRequisition = {
						Requisition: item
					};
					response.RequisitionToSave.push(completeRequisition);
				});
			}

			//invoking handleOnUpdateSucceeded function at first, then do the extra things
			data.handleOnUpdateSucceeded(updateData, response, data, true);
			//refresh resource requistions
			if (trsUtil.hasShowContainer('transportplanning.transport.resRequisition.list')) {
				// if (response.ResRequisitionToSave || response.ResRequisitionToDelete || (response.TrsRoute && response.TrsRoute.Version === 1)
				// 	|| response.ResReservationToDelete) { // delete reservation may update requisition which status is reopen
				// 	//reload data of Resource Requisition container
					var servFactory = $injector.get('productionplanningCommonResRequisitionDataServiceFactory');
					var serv = servFactory.getServiceByName('transportplanningTransportResRequisitionDataService');
					if (serv) {
						serv.loadResRequisition();
						loadResReservation();
					}
					//reset res requisition lookup in Resource Reservation container
					var lookupServ = $injector.get('productionplanningCommonResourceRequisitionLookupDataService');
					lookupServ.resetCache();
				// }
			}
			if (trsUtil.hasShowContainer('transportplanning.transport.resReservation.list')) {
				// if (response.ResReservationToSave || response.ResRequisitionToDelete || (response.TrsRoute && response.TrsRoute.Version === 1)) {
					//reload data of Resource Requisition container
					loadResReservation();
				// }
			}
			//refresh waypoint if need
			if (trsUtil.hasShowContainer('transportplanning.transport.waypoint.list')) {
				if (response.TrsRoute && response.TrsRoute.Version === 1 && response.TrsWaypointToSave) {
					var wpServ = $injector.get('transportplanningTransportWaypointDataService');
					wpServ.setFilter('routeId=' + response.TrsRoute.Id);//if the wayPoint List Container doesn't open, invoke setfilter() at first before invoking load().
					wpServ.load();
				}
			}
			else {
				$http.get(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/list?routeId=' + response.MainItemId).then(function (respond) {
					// refresh property waypoints of selected route
					let selectedRoute = service.getSelected();
					if (selectedRoute) {
						selectedRoute.waypointsBackup = _.cloneDeep(respond.data.Main);
						selectedRoute.Waypoints = respond.data.Main;
					}
				});
			}

			// fire messenger "updateDone" for calling registered callbacks. At the moment, messenger "updateDone" is only registered in transportplanningTransportPackageListController. There is no other callback of "updateDone" will be called.
			container.data.updateDone.fire();
			// remark: If messenger container.data.updateDone is obsoleted in the future(maybe by refactor of framework), we should define a new messenger(like "newUpdateDone") for registering our own callback.(by zwz 2020/1/19)

			service.isBusy = false;
		}

		function loadResReservation() {
			var reservationFactory = $injector.get('productionplanningCommonResReservationDataServiceFactory');
			var reservationService = reservationFactory.getServiceByName('transportplanningTransportResReservationDataService');
			if (reservationService) {
				reservationService.setFilter('PpsEventId=' + container.service.getSelected().PpsEventFk);
				reservationService.load();
			}
		}

		function getResourceTypes() {
			$http.get(globals.webApiBaseUrl + 'resource/type/tree').then(function (response) {
				if (response.data) {
					var resTypes = [];
					cloudCommonGridService.flatten(response.data, resTypes, 'SubResources');
					truckTypes = _.filter(resTypes, function (resType) {
						return resType.IsTruck;
					});
					driverTypes = _.filter(resTypes, function (resType) {
						return resType.IsDriver;
					});
				}
			});
		}

		function synchronizeResReservations(deleteList) {
			var reservationFactory = $injector.get('productionplanningCommonResReservationDataServiceFactory');
			var reservationService = reservationFactory.getServiceByName('transportplanningTransportResReservationDataService');
			if (reservationService) {
				var reservationList = reservationService.getList();
				reservationList = _.filter(reservationList, function (reservation) {
					return _.find(deleteList, function (deleteItem) {
						return reservation.Id !== deleteItem.Id;
					});
				});
				reservationService.setList(reservationList);
				reservationService.clearModifications(reservationList);
			}
		}

		function synchronizeResRequisitions(deleteList) {
			var requisitionFactory = $injector.get('productionplanningCommonResRequisitionDataServiceFactory');
			var requisitionService = requisitionFactory.getServiceByName('transportplanningTransportResRequisitionDataService');
			if (requisitionService) {
				var requisitionList = requisitionService.getList();
				requisitionList = _.filter(requisitionList, function (requisition) {
					return _.find(deleteList, function (deleteItem) {
						return requisition.Id !== deleteItem.Id;
					});
				});
				requisitionService.setList(requisitionList);
				requisitionService.clearModifications(requisitionList);
			}
		}

		function handleCharacteristic(item, isAfterCreated = false) {
			const gridContainerGuid = '1293102b4ee84cb5bd1b538fdf2ae90a';
			const characteristic2SectionId = 73;

			const containerInfoService = $injector.get('transportplanningTransportContainerInformationService');
			const characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
				.getService(container.service, characteristic2SectionId, gridContainerGuid, containerInfoService);

			if (isAfterCreated) {
				characterColumnService.appendDefaultCharacteristicCols(item);
			} else {
				characterColumnService.appendCharacteristicCols(item);
	}
		}
	}
})(angular);
