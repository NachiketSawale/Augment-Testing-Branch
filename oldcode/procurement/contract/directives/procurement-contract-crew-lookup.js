/**
 * Created by jhe on 1/14/2019.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.contractCrew = function contractCrew() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'contractcrew',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: '67d75094a15647c3afc2fabc06341307',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Contact',
						field: 'BpdContactFk',
						name: 'Contact',
						name$tr$: 'procurement.contract.entityBpdContactFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Contact',
							displayMember: 'FullName'
						}
					}
				]
			}
		};
	};

	angular.module(moduleName).directive('procurementContractCrewLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.contractCrew().lookupOptions);
		}]);

})(angular, globals);