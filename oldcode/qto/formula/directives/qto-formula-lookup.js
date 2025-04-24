( function (angular, globals) {
	'use strict';

	/* globals globals */

	globals.lookups.QtoFormula = function QtoFormula(){
		return {
			lookupOptions:{
				lookupType: 'QtoFormula',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'db5e053d6acb435ab06c2b29c2d44ff0',
				searchInterval:100,
				columns: [
					{id: 'code', field: 'Code', name$tr$: 'cloud.common.entityCode'},
					{
						id: 'Icon', field: 'Icon', name$tr$: 'cloud.common.entityIcon',
						lookupField: 'Icon',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'qtoFormulaIcon',
							displayMember: 'Description',
							imageSelector: 'qtoFormulaIconProcessor'
						},
						width:50
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'FormulaType',
						field: 'QtoTypeDescription',
						name$tr$: 'cloud.common.formulaType'
					},
					{
						id: 'FormulaGonimeter',
						field: 'Gonimeter',
						name$tr$: 'cloud.common.gonimeter',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'gonimeter',
							displayMember: 'Description'
						}
					}
				],
				inputSearchMembers: ['Code', 'Description']
			}
		};
	};

	angular.module('qto.formula').directive('qtoFormulaLookup',
		['basicsLookupdataLookupDescriptorService', 'qtoFormulaIcons', 'BasicsLookupdataLookupDirectiveDefinition',
			function (basicsLookupdataLookupDescriptorService, qtoFormulaIcons, BasicsLookupdataLookupDirectiveDefinition) {
				var iconData = {qtoFormulaIcon: qtoFormulaIcons};
				basicsLookupdataLookupDescriptorService.attachData(iconData);
				var defaults = globals.lookups.QtoFormula();
				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions);
			}
		]);
})(angular, globals);