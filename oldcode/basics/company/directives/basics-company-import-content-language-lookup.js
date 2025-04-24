/**
 * Created by ysl on 12/27/2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCompanyCompanyLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Structure lookup.
	 *
	 */
	angular.module('basics.company').directive('basicsCompanyImportContentLanguageLookup',
		['cloudCommonLanguageService', 'BasicsLookupdataLookupDirectiveDefinition', '$q',
			function (cloudCommonLanguageService, BasicsLookupdataLookupDirectiveDefinition, $q) {
				var defaults = {
					lookupType: 'DataLanguageSelection',
					valueMember: 'Culture',
					displayMember: 'Description'
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList:
							function () {
								return cloudCommonLanguageService.getLanguageItems();
							},
						getItemByKey:
							function (value) {
								var deferred = $q.defer();
								cloudCommonLanguageService.getLanguageItems().then(function (data) {
									var selectedItem = _.find(data, {Culture: value});
									deferred.resolve(selectedItem);
								});

								return deferred.promise;
							}
					}
				});

			}]);
})(angular);
