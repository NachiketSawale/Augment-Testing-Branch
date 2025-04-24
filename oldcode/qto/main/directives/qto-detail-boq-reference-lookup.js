
( function (angular, globals) {
	'use strict';

	/* global globals */

	globals.lookups.QtoBoqDetail = function QtoBoqDetail(){
		return {
			lookupOptions :{
				lookupType: 'qtoDetailBoqReference',
				valueMember: 'Id',
				displayMember: 'Reference',
				filterKey: 'boq-item-reference-filter',
				uuid: '68BF2FDB1F964BAF86711BC39F4D3693',
				columns: [
					{
						'id': 'Reference',
						'field': 'Reference',
						'name': 'Reference',
						'formatter': 'description',
						width: 100,
						'name$tr$': 'cloud.common.entityReference'
					},
					{
						'id': 'Brief',
						'field': 'BriefInfo',
						'name': 'Brief',
						'formatter': 'description',
						width: 100,
						'name$tr$': 'cloud.common.entityBrief'
					},
					{
						'id': 'BasUomFk',
						'field': 'BasUomFk',
						'name': 'Uom',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						width: 80,
						'name$tr$': 'cloud.common.entityUoM'
					},
					{
						id: 'Result',
						field: 'Result',
						name$tr$: 'qto.main.Result',
						width: 80,
						readyOnly: true,
						formatter: 'quantity'
					}
				],
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {

							args.entity.BoqItemReferenceFk = null;
							args.entity.Result =0;

							if( args.selectedItem){
								args.entity.BoqItemReferenceFk =  args.selectedItem.Id;
								args.entity.Result = args.selectedItem.Result;
							}
						}
					}
				]

			},
			dataProvider: 'qtoBoqItemLookupDataService'
		};
	};

	angular.module('qto.main').directive('qtoDetailBoqReferenceLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.QtoBoqDetail();

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);