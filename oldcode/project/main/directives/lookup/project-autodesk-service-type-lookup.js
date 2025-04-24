(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).directive('projectAutodeskServiceTypeLookup', ['$q', '$injector', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',

		function ($q, $injector, importFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'autodeskServiceType',
				valueMember: 'Id',
				displayMember: 'name'
			};

			var service = $injector.get('projectMainItwoproject2Bim360DialogService');

			var serviceTypes = service.getServiceType();

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {
					getList: function () {
						return $q.when(serviceTypes);
					},
					getItemByKey: function (value) {
						return _.find(serviceTypes, {'Id': value});
					}
				}
			});

		}
	]);

})(angular);
