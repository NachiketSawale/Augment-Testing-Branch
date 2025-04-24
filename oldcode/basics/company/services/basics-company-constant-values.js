/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyConditionConstantValues
	 * @function
	 *
	 * @description
	 * basicsCompanyConditionConstantValues provides definitions and constants frequently used in basics company module
	 */
	angular.module(moduleName).value('basicsCompanyConstantValues', {
		schemes: {
			company: {typeName: 'CompanyDto', moduleSubModule: 'Basics.Company'},
			companyCreditor: {typeName: 'CompanyCreditorDto', moduleSubModule: 'Basics.Company'},
			companyDebtor: {typeName: 'CompanyDebtorDto', moduleSubModule: 'Basics.Company'},
			timekeepingGroup: {typeName: 'TimekeepingGroupDto', moduleSubModule: 'Basics.Company'},
			companyICCu: {typeName: 'CompanyICCuDto', moduleSubModule: 'Basics.Company'}
		},
		uuid: {
			container: {
				companyList: '50593FEEA9FE4280B36F72E27C8DFDA1',
				companyDetails: '44c2c0adb0c9408fb873b8c395aa5e08',
				companyCreditorList: 'bc9dee680be8436591036d1438c11296',
				companyCreditorDetails: 'f419dce401ca4f378598eec59b296b63',
				companyDebtorList: '21ea54ddccde46cea63aeaa86eb82b1b',
				companyDebtorDetails: '3dac85c30d4c468c9678d9f010a8501a',
				timekeepingGroupList: 'fad2f7ae9ac24fffa884a5245d4e8d18',
				timekeepingGroupDetails: '818c680483854e4f9ec50a71203cd49d',
				companyICCuList: 'a4bfa1b188fa4732a7dea63c536a9959',
				companyICCuDetails: '3bff3962163b4ab49afda5a5e9199e0c'
			}
		},
		companyTypes: {
			company: 1,
			group: 2,
			profitCenter: 3
		}
	});
})(angular);
