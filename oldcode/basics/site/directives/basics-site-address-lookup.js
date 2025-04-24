(function (angular) {
	'use strict';

	var moduleName = 'basics.site';
	angular.module(moduleName).directive('basicsSiteAddressLookup', BasicsSiteAddressLookup);

	BasicsSiteAddressLookup.$inject = ['$q', 'basicsClerkMainService', 'BasicsLookupdataLookupDirectiveDefinition'];

	function BasicsSiteAddressLookup ($q, basicsAddressMainService, BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			lookupType: 'address',
			valueMember: 'Id',
			displayMember: 'street'
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			lookupTypesServiceName: 'basicsSiteLookupTypes',
			dataProvider: {
				myUniqueIdentifier: 'basicsSiteAddressLookupDataHandler',

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

})(angular);