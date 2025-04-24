/**
 * Created by Joshi on 27.11.2015.
 */

(function () {
	'use strict';
	let estimateRuleModule = 'estimate.rule';
	let cloudCommonModule = 'cloud.common';
	let estimateMainModule = 'estimate.main';
	let basicsUnit = 'basics.unit';

	/**
	 * @ngdoc service
	 * @name estimateRuleTranslationService
	 * @description provides translation for estimate rule module
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(estimateRuleModule).service('estimateRuleTranslationService', ['platformUIBaseTranslationService',
		function (platformUIBaseTranslationService) {

			let estimateRuleTranslations = {
				translationInfos: {
					'extraModules': [estimateRuleModule,cloudCommonModule,estimateMainModule, basicsUnit],
					'extraWords': {
						baseGroup: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },

						EstRuleExecutionTypeFk :{location: estimateRuleModule, identifier: 'estRuleExecutionType', initial: 'Est Rule Execution Type'},
						EstEvaluationSequenceFk :{location: estimateRuleModule, identifier: 'evaluationSequence', initial: 'Evaluation Sequence'},
						BasRubricCategoryFk: {location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk', initial: 'Category'},

						EstParameterGroupFk: {location:estimateRuleModule, identifier: 'estParameterGroupFk', initial:'Estimate Parameter Group'},
						ValueDetail: {location:estimateRuleModule, identifier: 'valueDetail', initial:'Default Value Detail'},
						DefaultValue: {location:estimateRuleModule, identifier: 'defaultValue', initial:'Default Value'},

						Comment: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
						UomFk:{location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
						IsLive: { location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
						Icon:{location: cloudCommonModule, identifier: 'entityIcon', initial: 'Icon' },
						Info:{location: estimateRuleModule, identifier: 'Info', initial: 'Info'},
						Sorting :{location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},

						Code:{ location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
						Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},

						Value: {location:cloudCommonModule, identifier: 'entityParameterValue', initial:'Value'},
						DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
						ValueType: {location:estimateRuleModule, identifier: 'detailParameterValueType', initial:'Type'},
						IsLookup: {location:estimateRuleModule, identifier: 'detailParameterIsLookup', initial:'Is Lookup?'},
						IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default?'},

						IsForEstimate: {location:cloudCommonModule, identifier: 'isForEstimate', initial:'Is For Estimate'},
						IsForBoq: { location: cloudCommonModule, identifier: 'isForBoq', initial: 'Is For BoQ'},
						Operand: { location: cloudCommonModule, identifier: 'operand', initial: 'Operand'},

						ParameterCode:{location: estimateRuleModule, identifier: 'parameter.code', initial: 'Parameter Code'},
						ValueText:{location:estimateRuleModule, identifier: 'valuetext', initial:'Default Value'},
						FormFk:{location:estimateRuleModule, identifier: 'formFk', initial:'User Form'}

					}
				}
			};
			platformUIBaseTranslationService.call(this, [estimateRuleTranslations], {});

		}
	]);
})();
