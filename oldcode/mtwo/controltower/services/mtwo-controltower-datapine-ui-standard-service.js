(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerDataPineDashboardsUIStandardService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerDataPineDashboardsUIStandardService is the data service for all ControlTower related functionality
	 *
	 */

	var modName = 'mtwo.controltower',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('mtwoControlTowerDataPineDashboardsLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			'fid': 'mtwo.datapine.dashboard.structure.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					'Description': {
						'location': cloudCommonModule,
						'identifier': 'entityDescription',
						'initial': 'Description'
					},
					'Name': {
						'location': cloudCommonModule,
						'identifier': 'entityName',
						'initial': 'Name'
					},
					'DashboardTypeId': {
						'location': modName,
						'identifier': 'entityDashboardTypeId',
						'initial': 'Dashboard Type'
					}
				}
			},
			'groups': [{
				'gid': 'baseGroup',
				'attributes': ['description', 'dashboardtypeid', 'name']
			}],
			'overloads': {
				'description': {
					'grid': {
						'editor': '',
						'formatter': 'description',
						'name$tr$': 'mtwo.controltower.datapine.dashboardDescription',
						'width': 200
					}
				},
				'name': {
					'grid': {
						'editor': '',
						'formatter': 'description',
						'name$tr$': 'mtwo.controltower.datapine.dashboardName',
						'width': 200
					}
				},
				'dashboardtypeid': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.dashboardtype', 'Description')
			},
			'addition': {
				'grid': [],
				'detail': []
			}
		};
	}]);

	angular.module(modName).factory('mtwoControlTowerDataPineDashboardsUIStandardService',
		['platformUIStandardConfigService', 'mtwoControlTowerTranslationService',
			'mtwoControlTowerDataPineDashboardsLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache(
					{typeName: 'DashboardStructureDto', moduleSubModule: 'Basics.BiPlusDesigner'}
				);
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);

})(angular);


