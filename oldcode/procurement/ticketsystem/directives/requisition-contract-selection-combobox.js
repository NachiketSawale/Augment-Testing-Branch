/**
 * Created by jes on 4/21/2017.
 */

(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.ticketsystem';

	globals.lookups.reqConSelection = function reqConSelection($injector) {
		var q = $injector.get('$q');
		var translate = $injector.get('$translate');

		var items = [
			{ Id: 1, Description: translate.instant('procurement.common.sidebar.con') },
			{ Id: 2, Description: translate.instant('procurement.common.sidebar.req') }
		];

		return {
			items: items,
			lookupOptions: {
				lookupType: 'ReqConSelection',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '2eb3d9d24c2644b8bc00a558967e4b34'
			},
			dataProvider: {
				getList: function () {
					return q.when(items);
				},
				getItemByKey: function (key) {
					return q.when(items[key]);
				},
				getDefault: function () {
					return q.when(items[0]);
				},
				getSearchList: function () {
					return q.when(items);
				}
			}
		};
	};

	angular.module(moduleName).directive('procurementTicketSystemReqConSelectionCombobox', procurementTicketSystemReqConSelectionCombobox);

	procurementTicketSystemReqConSelectionCombobox.$inject = [
		'$injector',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupDescriptorService'
	];

	function procurementTicketSystemReqConSelectionCombobox(
		$injector,
		BasicsLookupdataLookupDirectiveDefinition,
		basicsLookupdataLookupDescriptorService
	) {

		var defaults = globals.lookups.reqConSelection($injector);
		var dataProvider = {
			dataProvider: defaults.dataProvider
		};

		basicsLookupdataLookupDescriptorService.attachData({'ReqConSelection': defaults.items});

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, dataProvider);
	}

})(angular, globals);