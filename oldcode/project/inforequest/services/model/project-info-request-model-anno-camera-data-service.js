/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const projectInfoRequestModule = angular.module('project.inforequest');

	const svcName = 'projectInfoRequestModelAnnoCameraDataService';

	/**
	 * @ngdoc service
	 * @name projectInfoRequestModelAnnoCameraDataService
	 * @function
	 *
	 * @description
	 */
	projectInfoRequestModule.factory(svcName,
		projectInfoRequestModelAnnoCameraDataService);

	projectInfoRequestModelAnnoCameraDataService.$inject = ['projectInfoRequestDataService',
		'modelAnnotationCameraDataServiceFactory'];

	function projectInfoRequestModelAnnoCameraDataService(projectInfoRequestDataService,
		modelAnnotationCameraDataServiceFactory) {

		return modelAnnotationCameraDataServiceFactory.createService({
			moduleName: 'project.inforequest',
			serviceName: svcName,
			parentService: projectInfoRequestDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'project.inforequest'
		});
	}
})(angular);
