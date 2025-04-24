/**
 * Created by wul on 8/23/2018.
 */

(function (globals) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.procurementPesHeaderGridSelector = function procurementPesHeaderGridSelector($injector) {
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var pesHeaderLookupDataService = $injector.get('pesHeaderLookupDataService');

		return {
			lookupOptions: {
				version:2,
				lookupType: 'procurementPesHeaderGridSelector',
				valueMember: 'Id',
				uuid: '1DCE9D3CCF3B4E588A2C5CC91CF6AE11',
				columns:[
					{ id: 'code', field: 'Code', name: 'Code',  width: 140, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'Description', name: 'Description',  width: 240, toolTip: 'Description', formatter: 'description', name$tr$: 'cloud.common.entityDescription' }
				]
			},
			dataProvider: {
				myUniqueIdentifier: 'procurementPesHeaderLookupHandler',

				getList: function getList(/* settings, scope */) {
					return pesHeaderLookupDataService.getList().then(function (data) {
						return _.filter(data, function(item){
							return !item.IsInvoicedStatus && !item.IsReadOnly;
						});
					});
				},

				getDefault: function getDefault() {
					return q.when([]);
				},

				getItemByKey: function getItemByKey(value/* , options, scope */) {
					return pesHeaderLookupDataService.getItemById(value);
				},

				getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
					return pesHeaderLookupDataService.getList().then(function (data) {
						return _.filter(data, function(item){
							return !item.IsInvoicedStatus && !item.IsReadOnly;
						});
					});
				}
			}
		};
	};

	angular.module('procurement.pes').directive('procurementPesHeaderGridLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = globals.lookups.procurementPesHeaderGridSelector($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit',
				defaults.lookupOptions,{
					dataProvider: defaults.dataProvider
				});
		}
	]);

})(globals);
