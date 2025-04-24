/**
 Create by pet on 6/13/2018
 */
/* global  */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	angular.module(modName).factory('defectQuestionLayout',  ['defectQuestionLookupItems',
		function () {
			return {
				'fid': 'defect.question',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code','description', 'checkstatus']
					}
				],
				'overloads': {
					// add combo box for check status
					'checkstatus':{
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'defect-question-status-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'DefectQuestionStatus',
								displayMember: 'Description'
							}
						}
					}
				}
			};
		}]);

	angular.module(modName).factory('defectQuestionUIStandardService',
		['platformUIStandardConfigService', 'defectTranslationService', 'defectQuestionLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DfmQuestionDto',
					moduleSubModule: 'Defect.Main'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				return new BaseService(layout, domainSchema, translationService);
			}
		]);

})(angular);
