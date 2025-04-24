/**
 * Created by reimer on 30.03.2017.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainCatalogAssignmentModeCombobox
	 * @requires BasicsLookupdataLookupDirectiveDefinition
	 * @description
	 */

	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainCatalogAssignmentModeCombobox', ['BasicsLookupdataLookupDirectiveDefinition', '$q', '$http', 'boqCatalogAssignModeLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition, $q, $http, boqCatalogAssignModeLookupDataService) {

			var defaults = {
				lookupType: 'boqMainCatalogAssignmentMode',
				uuid: 'd315e0ecb82a41b297810554211921d8',
				valueMember: 'Id',
				displayMember: 'Description',
				onDataRefresh: function () {
					boqCatalogAssignModeLookupDataService.refresh();
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'boqCatalogAssignModeLookupDataService'
			});
		}
	]);

})(angular);
