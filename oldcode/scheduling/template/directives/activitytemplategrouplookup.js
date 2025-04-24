(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-template-activity-template-group-lookup
	 * @requires  schedulingTemplateActivityGroupService
	 * @description ComboBox to select a activity template group
	 */

	angular.module('scheduling.template').directive('schedulingTemplateActivityTemplateGroupLookup', ['$q', 'schedulingTemplateGrpMainService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingTemplateGrpMainService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'activitytemplategroupfk',
				valueMember: 'Id',
				displayMember: 'Code'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingTemplateLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingTemplateActivtiyTemplateGroupLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingTemplateGrpMainService.getList());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingTemplateGrpMainService.getList();
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
						var list = schedulingTemplateGrpMainService.getList();
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
						return schedulingTemplateGrpMainService.getList();
					}
				}
			});
		}
	]);

})(angular);
