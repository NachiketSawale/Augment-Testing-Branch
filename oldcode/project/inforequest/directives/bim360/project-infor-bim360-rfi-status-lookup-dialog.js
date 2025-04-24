(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	angular.module(moduleName).directive('projectInforBim360RfiStatusLookupDialog', ['_','$q', '$injector', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',

		function (_, $q, $injector, importFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'autodeskRfiStatus',
				valueMember: 'Id',
				displayMember: 'name'
			};

			var service = $injector.get('projectInfoRequestBim360Service');

			var serviceTypes = service.getRfiStatus();

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
