/**
 * Created by baf on 02.11.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupProjectGroupValidationService
	 * @description provides validation methods for resource equipment ProjectGroup entities
	 */
	myModule.service('projectGroupDefaultEntityService', ProjectGroupDefaultEntityService);

	ProjectGroupDefaultEntityService.$inject = ['$http'];

	function ProjectGroupDefaultEntityService($http) {
		this.getDefault = function getDefault() {
			return $http.get(globals.webApiBaseUrl + 'project/group/default').then(function (response)
			{
				return response.data;
			});
		};
	}
})(angular);