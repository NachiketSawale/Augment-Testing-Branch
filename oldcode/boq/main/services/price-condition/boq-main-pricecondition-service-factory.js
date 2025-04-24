/**
 * Created by xia on 5/17/2019.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainPriceconditionService
	 * @function
	 *
	 * @description
	 * boqMainPriceconditionService is the data service for all main related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainPriceconditionServiceFactory', ['_', '$http','$injector', 'basicsMaterialPriceConditionFactoryDataService', 'platformModuleStateService', 'basicsLookupdataLookupDescriptorService', 'boqMainCommonService',
		function (_, $http,$injector, priceConditionDataService, platformModuleStateService, basicsLookupdataLookupDescriptorService, boqMainCommonService) {

			// parentModuleName, priceConditionType, headerService, context
			function createService(parentService, option) {
				var service = priceConditionDataService.createService(parentService, {
					headerService: option.headerService,
					moduleName: option.parentModuleName,
					serviceName: option.serviceName,
					priceConditionType: option.priceConditionType,
					route: 'boq/main/pricecondition/',
					isBoq: true,
					getParentDataContainer: option.selectionChangeWaitForAsyncValidation ? function(){
						return {
							data : parentService.getContainerData(),
							serviceName: parentService
						};} : null,
						selectionChangeWaitForAsyncValidation: option.selectionChangeWaitForAsyncValidation,
					readonly: function () {
						if (option.context && angular.isDefined(option.context.isModuleReadOnly)) {
							return option.context.isModuleReadOnly;
						}
						return false;
					},
					itemName: 'PriceCondition',
					incorporateDataRead: function (readData, data) {
						service.setLastLoadedParentItem(data.currentParentItem);
						var items = (readData || []);
						basicsLookupdataLookupDescriptorService.attachData(readData || {});
						var dataRead = data.handleReadSucceeded(items, data);
						if (angular.isFunction(parentService.getReadOnly)) {
							var Isreadonly = parentService.getReadOnly();
							if (Isreadonly) {
								service.setFieldReadonly(items);
							}
						}
						return dataRead;
					},
					onCalculateDone: function (boqItem, priceConditionFk, total, totalOc, vatPercent) {
						var itemService = parentService;

						boqItem.ExtraIncrement = total;
						boqItem.ExtraIncrementOc = totalOc;

						boqItem.ExtraIncrementGross = total * (100 + vatPercent) / 100;
						boqItem.ExtraIncrementOcGross = totalOc * (100 + vatPercent) / 100;

						boqItem.ExtraTotal = boqItem.ExtraPrevious + boqItem.ExtraIncrement;

						itemService.calcItemsPriceHoursNew(boqItem, true); // Trigger calculation in boq tree

						itemService.markItemAsModified(boqItem);

						var modState = platformModuleStateService.state(itemService.getModule());
						itemService.assertPath(modState.modifications);
					},
					getExchangeRate: function () {
						// projectMaterialMainService.getSelected().ExchangeRate;
						if (option && option.headerService && option.headerService.getSelected()) {
							var headerEntity = option.headerService.getSelected();
							if (headerEntity.ExchangeRate) {
								return headerEntity.ExchangeRate;
							}
						}
						return 1;
					},
					initReadData: function (readData) {
						var selected = parentService.getSelected();
						if (selected) {
							readData.filter = '?boqHeaderFk=' + selected.BoqHeaderFk + '&boqItemFk=' + selected.Id;
						} else {
							readData.filter = '?boqHeaderFk=-1&boqItemFk=-1';
						}
					},
					initCreationData: function (creationData) {
						creationData.BoqItemFk = parentService.getSelected().Id;
						creationData.BoqHeaderFk = parentService.getSelected().BoqHeaderFk;
						creationData.ExistedTypes = service.getList().map(function (item) {
							return item.PrcPriceConditionTypeFk;
						});
					},
					readonlyAll: function () {
						var readonly = false;
						if (option.context && angular.isFunction(option.context.isReadonlyWholeModule)) {
							readonly = option.context.isReadonlyWholeModule();
						}
						return readonly;
					}
				}
				);

				var onPriceConditionSelectionChanged = function onPriceConditionSelectionChanged(priceConditionFk, boqItem) {
					if (_.isFunction(service.unwatchEntityAction)) {
						service.unwatchEntityAction();
					}
					var currentBoqItem = boqItem || parentService.getSelected();
					var isCopyPriceConditionFromBoqDivision = boqItem ? boqItem.IsCopyPriceConditionFromBoqDivision : false;
					return service.reload(currentBoqItem, priceConditionFk, false, false, null, isCopyPriceConditionFromBoqDivision).finally(resetWatchDataAction);
				};
				function resetWatchDataAction(){
					if (_.isFunction(service.watchEntityAction)) {
						service.watchEntityAction();
					}
				}

				var onBoqItemQuantityChanged = function onBoqItemQuantityChanged(boqItem) {
					let priceConditionFk = boqItem.PrcPriceConditionFk || boqItem.PrcPriceconditionFk;
					service.recalculate(boqItem, priceConditionFk);
				};

				service.doInit = function () {
					return true;
				};

				parentService.priceConditionSelectionChanged.register(onPriceConditionSelectionChanged);
				parentService.boqItemQuantityChanged.register(onBoqItemQuantityChanged);
				parentService.getCurrentPriceConditionService = function getCurrentPriceConditionService() {
					return service;
				};

				parentService.getHeaderService = function getHeaderService() {
					if (_.isString(option.headerService)) {
						return $injector.get(option.headerService);
					}
					return option.headerService;
				};

				parentService.getCurrentSelectEntity = function() {
					if (parentService.getSelectedEntities().length) {
						return parentService.getSelectedEntities()[0];
					}
					return parentService.getSelected();
				};

				var baseCanCreate = service.canCreate;
				var baseCanDelete = service.canDelete;
				service.canCreate = canCreate;
				service.canDelete = canDelete;
				service.getReadOnly = getReadOnly;

				service.copyPriceCondition = function (newPriceConditions, boqItem) {
					if (!canCreate()) {
						return;
					}
					if (!newPriceConditions || newPriceConditions.length <= 0) {
						return;
					}

					var oldList = service.getList();
					var newDtoCount = 0;
					_.forEach(newPriceConditions, function (item) {
						var old = _.find(oldList, {Code: item.Code});
						if (!_.isNil(old)) {
							var id = old.Id;
							var oldVersion = old.Version;
							_.merge(old, item);
							old.Id = id;
							old.Version = oldVersion;
							service.data.markItemAsModified(old, service.data);
						} else {
							newDtoCount++;
						}
					});
					if (newDtoCount > 0) {
						$http.post(globals.webApiBaseUrl + 'boq/main/pricecondition/createstandarddtos', {
							BoqHeaderFk: boqItem.BoqHeaderFk,
							BoqItemFk: boqItem.Id,
							NewDtoCount: newDtoCount
						}).then(function (response) {
							if (response && response.data && response.data.length > 0) {
								var index = 0;
								_.forEach(newPriceConditions, function (item) {
									var old = _.find(oldList, {Code: item.Code});
									if (!old) {
										var newDto = response.data[index++];
										var originalId = newDto.Id;
										_.merge(newDto, item);
										newDto.Id = originalId;
										newDto.Version = 0;
										service.data.itemList.push(newDto);
										service.data.markItemAsModified(newDto, service.data);
									}
								});
							}

							service.recalculate(boqItem, boqItem.PrcPriceConditionFk);
						}
						);
					} else {
						service.recalculate(boqItem, boqItem.PrcPriceConditionFk);
					}
				};

				return service;

				// /////////////////////
				function canCreate() {
					return baseCanCreate() && enable();
				}

				function canDelete() {
					return baseCanDelete() && enable();
				}

				function getReadOnly() {
					return !enable();
				}

				function enable() {
					var enable = true;

					if (parentService) {
						var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
						if (getModuleStatusFn) {
							var status = getModuleStatusFn();
							enable = !(status.IsReadOnly || status.IsReadonly);
						}

						var boqItemSelected = parentService.getSelected();

						if (boqMainCommonService.isItem(boqItemSelected) || boqMainCommonService.isDivision(boqItemSelected) || boqMainCommonService.isRoot(boqItemSelected)) {
							if (Object.prototype.hasOwnProperty.call(parentService, 'parentService')) {
								var serviceParentService = parentService.parentService();
								if (serviceParentService) {
									var parentServiceSelected = serviceParentService.getSelected();
									if (parentServiceSelected && Object.prototype.hasOwnProperty.call(serviceParentService, 'checkItemIsReadOnly')) {
										enable = !serviceParentService.checkItemIsReadOnly(parentServiceSelected);
									}
								}

							}
						} else {
							enable = false;
						}
					}

					if (enable) {
						if (option.context && angular.isFunction(option.context.isReadonlyWholeModule)) {
							enable = !option.context.isReadonlyWholeModule();
						}
					}
					return enable;
				}
			}

			return {
				createService: createService
			};

		}]);
})();