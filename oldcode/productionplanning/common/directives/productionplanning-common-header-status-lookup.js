
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonHeaderStatusLookup', ProductionplanningCommonHeaderStatusLookup);

	ProductionplanningCommonHeaderStatusLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ProductionplanningCommonHeaderStatusLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'HeaderStatus',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',
			editable: 'false'
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
	}
})(angular);