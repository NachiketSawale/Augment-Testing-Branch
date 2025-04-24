/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const projectInfoRequestModule = angular.module('project.inforequest');

	const svcName = 'projectInfoRequestModelAnnoObjectLinkDataService';

	/**
	 * @ngdoc service
	 * @name projectInfoRequestModelAnnoObjectLinkDataService
	 * @function
	 *
	 * @description
	 */
	projectInfoRequestModule.factory(svcName,
		projectInfoRequestModelAnnoObjectLinkDataService);

	projectInfoRequestModelAnnoObjectLinkDataService.$inject = ['projectInfoRequestDataService',
		'modelAnnotationObjectLinkDataServiceFactory'];

	function projectInfoRequestModelAnnoObjectLinkDataService(projectInfoRequestDataService,
		modelAnnotationObjectLinkDataServiceFactory) {

		return modelAnnotationObjectLinkDataServiceFactory.createService({
			moduleName: 'project.inforequest',
			serviceName: svcName,
			parentService: projectInfoRequestDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'project.inforequest'
		});
	}
})(angular);
