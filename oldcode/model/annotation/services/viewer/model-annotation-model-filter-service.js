/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.annotation.modelAnnotationModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Model Annotation module.
	 */
	angular.module('model.annotation').factory('modelAnnotationModelFilterService',
		modelAnnotationModelFilterService);

	modelAnnotationModelFilterService.$inject = ['modelViewerFilterFuncFactory',
		'modelAnnotationObjectLinkDataService'];

	function modelAnnotationModelFilterService(modelViewerFilterFuncFactory,
		modelAnnotationObjectLinkDataService) {

		return modelViewerFilterFuncFactory.createForDataService([modelAnnotationObjectLinkDataService.createModelFilterSettings(), {
			serviceName: 'modelAnnotationDataService'
		}]);
	}
})(angular);
