(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterConstantValues
	 * @function
	 *
	 * @description
	 * resourceMasterConstantValues provides definitions and constants frequently used in resource master module
	 */
	angular.module(moduleName).value('resourceMasterConstantValues', {
		schemes: {
			resource: {typeName: 'ResourceDto', moduleSubModule: 'Resource.Master'},
			photo: {typeName: 'PoolDto', moduleSubModule: 'Resource.Master'},
			requiredSkill: {typeName: 'RequiredResourceSkillDto', moduleSubModule: 'Resource.Master'},
			providedSkill: {typeName: 'ProvidedResourceSkillDto', moduleSubModule: 'Resource.Master'},
			resourcePart: {typeName: 'ResourcePartDto', moduleSubModule: 'Resource.Master'},
			providedSkillDocument: {typeName: 'ProvidedSkillDocumentDto', moduleSubModule: 'Resource.Master'},
			dataContext: {typeName: 'ResResource2mdcContextDto', moduleSubModule: 'Resource.Master'}
		},
		uuid: {
			container: {
				resourceList: '1046a3bd867147feb794bdb60a805eca',
				resourceDetail: 'd9391c21eaac4fb7b5db3178af56bdaa',
				poolList: '29278b487bd2434f8781b5929d9534cf',
				poolDetail: 'dde848354d474e529b937de53400357f',
				comment: '19c2a8a3346b40fda7364c2f3dda7f2e',
				photo: '3467f2642146437c94710b964f0c59cb',
				translation: '766992dd001b4c2aa739c35d222186f9',
				requiredSkillList: '485827a79a4b41b5aa8db9f323810cd2',
				requiredSkillDetail: '0fe7865b879b4dc0a9b2c8f88dd71484',
				providedSkillList: '9a9a8a01924849b484a03d3a85b67d82',
				providedSkillDetail: 'ff80c868f7b4469bba84cdf800afbb56',
				resourcePartList: 'dd7c02126a9c4654bb7d99ece8af7caa',
				resourcePartDetail: 'bb8ddc00f77c4535ada29aa2fd3b21d7',
				providedSkillDocumentList: 'b832581c91aa4418925c5cd9c575ab4f',
				providedSkillDocumentDetail: '21410313fb30413b840798cf7ec5b452',
				masterDataContextList: '37f6e0ad6d0f4f50acbd4b74d294ebdd',
				masterDataContextDetails: '05193fdb6814494ba4553ccdd6c7279e'
			}
		},
		type:{
			plant: 1,
			employee: 2
		}
	});
})(angular);
