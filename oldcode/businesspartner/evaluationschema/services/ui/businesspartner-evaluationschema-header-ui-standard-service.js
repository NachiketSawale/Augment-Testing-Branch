(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerEvaluationschemaHeaderUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationschemaHeaderUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerEvaluationschemaTranslationService', 'platformSchemaService',
			'basicsLookupdataConfigGenerator',
			function (BaseService, translationService, platformSchemaService,
				basicsLookupdataConfigGenerator) {
				let evaluationRubricFk = 33;
				let getLayout = function () {
					// Activity
					return {
						'fid': 'businesspartner.evaluationschema.activity.detail',
						'version': '1.1.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['descriptioninfo', 'sorting', 'isdefault', 'rubriccategoryfk', 'evaluationmotivefk', 'formfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							rubriccategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.rubriccategory', null, {
								field: 'RubricFk',
								filterKey: 'bp-evaluationschema-header-rubriccategory-by-rubric-filter',
								customIntegerProperty: 'BAS_RUBRIC_FK'
							}),
							'evaluationmotivefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.evaluation.motive'),
							'formfk': {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookup-data-by-custom-data-service-grid-less',
										lookupOptions: {
											lookupModuleQualifier: 'basicsUserFormLookupService',
											lookupType: 'basicsUserFormLookupService',
											dataServiceName: 'basicsUserFormLookupService',
											valueMember: 'Id',
											displayMember: 'DescriptionInfo.Description',
											filter: function () {
												return evaluationRubricFk;
											},
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'basicsUserFormLookupService',
										dataServiceName: 'basicsUserFormLookupService',
										displayMember: 'DescriptionInfo.Description',
										filter: function () {
											return evaluationRubricFk;
										}
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookup-data-by-custom-data-service-grid-less',
									options: {
										lookupModuleQualifier: 'basicsUserFormLookupService',
										lookupType: 'basicsUserFormLookupService',
										dataServiceName: 'basicsUserFormLookupService',
										valueMember: 'Id',
										displayMember: 'DescriptionInfo.Description',
										filter: function () {
											return evaluationRubricFk;
										},
										showClearButton: true
									}
								}
							}
						}
					};
				};

				let domains = platformSchemaService.getSchemaFromCache({
					typeName: 'EvaluationSchemaDto',
					moduleSubModule: 'BusinessPartner.EvaluationSchema'
				}).properties;
				return new BaseService(getLayout(), domains, translationService);
			}
		]);
})(angular);
