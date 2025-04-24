(function (angular) {
	'use strict';

	var modName = 'procurement.pricecomparison';
	angular.module(modName).factory('procurementtPricecomparisonPrcBoqUIStandardService', [
		function () {
			return {
				getStandardConfigForListView: function () {
					var gridColumns = {
						columns: [
							{
								id: 'reference',
								formatter: 'description',
								editor: 'description',
								field: 'Reference',
								name: 'Reference',
								name$tr$: 'procurement.pricecomparison.printing.Reference',
								width: 100,
								searchable: true
							},
							{
								id: 'briefinfo',
								formatter: 'description',
								editor: 'description',
								field: 'Brief',
								name: 'Brief Info',
								name$tr$: 'procurement.pricecomparison.printing.BriefInfo',
								width: 150
							},

							{
								id: 'referencefrom',
								// field: 'BoqRootItem.BoqHeaderFkFrom',
								field: 'BoqHeaderFkFrom',
								formatter: 'lookup',
								formatterOptions: {
									'lookupType': 'BoqItemForPrint',
									'displayMember': 'Reference'
								},
								editor: 'lookup',
								editorOptions: {
									lookupType: 'BoqItemForPrint',
									lookupDirective: 'procurement-price-comparison-boq-print-lookup',
									lookupOptions: {
										'showClearButton': true
									}
								},
								name: 'From',
								name$tr$: 'procurement.pricecomparison.printing.From',
								width: 300
							},
							{
								id: 'referenceto',
								field: 'BoqHeaderFkTo',
								formatter: 'lookup',
								formatterOptions: {
									'lookupType': 'BoqItemForPrint',
									'displayMember': 'Reference'
								},
								editor: 'lookup',
								editorOptions: {
									lookupType: 'BoqItemForPrint',
									lookupDirective: 'procurement-price-comparison-boq-print-lookup',
									lookupOptions: {
										'showClearButton': true
									}
								},
								name: 'To',
								name$tr$: 'procurement.pricecomparison.printing.To',
								width: 300
							}

						],
						addValidationAutomatically: true
					};

					// add grouping setting
					angular.forEach(gridColumns.columns, function (column) {
						angular.extend(column, {
							grouping: {
								title: column.name$tr$,
								getter: column.field,
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					});


					return gridColumns;
				}
			};
		}]);
})(angular);