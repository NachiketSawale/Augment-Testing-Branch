(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).directive('projectAutodeskProjectTypeLookup', ['$q', '$injector', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',

		function ($q, $injector, importFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'autodeskProjectType',
				valueMember: 'Id',
				displayMember: 'name'
			};

			var service = $injector.get('projectMainItwoproject2Bim360DialogService');

			var projectTypes = service.getProjectType();

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {
					getList: function () {
						return $q.when(projectTypes);
					},
					getItemByKey: function (value) {
						return _.find(projectTypes, {'Id': value});
					}
				}
			});

		}
	]);

})(angular);
