(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-lookup-activity-state-lookup
	 * @requires  schedulingLookupService
	 * @description ComboBox to select the state for an activity
	 */

	angular.module('scheduling.lookup').directive('schedulingLookupActivityState', ['$q', 'schedulingLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'activitystate',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			var ret =  new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupActivityStateDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingLookupService.getActivityStates());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingLookupService.getActivityStates();
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
						var list = schedulingLookupService.getActivityStates();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
						return item;
					},

					getSearchList: function () {
						return schedulingLookupService.getActivityStates();
					}
				}
			});

			return ret;
		}
	]);
})(angular);
