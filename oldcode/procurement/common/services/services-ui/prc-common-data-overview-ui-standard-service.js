(function () {
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick */
	angular.module(modName).factory('procurementCommonOverviewLayout', [function(){
		return {
			'fid': 'requisition.data.overview.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					'Description': {
						'location': cloudCommonModule,
						'identifier': 'entityDescription',
						'initial': 'Title'
					},
					'Count': {
						'location': cloudCommonModule,
						'identifier': 'entityCount',
						'initial': 'Status'
					}
				}
			},
			'groups': [{
				'gid': 'baseGroup',
				'attributes': ['description', 'count']
			}],
			'overloads': {
				'description': {
					'grid': {
						'editor': '',
						'formatter': Slick.Formatters.TitleFormatter,
						'name$tr$':'procurement.common.data.reqDataTitle',
						'width': 200
					}
				},
				'count': {
					'grid': {
						'editor': '',
						'formatter': Slick.Formatters.IconTickFormatter,
						'name$tr':'procurement.common.data.reqDataStatus',
						'width': 90
					},
					'detail': {
						'type': 'boolean'
					}
				}
			},
			'addition': {
				'grid': [],
				'detail': []
			}
		};
	}]);

	angular.module(modName).factory('procurementCommonOverviewUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonOverviewLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcDataViewDto',
					moduleSubModule: 'Procurement.Common'
				});
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
})();
