/**
 * Created by henkel on 15.10.2014.
 */

(function (angular) {
	'use strict';

	angular.module('basics.company').directive('basicsCompanyClerkLookup', ['$q','basicsClerkMainService','BasicsLookupdataLookupDirectiveDefinition',
		function ($q,basicsClerkMainService,BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'clerk',
				valueMember: 'Id',
				displayMember: 'FamilyName'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'basicsCompanyLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'basicsCompanyClerkLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(basicsClerkMainService.getList());
						return deferred.promise;
					},

					getItemByKey: function (value) {
						var item = {};
						var list = basicsClerkMainService.getList();
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
