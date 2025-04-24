/**
 * Created by chi on 11/15/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonSimulateQuoteDataService', procurementPriceComparisonSimulateQuoteDataService);

	procurementPriceComparisonSimulateQuoteDataService.$inject = [
		'_',
		'$rootScope',
		'$q',
		'$http',
		'globals',
		'platformDataServiceFactory',
		'PlatformMessenger',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceValidationErrorHandlerExtension',
		'platformDataServiceModificationTrackingExtension',
		'platformModuleDataExtensionService',
		'procurementCommonDataEnhanceProcessor'];

	function procurementPriceComparisonSimulateQuoteDataService(
		_,
		$rootScope,
		$q,
		$http,
		globals,
		platformDataServiceFactory,
		PlatformMessenger,
		basicsLookupdataLookupDescriptorService,
		platformDataServiceValidationErrorHandlerExtension,
		platformDataServiceModificationTrackingExtension,
		platformModuleDataExtensionService,
		procurementCommonDataEnhanceProcessor) {

		var service = {};
		var localData = {};
		var isBoq = false; // another type is boq

		var quoteHeaderService = null;
		var quoteRequisitionService = null;
		var prcBoqService = null;

		service.getQuoteHeaderService = getQuoteHeaderService;
		service.getQuoteRequisitionService = getQuoteRequisitionService;
		service.getPrcBoqService = getPrcBoqService;
		service.prepareCreateBoqItem = prepareCreateBoqItem;
		service.prepareCreateItem = prepareCreateItem;
		service.resetLocalData = resetLocalData;
		service.preparationDone = new PlatformMessenger();

		return service;

		// ////////////////////////////////

		function getQuoteHeaderService() {
			if (!quoteHeaderService) {
				quoteHeaderService = createSimulateQuoteContainerService();
			}

			return quoteHeaderService;
		}

		function getQuoteRequisitionService(parentService) {
			if (!quoteRequisitionService) {
				quoteRequisitionService = createSimulateQuoteRequisitionContainerService(parentService);
			}

			return quoteRequisitionService;
		}

		function getPrcBoqService(parentService, prcBoqMainService) {
			if (!prcBoqService) {
				prcBoqService = createSimulatePrcBoqListContainerService(parentService, prcBoqMainService);
			}

			return prcBoqService;
		}

		function prepareCreateBoqItem(data) {
			localData = data;
			isBoq = true;
			if (quoteRequisitionService) {
				quoteRequisitionService.registerListLoaded(onQuoteRequisitionListLoaded);
			}

			if (quoteHeaderService) {
				quoteHeaderService.load();
				quoteHeaderService.goToFirst();
			}
		}

		function prepareCreateItem(data) {
			localData = data;
			isBoq = false;
			if (quoteRequisitionService) {
				quoteRequisitionService.registerListLoaded(onQuoteRequisitionListLoaded);
			}

			if (quoteHeaderService) {
				quoteHeaderService.load();
				quoteHeaderService.goToFirst();
			}
		}

		function createSimulateQuoteContainerService() {

			var serviceOptions = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonSimulateQuoteService',
					entityRole: {
						root: {
							moduleName: 'cloud.desktop.moduleDisplayNameQuote',
							itemName: 'QuoteHeader'
						}
					},
					httpRead: {
						useLocalResource: true,
						resourceFunction: function (/* data, readData, onReadSucceeded */) {
							if (!localData.quote) {
								return;
							}
							var quoteList = [localData.quote];
							if (quoteList && quoteList.length > 0) {
								_.forEach(quoteList, function (item) {
									if (item && item.Id && item['StatusFk']) {// jshint ignore: line
										item['QuoteStatus'] = basicsLookupdataLookupDescriptorService// jshint ignore: line
											.getLookupItem('QuoteStatus', item['StatusFk']);// jshint ignore: line

										if (item['QuoteStatus'] && item['QuoteStatus'].DescriptionInfo && item['QuoteStatus'].DescriptionInfo.Translated) {// jshint ignore: line
											item['QuoteStatus'].Description = item['QuoteStatus'].DescriptionInfo.Translated;// jshint ignore: line
										}
									}
								});
							}
							return quoteList;
						}
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'procurement/quote/header/',
						endUpdate: 'updateqtn'
					},
					actions: {
						delete: false,
						create: false
					},
					entitySelection: {},
					modification: {simple: {}},
					presenter: {list: {}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			var data = serviceContainer.data;
			service.name = moduleName + '.quote';

			service.exchangeRateChanged = new PlatformMessenger();
			service.updateItem = updateItem;
			data.showHeaderAfterSelectionChanged = null;
			return service;

			function updateItem(type, doPrepareUpdateCall) {
				$rootScope.$emit('updateRequested');
				var endUpdate = serviceContainer.data.endUpdate;
				switch (type) {
					case 'item2OneQuote':
						endUpdate = 'updateitemtoonequote';
						break;
					case 'item2AllQuotes':
						endUpdate = 'updateitemtoallquotes';
						break;
				}

				return $q.all([serviceContainer.data.waitForOutstandingDataTransfer(), platformDataServiceValidationErrorHandlerExtension.assertAllValid(service)])
					.then(function (responses) {
						var response = responses[1];
						if (response === true) {
							var updateData = platformDataServiceModificationTrackingExtension.getModifications(service);
							platformDataServiceModificationTrackingExtension.clearModificationsInRoot(service);
							if (service.doPrepareUpdateCall) {
								service.doPrepareUpdateCall(updateData);
							}
							if(_.isFunction(doPrepareUpdateCall)) {
								doPrepareUpdateCall(updateData);
							}

							if (updateData && updateData.EntitiesCount >= 1) {
								platformModuleDataExtensionService.fireUpdateDataExtensionEvent(updateData, serviceContainer.data);

								return $http.post(serviceContainer.data.httpUpdateRoute + endUpdate, updateData).then(function (response) {
									serviceContainer.data.onUpdateSucceeded(response.data, serviceContainer.data, updateData);
									$rootScope.$emit('updateDone');
									return response.data;
								});
							}
						}
						return response;
					}
					);
			}
		}

		function createSimulateQuoteRequisitionContainerService(parentService) {

			var serviceOptions = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonSimulateQuoteRequisitionService',
				entityRole: {
					node: {
						itemName: 'QtnRequisition',
						parentService: parentService,
						doesRequireLoadAlways: true
					}
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/quote/requisition/', endRead: 'list'
				},
				actions: {
					delete: false,
					create: false
				},
				entitySelection: {},
				modification: {simple: {}},
				presenter: {list: {incorporateDataRead: incorporateDataRead}},
				dataProcessor: [dataProcessItem()]
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			var data = serviceContainer.data;
			service.name = moduleName + '.quote.requisition';
			service.getItemServiceName = function () {
				return 'procurementComparisonQuoteItemDataService';
			};
			service.exchangeRateChanged = parentService.exchangeRateChanged;
			service.loadOverview = new PlatformMessenger();
			data.showHeaderAfterSelectionChanged = null;
			return service;

			// //////////////////////////////////
			function incorporateDataRead(responseData, data) {
				return data.handleReadSucceeded(responseData.Main, data, true);
			}

			function dataProcessItem() {
				var dataProcessService = function () {
					var defineOption = {
						fields: ['ExchangeRate', 'TaxCodeFk', 'ProjectFk', 'ReqHeaderEntity.BusinessPartnerFk', 'CurrencyFk'],
						get: parentService.getSelected
					};
					return {dataService: serviceContainer.service, validationService: {}, defineOption: defineOption};
				};
				return procurementCommonDataEnhanceProcessor(dataProcessService, [{}], true);
			}
		}

		function createSimulatePrcBoqListContainerService(parentService, prcBoqMainService) {
			var serviceOptions = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonSimulatePrcBoqService',
					entityRole: {
						root: {
							moduleName: 'procurement.common',
							itemName: 'PrcBoqExtended',
							lastObjectModuleName: moduleName
						}
					},
					httpRead: {
						useLocalResource: true,
						resourceFunction: function () {
							return [localData.prcBoq];
						}
					},
					actions: {
						delete: false,
						create: false
					},
					entitySelection: {},
					modification: {simple: {}},
					presenter: {list: {}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			var data = serviceContainer.data;
			service.loadSubItemList = function () {
			};
			service.registerSelectionChanged(onItemSelectionChanged);
			service.clearPrcBoqMainService = clearPrcBoqMainService;
			data.showHeaderAfterSelectionChanged = null;
			return service;

			// //////////////////////
			function onItemSelectionChanged() {
				if (prcBoqMainService && localData && localData.prcBoq && localData.prcBoq.BoqHeaderFk && localData.quote) {
					prcBoqMainService.onlySetSelectedHeaderFk(localData.prcBoq.BoqHeaderFk);
					prcBoqMainService.setCurrentExchangeRate(localData.quote.ExchangeRate ? localData.quote.ExchangeRate : 1.0);
				}
			}

			function clearPrcBoqMainService() {
				if (prcBoqMainService) {
					prcBoqMainService.clear();
				}
			}
		}

		function resetLocalData() {
			localData = {};
			// TODO chi: right?
			if (quoteHeaderService) {
				quoteHeaderService.clear();
			}
			if (prcBoqService) {
				prcBoqService.clear();
				prcBoqService.clearPrcBoqMainService();
			}

			if (quoteRequisitionService) {
				quoteRequisitionService.unregisterListLoaded(onQuoteRequisitionListLoaded);
			}
		}

		function onQuoteRequisitionListLoaded(items) {
			if (!items) {
				return;
			}

			var list = quoteRequisitionService.getList();
			var found = _.find(list, {ReqHeaderFk: localData.quoteRequisition.ReqHeaderFk});

			if (found) {
				quoteRequisitionService.deselect();
				quoteRequisitionService.setSelected(found);

				if (isBoq) {
					if (prcBoqService) {
						prcBoqService.load();
						prcBoqService.goToFirst();
					}
				}

				service.preparationDone.fire();
			}
		}
	}
})(angular);