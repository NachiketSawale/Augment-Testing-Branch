/**
 * Created by cakiral on 2020-02-18
 */
(function (angular) {
	'use strict';
	var projectMainModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainForProjectChangeContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	projectMainModule.service('projectMainForProjectChangeContainerService', ProjectMainForProjectChangeContainerService);

	ProjectMainForProjectChangeContainerService.$inject = ['platformDynamicContainerServiceFactory', 'projectMainForProjectChangeDataServiceFactory'];

	function ProjectMainForProjectChangeContainerService(platformDynamicContainerServiceFactory, projectMainForProjectChangeDataServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareGridConfig('Project.Main', projectMainForProjectChangeDataServiceFactory, containerUid, scope, moduleCIS);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareDetailConfig('Project.Main', projectMainForProjectChangeDataServiceFactory, containerUid, scope, moduleCIS);
		};
	}
})(angular);