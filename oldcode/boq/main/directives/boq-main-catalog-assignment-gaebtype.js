/**
 * Created by benny on 13.06.2017.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainCatalogAssignmentGaebTypeCombobox
	 * @description
	 */

	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainCatalogAssignmentGaebTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition', '$q', '$http', 'boqCatalogAssignGaebLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition, $q, $http, boqCatalogAssignGaebLookupDataService) {

			var defaults = {
				lookupType: 'boqMainCatalogAssignmentGaebType',
				uuid: 'dab29b9aaea54e5aa2e1ae32d19c5618',
				valueMember: 'Id',
				displayMember: 'Description',
				onDataRefresh: function () {
					boqCatalogAssignGaebLookupDataService.refresh();
				}

			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'boqCatalogAssignGaebLookupDataService'
			});
		}
	]);

})(angular);
