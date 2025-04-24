/**
 * Created by Sudarshan on 22.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingCertificateConstantValues provides definitions and constants frequently used in timekeeping certificate module
	 */
	angular.module(moduleName).value('timekeepingCertificateConstantValues', {
		schemes: {
			certificate: {typeName: 'EmployeeCertificateDto', moduleSubModule: 'Timekeeping.Certificate'},
			certifiedEmployee: {typeName: 'CertifiedEmployeeDto', moduleSubModule: 'Timekeeping.Certificate'},
			certificateDoc:{typeName: 'EmployeeCertifiedDocumentDto', moduleSubModule: 'Timekeeping.Certificate'}
		},
		uuid: {
			container: {
				certificateList: 'c9420131ec4a48a1a6524c4927252f47',
				certificateDetails: '1c474c77cb944482833296349056c317',
				certifiedEmployeeList:'e69fc5da946948f1abaa204629a91067',
				certifiedEmployeeDetails:'2d585d88dc054491922176340016f112',
				certificateDocList:'a68ac5da946948r1abaa204629a91048',
				certificateDocDetails:'6e476e45fc076573698722593466n523'
			}
		}
	});
})(angular);
