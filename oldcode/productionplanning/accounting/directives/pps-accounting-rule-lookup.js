/**
 * Created by zwz on 11/14/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';
	angular.module(moduleName).directive('productionplanningAccountingRuleLookup', LookUp);

	LookUp.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function LookUp(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'PpsAccountingRule',
			valueMember: 'Id',
			displayMember: 'MatchPattern',
			uuid: '1d8f484f62fb49929ce392f82f91cb7d',
			columns: [
				{
					id: 'desc',
					field: 'MatchPattern',
					name: 'MatchPattern',
					name$tr$: 'productionplanning.rule.matchPattern'
				}
			],
			width: 500,
			height: 200,
			version: 3
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
	}
})(angular);