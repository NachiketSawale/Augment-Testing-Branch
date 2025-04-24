/**
 * Created by leo on 29.09.2014.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling.calendar.weekday.directive:weekdayLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Structure lookup.
	 *
	 */
	angular.module('scheduling.calendar').directive('schedulingCalendarWeekdayLookup', ['$q','schedulingCalendarWeekdayService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q,schedulingCalendarWeekdayService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'weekday',
				valueMember: 'Id',
				displayMember: 'Acronym'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingCalendarMainLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingCalendarWeekdayLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingCalendarWeekdayService.getList());
						return deferred.promise;
					},

					getItemByKey: function (value) {
						var item = {};
						var deferred = $q.defer();
						var list = schedulingCalendarWeekdayService.getList();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								deferred.resolve(item);
								break;
							}
						}
						return deferred.promise;
					}
				}
			});
		}
	]);
})(angular);
