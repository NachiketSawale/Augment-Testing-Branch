/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	'use strict';
	var dropPointModule = angular.module('project.droppoints');

	dropPointModule.service('projectDropPointsDropPointArticlesReadOnlyProcessor', ProjectDropPointsDropPointArticlesReadOnlyProcessor);

	ProjectDropPointsDropPointArticlesReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ProjectDropPointsDropPointArticlesReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(dropPoint) {
			platformRuntimeDataService.readonly(dropPoint, [
				{ field: 'Quantity', readonly: dropPoint.PlantFk !== null && !dropPoint.IsBulk }
			]);
		};
	}
})(angular);