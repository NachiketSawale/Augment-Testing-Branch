/* global , _ */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';

	angular.module(moduleName).directive('defectMainBim360IssueStatusLookupDialog', ['$q', '$injector', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition',

		function ($q, $injector, importFormatService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'autodeskIssueStatus',
				valueMember: 'Id',
				displayMember: 'name'
			};


			var service = $injector.get('defectMainBim360Service');

			var serviceTypes = service.getIssueStatus();

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