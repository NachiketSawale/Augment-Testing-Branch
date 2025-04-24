(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	angular.module(moduleName).directive('basicsCustomizeValueTypeCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'BasicsCustomizeValueType',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			const item1 = {Id: 1, Description: 'Standard'};
			const item2 = {Id: 2, Description: 'Negative'};
			const item3 = {Id: 3, Description: 'Positive'};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function getValueTypeList() {
						return $q.when([item1, item2, item3]);
					},
					getItemByKey: function getValueTypeByKey(id) {
						let result = item1;

						switch(id) {
							case 2: result = item2; break;
							case 3: result = item3; break;
							default: break;
						}

						return  $q.when(result);
					}
				}
			});
		}
	]);

})(angular);
