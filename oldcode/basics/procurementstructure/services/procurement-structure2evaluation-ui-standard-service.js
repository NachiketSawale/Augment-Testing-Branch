(function () {
	'use strict';
	var modName = 'basics.procurementstructure';
	angular.module(modName)
		.factory('basicsProcurementEvaluationLayout',
			function () {
				return {
					'fid': 'basics.procurementstructure.evaluation.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['companyfk', 'bpdevaluationschemafk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							BpdEvaluationSchemaFk: {
								location: modName,
								identifier: 'evaluationSchema',
								initial: 'evaluationSchema'
							}
						}
					},
					'overloads': {
						'companyfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'Code'
								},
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {}
								},
								'change': 'formOptions.onPropertyChanged'
							}
						},
						'bpdevaluationschemafk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupField: 'BpdEvaluationSchemaFk',
									directive: 'business-partner-evaluation-schema-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'EvaluationSchema',
									displayMember: 'Description'
								},
								width: 100
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-evaluation-schema-combobox'
							}
						}
					},
					'addition': {
						grid: [
							{
								lookupDisplayColumn: true,
								field: 'CompanyFk',
								'name': 'Company Name',
								'name$tr$': 'cloud.common.entityCompanyName',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'CompanyName'
								},
								width: 140
							}
						]
					}
				};
			})
		.factory('basicsProcurementEvaluationUIStandardService',
			['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
				'basicsProcurementEvaluationLayout', 'platformSchemaService', 'platformUIStandardExtentService',

				function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcStructure2EvaluationDto',
						moduleSubModule: 'Basics.ProcurementStructure'
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