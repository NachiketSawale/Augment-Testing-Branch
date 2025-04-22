/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesWipBoqStructureService', ['_', 'boqMainServiceFactory', 'salesWipService', 'salesWipBoqService', 'salesCommonBoqStructureServiceDecorator', '$injector', 'platformRuntimeDataService', 'boqMainCommonService',
		function (_, boqMainServiceFactory, salesWipService, salesWipBoqService, salesCommonBoqStructureServiceDecorator, $injector, platformRuntimeDataService, boqMainCommonService) {

			var service = {};
			var option = {
				maintainHeaderInfo: false,
				parent: salesWipService,
				moduleContext: {
					moduleName: moduleName
				},
				serviceName: 'salesWipBoqStructureService',
				filterByViewer: true
			};

			var serviceContainer = boqMainServiceFactory.createNewBoqMainService(option);
			service = serviceContainer.service;
			var gridId = null;

			// Enhance sales boq structure service by general functionality placed in the decorator
			salesCommonBoqStructureServiceDecorator.decorate(serviceContainer, salesWipService, salesWipBoqService, true, false);

			service.setGridId = function (item) {
				gridId = item;
			};

			service.getGridId = function () {
				return gridId;
			};

			service.handleReadonlyLocally = function handleReadonlyLocally(boqItem, localReadOnlyFields) {

				// In array localReadOnlyFields we expect to be given all fields initially
				var selectedSalesWip = salesWipService.getSelected();
				var wipIsProtectedStatus = salesWipService.isProtectedStatus(selectedSalesWip);

				if (!wipIsProtectedStatus || !service.hasItemBeenSavedYet(boqItem)) {
					return false; // Nothing special to do -> back to standard behaviour
				}

				if ((boqMainCommonService.isItem(boqItem) || boqMainCommonService.isLeadDescription(boqItem))) {
					// Elements of type position or lead description should allow editing of certain fields (i.e. quantity, percentagequantity or totalquantity)
					_.remove(localReadOnlyFields, function (field) {
						return field === 'Indicator' || field === 'Quantity' || field === 'QuantityDetail' || field === 'PercentageQuantity' || field === 'CumulativePercentage' || field === 'TotalQuantity' || field === 'TotalPrice' || field === 'ItemTotalEditable' || field === 'ItemTotalEditableOc' || field === 'PrcPriceConditionFk' || field === 'RecordingLevel';
					});

					if (angular.isDefined(boqItem.HasMultipleSplitQuantities) && boqItem.HasMultipleSplitQuantities || boqItem.RecordingLevel === 1) {
						localReadOnlyFields.push('Quantity');
						localReadOnlyFields.push('QuantityAdj');
						localReadOnlyFields.push('QuantityDetail');
						localReadOnlyFields.push('QuantityAdjDetail');
						localReadOnlyFields.push('TotalQuantity');
						localReadOnlyFields.push('PercentageQuantity');
						localReadOnlyFields.push('CumulativePercentage');
						localReadOnlyFields.push('ItemTotalEditable');
						localReadOnlyFields.push('ItemTotalEditableOc');
					}

					if (boqItem.IsQtoForQuantity) {
						if (localReadOnlyFields.indexOf('Quantity') === -1) {
							localReadOnlyFields.push('Quantity');
						}
						if (localReadOnlyFields.indexOf('QuantityDetail') === -1) {
							localReadOnlyFields.push('QuantityDetail');
						}

						if (localReadOnlyFields.indexOf('ItemTotal') === -1) {
							localReadOnlyFields.push('ItemTotal');
						}

						if (localReadOnlyFields.indexOf('CumulativePercentage') === -1) {
							localReadOnlyFields.push('CumulativePercentage');
						}

						if (localReadOnlyFields.indexOf('PercentageQuantity') === -1) {
							localReadOnlyFields.push('PercentageQuantity');
						}

						if (localReadOnlyFields.indexOf('TotalQuantity') === -1) {
							localReadOnlyFields.push('TotalQuantity');
						}

						if (localReadOnlyFields.indexOf('ItemTotalEditable') === -1) {
							localReadOnlyFields.push('ItemTotalEditable');
						}

						if (localReadOnlyFields.indexOf('ItemTotalEditableOc') === -1) {
							localReadOnlyFields.push('ItemTotalEditableOc');
						}

					}
					_.remove(localReadOnlyFields, function (field) {
						return field === 'ColVal1' || field === 'ColVal2' || field === 'ColVal3' || field === 'ColVal4' || field === 'ColVal5';
					});
					return true;
				} else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
					_.remove(localReadOnlyFields, function (field) {
						return field === 'PercentageQuantity' || field === 'CumulativePercentage' || field === 'RecordingLevel';
					});

					if (boqMainCommonService.isDivisionType(boqItem.BoqLineTypeFk)) {
						_.remove(localReadOnlyFields, function (field) {
							return field === 'WorkContent' || field === 'PrjCharacter';
						});
					}

					return true;
				} else {
					// For all other types of boq elements all fields should be set readonly
					return true;
				}
			};

			/* TODO: is never used, please check
			function processBoqItem(boqItem) {
				service.initInstalledValues(boqItem);
			} */

			return service;
		}]);
})();
