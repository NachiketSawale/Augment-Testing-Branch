/**
 * Created by lvi on 2/6/2015.
 */

( function (angular, globals) {
	/* global  globals */

	'use strict';

	globals.lookups.QtoDetail = function QtoDetail($injector){
		var qtoMainHeaderDataService = $injector.get('qtoMainHeaderDataService');
		return {
			lookupOptions :{
				lookupType: 'QtoDetail',
				valueMember: 'Id',
				displayMember: 'QtoDetailReference',
				filterKey: 'qto-detail-reference-filter',
				uuid: '8eb88c545bc64eef82164895af366820',
				columns: [
					{
						id: 'QtoReference',
						field: 'QtoDetailReference',
						name$tr$: 'qto.main.QtoReference',
						formatter: 'description',
						width: 80
					},
					{
						id: 'BoqItemCode',
						field: 'BoqItemFk',
						name$tr$: 'qto.main.boqItem',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'boqItemLookupDataService',
							dataServiceName: 'boqItemLookupDataService',
							filter: function () {
								if(qtoMainHeaderDataService.getSelected()){
									return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
								}
							},
							displayMember: 'Reference'
						},
						width: 80
					},
					{
						id: 'PrjLocationDesc',
						field: 'PrjLocationFk',
						name$tr$: 'qto.main.PrjLocationDesc',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProjectLocation',
							displayMember: 'DescriptionInfo.Translated'
						},
						width: 120
					},
					{
						id: 'QtoLineTypeDesc',
						field: 'QtoLineTypeFk',
						name$tr$: 'qto.main.QtoLineTypeDesc',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QtoLineType',
							displayMember: 'Description'
						},
						width: 130
					},
					{
						id: 'QtoFormulaDesc',
						field: 'QtoFormulaFk',
						name$tr$: 'qto.main.QtoFormulaDesc',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QtoFormula',
							displayMember: 'DescriptionInfo.Translated'
						},
						width: 130
					},
					{
						id: 'Result',
						field: 'Result',
						name$tr$: 'qto.main.Result',
						width: 120,
						readyOnly: true,
						formatter: 'quantity'
					},
					{
						id: 'SubTotal',
						field: 'SubTotal',
						name$tr$: 'qto.main.SubTotal',
						width: 120,
						formatter: 'quantity'
					}
				]

			},
			dataProvider: 'qtoMainQtoDetailDataService'
		};
	};

	angular.module('qto.main').directive('qtoDetailReferenceLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.QtoDetail($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);