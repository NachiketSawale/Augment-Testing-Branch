(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-lookup-activity-task-type
	 * @requires  schedulingLookupService
	 * @description ComboBox to select a task type for an activity
	 */

	angular.module('scheduling.lookup').directive('schedulingLookupActivityTaskType', ['$q', 'schedulingLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'activitytasktype',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupActivityTaskTypeDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingLookupService.getTaskTypes());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingLookupService.getTaskTypes();
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
						var list = schedulingLookupService.getTaskTypes();
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
						return schedulingLookupService.getTaskTypes();
					}
				}
			});
		}
	]);

})(angular);
