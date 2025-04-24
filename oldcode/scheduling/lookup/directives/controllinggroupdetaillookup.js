(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-lookup-activity-constraint-type
	 * @requires  schedulingLookupService
	 * @description ComboBox to select a constraint types for an activity
	 */

	angular.module('scheduling.lookup').directive('schedulingLookupControllingGroupDetail', ['$q', 'schedulingLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'controllinggroupdetail',
				uuid: 'd4befc9fa84d459eb5909321507d9e7e',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode', width: 100,formatter: 'code'},
					{ id: 'description', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 100, formatter: 'translation' }
				],
				valueMember: 'Id',
				displayMember: 'Code'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				lookupTypesServiceName: 'schedulingLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupControllingGroupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingLookupService.getControllingGroupDetails());
						return deferred.promise;
					},

					getItemByKey: function (value) {
						var item = {};
						var deferred = $q.defer();
						var list = schedulingLookupService.getControllingGroupDetails();
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
						return schedulingLookupService.getControllingGroupDetails();
					}
				}
			});
		}
	]);
})(angular);
