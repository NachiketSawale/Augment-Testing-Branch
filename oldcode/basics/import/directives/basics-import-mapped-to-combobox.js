/**
 * Created by reimer on 05.08.2015.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsUserformRubricCombobox
	 * @requires
	 * @description ComboBox to select a rubric
	 */

	var moduleName = 'basics.import';

	angular.module(moduleName).directive('basicsImportMappedToCombobox', ['$q', 'basicsImportHeaderService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, dataService, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'basicsImportMappedToCombobox',
				valueMember: 'description',
				displayMember: 'description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {

					getList: function () {
						var deferred = $q.defer();
						deferred.resolve(dataService.getList());
						return deferred.promise;
					},

					getItemByKey: function (value) {

						var deferred = $q.defer();
						deferred.resolve(dataService.getItemByDescription(value));
						return deferred.promise;
					}
				}
			});
		}
	]);

})(angular);


