(function (angular) {

	'use strict';

	var moduleName = 'basics.import';

	angular.module(moduleName).directive('basicsImportFormatsCombobox', ['$q', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, importFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'BasicsImportFormats',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return $q.when().then(function() { return importFormatService.getList(); } );
					},
					getItemByKey: function(key) {
						return $q.when(_.find(importFormatService.getList(), ['Id', key]));
					}
				}
			});
		}
	]);

})(angular);
