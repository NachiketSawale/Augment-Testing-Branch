(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-main-activity-parent-lookup
	 * @requires  schedulingMainService
	 * @description ComboBox to select a activity
	 */

	angular.module('scheduling.main').directive('schedulingMainActivityParentLookup', ['$q', 'schedulingMainService', 'BasicsLookupdataLookupDirectiveDefinition','_',
		function ($q, schedulingMainService, BasicsLookupdataLookupDirectiveDefinition, _) {
			var defaults = {
				lookupType: 'activityfk',
				valueMember: 'Id',
				displayMember: 'Code'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingMainLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingMainActivitySchedulingMethodLookupDataHandler',

					getList: function () {
						return $q.when(schedulingMainService.getList());
					},

					getDefault: function () {
						var item = {};
						var list = schedulingMainService.getList();
						item = _.find(list, {Default: true});
						return $q.when(item);
					},

					getItemByKey: function (value) {
						var item = {};
						var list = schedulingMainService.getList();
						item = _.find(list, {Id: value});
						return $q.when(item);
					},

					getSearchList: function () {
						return $q.when(schedulingMainService.getList());
					}
				}
			});
		}
	]);

})(angular);
