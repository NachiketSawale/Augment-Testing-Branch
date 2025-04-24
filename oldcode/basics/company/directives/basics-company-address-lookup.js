/**
 * Created by henkel on 15.10.2014.
 */

(function (angular) {
	'use strict';

	angular.module('basics.company').directive('basicsCompanyAddressLookup', ['$q','basicsClerkMainService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q,basicsAddressMainService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'address',
				valueMember: 'Id',
				displayMember: 'street'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'basicsCompanyLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'basicsCompanyAddressLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(basicsAddressMainService.getList());
						return deferred.promise;
					},

					getItemByKey: function (value) {
						var item = {};
						var list = basicsAddressMainService.getList();
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
