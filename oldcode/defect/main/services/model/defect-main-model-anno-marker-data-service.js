/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const defectMainModule = angular.module('defect.main');

	const svcName = 'defectMainModelAnnoMarkerDataService';

	/**
	 * @ngdoc service
	 * @name defectMainModelAnnoMarkerDataService
	 * @function
	 *
	 * @description
	 */
	defectMainModule.factory(svcName,
		defectMainModelAnnoMarkerDataService);

	defectMainModelAnnoMarkerDataService.$inject = ['defectMainHeaderDataService',
		'modelAnnotationMarkerDataServiceFactory'];

	function defectMainModelAnnoMarkerDataService(defectMainHeaderDataService,
		modelAnnotationMarkerDataServiceFactory) {

		return modelAnnotationMarkerDataServiceFactory.createService({
			moduleName: 'defect.main',
			serviceName: svcName,
			parentService: defectMainHeaderDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'defect.main',
			getProjectIdFromParent: item => item.PrjProjectFk
		});
	}
})(angular);
