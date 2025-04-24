/**
 * Created by reimer on 16.12.2014.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description
	 */

	var moduleName = 'basics.dependentdata';

	angular.module(moduleName).directive('basicsDependentDataColumnCombobox', ['$q', 'basicsDependentDataColumnLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, basicsDependentDataColumnLookupService, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'basicsDependentDataColumn',
				valueMember: 'Id',
				displayMember: 'DatabaseColumn'
			};

			function getList() {
				var deferred = $q.defer();
				basicsDependentDataColumnLookupService.loadData().then(
					function() {
						deferred.resolve(basicsDependentDataColumnLookupService.getList());
					}
				);
				return deferred.promise;

			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {

					myUniqueIdentifier: 'basicsDependentDataColumn',

					getList: getList,

					getItemByKey: function (value) {
						basicsDependentDataColumnLookupService.loadData().then(
							function() {
								return basicsDependentDataColumnLookupService.getItemByKey(value);
							}
						);
					},

					getSearchList: getList
				}
			});
		}
	]);

})(angular);


