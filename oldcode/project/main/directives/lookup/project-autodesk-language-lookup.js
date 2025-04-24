(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).directive('projectAutodeskLanguageLookup', ['$q', '$injector', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',

		function ($q, $injector, importFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'autodeskLanguage',
				valueMember: 'Id',
				displayMember: 'name'
			};

			var service = $injector.get('projectMainItwoproject2Bim360DialogService');

			var languages = service.getLanguage();

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {
					getList: function () {
						return $q.when(languages);
					},
					getItemByKey: function (value) {
						return _.find(languages, {'Id': value});
					}
				}
			});

		}
	]);

})(angular);
