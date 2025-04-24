/**
 * Created by baf on 27.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc service
	 * @name resourceCertificateConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceCertificateConditionConstantValues provides definitions and constants frequently used in resource certificate module
	 */
	angular.module(moduleName).value('resourceCertificateConstantValues', {
		schemes: {
			certificate: {typeName: 'CertificateDto', moduleSubModule: 'Resource.Certificate'},
			certificateDoc: {typeName: 'CertificateDocumentDto', moduleSubModule: 'Resource.Certificate'},
			certificatedPlant: {typeName: 'CertificatedPlantDto', moduleSubModule: 'Resource.Certificate'}
		},
		uuid: {
			container: {
				certificateList: 'ddfd93ac951e42f0bb947a847121a79a',
				certificateDetails: '424d4d840861440489a0bfdfc71d04a1',
				certificateDocList: '3b4a2a670db2438da5deb4b9782547b5',
				certificateDocDetails: 'dd6a8c4970bd4f4fb46a6114c68ccd95',
				certificatedPlantList: '43d1291116b641858c78ad23732e4e60',
				certificatedPlantDetails: '055f01dd049d4ae3a1f00ff58444e176'
			}
		}
	});
})(angular);
