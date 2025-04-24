// /clv

(function(angular, globals){

	'use strict';
	var moduleName = 'procurement.pes';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.PesHeader = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PesHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '65d25be56162466cbdf39773bfc4c85a',
				columns: [
					{ id: 'status',
						field: 'PesStatusFk',
						name: 'Status',
						name$tr$: '',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PesStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						}
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 140,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode' },
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						width: 240,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				title: {name: 'Pes Header', name$tr$: 'procurement.common.pesHeaderDialogTitle'}
			}
		};
	};


	angular.module(moduleName).directive('procurementPesHeaderLookupDirective', procurementPesHeaderLookupDirective);

	procurementPesHeaderLookupDirective.$inject = ['globals','BasicsLookupdataLookupDirectiveDefinition'];

	function  procurementPesHeaderLookupDirective(globals,BasicsLookupdataLookupDirectiveDefinition) {

		var providerInfo = globals.lookups.PesHeader();


		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
	}




})(angular, globals);