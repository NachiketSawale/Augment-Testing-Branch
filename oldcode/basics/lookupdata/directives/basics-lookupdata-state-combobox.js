(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataStateCombobox',
		['$http', '$q', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($http, $q, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'State',
					valueMember: 'Id',
					displayMember: 'Description',
					formatter: function (value, item) {
						if (item) {
							if(!item.Description) { /// by ada, when the Description is null, it will not shown
								return item.State;
							}
							return item.State + '-' + item.Description;
						}
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
			}
		]);

})(angular);
