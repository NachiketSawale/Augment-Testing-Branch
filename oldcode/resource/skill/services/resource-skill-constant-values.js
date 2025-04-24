(function (angular) {
	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc service
	 * @name resourceSkillConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceSkillConditionConstantValues provides definitions and constants frequently used in resource skill module
	 */
	angular.module(moduleName).value('resourceSkillConstantValues', {
		schemes: {
			skill: {typeName: 'ResourceSkillDto', moduleSubModule: 'Resource.Skill'},
			skillChain: {typeName: 'ResourceSkillChainDto', moduleSubModule: 'Resource.Skill'}
		},
		uuid: {
			container: {
				skillList: '42e6d32d1ea343e5b0558a0394bfd3f7',
				skillDetail: 'c6c4abc54c5b432aa8cdee1b4b4030a3',
				skillChainList: '0aa9dbc6d88744e2adc1d08e85e9361b',
				skillChainDetail: '41057af6965043cfaab9bb267b239061',
				translation: '8aa83e56e8c14c669871667de86c8557'
			}
		}
	});
})(angular);
