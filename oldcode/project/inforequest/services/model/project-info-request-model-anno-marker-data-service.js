/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const projectInfoRequestModule = angular.module('project.inforequest');

	const svcName = 'projectInfoRequestModelAnnoMarkerDataService';

	/**
	 * @ngdoc service
	 * @name projectInfoRequestModelAnnoMarkerDataService
	 * @function
	 *
	 * @description
	 */
	projectInfoRequestModule.factory(svcName,
		projectInfoRequestModelAnnoMarkerDataService);

	projectInfoRequestModelAnnoMarkerDataService.$inject = ['projectInfoRequestDataService',
		'modelAnnotationMarkerDataServiceFactory'];

	function projectInfoRequestModelAnnoMarkerDataService(projectInfoRequestDataService,
		modelAnnotationMarkerDataServiceFactory) {

		return modelAnnotationMarkerDataServiceFactory.createService({
			moduleName: 'project.inforequest',
			serviceName: svcName,
			parentService: projectInfoRequestDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'project.inforequest'
		});
	}
})(angular);
