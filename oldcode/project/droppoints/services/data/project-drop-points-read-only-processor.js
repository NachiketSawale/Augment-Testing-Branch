/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	'use strict';
	var dropPointModule = angular.module('project.droppoints');

	dropPointModule.service('projectDropPointsReadOnlyProcessor', ProjectDropPointsReadOnlyProcessor);

	ProjectDropPointsReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ProjectDropPointsReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(dropPoint) {
			platformRuntimeDataService.readonly(dropPoint, [
				{ field: 'Code', readonly: !dropPoint.IsManual },
				{ field: 'GLNCode', readonly: !dropPoint.IsManual },
				{ field: 'DropPointTypeFk', readonly: !dropPoint.IsManual },
				{ field: 'IsActive', readonly: !dropPoint.IsManual },
				{ field: 'ControllingUnitFk', readonly: !dropPoint.IsManual },
				{ field: 'PrjAddressFk', readonly: !dropPoint.IsManual },
				{ field: 'Icon', readonly: !dropPoint.IsManual },
				{ field: 'ClerkRespFk', readonly: !dropPoint.IsManual },
				{ field: 'Comment', readonly: !dropPoint.IsManual }
			]);
		};
	}
})(angular);