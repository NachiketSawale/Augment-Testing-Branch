(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('priceComparisonHistoricalPriceForItemService', [
		'_',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonCheckBidderService',
		'basicsLookupdataLookupDescriptorService',
		function (
			_,
			dataService,
			lineTypes,
			checkBidderService,
			lookupDescriptorService) {
			var options = {};
			var service = {
				init: function () {

				},
				getSelectedParentItem: function () {

				},
				getSelectedPrcItem: function () {

				},
				getPrcItemId: function () {

				},
				getMaterialId: function () {

				},
				getMaterial: function () {

				},
				parentService: null
			};

			service.parentService = dataService;

			service.getSelectedParentItem = function () {
				let selectedParentItem = service.parentService.currentRow;
				return (selectedParentItem && _.includes([lineTypes.prcItem, lineTypes.compareField], selectedParentItem.LineType)) ? selectedParentItem : null;
			};

			service.getSelectedPrcItem = function (selectedParentItem) {
				var selectedItem = service.parentService.selectedQuoteItem;
				if (selectedParentItem.QuoteItems &&
					(checkBidderService.item.isTarget(service.parentService.activeField) ||
						checkBidderService.item.isBase(service.parentService.activeField))) {

					var quoteItem = _.find(selectedParentItem.QuoteItems, {QuoteKey: service.parentService.activeField});
					if (quoteItem) {
						selectedItem = quoteItem;
					}
				}

				if (selectedParentItem && !selectedItem) {
					var result = isEqualMdcMaterial(selectedParentItem);
					if (result.isSameMdcMaterial) {
						selectedItem = result.quoteItem;
						selectedItem = angular.extend({Id: selectedItem.PrcItemId}, selectedItem);
					} else {
						if (selectedParentItem.QuoteItems) {
							selectedItem = _.find(selectedParentItem.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'});// requisition
							if (selectedItem) {
								selectedItem = angular.extend({Id: selectedItem.PrcItemId}, selectedItem);
							}
						} else if (selectedParentItem.parentItem) {
							selectedItem = selectedParentItem.parentItem;
						}
					}
				}

				return selectedItem;
			};

			service.getMaterial = function () {
				return lookupDescriptorService.getData('MaterialRecord');
			};

			service.getPrcItemId = function (selectedPrcItem) {
				return selectedPrcItem.PrcItemId;
			};

			service.init = function (options) {
				options = angular.extend({
					onRowDeselected: function () {

					},
					onItemSelected: function () {

					}
				}, options);
				service.parentService.onRowDeselected.register(options.onRowDeselected);
				service.parentService.onQuoteItemSelected.register(options.onItemSelected);
			};

			service.getHeaderParentItem = function () {
				var quotes = lookupDescriptorService.getData('Quote');
				if (service.parentService.selectedQuoteItem) {
					return  _.find(quotes, {Id: service.parentService.selectedQuoteItem.QtnHeaderId});
				}
				return null;
			};

			service.unregister = function () {
				service.parentService.onRowDeselected.unregister(options.onRowDeselected);
				service.parentService.onQuoteItemSelected.unregister(options.onItemSelected);
			};

			function isEqualMdcMaterial(selectedParentItem) {
				var isSameMdcMaterial = false;
				var first;
				if (selectedParentItem.parentItem) {
					selectedParentItem = selectedParentItem.parentItem;
				}
				if (selectedParentItem.QuoteItems) {
					var quoteItems = _.filter(selectedParentItem.QuoteItems, function (item) {
						return item.QuoteKey.indexOf('QuoteCol_-') === -1;
					});
					if (quoteItems.length === 0) {
						return {
							isSameMdcMaterial: isSameMdcMaterial,
							quoteItem: null
						};
					}
					first = quoteItems[0];
					isSameMdcMaterial = first.MdcMaterialFk;
					if (!isSameMdcMaterial) {
						return {
							isSameMdcMaterial: isSameMdcMaterial,
							quoteItem: null
						};
					}
					_.forEach(quoteItems, function (item) {
						if (item.QuoteKey !== first.QuoteKey) {
							isSameMdcMaterial = item.MdcMaterialFk && item.MdcMaterialFk === first.MdcMaterialFk;
						}
					});
				}
				return {
					isSameMdcMaterial: isSameMdcMaterial,
					quoteItem: first
				};
			}

			return service;
		}]);

})(angular);
