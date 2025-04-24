/**
 * Created by baf on 25.10.2023
 */

(function (angular) {
	'use strict';
	var projectModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainAddressReadonlyProcessor
	 * @description provides methods to access, create and update project main address entities
	 */
	projectModule.service('projectMainAddressReadonlyProcessor', ProjectMainAddressReadonlyProcessor);

	ProjectMainAddressReadonlyProcessor.$inject = ['platformRuntimeDataService'];

	function ProjectMainAddressReadonlyProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(projectAddress) {
			if(projectAddress.Id === 0) {
				platformRuntimeDataService.readonly(projectAddress, true);
			}
		};
	}
})(angular);
