(function (angular) {
	'use strict';

	angular.module('basics.export').directive('basicsExportFormatsCombobox', ['$q', 'basicsExportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, basicsExportFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType:    'BasicsExportFormats',
				valueMember:   'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function() {
						return basicsExportFormatService.loadExcelProfiles().then(function() { return basicsExportFormatService.getList(); } );
					},
					getItemByKey: function(id) {
						return $q.when(_.find(basicsExportFormatService.getList(), ['Id', id]));
					}
				}
			});
		}
	]);

})(angular);
