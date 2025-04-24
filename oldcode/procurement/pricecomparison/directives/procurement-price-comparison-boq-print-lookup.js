(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.boqItemForPrint = function boqItem($injector) {
		var procurementPriceComparisonBoqPrintLookupService = $injector.get('procurementPriceComparisonBoqPrintLookupService');
		return {
			lookupOptions: {
				lookupType: 'BoqItemForPrint',
				valueMember: 'BoqItemId',
				displayMember: 'Reference',
				uuid: '6ccd5aa3382c48cb94f56407152816e3',
				columns: [
					{
						id: 'ref',
						field: 'Reference',
						name: 'Reference',
						width: 100,
						toolTip: 'Reference',
						formatter: 'description',
						name$tr$: 'boq.main.Reference'
					},
					{
						id: 'brief',
						field: 'Brief',
						name: 'Brief',
						width: 120,
						toolTip: 'Brief',
						formatter: 'description',
						name$tr$: 'boq.main.BriefInfo'
					}
				],
				showClearButton: true,
				treeOptions: {
					parentProp: 'ParentId',
					childProp: 'BoqItemChildren',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				}
			},
			dataProvider: {
				getList: function (options, scope) {
					return procurementPriceComparisonBoqPrintLookupService.getListAsync(scope);
				},
				getItemByKey: function (value) {
					return procurementPriceComparisonBoqPrintLookupService.getItemByIdAsync(value);
				},
				getDisplayItem: function (value) {
					return procurementPriceComparisonBoqPrintLookupService.getItemByIdAsync(value);
				}
			}
		};
	};

	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('procurementPriceComparisonBoqPrintLookup',
		['boqMainImageProcessor', 'procurementPriceComparisonBoqPrintLookupService', 'BasicsLookupdataLookupDirectiveDefinition', '$injector',
			function (boqMainImageProcessor, procurementPriceComparisonBoqPrintLookupService, BasicsLookupdataLookupDirectiveDefinition, $injector) {

				/* jshint -W064 */
				function ProcessData(dataList) {
					for (let item of dataList) {
						boqMainImageProcessor.processItem(item);
						const boqItems = item.BoqItems;
						if (boqItems && angular.isArray(boqItems)) {
							ProcessData(boqItems);
						}
					}
					return dataList;
				}

				var defaults = globals.lookups.boqItemForPrint($injector);

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
					dataProvider: defaults.dataProvider,
					processData:ProcessData
				});
			}]);
})(angular, globals);