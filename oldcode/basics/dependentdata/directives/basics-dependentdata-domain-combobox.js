/**
 * Created by reimer on 20.11.2014.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsDependentDataDomainCombobox
	 * @requires
	 * @description ComboBox to select a module
	 */

	var moduleName = 'basics.dependentdata';

	angular.module(moduleName).directive('basicsDependentDataDomainCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsDependentDataDomainLookupService',
		function ($q, BasicsLookupdataLookupDirectiveDefinition, dataService) {

			var defaults = {
				lookupType: 'basicsDependentDataDomain',
				valueMember: 'Id',
				// displayMember: 'DomainName',
				displayMember: 'DescriptionInfo.Translated',
				onDataRefresh: function () {
					dataService.refresh();
				}
			};

			function getList() {

				var deferred = $q.defer();
				dataService.loadData().then(
					function() {
						deferred.resolve(dataService.getList());
					}
				);
				return deferred.promise;

			}


			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				//url: {
				//	getList: 'basics/dependentdata/domain/lookup',
				//	getItemByKey:  'basics/dependentdata/domain/lookupbykey'
				//}
				dataProvider: {

					getList: getList,

					getItemByKey: function (value) {

						var deferred = $q.defer();
						dataService.loadData().then(
							function() {
								deferred.resolve(dataService.getItemByKey(value));
							}
						);
						return deferred.promise;
					},

					getSearchList: getList
				}
			});
		}
	]);

})(angular);

