(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-lookup-activity-constraint-type
	 * @requires  schedulingLookupService
	 * @description ComboBox to select a constraint types for an activity
	 */

	angular.module('scheduling.lookup').directive('schedulingLookupControllingGroup', ['$q', 'schedulingLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'controllinggroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '48cbede1b0944152a51cfecc66f7d9aa',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode', width: 100,formatter: 'code'},
					{ id: 'description', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 100, formatter: 'translation' }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				lookupTypesServiceName: 'schedulingLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupControllingGroupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingLookupService.getControllingGroups());
						return deferred.promise;
					},

					getItemByKey: function (value) {
						var item = {};
						var list = schedulingLookupService.getControllingGroups();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
						return item;
					},

					getSearchList: function () {
						return schedulingLookupService.getControllingGroups();
					}
				}
			});
		}
	]);
})(angular);
