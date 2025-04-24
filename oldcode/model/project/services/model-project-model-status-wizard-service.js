/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectModelStatusWizardService
	 * @function
	 *
	 * @description Provides a status change wizard for object sets.
	 */
	angular.module('model.project').service('modelProjectModelStatusWizardService', ['basicsCommonChangeStatusService',
		'modelProjectModelDataService', 'basicsCustomMDLStatusLookupDataService', 'projectMainService',
		function (basicsCommonChangeStatusService, modelProjectModelDataService,
		          basicsCustomMDLStatusLookupDataService, projectMainService) {
			const service = {};

			service.showDialog = function () {
				const wz = basicsCommonChangeStatusService.provideStatusChangeInstance({
					mainService: projectMainService,
					dataService: modelProjectModelDataService,
					title: 'model.project.changeModelStatus',
					statusField: 'StatusFk',
					statusName: 'model',
					statusProvider: function () {
						return basicsCustomMDLStatusLookupDataService.getList({});
					},
					updateUrl: 'model/project/model/changestatus'
				});
				wz.fn();
			};

			return service;
		}]);
})(angular);
