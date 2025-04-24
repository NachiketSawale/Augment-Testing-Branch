/**
 *
 * @directive:  procurement-price-comparison-item-bp-quote-lookup
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('procurementPriceComparisonItemBpQuoteLookup', [
		'BasicsLookupdataLookupDirectiveDefinition', 'procurementPriceComparisonItemColumnService',
		'basicsLookupdataLookupDescriptorService', '$injector',
		'procurementPriceComparisonMainService',
		'basicsLookupdataLookupFilterService',
		'_', 'globals',
		function (BasicsLookupdataLookupDirectiveDefinition, procurementPriceComparisonItemColumnService,
			basicsLookupdataLookupDescriptorService, $injector,
			procurementPriceComparisonMainService,
			basicsLookupdataLookupFilterService,
			_, globals
		) {

			function dataProcessor(lookupItems, option) {
				var selectedItem = option.service ? option.service.getSelected() : procurementPriceComparisonItemColumnService.getSelected();
				var currentBpName = basicsLookupdataLookupDescriptorService.getLookupItem('Quote', selectedItem.QtnHeaderFk).BusinessPartnerName1 || '';
				var treeItem = option.service ? option.service.getTree() : procurementPriceComparisonItemColumnService.getTree();

				treeItem = _.filter(treeItem, function (tree) {  // different version of currency QTN in tree data
					return tree.RfqHeaderId === selectedItem.RfqHeaderId && tree.Id !== selectedItem.Id &&
						tree.BusinessPartnerFk === selectedItem.BusinessPartnerFk;
				});
				var treeItemIds = _.map(treeItem, 'QtnHeaderFk');
				// do filter
				lookupItems = lookupItems.filter(function (item) {
					return selectedItem.BusinessPartnerFk === item.BusinessPartnerFk &&
						item.RfqHeaderFk === selectedItem.RfqHeaderId && !_.includes(treeItemIds, item.Id);
				});

				// sort by name first
				lookupItems.sort(function (item) {
					return item.BusinessPartnerName1;
				});

				// after the sort, put the current name at the beginning
				return _.sortBy(lookupItems, function (item, index) {
					var sortIdx = 0;
					if (item.BusinessPartnerName1 === currentBpName) {
						sortIdx = 0;
					} else {
						sortIdx = index + 1;
					}
					return sortIdx;
				});
			}

			var filter = {
				key: 'procurement-price-comparison-item-quote-lookup-filter',
				serverKey: 'procurement-price-comparison-item-quote-lookup-filter',
				serverSide: true,
				fn: function () {
					return {
						RfqHeaderFk: procurementPriceComparisonMainService.getSelected().Id
					};
				}
			};

			var defaults = angular.copy(globals.lookups.quote($injector).lookupOptions);

			defaults = angular.extend(defaults, {
				dataProcessor: {execute: dataProcessor},
				filterKey: filter.key,
				displayMember: 'BusinessPartnerName1',
			});

			basicsLookupdataLookupFilterService.registerFilter(filter);

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);