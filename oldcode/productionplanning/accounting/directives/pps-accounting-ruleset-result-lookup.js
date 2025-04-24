/**
 * Created by lav on 4/30/2019.
 */
/**
 * Created by anl on 1/9/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';
	angular.module(moduleName).directive('productionplanningAccountingRulesetResultLookup', LookUp);

	LookUp.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function LookUp(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'PpsAccountingRulesetResult',
			valueMember: 'Id',
			displayMember: 'Description',
			uuid: 'ace6b5e9d5614fv9b954a9c7ebb59ff2',
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