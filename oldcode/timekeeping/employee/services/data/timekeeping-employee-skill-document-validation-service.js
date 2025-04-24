/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeSkillDocumentDataService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeSkillDocumentValidationService', TimekeepingEmployeeSkillDocumentValidationService);

	TimekeepingEmployeeSkillDocumentValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingEmployeeSkillDocumentDataService'];

	function TimekeepingEmployeeSkillDocumentValidationService(platformValidationServiceFactory, timekeepingEmployeeSkillDocumentDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'EmployeeSkillDocumentDto',
			moduleSubModule: 'Timekeeping.Employee'
		}, {
			mandatory: ['DocumentTypeFk', 'EmployeesSkillDocTypefk', 'FileArchiveDocFk']
		},
		self,
		timekeepingEmployeeSkillDocumentDataService);
	}
})(angular);
