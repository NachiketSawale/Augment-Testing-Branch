( function (angular) {
	'use strict';
	var modName = 'procurement.common';
	var basicsCustomizeModule = 'basics.customize';

	angular.module(modName).factory('procurementCommonHeaderTextLayout', procurementCommonHeaderTextLayout);

	procurementCommonHeaderTextLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function procurementCommonHeaderTextLayout(basicsLookupdataConfigGenerator) {
		return {

			'fid': 'requisition.headerText.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'translationInfos': {
				'extraModules': [modName, basicsCustomizeModule],
				'extraWords': {
					'PrcTexttypeFk': {
						'location': modName,
						'identifier': 'headerText.prcTextType',
						'initial': 'Text Type'
					},
					TextModuleTypeFk: {
						location: basicsCustomizeModule,
						identifier: 'textmoduletype',
						initial: 'Text Module Type'
					},
					IsProject:{
						'location': modName,
						'identifier': 'headerText.isProject',
						'initial': 'Is Project'
					}
				}
			},
			'groups': [{
				'gid': 'baseGroup',
				'attributes': ['prctexttypefk', 'textmoduletypefk','isproject']
			}],
			'overloads': {
				'prctexttypefk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName:'prcCommonTextTypeLookupDataService' ,enableCache: true}),
				/* 'prctexttypefk': {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							directive: 'procurement-text-type-combobox',
							lookupOptions: {filterKey: 'prc-req-header-text-prc-text-type-filter'}
						},
						'formatter': 'lookup',
						'formatterOptions': {'lookupType': 'configuration2TextType', 'displayMember': 'Description'},
						'width': 120
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'procurement-text-type-combobox',
							'descriptionMember': 'Description',
							lookupOptions: {filterKey: 'prc-req-header-text-prc-text-type-filter'}
						}
					}
				}, */
				'textmoduletypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmoduletype'),
				'isproject':{
					readonly:true
				}
			},
			'addition': {
				'grid': [],
				'detail': []
			}
		};
	}

	angular.module(modName).factory('procurementCommonHeaderTextUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonHeaderTextLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcHeaderblobDto',
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

				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function () {
					return angular.copy(basicGetStandardConfigForDetailView());
				};

				return service;
			}
		]);
} )(angular);
