(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectMainAccessObject2GrpRoleValidationService
	 * @description provides validation methods for accessobject2grprole header instances
	 */
	var moduleName='project.main';
	angular.module(moduleName).service('projectMainAccessObject2GrpRoleValidationService', ProjectMainAccessObject2GrpRoleValidationService);

	ProjectMainAccessObject2GrpRoleValidationService.$inject = [ 'platformDataValidationService','objectMainUnitService'];

	function ProjectMainAccessObject2GrpRoleValidationService( ) {
		var self = this;
		return self;
	}

})(angular);
