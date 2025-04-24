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

	var moduleName = 'platform';

	angular.module(moduleName).directive('gridConfigUserLabelCombobox', ['BasicsLookupdataLookupDirectiveDefinition', '$q', '$http', 'platformGridConfigUserLabelLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition, $q, $http, platformGridConfigUserLabelLookupDataService) {

			var defaults = {
				lookupType: 'platformGridConfigUserLabelLookup',
				uuid: '7f644bce8e034baeaa4bf306c466e20b',
				valueMember: 'Id',
				displayMember: 'Code',
				columns:[
					{id: 'Code', field: 'Code', name: 'Code', width: 150},
					{id: 'KeyWords', field: 'KeyWords', name: 'Key Words', width: 150},
				],
				onDataRefresh: function () {
					platformGridConfigUserLabelLookupDataService.refresh();
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: 'platformGridConfigUserLabelLookupDataService'
			});
		}
	]);

})(angular);
