/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const defectMainModule = angular.module('defect.main');

	const svcName = 'defectMainModelAnnoCameraDataService';

	/**
	 * @ngdoc service
	 * @name defectMainModelAnnoCameraDataService
	 * @function
	 *
	 * @description
	 */
	defectMainModule.factory(svcName,
		defectMainModelAnnoCameraDataService);

	defectMainModelAnnoCameraDataService.$inject = ['defectMainHeaderDataService',
		'modelAnnotationCameraDataServiceFactory'];

	function defectMainModelAnnoCameraDataService(defectMainHeaderDataService,
		modelAnnotationCameraDataServiceFactory) {

		return modelAnnotationCameraDataServiceFactory.createService({
			moduleName: 'defect.main',
			serviceName: svcName,
			parentService: defectMainHeaderDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'defect.main',
			getProjectIdFromParent: item => item.PrjProjectFk
		});
	}
})(angular);
