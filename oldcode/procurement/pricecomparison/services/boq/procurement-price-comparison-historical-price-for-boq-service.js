
(function (angular) {

	'use strict';
	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('priceComparisonHistoricalPriceForBoqService', [
		'_',
		'procurementContextService',
		'procurementPriceComparisonBoqService',
		'boqMainLineTypes',
		'procurementPriceComparisonCheckBidderService',
		function (
			_,
			moduleContext,
			dataService,
			boqMainLineTypes,
			checkBidderService){
			var options = {};
			var service = {
				init: function () {

				},
				getSelectedBoqItem: function () {

				},
				getBoqItemId: function () {

				},
				parentService: null
			};
			service.parentService = dataService;

			service.getSelectedBoqItem = function () {
				var selectedParentItem = service.parentService.getSelected();
				var selectedItem = service.parentService.selectedQuoteBoq;
				if (selectedParentItem && selectedParentItem.QuoteItems &&
					(checkBidderService.item.isTarget(service.parentService.activeField) ||
					checkBidderService.item.isBase(service.parentService.activeField))) {

					var quoteItem = _.find(selectedParentItem.QuoteItems, {QuoteKey: service.parentService.activeField});
					if (quoteItem) {
						selectedItem = quoteItem;
					}
				}

				if (selectedParentItem && !selectedItem) {
					var result=isEqualWicNo(selectedParentItem);
					if (result.isSameWicNo){
						selectedItem=result.quoteItem;
						selectedItem = angular.extend({Id: selectedItem.BoqItemId}, selectedItem);
					}
					else {
						if (selectedParentItem.QuoteItems) {
							selectedItem = _.find(selectedParentItem.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'});// requisition
							if (selectedItem) {
								selectedItem = angular.extend({Id: selectedItem.BoqItemId}, selectedItem);
							}
						} else if (selectedParentItem.parentItem) {
							selectedItem = selectedParentItem.parentItem;
						}
					}
				}
				return selectedItem && selectedItem.BoqLineTypeFk === boqMainLineTypes.position ? selectedItem : null;
			};

			service.getBoqItemId = function (selectedBoqItem) {
				return selectedBoqItem.Id;
			};

			service.init = function (options) {
				options = angular.extend({
					onRowDeselected: function () {

					},
					onItemSelected: function () {

					}
				}, options);
				service.parentService.onRowDeselected.register(options.onRowDeselected);
				service.parentService.onQuoteBoqSelected.register(options.onItemSelected);
			};

			service.unregister = function () {
				service.parentService.onRowDeselected.unregister(options.onRowDeselected);
				service.parentService.onQuoteBoqSelected.unregister(options.onItemSelected);
			};

			function isEqualWicNo(selectedParentItem) {
				var isSameWicNo = false;
				var first;
				if (selectedParentItem.parentItem) {
					selectedParentItem = selectedParentItem.parentItem;
				}
				if (selectedParentItem.QuoteItems) {
					var quoteItems = _.filter(selectedParentItem.QuoteItems, function (item) {
						return item.QuoteKey.indexOf('QuoteCol_-') === -1;
					});
					if (quoteItems.length === 0)
						return {
							isSameWicNo: isSameWicNo,
							quoteItem: null
						};
					first = quoteItems[0];
					isSameWicNo = first.BoqItemWicBoqFk && first.BoqItemWicItemFk;
					if (!isSameWicNo)
						return {
							isSameWicNo: isSameWicNo,
							quoteItem: null
						};
					_.forEach(quoteItems, function (item) {
						if (item.QuoteKey !== first.QuoteKey) {
							isSameWicNo =
								item.BoqItemWicBoqFk &&
								item.BoqItemWicItemFk &&
								item.BoqItemWicBoqFk === first.BoqItemWicBoqFk &&
								item.BoqItemWicItemFk === first.BoqItemWicItemFk;
						}
					});
				}
				return {
					isSameWicNo: isSameWicNo,
					quoteItem: first
				};
			}

			return service;
		}]);

})(angular);
