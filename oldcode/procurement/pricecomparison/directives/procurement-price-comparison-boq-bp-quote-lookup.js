(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc directive
	 * @name procurementPriceComparisonBoqBpQuoteLookup
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 * directive for boq compare config dialog quote compare columns field 'Business Partner' lookup.
	 *
	 */
	angular.module(moduleName).directive('procurementPriceComparisonBoqBpQuoteLookup', [
		'BasicsLookupdataLookupDirectiveDefinition', 'procurementPriceComparisonBoqColumnService',
		'basicsLookupdataLookupDescriptorService', '$injector',
		'procurementPriceComparisonMainService', 'basicsLookupdataLookupFilterService', '_', 'globals',
		function (BasicsLookupdataLookupDirectiveDefinition, boqColumnService,
			lookupDescriptorService, $injector,
			procurementPriceComparisonMainService, lookupFilterService, _, globals) {

			function dataProcessor(lookupItems) {
				var selectedItem = boqColumnService.getSelected();
				var currentBpName = lookupDescriptorService.getLookupItem('Quote', selectedItem.QtnHeaderFk).BusinessPartnerName1 || '';
				var treeItem = boqColumnService.getTree();

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
					var sortIdx;
					if (item.BusinessPartnerName1 === currentBpName) {
						sortIdx = 0;
					} else {
						sortIdx = index + 1;
					}
					return sortIdx;
				});
			}

			var filter = {
				key: 'procurement-price-comparison-boq-quote-lookup-filter',
				serverKey: 'procurement-price-comparison-boq-quote-lookup-filter',
				serverSide: true,
				fn: function () {
					return {
						RfqHeaderFk: procurementPriceComparisonMainService.getSelected().Id
					};
				}
			};

			lookupFilterService.registerFilter(filter);

			var defaults = angular.copy(globals.lookups.quote($injector).lookupOptions);

			defaults = angular.extend(defaults, {
				dataProcessor: {execute: dataProcessor},
				filterKey: filter.key,
				displayMember: 'BusinessPartnerName1'
			});

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);