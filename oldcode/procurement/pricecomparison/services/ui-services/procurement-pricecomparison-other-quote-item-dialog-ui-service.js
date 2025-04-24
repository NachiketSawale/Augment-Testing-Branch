/**
 * Created by chi on 10/21/2018.
 */
(function(angular){
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonOtherQuoteItemDialogUIService', procurementPriceComparisonOtherQuoteItemDialogUIService);

	procurementPriceComparisonOtherQuoteItemDialogUIService.$inject = ['_'];

	function procurementPriceComparisonOtherQuoteItemDialogUIService(_){
		var defaultColumns = [
			{
				id: 'QtnCode',
				field: 'QtnCode',
				name$tr$: 'cloud.common.entityCode',
				width: 100,
				sortable: true,
				formatter: 'code',
				searchable: true
			},
			{
				id: 'QtnDescription',
				field: 'QtnDescription',
				name$tr$: 'basics.common.Description',
				width: 250,
				sortable: true,
				formatter: 'description',
				searchable: true
			},
			{
				id: 'QtnVersion',
				field: 'QtnVersion',
				name$tr$: 'procurement.quote.sidebar.quoteVersion',
				width: 80,
				sortable: true,
				formatter: 'integer',
				searchable: true
			},
			{
				id: 'QtnBpdBusinessPartnerFk',
				field: 'QtnBpdBusinessPartnerFk',
				name$tr$: 'procurement.pricecomparison.businessPartnerName1',
				width: 250,
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'BusinessPartner',
					displayMember: 'BusinessPartnerName1'
				},
				searchable: true
			}
		];

		var serviceCache = {};

		return {
			getService: getService
		};

		// ///////////////////////

		function getService(entityType) {
			if (!entityType) {
				throw new Error('entityType is required.');
			}

			if (serviceCache[entityType]) {
				return serviceCache[entityType];
			}

			var service = {
				getStandardConfigForListView: getStandardConfigForListView(entityType)
			};

			serviceCache[entityType] = service;
			return service;
		}

		function getColumns(entityType) {
			var additionalCols = [];
			if (entityType === 'item') {
				additionalCols = [
					{
						id: 'PrcItemPrice',
						field: 'PrcItemPrice',
						name$tr$: 'procurement.common.price',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					},
					{
						id: 'PrcItemPriceOc',
						field: 'PrcItemPriceOc',
						name$tr$: 'procurement.common.prcItemPriceCurrency',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					},
					{
						id: 'PrcItemPriceExtra',
						field: 'PrcItemPriceExtra',
						name$tr$: 'procurement.common.prcItemPriceExtras',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					},
					{
						id: 'PrcItemPriceExtraOc',
						field: 'PrcItemPriceExtraOc',
						name$tr$: 'procurement.common.prcItemPriceExtrasCurrency',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					},
					{
						id: 'PrcItemTotalPrice',
						field: 'PrcItemTotalPrice',
						name$tr$: 'procurement.common.prcItemTotalPrice',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					},
					{
						id: 'PrcItemTotalPriceOc',
						field: 'PrcItemTotalPriceOc',
						name$tr$: 'procurement.common.prcItemTotalPriceCurrency',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					}
				];
			}
			else if (entityType === 'boq') {
				additionalCols = [
					{
						id: 'boqItemPrice',
						field: 'BoqItemPrice',
						name$tr$: 'procurement.common.price',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					},
					{
						id: 'boqItemPriceOc',
						field: 'BoqItemPriceOc',
						name$tr$: 'procurement.common.prcItemPriceCurrency',
						width: 100,
						sortable: true,
						formatter: 'money',
						searchable: true
					}
				];
			}
			else {
				throw new Error('No such entityType is found.');
			}
			return _.concat(defaultColumns, additionalCols);
		}

		function getStandardConfigForListView(entityType){
			var columns = getColumns(entityType);
			return function () {
				return {
					columns: columns
				};
			};
		}
	}
})(angular);