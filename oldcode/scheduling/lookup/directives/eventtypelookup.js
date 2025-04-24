(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-lookup-activity-constraint-type
	 * @requires  schedulingLookupService
	 * @description ComboBox to select a constraint types for an activity
	 */

	angular.module('scheduling.lookup').directive('schedulingLookupEventType', ['$q', 'schedulingLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'eventtype',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupEventTypeDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingLookupService.getEventTypes());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingLookupService.getEventTypes();
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
						var list = schedulingLookupService.getEventTypes();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
						return item;
					},

					getSearchList: function () {
						return schedulingLookupService.getEventTypes();
					}
				}
			});
		}
	]);
})(angular);
