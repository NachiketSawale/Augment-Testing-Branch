(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-lookup-activity-scheduling-method
	 * @requires  schedulingLookupService
	 * @description ComboBox to select the scheduling method of an activity
	 */

	angular.module('scheduling.lookup').directive('schedulingLookupActivitySchedulingMethod', ['$q', 'schedulingLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'activityschedulingmethod',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			var ret =  new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupActivitySchedulingMethodDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingLookupService.getSchedulingMethods());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingLookupService.getSchedulingMethods();
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
						var list = schedulingLookupService.getSchedulingMethods();
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
						return schedulingLookupService.getSchedulingMethods();
					}
				}
			});

			return ret;
		}
	]);
})(angular);
