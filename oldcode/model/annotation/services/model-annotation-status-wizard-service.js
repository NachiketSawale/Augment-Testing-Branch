(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name modelAnnotationStatusWizardService
     * @function
     *
     * @description Provides a status change wizard for model annotations.
     */
	angular.module('model.annotation').service('modelAnnotationStatusWizardService', ['basicsCommonChangeStatusService',
		'modelAnnotationDataService', 'basicsCustomMDLAnnoStatusLookupDataService',
		function (basicsCommonChangeStatusService, modelAnnotationDataService, basicsCustomMDLAnnoStatusLookupDataService) {
			const service = {};

			service.showDialog = function () {
				var wz = basicsCommonChangeStatusService.provideStatusChangeInstance({
					mainService: modelAnnotationDataService,
					title: 'model.annotation.changeAnnotationStatus',
					statusField: 'StatusFk',
					statusName: 'modelAnnotation',
					statusProvider: function () {
						return basicsCustomMDLAnnoStatusLookupDataService.getList({});
					},
					updateUrl: 'model/annotation/changestatus'
				});
				wz.fn();
			};
			return service;
		}]);
})(angular);