/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	var moduleName = angular.module('project.main');

	moduleName.service('projectMainActionReadOnlyProcessor', ProjectMainActionReadOnlyProcessor);

	ProjectMainActionReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ProjectMainActionReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processMainActionEntity(item) {
			if(item.IsEmployeeReport === true){
				platformRuntimeDataService.readonly(item, [
					{field: 'ControllingUnitFk', readonly:true},
					{field: 'ActivityFk', readonly:true},
					{field: 'LogisticJobFk', readonly:true}
				]);
			}
		};
	}
})(angular);
