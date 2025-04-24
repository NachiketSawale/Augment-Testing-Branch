/**
 * Created by leo on 02.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.employee';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name employee
	 * @description
	 * Module definition of the timekeeping employee module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			let wizardData = [{
				serviceName: 'timekeepingEmployeeSidebarWizardService',
				wizardGuid: 'df9d5e1dd85c4af3a7618bf455cb2957',
				methodName: 'disableEmployee',
				canActivate: true
			}, {
				serviceName: 'timekeepingEmployeeSidebarWizardService',
				wizardGuid: 'b893f83de69e4d0eac630df78eaf7c79',
				methodName: 'enableEmployee',
				canActivate: true
			},
			{
				serviceName: 'timekeepingEmployeeCreateResourcesSideBarWizardService',
				wizardGuid: '6106e416127d40a1a47da65ec62688df',
				methodName: 'createResources',
				canActivate: true
			},
			{
				serviceName: 'timekeepingEmployeeSidebarWizardService',
				wizardGuid: '9bc066326fae45e68798d99e314cac1b',
				methodName: 'setPlannedAbsenceStatus',
				canActivate: true
			},
			{
				serviceName: 'timekeepingEmployeeSidebarWizardService',
				wizardGuid: 'c375c8caaa3644b4adfbf72e77256ff6',
				methodName: 'setEmployeeStatus',
				canActivate: true
			},
			{
				serviceName: 'timekeepingEmployeeSidebarWizardService',
				wizardGuid: '6403dcc971c6460b8b5d9e42578fd14c',
				methodName: 'setEmployeeSkillStatus',
				canActivate: true
			},
			{
				serviceName: 'timekeepingEmployeeSidebarWizardService',
				wizardGuid: '3934cc07803041928fe4b8b110ac25a4',
				methodName: 'createReservation',
				canActivate: true
			},
			{
				serviceName: 'timekeepingEmployeeSidebarWizardService',
				wizardGuid: '27b4fcf125c54f3780c234e3a1aba5c7',
				methodName: 'generatePlannedAbsences',
				canActivate: true
			},
			{
				serviceName: 'timekeepingEmployeeCertificatesSideBarWizardService',
				wizardGuid: '291c0f1a7456446890600c601237c7ce',
				methodName: 'changeCertificateStatus',
				canActivate: true
			}];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'timekeepingEmployeeConstantValues',
						function (platformSchemaService, basicsConfigWizardSidebarService, timekeepingEmployeeConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								timekeepingEmployeeConstantValues.schemes.crewAssignment,
								timekeepingEmployeeConstantValues.schemes.crewMember,
								timekeepingEmployeeConstantValues.schemes.employee,
								timekeepingEmployeeConstantValues.schemes.employeeDefault,
								timekeepingEmployeeConstantValues.schemes.employeePicture,
								timekeepingEmployeeConstantValues.schemes.plannedAbsence,
								timekeepingEmployeeConstantValues.schemes.skill,
								timekeepingEmployeeConstantValues.schemes.skillDocument,
								timekeepingEmployeeConstantValues.schemes.workingTimeAccountV,
								timekeepingEmployeeConstantValues.schemes.employeeWTM,
								timekeepingEmployeeConstantValues.schemes.ppsEmployeeAssignment,
								timekeepingEmployeeConstantValues.schemes.employeeDoc,
								timekeepingEmployeeConstantValues.schemes.certification,
								timekeepingEmployeeConstantValues.schemes.vacationAccount,
								timekeepingEmployeeConstantValues.schemes.licenseCheck
							]);
						}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]);
})(angular);
