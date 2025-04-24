(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-template-activity-template-lookup
	 * @requires  schedulingTemplateActivityService
	 * @description ComboBox to select a activity template
	 */
	var moduleName = 'scheduling.template';
	angular.module(moduleName).directive('schedulingTemplateActivityTemplateLookup', ['$q', 'schedulingTemplateActivityTemplateService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, schedulingTemplateActivityTemplateService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'activitytemplatefk',
				valueMember: 'Id',
				displayMember: 'Code'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingTemplateLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingTemplateActivityTemplateLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(schedulingTemplateActivityTemplateService.getList());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = schedulingTemplateActivityTemplateService.getList();
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
						var list = schedulingTemplateActivityTemplateService.getList();
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
						return schedulingTemplateActivityTemplateService.getList();
					}
				}
			});
		}
	]);

})(angular);
