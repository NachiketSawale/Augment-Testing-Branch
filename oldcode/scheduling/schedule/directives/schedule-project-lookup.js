/**
 * Created by leo on 03.11.2014.
 */
(function (angular) {

	'use strict';
	var moduleName = 'scheduling.schedule';
	/**
	 * @ngdoc directive
	 * @name scheduling-main-activity-parent-lookup
	 * @requires  schedulingMainService
	 * @description ComboBox to select a activity
	 */

	angular.module(moduleName).directive('schedulingScheduleProjectLookup', ['$q', 'schedulingScheduleLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingScheduleLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'project',
				valueMember: 'Id',
				displayMember: 'ProjectNo'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingProjectLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingSchedulingProjectLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingScheduleLookupService.getProjectList());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingScheduleLookupService.getProjectList();
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
						var list = schedulingScheduleLookupService.getProjectList();
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
						return schedulingScheduleLookupService.getProjectList();
					}
				}
			});
		}
	]);

})(angular);
