(function (angular) {
	'use strict';
	/* global globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonPaymentScheduleDataService
	 * @function
	 * @requireds paymentScheduleDataService
	 *
	 * @description Provide paymentSchedule data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonPaymentScheduleDataService', [
		'procurementCommonDataServiceFactory',
		'procurementContextService',
		'$http',
		'procurementCommonTotalDataService',
		'procurementCommonPaymentScheduleReadonlyProcessor',
		'procurementCommonPaymentScheduleFormatterProcessor',
		'paymentScheduleDataFactory',
		'basicsLookupdataLookupDescriptorService',
		function (
			dataServiceFactory,
			moduleContext,
			$http,
			procurementCommonTotalDataService,
			ReadonlyProcessor,
			formatterProcessor,
			paymentScheduleDataFactory,
			basicsLookupdataLookupDescriptorService
		) {
			function constructorFn(parentService) {
				var readonlyProcessor = new ReadonlyProcessor(parentService);
				var totalDataService = procurementCommonTotalDataService.getService(parentService);
				var moduleName = parentService.getModule().name;
				var serviceInfo = {
					flatLeafItem: {
						serviceName: 'procurementCommonPaymentScheduleDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/'
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.MainItemId = parentService.getSelected().PrcHeaderEntity.Id;
								},
								handleCreateSucceeded: function (createItem) {
									var entities = service.getList();
									var newEntities = _.filter(entities, {Version: 0});
									if (newEntities && newEntities.length) {
										var maxSortingEntity = _.maxBy(newEntities, function(e) {
											return e.Sorting;
										});
										createItem.Sorting = maxSortingEntity.Sorting + 1;
									}
									return createItem;
								},
								incorporateDataRead: function incorporateDataRead(responseData, data) {
									service.setPaymentScheduleTotalSetting({
										hasTotalSetting: responseData.hasTotalSetting,
										paymentScheduleNetOc: responseData.paymentScheduleNetOc,
										paymentScheduleGrossOc: responseData.paymentScheduleGrossOc
									});
									var resData = responseData.Main ? responseData.Main : (_.isArray(responseData) ? responseData : []);
									var hasSumLineList = service.addSumLine(resData);
									return data.handleReadSucceeded(hasSumLineList, data, true);
								}
							}
						},
						actions: {delete: true, create: 'flat',
							canCreateCallBackFunc: prcCanCreateCallBackFunc,
							canDeleteCallBackFunc: prcCanDeleteCallBackFunc
						},
						entityRole: {
							leaf: {
								itemName: 'PrcPaymentSchedule',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						dataProcessor: [readonlyProcessor, formatterProcessor, {processItem: addAdditionalProperties}]
					}
				};
				var service = paymentScheduleDataFactory.getService(parentService, serviceInfo);
				var data = service.getServiceContainerData();

				basicsLookupdataLookupDescriptorService.loadData('PrcPsStatus');

				function addAdditionalProperties() {
					service.calculateRemaining(true);
				}

				// recalculate paymentschedule
				service.updateCalculation = function updateCalculation() {
					var leadingService = moduleContext.getLeadingService();
					var getSelected = moduleContext.getItemDataService().getSelectedPrcHeader();
					var valData = {
						mainItemId: getSelected.Id,
						ProjectFk: getSelected.ProjectFk,
						moduleName: parentService.name,
						prcHeaderFk: getSelected.PrcHeaderFk,
						taxCodeFk: getSelected.TaxCodeFk,
						exchangeRate: getSelected.ExchangeRate,
						parentHeaderId: leadingService.getSelected().Id
					};
					var url = globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/recalculate';
					leadingService.update().then(function () {
						$http.post(url, valData
						).then(function (res) {
							if (!res.data) {
								return;
							}
							service.onRecalculated.fire();
							var itemList = data.itemList || [], newItems = res.data;

							_.forEach(newItems, function (updateItem) {
								var oldItem = _.find(itemList, {Id: updateItem.Id});
								if (oldItem) {
									data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
								}
							});
							service.resetSumLine(true);
							service.load();
						});
					});
				};

				service.updateReadOnly = function (item) {
					readonlyProcessor.processItem(item);
				};

				service.setFieldsReadOnly = function setFieldsReadOnly(item) {
					readonlyProcessor.setFieldsReadOnly(item);
				};

				function prcCanCreateCallBackFunc() {
					var parentItem = parentService.getSelected();
					if (moduleName === 'procurement.contract' && parentItem && parentItem.ContractHeaderFk) {
						return false;
					}
					if (moduleName === 'procurement.requisition' && parentItem && parentItem.ReqHeaderFk) {
						return false;
					}
					return !!parentItem && !!parentItem.Id;
				}

				function prcCanDeleteCallBackFunc(entity) {
					var parentItem = parentService.getSelected();
					var isSumLine = service.isSumLine(entity);
					if (isSumLine) {
						return false;
					}
					if (moduleName === 'procurement.contract' && parentItem && parentItem.ContractHeaderFk) {
						return false;
					}
					if (moduleName === 'procurement.requisition' && parentItem && parentItem.ReqHeaderFk) {
						return false;
					}
					var prcPsStatuss = basicsLookupdataLookupDescriptorService.getData('PrcPsStatus');
					if (entity && prcPsStatuss) {
						var prcPsStatus = prcPsStatuss[entity.PrcPsStatusFk];
						if (prcPsStatus && prcPsStatus.IsReadonly) {
							return false;
						}
					}
					return true;
				}


				service.setNewEntityValidator('PrcPaymentScheduleDto', 'Procurement.Common', [
					'BasPaymentTermFk', 'AmountNet', 'AmountGross', 'AmountNetOc', 'AmountGrossOc'
				]);

				totalDataService.registerListLoaded(service.calculateRemaining);

				return service;
			}

			return dataServiceFactory.createService(constructorFn, 'procurementCommonPaymentScheduleDataService');
		}]);

})(angular);