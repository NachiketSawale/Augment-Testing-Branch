(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerEvaluationschemaIconUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationschemaIconUIStandardService', ['platformUIStandardConfigService', 'businesspartnerEvaluationschemaTranslationService', 'platformSchemaService',
		function (BaseService, translationService, platformSchemaService) {
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
							'attributes': ['pointsfrom', 'pointsto', 'icon']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'icon': {
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-evaluation-schema-icon-combobox'
							},
							'grid': {
								lookupField: 'Icon',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'businessPartnerEvaluationSchemaIcon',
									displayMember: 'Description',
									imageSelector: 'businessPartnerEvaluationSchemaIconProcessor'
								},
								editor: 'lookup',
								editorOptions: {
									lookupField: 'Icon',
									directive: 'business-partner-evaluation-schema-icon-combobox'
								},
								width: 80
							}
						}
					}
				};
			};

			let domains = platformSchemaService.getSchemaFromCache({
				typeName: 'EvaluationSchemaIconDto',
				moduleSubModule: 'BusinessPartner.EvaluationSchema'
			}).properties;
			return new BaseService(getLayout(), domains, translationService);
		}
	]);
})(angular);
