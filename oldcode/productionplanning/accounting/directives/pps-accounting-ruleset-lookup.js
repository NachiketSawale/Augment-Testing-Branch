/**
 * Created by lav on 7/23/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';
	angular.module(moduleName).directive('productionplanningAccountingRulesetLookup', LookUp);

	LookUp.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function LookUp(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'ruleset',
			valueMember: 'Id',
			displayMember: 'Description',
			uuid: 'bce6b5e9d5615fv9b954a9c7ecc59ff2',
			columns: [
				{
					id: 'desc',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			width: 500,
			height: 200,
			version: 3
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
	}
})(angular);