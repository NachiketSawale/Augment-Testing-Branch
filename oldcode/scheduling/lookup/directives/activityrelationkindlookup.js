(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-main-activity-parent-lookup
	 * @requires  schedulingLookupService
	 * @description ComboBox to select a activity
	 */

	angular.module('scheduling.lookup').directive('schedulingLookupActivityRelationKind', ['$q', 'schedulingLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'activityrelationkind',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupActivityRelationKindDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingLookupService.getRelationKinds());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingLookupService.getRelationKinds();
						for (var i = 0; i < list.length; i++) {
							if (list[i].IsDefault === true) {
								item = list[i];
								break;
							}
						}
						return item;
					},

					getItemByKey: function (value) {
						var item = {};
						var deferred = $q.defer();
						var list = schedulingLookupService.getRelationKinds();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								deferred.resolve(item);
								break;
							}
						}
						return deferred.promise;
					},

					getSearchList: function () {
						return schedulingLookupService.getRelationKinds();
					}
				}
			});
		}
	]);

})(angular);
