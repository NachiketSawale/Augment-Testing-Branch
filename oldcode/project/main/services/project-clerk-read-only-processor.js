/**
 * Created by cakiral on 12.09.2020
 */

(function (angular) {
	'use strict';
	var moduleName = angular.module('project.main');

	moduleName.service('projectClerkReadOnlyProcessor', ProjectClerkReadOnlyProcessor);

	ProjectClerkReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ProjectClerkReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processProjectClerkEntity(clerk) {
			platformRuntimeDataService.readonly(clerk, [
				{field: 'Address', readonly:true},
				{field: 'TelephoneNumber', readonly:true},
				{field: 'TelephoneNumberTelefax', readonly:true},
				{field: 'TelephoneMobil', readonly:true},
				{field: 'Email', readonly:true},
				{field: 'CountryFk', readonly:true},
				{field: 'TelephonePrivat', readonly:true},
				{field: 'TelephonePrivatMobil', readonly:true},
			]);
		};
	}
})(angular);
