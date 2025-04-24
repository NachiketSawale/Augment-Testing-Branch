/**
 * Created by chd on 3/6/2018.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementChangeOrderItemDeliveryScheduleDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide delivery schedule data
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.contract').factory('procurementChangeOrderItemDeliveryScheduleDataService',
		['$http', 'procurementCommonDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementCommonDeliveryScheduleValidationService', 'platformRuntimeDataService',
			function ($http, dataServiceFactory, basicsLookupdataLookupDescriptorService, procurementCommonDeliveryScheduleValidationService, platformRuntimeDataService) {

				var service;
				var checkItemStatus;
				function getStopChangeStatus() {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/common/prcitem/externalstatus',
						params: {
							externalsourceDesc: 'YTWO Platform',
							externalCode: 'SUPPLIER_STOP_CHANGE'
						}
					}).then(function (respon) {
						return respon.data;
					});
				}

				function getAllDeliveryStatus(){
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/common/prcitem/getdeliveredstatus',
					}).then(function (respon) {
						return respon.data;
					});
				}

				var currentData;
				var currentNewData;
				// var deliveryScheduleCacheDatas = [];
				// create a new data service object
				function constructorFn(parentService) {
					var stopChangeStatusId = 0;
					var deliveredStatusIds = [];
					getStopChangeStatus().then(function(id){
						getAllDeliveryStatus().then(function(status){
							if(id !== null){
								stopChangeStatusId = id;
							}
							else {
								stopChangeStatusId = 9;
							}

							if(status !== null && angular.isArray(status)){
								_.forEach(status, function(status){
									deliveredStatusIds.push(status.Id);
								});
							}
						});
					});

					// properties
					// retrieve leading data service from mainServiceAgent
					var serviceContainer = null, deliveryScheduleCacheDatas= [],

						// service configuration
						tmpServiceInfo = {
							flatLeafItem: {
								module: angular.module('procurement.contract'),
								httpCRUD: {
									route: globals.webApiBaseUrl + 'procurement/common/deliveryschedule/',
									initReadData: function initReadData(readData) {
										var prcHeader = parentService.getSelected();
										readData.filter = '?MainItemId=' + (prcHeader ? prcHeader.Id : -1);
									}
								},
								presenter: {
									list: {
										incorporateDataRead: function (readData, data) {
											basicsLookupdataLookupDescriptorService.attachData(readData || {});
											var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;

											checkItemStatus(items);

											_.forEach(items, function (item) {
												if (item.NewDateRequired === null) {
													item.NewDateRequired = window.moment(item.DateRequired).utc();
												}

												var isExist = false;
												_.forEach(deliveryScheduleCacheDatas, function (deliveryScheduleCacheData){
													if(deliveryScheduleCacheData.Id === item.Id){
														isExist = true;
													}
												});

												if(!isExist){
													deliveryScheduleCacheDatas.push(item);
												}

												// update readonly
												angular.forEach(items, function (item) {
													service.setColumnsReadOnly(item, true);
												});
											});

											return data.handleReadSucceeded(items, data, true);
										},
										initCreationData: function initCreationData(creationData, data) {
											var prcItem = parentService.getSelected();
											creationData.PrcItemFk = prcItem.Id;
											creationData.PrcItemstatusFk = prcItem.PrcItemstatusFk;
											creationData.RunningNumbers = _.map(data.itemList, function (item) {
												return item.RunningNumber;
											});
										},
										handleCreateSucceeded: function (newData) {
											var prcItem = parentService.getSelected();
											var date = new Date(newData.DateRequired);
											var changeDate = new Date(newData.NewDateRequired);
											var newDate = date.setDate(date.getDate() + prcItem.TotalLeadTime);
											var newChangeDate = changeDate.setDate(changeDate.getDate() + prcItem.TotalLeadTime);
											newData.DateRequired = window.moment(newDate).utc();// .format('DD/MM/YYYY');
											newData.NewDateRequired = window.moment(newChangeDate).utc();// .format('DD/MM/YYYY');
											currentData = newData.DateRequired;
											currentNewData = newData.NewDateRequired;
										}
									}

								},
								entityRole: {leaf: {itemName: 'PrcItemDelivery', parentService: parentService}}
							}
						};

					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
						date: ['DateRequired'],
						time: ['TimeRequired']
					}, parentService);

					// read service from serviceContainer
					service = serviceContainer.service;
					// var validator = procurementCommonDeliveryScheduleValidationService(serviceContainer.service);

					/**
					 * formatter the quantity
					 * @param value
					 * @returns {string}
					 */
					var formatter = function (value) {
						value = parseFloat(value);
						if (angular.isNumber(value)) {
							return value.toFixed(3);
						}
					};

					checkItemStatus = function(items) {
						angular.forEach(items, function (item) {
							var canChangeItemAddress = true;
							if(item.PrcItemstatusFk === stopChangeStatusId){
								canChangeItemAddress = false;
							}

							if (!canChangeItemAddress){
								platformRuntimeDataService.readonly(parentService.getSelected(), [{field: 'NewAddress', readonly: true}]);
							}
						});
					};

					service.getAllDeliveryScheduleCacheDatas = function getCache(){
						return deliveryScheduleCacheDatas;
					};

					service.clearCache = function clearCache() {
						serviceContainer.data.cache = {};
						serviceContainer.service.setList([]);
					};

					service.getQuantityFormatter = function (prcItem) {
						return formatter(prcItem.Quantity);
					};

					service.calculateDateRequired = function () {
						return currentData;
					};

					service.calculateNewDateRequired = function () {
						return currentNewData;
					};

					// Set some columns readonly
					service.setColumnsReadOnly = function(item, readOnly){
						if(item.PrcItemstatusFk === stopChangeStatusId){
							platformRuntimeDataService.readonly(item, [{field: 'NewDateRequired', readonly: readOnly}]);
						}

						_.forEach(deliveredStatusIds, function (deliveredStatusId) {
							if(item.PrcItemstatusFk === deliveredStatusId){
								platformRuntimeDataService.readonly(item, [{field: 'NewDateRequired', readonly: readOnly}]);
							}
						});
					};

					return service;
				}

				return dataServiceFactory.createService(constructorFn, 'procurementChangeOrderItemDeliveryScheduleDataService');
			}]);
})(angular);