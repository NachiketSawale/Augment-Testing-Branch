/**
 * Created by xia on 11/15/2017.
 */
(function (globals) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.procurementPesHeaderSelector = function procurementPesHeaderSelector($injector) {

		var q = $injector.get('$q');
		var pesHeaderLookupDataService = $injector.get('pesHeaderLookupDataService');

		return {
			lookupOptions: {
				version:2,
				lookupType: 'procurementPesHeaderSelector',
				valueMember: 'Id',
				// displayMember: 'Code',
				selectableCallback: function(/* dataItem, entity */) {
					return true;
				}
			},
			dataProvider: {
				myUniqueIdentifier: 'procurementPesHeaderLookupHandler',

				getList: function getList(/* settings, scope */) {
					return pesHeaderLookupDataService.getList();
				},

				getDefault: function getDefault() {
					return q.when([]);
				},

				getItemByKey: function getItemByKey(value, options) {
					return pesHeaderLookupDataService.getItemById(value, options);
				},

				getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
					return pesHeaderLookupDataService.getList();
				}
			}
		};
	};

	angular.module('procurement.pes').directive('procurementPesHeaderLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.procurementPesHeaderSelector($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',
				defaults.lookupOptions, {
					dataProvider: defaults.dataProvider
				});
		}
	]);

})(globals);