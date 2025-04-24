
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonProductStatusLookup', ProductionplanningCommonProductStatusLookup);

	ProductionplanningCommonProductStatusLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ProductionplanningCommonProductStatusLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'ProductStatus',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',
			editable: 'false'
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
	}
})(angular);