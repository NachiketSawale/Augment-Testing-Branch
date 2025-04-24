/**
 * Created by henkel on 15.10.2014.
 */

(function (angular) {
	'use strict';

	angular.module('basics.company').directive('basicsCompanyCategoryLookup', ['$q','basicsCompanyCategoryService','BasicsLookupdataLookupDirectiveDefinition',
		function ($q,basicsCompanyCategoryService,BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'weekday',
				valueMember: 'Id',
				displayMember: 'Acronym'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'basicsCompanyLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'basicsCompanyCategoryLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(basicsCompanyCategoryService.getList());
						return deferred.promise;
					},

					getItemByKey: function (value) {
						var item = {};
						var list = basicsCompanyCategoryService.getList();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
						return item;
					}
				}
			});
		}
	]);
})(angular);
