/**
 * Created by baf on 28.05.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingEmployeeConditionConstantValues provides definitions and constants frequently used in timekeeping employee module
	 */
	angular.module(moduleName).value('timekeepingEmployeeConstantValues', {
		schemes: {
			crewAssignment: {typeName: 'CrewAssignmentDto', moduleSubModule: 'Timekeeping.Employee'},
			crewMember: {typeName: 'CrewMemberDto', moduleSubModule: 'Timekeeping.Employee'},
			employee: {typeName: 'EmployeeDto', moduleSubModule: 'Timekeeping.Employee'},
			employeeDefault: {typeName: 'EmployeeDefaultDto', moduleSubModule: 'Timekeeping.Employee'},
			employeePicture: {typeName: 'EmployeePictureDto', moduleSubModule: 'Timekeeping.Employee'},
			plannedAbsence: {typeName: 'PlannedAbsenceDto', moduleSubModule: 'Timekeeping.Employee'},
			skill: {typeName: 'EmployeeSkillDto', moduleSubModule: 'Timekeeping.Employee'},
			skillDocument: {typeName: 'EmployeeSkillDocumentDto', moduleSubModule: 'Timekeeping.Employee'},
			workingTimeAccountV: {typeName: 'WorkingTimeAccountVDto', moduleSubModule: 'Timekeeping.Employee'},
			employeeWTM: {typeName: 'EmployeeWTMDto', moduleSubModule: 'Timekeeping.Employee'},
			employeeStatus: { typeName: 'EmployeeStatusDTO', moduleSubModule: 'Timekeeping.Employee' },
			employeeSkillStatus: { typeName: 'EmployeeSkillStatusDto', moduleSubModule: 'Timekeeping.Employee' },
			ppsEmployeeAssignment:{ typeName: 'PpsEmployeeAssignmentDto', moduleSubModule: 'ProductionPlanning.Common' },
			employeeDoc:{ typeName: 'EmployeeDocumentDto', moduleSubModule: 'Timekeeping.Employee' },
			certification:{ typeName: 'CertifiedEmployeeDto', moduleSubModule: 'Timekeeping.Employee' },
			vacationAccount:{ typeName: 'VacationAccountDto', moduleSubModule: 'Timekeeping.Employee' },
			licenseCheck:{ typeName: 'EmployeeLicenseCheckDto', moduleSubModule: 'Timekeeping.Employee' },
		},
		uuid: {
			container: {
				crewAssignmentList: 'b89f95becdc44a84ba8cf3f32f2f06cf',
				crewAssignmentDetails: '0326e2061c0f45a790536a4741ec137c',
				crewMemberList: '41653191a89a4f279710b2b6bafd8a5b',
				crewMemberDetails: '7edfbf3ed45849e5acc2d49cbd2eddb6',
				employeeList: '3b47dae9be994a8c8aab95ca3aba7725',
				employeeDetails: '6fa7a4435630483b8ffe16d6dbd3d17c',
				employeeDefaultList: 'e5a38b354fe84b39b6d541ec661acb7e',
				employeeDefaultDetails: '5c0b3429333b401a90057101a209c85c',
				employeePictureList: 'cb717989d7494402a312e14f00974d51',
				employeePictureDetails: '14d107fb61184d6abb207033aef44e47',
				plannedAbsenceList: 'fdf3f45827f6410f8c89536f03982064',
				plannedAbsenceDetails: '4933b71664ea4c4db200937bd6e39cdb',
				skillList: 'a0ce2e3271734b7db3e13b2b6c2ad44a',
				skillDetails: '3a0dc9c87b63405895bbe38caff26e0b',
				skillDocumentList: '1aefc92216ac4bd6b614aae9b54e0dbc',
				skillDocumentDetails: 'd8704e0684b047ea949e6785f6a6ee92',
				employeeWorkingTimeAccountList:'e66a0a6fad844616b5c4c8be9de1c170',
				employeeWorkingTimeAccountDetails:'285614dd3e3847189844bafa8f029f7f',
				employeeWorkingTimeModelList:'67b5049e07304887abe0d7b29fcf20e3',
				employeeWorkingTimeModelDetail:'0eb6d19bf95546af8792202826993c7b',
				employeeDocList: 'e36248434a2c47219b813546e5bcd8bd',
				employeeDocDetails: '33b305dec16b11edafa10242ac120002',
				employeeCertList: '16e0f41c255e48038090ab70a92692e7',
				employeeCertDetails: '56v185feb13m77evgvb10659jh557801',
				employeeVacationAccountList: 'k9903131mo4a48l1a6524c4927252f47',
				employeeVacationAccountDetails: '1829a2061c0f45a790536a4741ec897c',
				employeeLicenseCheckList: '3bcfa94250ea4c57b57fdbddcf59aa79',
				employeeLicenseCheckDetails: '709b789198e04428b85ee78a02c63bca',
			}
		}
	});
})(angular);
