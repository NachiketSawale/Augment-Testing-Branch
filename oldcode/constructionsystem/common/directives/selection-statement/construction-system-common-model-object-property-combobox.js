/**
 * Created by chi on 7/5/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).directive('constructionSystemCommonModelObjectPropertyCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 3,
				lookupType: 'CosPropertyKeyLookup',
				valueMember: 'Id',
				displayMember: 'PropertyName',
				uuid: '92747c238dc14add9d555718c073na57',
				columns: [
					{ id: 'propertyName', field: 'PropertyName', name: 'PropertyName', width: 150, name$tr$: 'constructionsystem.master.entityPropertyName' },
					{
						id: 'ValueTypeFk',
						field: 'ValueTypeFk',
						name: 'ValueType',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.mdlvaluetype',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						width: 100,
						name$tr$: 'model.main.propertyValueType'
					}
				],
				pageOptions: {
					enabled: true,
					size: 100
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: 'constructionSystemCommonPropertyNameLookupService'
			});

		}]);
})(angular);