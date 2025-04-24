/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc service
	 * @name resourceTypeConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceTypeConditionConstantValues provides definitions and constants frequently used in resource type module
	 */
	angular.module(moduleName).value('resourceTypeConstantValues', {
		schemes: {
			type: {typeName: 'ResourceTypeDto', moduleSubModule: 'Resource.Type'},
			requiredSkill: {typeName: 'RequiredSkillDto', moduleSubModule: 'Resource.Type'},
			planningBoardFilter: {typeName: 'PlanningBoardFilterDto', moduleSubModule: 'Resource.Type'},
			requestedType: {typeName: 'RequestedTypeDto', moduleSubModule: 'Resource.Type'},
			requestedSkillV: {typeName: 'RequestedSkillVDto', moduleSubModule: 'Resource.Type'},
			alternativeResType: {typeName: 'AlternativeResTypeDto', moduleSubModule: 'Resource.Type'},
		},
		uuid: {
			container: {
				typeList: 'b881141e03c14ddfb1aa965c0cb9ea2c',
				typeDetail: '02941383fd24429f9ba46df30b2f6d6c',
				requiredSkillList: 'a0b5aa1be8524f48b1796a06b9ce3e77',
				requiredSkillDetail: 'a6e1e8208327420f85aa92585f851aee',
				planningBoardFilterList: '9a86db998dad47b6bf7e96fe48c6f0b7',
				planningBoardFilterDetail: '1d92b58b87834e8b825380b75c9ca796',
				requestedTypeList: '009af8b7d07b48d5879e220f684e207e',
				requestedTypeDetail: 'f7836fe22b9445e69cd2f881d69fa610',
				requestedSkillVList: '29e4435b181f41ada329d9c6874867e7',
				requestedSkillVDetail: 'e87b97f59061480b9630a1880c340788',
				alternativeResTypeList: '626a87698fef4e69bff848173b424519',
				alternativeResTypeDetail: 'ddeb7bd64d6c4eceb84dec9b7b0dbe00'
			}
		}
	});
})(angular);
