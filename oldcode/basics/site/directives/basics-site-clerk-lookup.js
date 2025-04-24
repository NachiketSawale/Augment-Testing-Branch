(function (angular) {
	'use strict';

	var moduleName = 'basics.site';
	angular.module(moduleName).directive('basicsSiteClerkLookup', BasicsSiteClerkLookup);

	BasicsSiteClerkLookup.$inject = ['$q', 'basicsClerkMainService', 'BasicsLookupdataLookupDirectiveDefinition'];

	function BasicsSiteClerkLookup($q, basicsClerkMainService, BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			lookupType: 'clerk',
			valueMember: 'Id'
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			lookupTypesServiceName: 'basicsSiteLookupTypes',
			dataProvider: {
				myUniqueIdentifier: 'basicsSiteClerkLookupDataHandler',

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
})(angular);