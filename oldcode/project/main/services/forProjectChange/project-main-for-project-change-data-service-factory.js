/**
 * Created by cakiral on 18.02.2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.main';
	var projectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainChangeForDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	projectModule.service('projectMainForProjectChangeDataServiceFactory', ProjectMainForProjectChangeDataServiceFactory);

	ProjectMainForProjectChangeDataServiceFactory.$inject = ['platformDynamicDataServiceFactory', 'projectMainService'];

	function ProjectMainForProjectChangeDataServiceFactory(platformDynamicDataServiceFactory, projectMainService) {
		var instances = {};

		this.createDataService = function createDataService(templInfo) {
			var moduleInfo = {
				instance: projectModule,
				name: 'Project.Main',
				postFix: 'ChangeForProjectDataService',
				translationKey: 'project.main.changeFor',
				readEndPoint: 'byProject',
				parentService: projectMainService,
				filterName: 'projectId',
				itemName: 'ChangeOfProject'
			};

			var dsName = platformDynamicDataServiceFactory.getDataServiceName(templInfo, moduleInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = platformDynamicDataServiceFactory.createDataService(templInfo, moduleInfo);
				instances[dsName] = srv;
			}

			return srv;
		};
	}
})(angular);
