(function (angular) {
	'use strict';
	var moduleName = 'documents.centralquery';

	angular.module(moduleName).directive('documentscentralquerybim360toitwo40documentstatuslookupdialog', ['_','$q', '$injector', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',

		function (_,$q, $injector, importFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'Bim360DocumentToITwo40Status',
				valueMember: 'Id',
				displayMember: 'name'
			};


			var service = $injector.get('documentsCentralqueryBim360toITwo40Service');

			var serviceTypes = service.getDocumentStatus();

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