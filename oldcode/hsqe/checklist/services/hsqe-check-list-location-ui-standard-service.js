/*
 * Created by alm on 01.25.2021.
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';

	angular.module(moduleName).factory('hsqeCheckList2LocationLayout', ['basicsLookupdataConfigGenerator','hsqeCheckListDataService',
		function hsqeCheckList2LocationLayout(basicsLookupdataConfigGenerator,hsqeCheckListDataService) {
			return {
				fid: 'hsqe.checklist.hsqechecklistlocationform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['prjlocationfk']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						'PrjLocationFk': {location: moduleName, identifier: 'location.entityLocation', initial: 'Location'}
					}
				},
				overloads: {
					'prjlocationfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
						dataServiceName: 'projectLocationLookupDataService',
						cacheEnable: true,
						additionalColumns: true,
						filter: function() {
							var parentItem = hsqeCheckListDataService.getSelected();
							if (parentItem) {
								return parentItem.PrjProjectFk ? parentItem.PrjProjectFk : -1;
							}
							return 0;
						}
					})
				}
			};
		}
	]);

	angular.module(moduleName).factory('hsqeCheckListLocationUIStandardService',

		['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'platformSchemaService', 'hsqeCheckList2LocationLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, hsqeCheckList2LocationLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'HsqCheckList2LocationDto',
					moduleSubModule: 'Hsqe.CheckList'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(hsqeCheckList2LocationLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, hsqeCheckList2LocationLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
