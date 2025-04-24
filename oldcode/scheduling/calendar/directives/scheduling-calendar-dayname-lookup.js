/**
 * Created by leo on 03.11.2014.
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
	angular.module('scheduling.calendar').directive('schedulingCalendarDayNameLookup', ['$q','schedulingCalendarWeekdayCultureItemService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q,schedulingCalendarWeekdayCultureItemService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'dayname',
				valueMember: 'Acronym',
				displayMember: 'Acronym'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingCalendarMainLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingCalendarDayNameLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingCalendarWeekdayCultureItemService.getList());
						return deferred.promise;
					},

					getItemByKey: function (value) {
						var item = {};
						var deferred = $q.defer();
						var list = schedulingCalendarWeekdayCultureItemService.getList();
						if (list) {
							for (var i = 0; i < list.length; i++) {
								if (list[i].Acronym === value) {
									item = list[i];
									deferred.resolve(item);
									break;
								}
							}
						}
						if (!item.Acronym) {
							item = {'Acronym': value};
						}
						return deferred.promise;
					}
				}
			});
		}
	]);
})(angular);
