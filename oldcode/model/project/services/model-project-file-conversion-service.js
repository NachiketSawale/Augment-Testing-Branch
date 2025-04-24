/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectFileConversionService
	 * @function
	 *
	 * @description
	 * The modelProjectFileConversionService starts the conversion of the choosen file
	 */

	angular.module(moduleName).service('modelProjectFileConversionService', ModelProjectFileConversionService);

	ModelProjectFileConversionService.$inject = ['$http', '$injector'];

	function ModelProjectFileConversionService($http, $injector) {
		this.convert = function convert(entity) {
			//start conversion via WEBApi
			var oldItem = entity;
			entity.State = 1;
			$http.post(globals.webApiBaseUrl + 'model/project/modelfile/convert', {
				Id: entity.Id,
				SkipLongPropertyValues: false
			}).then(function (response) {
				var fileService = $injector.get('modelProjectModelFileDataService');
				var schedulerService = $injector.get('servicesSchedulerUIStatusNotificationService');
				entity.JobFk = response.data.JobId;
				fileService.updateItemList(oldItem, entity);
				schedulerService.registerHandler([response.data.JobId], fileService.updateModelFileState);
			});
		};

		this.convertByWizard = function convertByWizard(id, skipProperty) {
			//start conversion via WEBApi
			return $http.post(globals.webApiBaseUrl + 'model/project/modelfile/convert', {
				Id: id,
				SkipLongPropertyValues: skipProperty
			});
		};
	}
})(angular);
