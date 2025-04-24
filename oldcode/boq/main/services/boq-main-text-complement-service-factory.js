(function () {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainTextComplementServiceFactory', [
		'platformDataServiceFactory',
		'boqMainTextComplementHelperService',
		'boqMainCommonService',
		'$injector',
		'procurementContextService',
		function (platformDataServiceFactory,
			boqMainTextComplementHelperService,
			boqMainCommonService,
			$injector,
			procurementContextService) {

			var serviceCache = [];
			var _defaultComplType = 0;
			var _itemsCounter = null;  // No. of text complements of the coomplete BoQ
			var serviceContainer = {};

			function getServiceName(serviceKey) {
				return 'boqMainTextComplementService_' + serviceKey;
			}

			function createNewComplete(parentService, serviceKey) {

				var serviceFactoryOptions = {
					flatLeafItem: {
						serviceName: getServiceName(serviceKey),
						actions: {
							delete: true,
							canDeleteCallBackFunc: function canDeleteCallBackFunc(/* selectedItem, data */) {
								return !serviceContainer.service.isSpecificationSetReadOnly();
							},
							create: 'flat',
							canCreateCallBackFunc: function canCreateCallBackFunc(/* selectedItem, data */) {
								return !serviceContainer.service.isSpecificationSetReadOnly();
							}
						},
						entityRole: {
							leaf: {itemName: 'BoqTextComplement', parentService: parentService}
						},
						httpCRUD: {
							route: globals.webApiBaseUrl + 'boq/main/textcomplement/',
							usePostForRead: true
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/main/textcomplement',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function (readData) {
								var selectItem = parentService.getSelected();
								if (selectItem) {
									readData.BoqHeaderFk = selectItem.BoqHeaderFk;
									readData.BoqItemFk = selectItem.Id;
								}
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectItem = parentService.getSelected();
									if (selectItem) {
										creationData.BoqHeaderFk = selectItem.BoqHeaderFk;
										creationData.BoqItemFk = selectItem.Id;
										creationData.ComplType = _defaultComplType;
									}
								},
								incorporateDataRead: function(readData, data) {
									if (!parentService.isOenBoq()) { // OENORM textcomplements only are persistet with the blob specification text. The call in the next line would delete the items.
										return serviceContainer.data.handleReadSucceeded(readData, data);
									}
								}
							}
						},
						dataProcessor: [{
							processItem: function (item) {
								var readonlyFields = ['ComplType', 'ComplCaption', /* 'ComplBody', */ 'ComplTail', 'Sorting'];
								var fields = _.map(readonlyFields, function (field) {
									return {field: field, readonly: true};
								});

								var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
								if (serviceContainer.service.isSpecificationSetReadOnly()) {
									platformRuntimeDataService.readonly(item, fields);
								}
								if (globals.portal) {
									if (item.ComplType === 1) {// owner type
										platformRuntimeDataService.readonly(item, true);
									}
								}

								if (procurementContextService && procurementContextService.getModuleReadOnly()) {
									var moduleName = procurementContextService.getModuleName();
									if (moduleName === 'procurement.quote') {
										platformRuntimeDataService.readonly(item, true);
									}
								}
							}
						}]
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

				serviceContainer.service.getBoqService = function () {
					return parentService;
				};

				serviceContainer.data.markItemAsModified = function(item, data) {
					if (!parentService.isOenBoq()) { // OENORM textcomplements only are persistet with the blob specification text
						serviceContainer.service.markItemAsModified(item, data);
					}
				};

				/**
				 * @ngdoc function
				 * @name insertNewTextComplement
				 * @function
				 * @methodOf
				 * @description
				 * @returns {promise} returns new complement phrase
				 */
				serviceContainer.service.insertNewTextComplement = function (complType) {

					_defaultComplType = complType;   // remember curent complement type
					return serviceContainer.service.createItem().then(function (newItem) {
						newItem.ComplType = complType || 0;
						newItem.ComplCaption = '?';         // needs a value - otherwise html editor will ignore tag ???!!!???

						if (complType === 0) {  // initialize bidder text
							newItem.ComplBody = new Array(52).join('.');
						}

						var boqItem = parentService.getSelected();
						serviceContainer.service.updateTcIndicator(boqItem);
						parentService.gridRefresh();

						return boqMainTextComplementHelperService.getHtmlComplementPhrase(newItem.ComplCaption, newItem.ComplBody, newItem.ComplTail, newItem.ComplType, newItem.Sorting);
					});
				};

				var onEntityCreated = function onEntityCreated(e, newItem) {   // jshint ignore:line
					if (_itemsCounter === null) {
						_itemsCounter = newItem.Sorting - 1;
					}

					_itemsCounter++;
					newItem.Sorting = _itemsCounter;
				};
				serviceContainer.service.registerEntityCreated(onEntityCreated);

				var onEntityDeleted = function onEntityDeleted(e, deletedTextComplements) {
					var currentBlobSpecification = parentService.getCurrentSpecification();
					_.forEach(deletedTextComplements, function(textComplement) {
						var content = currentBlobSpecification.Content || '';
						var phrase = boqMainTextComplementHelperService.findTextComplement(content, textComplement.Sorting);
						currentBlobSpecification.Content = content.replace(phrase, '');
					});

					serviceContainer.service.updateTcIndicator(parentService.getSelected());
					parentService.gridRefresh();
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				serviceContainer.service.updateTcIndicator = function (boqItem) {

					if (!boqItem) {
						return;
					}

					var countBidderTcs = 0;
					var countOwnerTcs = 0;
					var tcs = serviceContainer.service.getList();

					if (tcs && tcs.length > 0) {
						angular.forEach(tcs, function (tc) {
							if (tc.ComplType === 0) {
								countBidderTcs++;
							} else {
								countOwnerTcs++;
							}
						});
					}

					boqItem.HasBidderTextComplements = countBidderTcs > 0;
					boqItem.HasOwnerTextComplements = countOwnerTcs > 0;
					boqItem.ItemInfo = boqMainCommonService.buildItemInfo(boqItem);
				};

				serviceContainer.service.isSpecificationSetReadOnly = function isSpecificationSetReadOnly() {
					var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					var selectedBoqItem = parentService.getSelected();
					var isReadOnly = false;

					if (_.isObject(selectedBoqItem)) {
						isReadOnly = platformRuntimeDataService.isReadonly(selectedBoqItem, 'BasBlobsSpecificationFk');
					}

					return isReadOnly;
				};

				// ---
				var resetCounter = function () {
					_itemsCounter = null;
				};

				var selectedBoqHeaderChanged = function selectedBoqHeaderChanged() {
					serviceContainer.data.doNotLoadOnSelectionChange = parentService.isOenBoq();
					resetCounter();
				};
				parentService.selectedBoqHeaderChanged.register(selectedBoqHeaderChanged);

				var boqItemsUpdated = function boqItemsUpdated() {
					resetCounter();
				};
				parentService.boqItemsUpdated.register(boqItemsUpdated);

				var importSucceeded = function () {
					parentService.deselect();  // first must deselect boq item???
					serviceContainer.service.clearCache();
				};
				parentService.onImportSucceeded.register(importSucceeded);

				return serviceContainer.service;
			}

			return {

				getService: function (parentService, serviceKey) {

					var serviceName = getServiceName(serviceKey);
					if (!serviceCache[serviceName]) {
						serviceCache[serviceName] = createNewComplete(parentService, serviceKey);
					}
					return serviceCache[serviceName];
				}
			};

		}]);
})(angular);
