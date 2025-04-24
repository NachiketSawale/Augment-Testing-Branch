(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).directive('productionplanningDrawingStackLookup', Lookup);

	Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			lookupType: 'EngStack',
			valueMember: 'Id',
			displayMember: 'Code',
			version: 3
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

	}
})(angular);
