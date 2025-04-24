/**
 * Created by wui on 3/6/2019.
 */

(function (angular) {
	'use strict';

	const moduleName = 'procurement.rfq';
	const prcCommonModule = 'procurement.common';
	const basicsCustomizeModule = 'basics.customize';

	angular.module(moduleName).factory('procurementRfqHeaderTextLayout', procurementRfqHeaderTextLayout);

	procurementRfqHeaderTextLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function procurementRfqHeaderTextLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'rfq.headerText.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'translationInfos': {
				'extraModules': [prcCommonModule, basicsCustomizeModule],
				'extraWords': {
					'PrcTexttypeFk': {
						'location': prcCommonModule,
						'identifier': 'headerText.prcTextType',
						'initial': 'Text Type'
					},
					TextModuleTypeFk: {
						location: basicsCustomizeModule,
						identifier: 'textmoduletype',
						initial: 'Text Module Type'
					},
					'IsProject': {
						'location': prcCommonModule,
						'identifier': 'headerText.isProject',
						'initial': 'Is Project'
					}
				}
			},
			'groups': [{
				'gid': 'baseGroup',
				'attributes': ['prctexttypefk', 'textmoduletypefk', 'isproject']
			}],
			'overloads': {
				'prctexttypefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'prcCommonTextTypeLookupDataService', enableCache: true}),
				'textmoduletypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmoduletype'),
				'isproject': {
					readonly: true
				}
			},
			'addition': {
				'grid': [],
				'detail': []
			}
		};
	}

	angular.module(moduleName).factory('procurementRfqHeaderTextUIStandardService',
		['platformUIStandardConfigService', 'procurementRfqTranslationService',
			'procurementRfqHeaderTextLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'RfqHeaderblobDto',
					moduleSubModule: 'Procurement.RfQ'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				let service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				// override getStandardConfigForDetailView
				let basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function () {
					return angular.copy(basicGetStandardConfigForDetailView());
				};

				return service;
			}
		]);
})(angular);
