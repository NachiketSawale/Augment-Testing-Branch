/**
 * Created by guh on 5/17/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular, globals, _ */
	var moduleName = 'procurement.pes';
	var procurementPesModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name procurementPesShipmentInfoService
     * @function
     * @description procurementPesShipmentInfoService is the data service for Pes Shipment Info.
     */
	/* jshint -W072 */
	procurementPesModule.factory('procurementPesShipmentInfoService',
		['$q', '$http', 'platformRuntimeDataService', 'platformDataServiceFactory', 'procurementPesHeaderService','procurementContextService',

			function ($q, $http, platformRuntimeDataService, platformDataServiceFactory, procurementPesHeaderService, procurementContextService
			) {
				// var oldItems = [];
				var procurementPesShipmentInfoServiceOption = {
					flatLeafItem: {
						module: procurementPesModule,
						serviceName: 'procurementPesShipmentInfoService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/pes/shipmentInfo/',
							endRead: 'list',
							endCreate:'createnew'
						},
						presenter: {
							list: {
								initCreationData: initCreationData,
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							leaf: {
								itemName: 'ShipmentInfo',
								parentService: procurementPesHeaderService,
								doesRequireLoadAlways: true
							}
						},
						actions: {
							create: 'flat',
							delete: {}
						},
						entitySelection: {supportsMultiSelection: false}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(procurementPesShipmentInfoServiceOption);

				var service = serviceContainer.service;
				var data = serviceContainer.data;
				var createLater = false;

				var originalDoReadData = data.doReadData;
				data.doReadData = function (data) {
					var parentItem = procurementPesHeaderService.getSelected();
					if (parentItem && parentItem.Version !== 0) {
						return originalDoReadData(data);
					}
					else {
						if (createLater) {
							createLater = false;
							return service.createItem().then(function (res) {
								parentItem.PesShipmentinfoFk = res.Id;
								return res;
							});
						}
						return $q.when([]);
					}
				};

				angular.extend(serviceContainer.service,
					{
						name: 'procurement.pes.shipmentInfo'
					}
				);

				serviceContainer.service.deleteItem = function deleteItem(entity) {
					var parentItem = procurementPesHeaderService.getSelected();
					if (parentItem) {
						parentItem.PesShipmentinfoFk = null;
						procurementPesHeaderService.markItemAsModified(parentItem);
					}
					serviceContainer.data.deleteItem(entity, serviceContainer.data);
				};

				function initCreationData(creationData,data) {
					creationData.mainItemId = data.mainItemId;
					var lastinfo = data.itemList[data.itemList.length - 1];
					creationData.lastinfoId = lastinfo?lastinfo.Id:-1;
				}


				function incorporateDataRead(readItems, data){
					var dataRead = data.handleReadSucceeded(readItems.dtos, data, true);
					if (readItems.dtos && readItems.dtos.length === 0) {
						serviceContainer.data.selectionChanged.fire();
					}
					else {
						serviceContainer.service.goToFirst(data);
						// set shipmentInfo readonly
						setShipmentInfoReadOnly(readItems.dtos);
					}
					return dataRead;
				}

				serviceContainer.service.createBlankItem = function createBlankItem() {
					if (serviceContainer.data.doUpdate) {
						return serviceContainer.data.doUpdate(serviceContainer.data).then(function () {
							return doCallCustomHTTPCreate(serviceContainer.data, serviceContainer.data.onCreateSucceeded);
						});
					}
					else{
						return doCallCustomHTTPCreate(serviceContainer.data, serviceContainer.data.onCreateSucceeded);
					}

				};

				function doCallCustomHTTPCreate(data, onCreateSucceeded) {
					return $http.post(data.httpCreateRoute + 'create', {}).then(function (response) {
						if (onCreateSucceeded) {
							var parentItem = procurementPesHeaderService.getSelected();
							if (parentItem) {
								parentItem.PesShipmentinfoFk = response.data.Id;
								procurementPesHeaderService.markItemAsModified(parentItem);
							}
							return onCreateSucceeded(response.data, data, {});
						}
						return response.data;
					});
				}

				function setShipmentInfoReadOnly(readItems) {
					var entity = (_.isArray(readItems) && readItems.length) ? readItems[0] : readItems;
					if (entity) {
						var flag = entity.IsPesReadOnly;
						var fields = [
							{field: 'Shipmentnumber', readonly: flag},
							{field: 'Packinglistnumber', readonly: flag},
							{field: 'BasCountryFk', readonly: flag},
							{field: 'Totaldimension', readonly: flag},
							{field: 'Totalweight', readonly: flag},
							{field: 'Trackingnumber', readonly: flag},
							{field: 'Carriername', readonly: flag},
							{field: 'Carrierlink', readonly: flag}
						];
						platformRuntimeDataService.readonly(entity,fields);
					}
				}

				function onParentCreated() {
					createLater = true;
				}
				procurementPesHeaderService.registerEntityCreated(onParentCreated);

				function onParentPrepareUpdate(updateData) {
					if (_.has(updateData, 'Header.PesShipmentinfoFk') && updateData.Header.Version === 0 &&
						(!updateData.ShipmentInfoToSave || updateData.ShipmentInfoToSave.length === 0)) {
						const shipmentInfoOfPes = _.find(serviceContainer.service.getList(), function (item) {
							return item.Id === updateData.Header.PesShipmentinfoFk;
						});

						if (shipmentInfoOfPes) {
							updateData.ShipmentInfoToSave = [shipmentInfoOfPes];
						}
					}
				}
				procurementPesHeaderService.onPrepareUpdate.register(onParentPrepareUpdate);

				return serviceContainer.service;
			}
		]);
})(angular);