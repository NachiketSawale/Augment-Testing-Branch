/**
 * Created by zwz on 10/24/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).directive('productionplanningEngineeringTaskLookup', Lookup);

	Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			version: 3,
			lookupType: 'EngTask',
			valueMember: 'Id',
			displayMember: 'Code'
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

	}
})(angular);
