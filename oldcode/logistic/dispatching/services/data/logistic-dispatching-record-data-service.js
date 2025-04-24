/**
 * Created by baf on 30.01.2018
 */

(function (angular) {
	/* global globals Platform */
	'use strict';
	var myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordDataService3
	 * @description pprovides methods to access, create and update logistic dispatching record entities
	 */
	myModule.service('logisticDispatchingRecordDataService', LogisticDispatchingRecordDataService);

	LogisticDispatchingRecordDataService.$inject = ['_','$http', '$q', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceActionExtension',
		'logisticDispatchingHeaderDataService', 'basicsCommonMandatoryProcessor',
		'logisticDispatchingCommonLookupDataService', 'logisticDispatchingRecordProcessorService',
		'logisticDispatchingConstantValues', 'platformDataServiceDataProcessorExtension'];

	function LogisticDispatchingRecordDataService(_,$http, $q, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, platformDataServiceActionExtension,
		logisticDispatchingHeaderDataService, basicsCommonMandatoryProcessor,
		logisticDispatchingCommonLookupDataService, logisticDispatchingRecordProcessorService,
		logisticDispatchingConstantValues, platformDataServiceDataProcessorExtension) {

		// private code
		let service = null;
		let data = null;
		let self = this;

		let logisticDispatchingRecordServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticDispatchingRecordDataService',
				entityNameTranslationID: 'logistic.dispatching.dispatchingRecord',
				httpCreate: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/record/',
					endCreate: 'create'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/record/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticDispatchingHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
						readData.PKey2 = selected.CompanyFk;
					}
				},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'DispatchRecordDto',
						moduleSubModule: 'Logistic.Dispatching'
					}),
					logisticDispatchingRecordProcessorService
				],
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticDispatchingHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.CompanyFk;
						},
						incorporateDataRead: function incorporateDataRead(readItems, data) {
							if (readItems && readItems.length) {
								angular.forEach(readItems, function (item) {
									item.RecordTypeFkExtend = item.RecordTypeFk;
									item.CodeExtend = null;
								});
							}
							return data.handleReadSucceeded(readItems, data);
						},
						handleCreateSucceeded: function handleCreateSucceeded(newItem, data) {
							if (newItem && data.itemList.length > 0) {
								var record = _.find(data.itemList, function (item) {
									return newItem.RecordNo === item.RecordNo;
								});
								if (record) {
									var newList = _.sortBy(data.itemList, function (item) {
										return item.RecordNo;
									});
									var lastItem = _.last(newList);
									if (lastItem) {
										newItem.RecordNo = lastItem.RecordNo + 10;
									}
								}
							}
						}
					}
				},
				entityRole: {
					node: {itemName: 'Records', parentService: logisticDispatchingHeaderDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticDispatchingRecordServiceOption, self);
		serviceContainer.data.Initialised = true;
		service = serviceContainer.service;
		data = serviceContainer.data;

		service.validateNewRecord = function validateNewRecord(record) {
			data.newEntityValidator.validate(record, service);
		};

		data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'DispatchRecordDto',
			moduleSubModule: 'Logistic.Dispatching',
			validationService: 'logisticDispatchingRecordValidationService'
		});

		service.canCreate = function checkIfCanCreateDispatchRecord() {
			var res = platformDataServiceActionExtension.canCreateSubordinatedEntity(serviceContainer.data, logisticDispatchingRecordServiceOption.flatNodeItem);

			if(res) {
				var parent = logisticDispatchingHeaderDataService.getSelected();

				if(!parent || !parent.Job1Fk || !parent.Job2Fk) {
					res = false;
				}
			}

			return res;
		};

		service.setPriceTotal = function setPriceTotal(entity, priceTotal) {
			if (entity.PriceTotal !== priceTotal) {
				entity.PriceTotal = priceTotal;
				logisticDispatchingHeaderDataService.calculatePriceTotal(service.getList());
			}
		};

		service.setPriceTotalOc = function setPriceTotalOc(entity, priceTotalOc) {
			if (entity.PriceTotalOc !== priceTotalOc) {
				entity.PriceTotalOc = priceTotalOc;
				service.setPriceTotal(entity, priceTotalOc / logisticDispatchingHeaderDataService.getExchangeRate());
			}
		};

		service.setPriceTotalPre = function setPriceTotalPre(entity, priceTotalPre) {
			if (entity.PriceTotalPre !== priceTotalPre) {
				entity.PriceTotalPre = priceTotalPre;
				logisticDispatchingHeaderDataService.calculatePriceTotalPre(service.getList());
			}
		};

		service.setPriceTotalPreOc = function setPriceTotalPreOc(entity, priceTotalPreOc) {
			if (entity.PriceTotalPreOc !== priceTotalPreOc) {
				entity.PriceTotalPreOc = priceTotalPreOc;
				service.setPriceTotalPre(entity, priceTotalPreOc / logisticDispatchingHeaderDataService.getExchangeRate());
			}
		};

		service.setPrice = function (entity, item) {
			entity.Price = item.Price;
			service.setPriceTotal(entity, item.PriceTotal);
			entity.PricePortion01 = item.PricePortion01;
			entity.PricePortion02 = item.PricePortion02;
			entity.PricePortion03 = item.PricePortion03;
			entity.PricePortion04 = item.PricePortion04;
			entity.PricePortion05 = item.PricePortion05;
			entity.PricePortion06 = item.PricePortion06;
			entity.PriceOc = item.PriceOc;
			service.setPriceTotalOc(entity, item.PriceTotalOc);
			entity.PricePortionOc01 = item.PricePortionOc01;
			entity.PricePortionOc02 = item.PricePortionOc02;
			entity.PricePortionOc03 = item.PricePortionOc03;
			entity.PricePortionOc04 = item.PricePortionOc04;
			entity.PricePortionOc05 = item.PricePortionOc05;
			entity.PricePortionOc06 = item.PricePortionOc06;
			entity.IsDailyBase = item.IsDailyBase;
			entity.IsManual = item.IsManual;
			entity.MaterialConversion = item.MaterialConversion;
			data.markItemAsModified(entity, data);
		};
		service.setPreCalcPrice = function (entity, item) {
			entity.PricePre = item.PricePre;
			service.setPriceTotalPre(entity, item.PriceTotalPre);
			entity.PricePortionPre01 = item.PricePortionPre01;
			entity.PricePortionPre02 = item.PricePortionPre02;
			entity.PricePortionPre03 = item.PricePortionPre03;
			entity.PricePortionPre04 = item.PricePortionPre04;
			entity.PricePortionPre05 = item.PricePortionPre05;
			entity.PricePortionPre06 = item.PricePortionPre06;
			entity.PricePreOc = item.PricePreOc;
			service.setPriceTotalPreOc(entity, item.PriceTotalPreOc);
			entity.PricePortionPreOc01 = item.PricePortionPreOc01;
			entity.PricePortionPreOc02 = item.PricePortionPreOc02;
			entity.PricePortionPreOc03 = item.PricePortionPreOc03;
			entity.PricePortionPreOc04 = item.PricePortionPreOc04;
			entity.PricePortionPreOc05 = item.PricePortionPreOc05;
			entity.PricePortionPreOc06 = item.PricePortionPreOc06;
			entity.IsPreCalcDailyBase = item.IsPreCalcDailyBase;
			data.markItemAsModified(entity, data);
		};

		service.calculatePrice = function calculatePrice(entity) {
			entity.Price = entity.PricePortion01 + entity.PricePortion02 + entity.PricePortion03 + entity.PricePortion04 + entity.PricePortion05 + entity.PricePortion06;
			entity.PriceOc = entity.Price * logisticDispatchingHeaderDataService.getExchangeRate();
			self.setPriceTotalOc(entity, entity.PriceOc * entity.DeliveredQuantity);
		};

		service.calculatePriceOc = function calculatePriceOc(entity) {
			entity.PriceOc = entity.PricePortionOc01 + entity.PricePortionOc02 + entity.PricePortionOc03 + entity.PricePortionOc04 + entity.PricePortionOc05 + entity.PricePortionOc06;
			entity.Price = entity.PriceOc / logisticDispatchingHeaderDataService.getExchangeRate();
			self.setPriceTotalOc(entity, entity.PriceOc * entity.DeliveredQuantity);
		};

		function noOtherRecordWithSamePlantExists(record, recordList) {
			return _.every(recordList, function(candidate) {
				return candidate.RecordTypeFk !== logisticDispatchingConstantValues.record.type.plant || candidate.PlantFk !== record.PlantFk;
			});
		}

		service.takeOverRecords = function takeOverRecords(records) {
			if(_.isArray(records) && records.length > 0) {
				const addedEntities = [];
				_.forEach(records, function (item) {
					platformDataServiceDataProcessorExtension.doProcessItem(item, data);
					if(noOtherRecordWithSamePlantExists(item, data.itemList)) {
						data.itemList.push(item);
						addedEntities.push(item);
						if (item.Version === 0) {
							data.markItemAsModified(item, data);
						}
					}
				});

				data.entitiesAdded.fire(data, addedEntities);
			}
		};

		serviceContainer.data.typeChanged = new Platform.Messenger();
		serviceContainer.service.registerTypeChanged = function (callBackFn) {
			serviceContainer.data.typeChanged.register(callBackFn);
		};
		serviceContainer.service.unregisterTypeChanged = function (callBackFn) {
			serviceContainer.data.typeChanged.unregister(callBackFn);
		};
		serviceContainer.service.typeChanged = function typeChanged(e, entity) {
			serviceContainer.data.typeChanged.fire(e, entity);
		};

		serviceContainer.service.recalculatePricePortions = function (exchangeRate) {
			var data = serviceContainer.data;
			if (exchangeRate !== 0) {
				_.forEach(serviceContainer.data.itemList, function (item) {
					item.PricePortion01 = item.PricePortionOc01 / exchangeRate;
					item.PricePortion02 = item.PricePortionOc02 / exchangeRate;
					item.PricePortion03 = item.PricePortionOc03 / exchangeRate;
					item.PricePortion04 = item.PricePortionOc04 / exchangeRate;
					item.PricePortion05 = item.PricePortionOc05 / exchangeRate;
					item.PricePortion06 = item.PricePortionOc06 / exchangeRate;
					item.Price = item.PriceOc / exchangeRate;
					service.setPriceTotal(item, item.Price * item.DeliveredQuantity);
					data.markItemAsModified(item, data);
				});
			}
		};
	}
})(angular);
