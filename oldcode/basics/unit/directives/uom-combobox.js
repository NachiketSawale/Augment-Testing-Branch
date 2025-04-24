(function (angular) {
	'use strict';
	var moduleName = 'basics.unit';
	angular.module(moduleName).directive('basicsLookupdataUomCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'uom',
				valueMember: 'Id',
				displayMember: 'Unit',
				filterOptions: {
					serverSide: false,
					fn: function (entity) {
						return entity.IsLive;
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);

})(angular);
