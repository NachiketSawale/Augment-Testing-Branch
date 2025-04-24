/**
 * Created by chk on 5/5/2017.
 */
( function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).directive('basicsPrcStructureEventOptionComboBox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcEventOption',
				valueMember: 'Id',
				displayMember: 'Description'
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults,{
				dataProvider: 'basicsProcurementStructureEventOptionDataService'
			});
		}]);
})(angular);