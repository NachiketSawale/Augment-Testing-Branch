(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonDeliveryScheduleDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide common data
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonDeliveryScheduleDataService',
		['procurementCommonDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementCommonDeliveryScheduleValidationService','platformRuntimeDataService','$http', 'moment', 'prcCommonItemCalculationHelperService','PlatformMessenger','procurementContextService',
			function (dataServiceFactory, basicsLookupdataLookupDescriptorService, procurementCommonDeliveryScheduleValidationService,platformRuntimeDataService,$http,moment, prcCommonItemCalculationHelper,PlatformMessenger,moduleContext) {
				// eslint-disable-next-line no-unused-vars
				var currentData;
				// create a new data service object
				function constructorFn(parentService) {
					// properties
					// retrieve leading data service from mainServiceAgent
					var IsOnlyShowData = parentService.getServiceName() === 'procurementPesItemService';
					var getRemainQuantity;
					var service;
					let roundingType = prcCommonItemCalculationHelper.roundingType;
					var serviceContainer = null,
						// service configuration
						tmpServiceInfo = {
							flatLeafItem: {
								module: angular.module('procurement.common'),
								httpCRUD: {
									route: globals.webApiBaseUrl + 'procurement/common/deliveryschedule/',
									initReadData: function initReadData(readData) {
										var prcHeader = parentService.getSelected();
										if(IsOnlyShowData){
											readData.filter = '?MainItemId=' + ((prcHeader && prcHeader.PrcItemFk) ? prcHeader.PrcItemFk : -1);
										}
										else {
											readData.filter = '?MainItemId=' + (prcHeader ? prcHeader.Id : -1);
										}
									}
								},
								presenter: {
									list: {
										incorporateDataRead: function (readData, data) {
											basicsLookupdataLookupDescriptorService.attachData(readData || {});
											var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;

											// to fix an issue caused by cache. the value of type time is stored as moment in the cache.
											// it causes error when convert the value in the process with service SchedulingDataProcessTimesExtension.
											// so convert it back to string when it is a moment object.
											_.forEach(items, function (item) {
												if (item.TimeRequired && item.TimeRequired._isAMomentObject) {
													item.TimeRequired = item.TimeRequired.format('HH:mm:ss');
												}
											});
											var dataRead = data.handleReadSucceeded(items, data, true);
											if(!IsOnlyShowData) {
												service.Scheduled.totalQuantity = parentService.getSelected().Quantity;
												service.calculateQuantity();
												service.goToFirst(data);
											}
											else{
												service.SelectQuantity();
											}
											if(parentService.getSelected()){
												if(parentService.getSelected().BasItemTypeFk === 7){
													_.forEach(items,(item)=>{
														service.readonlyFieldsByItemType(item,parentService.getSelected().BasItemTypeFk);
													});
												}
											}
											return dataRead;
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
											var newDate = date.setDate(date.getDate() + prcItem.TotalLeadTime);
											newData.DateRequired = window.moment(newDate).utc();// .format('DD/MM/YYYY');
											currentData = newData.DateRequired;
											// newData.Quantity = getRemainQuantity(prcItem.SellUnit);
											if(!_.isNil(prcItem.DeliverDateConfirm)) {
												let deliverDate = new Date(prcItem.DeliverDateConfirm._d);
												let newDeliverDate = deliverDate.setDate(deliverDate.getDate());
												newData.DeliverdateConfirm = window.moment(newDeliverDate).utc();// .format('DD/MM/YYYY');
											}
										}
									}

								},
								entityRole: {leaf: {itemName: 'PrcItemDelivery', parentService: parentService}},
								dataProcessor: [{
									processItem: function (item) {
										if(IsOnlyShowData) {
											var fields = [
												{field: 'DateRequired',readonly:true},
												{field: 'TimeRequired',readonly:true},
												{field: 'Description',readonly:true},
												{field: 'Quantity',readonly:true},
												{field: 'CommentText',readonly:true},
												{field: 'RunningNumber',readonly:true},
												{field: 'AddressDto',readonly:true}
											];
											platformRuntimeDataService.readonly(item, fields);
										}
									}
								}]
							}
						};
					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
						date: ['DateRequired'],
						time: ['TimeRequired']
					}, parentService);

					// read service from serviceContainer
					service = serviceContainer.service;

					function onEntityCreated() {
						if (parentService) {
							parentService.onDeliveryScheduleRecordChanged(serviceContainer.service.getList());
						}
						validate();
					}

					var onParentItemChanged = function onParentItemChanged(e, item) {
						if(!IsOnlyShowData) {
							if (item && this.old && this.old.Quantity !== item.Quantity) {
								service.calculateQuantity();
							}
							this.old = angular.copy(item);
						}
					};

					var onParentSelectionChanged = function onParentSelectionChanged(e, item) {
						if(!IsOnlyShowData) {
							this.old = angular.copy(item);
							service.calculateQuantity();
						}
					};

					service.registerEntityCreated(onEntityCreated);
					parentService.registerItemModified(onParentItemChanged);
					parentService.registerSelectionChanged(onParentSelectionChanged);

					// override onDeleteDone
					// var baseOnDelementDone = serviceContainer.data.onDeleteDone;
					// serviceContainer.data.onDeleteDone = function onDeleteDoneInList() {
					// baseOnDelementDone.apply(serviceContainer.data, arguments);
					// parentService.onDeliveryScheduleRecordChanged(serviceContainer.service.getList());
					// };

					// (e=>null, deletedItems=>all deleted items)
					// replace the logic of onDeleteDone, done by stone.

					var validator = procurementCommonDeliveryScheduleValidationService(serviceContainer.service);

					var formatter;

					function validate() {
						var dataSource = service.getList();
						if (dataSource.length > 0) {
							var func = 'validateQuantity';
							validator[func](dataSource[0], dataSource[0]['Quantity'], 'Quantity');// jshint ignore:line
						}
						else {
							var parentItem = parentService.getSelected();
							service.Scheduled.openQuantity = parentItem ? prcCommonItemCalculationHelper.round(roundingType.openQuantity, parentItem.Quantity) : 0;
							service.Scheduled.quantityScheduled = 0;
							service.gridRefresh();
						}
					}

					var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
						parentService.onDeliveryScheduleRecordChanged(serviceContainer.service.getList());
						validate();
					};
					serviceContainer.service.registerEntityDeleted(onEntityDeleted);

					// current scheduled info, display in form body
					service.Scheduled = {
						totalQuantity: 0,
						quantityScheduled: 0,
						openQuantity: 0
					};

					/**
					 * formatter the quantity
					 * @param value
					 * @returns {string}
					 */
					formatter = function (value) {
						value = parseFloat(value);
						if (angular.isNumber(value)) {
							return value.toFixed(3);
						}
					};

					service.clearCache = function clearCache() {
						serviceContainer.data.cache = {};
						serviceContainer.service.setList([]);
					};

					service.getQuantityFormatter = function (prcItem) {
						return prcCommonItemCalculationHelper.round(roundingType.Quantity, prcItem.Quantity);
					};

					/**
					 * calculate
					 * @description: 1  when it load data from services or buffer , calculate each quantity
					 *               2  when the user modify the data in slickgrid, calculate each column of slickgrid
					 */
					service.calculateQuantity = function () {
						var dataSource = service.getList();

						var quantityScheduled = _.reduce(dataSource, function (sum, item) {
							// noinspection JSUnusedAssignment
							return sum += parseFloat(item.Quantity);
						}, 0);
						var parentItem = parentService.getSelected();
						service.Scheduled.totalQuantity = parentItem ? prcCommonItemCalculationHelper.round(roundingType.Quantity, parentItem.Quantity) : 0;
						service.Scheduled.quantityScheduled = prcCommonItemCalculationHelper.round(roundingType.quantityScheduled, quantityScheduled);
						service.Scheduled.openQuantity = prcCommonItemCalculationHelper.round(roundingType.openQuantity, service.Scheduled.totalQuantity - service.Scheduled.quantityScheduled);

						service.gridRefresh();
					};
					service.SelectQuantity = function (value) {
						var prcItems = basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
						var PrcItemFk = value ? value : parentService.getSelected().PrcItemFk;

						var parentItem = prcItems ? prcItems[PrcItemFk] : null;
						var dataSource = service.getList();

						var quantityScheduled = _.reduce(dataSource, function (sum, item) {
							// noinspection JSUnusedAssignment
							return sum += parseFloat(item.Quantity);
						}, 0);
						service.Scheduled.totalQuantity = parentItem ? prcCommonItemCalculationHelper.round(roundingType.Quantity, parentItem.Quantity) : 0;
						service.Scheduled.quantityScheduled = prcCommonItemCalculationHelper.round(roundingType.quantityScheduled, quantityScheduled);
						service.Scheduled.openQuantity = prcCommonItemCalculationHelper.round(roundingType.openQuantity, service.Scheduled.totalQuantity - service.Scheduled.quantityScheduled);
					};

					service.calculateDateRequired = function () {
						var prcItem = parentService.getSelected();
						var date = new Date();
						var newDate = date.setDate(date.getDate() + prcItem.TotalLeadTime);
						return window.moment(newDate).utc();// .format('DD/MM/YYYY');
					};

					getRemainQuantity = function getRemainQuantity(sellUnit) {
						var dataSource = service.getList();
						var quantityScheduled = _.reduce(dataSource, function (sum, item) {
							// noinspection JSUnusedAssignment
							return sum += parseFloat(item.Quantity);
						}, 0);
						var parentItem = parentService.getSelected();
						var totalQuantity = parentItem ? formatter(parentItem.Quantity) : 0;
						var openQuantity = totalQuantity - formatter(quantityScheduled);
						return openQuantity <= sellUnit ? openQuantity : sellUnit;
					};

					service.reload = function (value) {
						if (value) {
							$http.get(globals.webApiBaseUrl + 'procurement/common/deliveryschedule/list?MainItemId=' + value)
								.then(function (itemList) {
									var data = itemList.data.Main;
									_.forEach(data,function (_data) {
										_data.__rt$data = {errors: {}};
										if (_data.TimeRequired && _data.TimeRequired._isAMomentObject) {
											_data.TimeRequired = _data.TimeRequired.format('HH:mm:ss');
										}
										_data.DateRequired = moment.utc(_data.DateRequired);
									});
									service.setList(data);
									service.gridRefresh();
									service.SelectQuantity(value);


									var fields = [
										{field: 'DateRequired',readonly:true},
										{field: 'TimeRequired',readonly:true},
										{field: 'Description',readonly:true},
										{field: 'Quantity',readonly:true},
										{field: 'CommentText',readonly:true},
										{field: 'RunningNumber',readonly:true},
										{field: 'AddressDto',readonly:true}
									];
									_.forEach(service.getList(),function (item) {
										platformRuntimeDataService.readonly(item, fields);
									});


								});
						} else {
							service.setList([]);
							service.gridRefresh();
							service.SelectQuantity(value);
						}
					};

					if (IsOnlyShowData) {
						service.createItem = null;
						service.deleteItem = null;
					}

					service.canCreate = function () {
						let selectedItem = parentService.getSelected();
						if(selectedItem) {
							let itemTypeFk = selectedItem.BasItemTypeFk;
							return !(moduleContext.isReadOnly || itemTypeFk === 7);

						} else {
							return false;
						}
					};
					service.canDelete = function () {
						let selectedItem = parentService.getSelected();
						if(selectedItem) {
							let itemTypeFk = selectedItem.BasItemTypeFk;
							return !(moduleContext.isReadOnly || itemTypeFk === 7);

						} else {
							return false;
						}
					};
					service.updateToolsEvent = new PlatformMessenger();
					service.readonlyFieldsByItemType=(entity,itemTypeFk)=>{
						let columns = Object.keys(entity);
						_.forEach(columns, (item) => {
							if(itemTypeFk=== 7){
								platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);}else{
								platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
							}
						});
					};
					return service;
				}

				return dataServiceFactory.createService(constructorFn, 'procurementCommonDeliveryScheduleDataService');
			}]);
})(angular);