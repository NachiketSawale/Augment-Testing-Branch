/**
 * Created by zwz on 03/17/2022.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawingtype';
	angular.module(moduleName).directive('productionplanningDrawingtypeLookup', Lookup);

	Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			version: 3,
			lookupType: 'EngDrawingType',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
			//disableDataCaching: true
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

	}
})(angular);
