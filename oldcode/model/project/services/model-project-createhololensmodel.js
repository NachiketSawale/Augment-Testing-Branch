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
	 * @name modelProjectCreateHololensModelService
	 * @function
	 *
	 * @description
	 * The createhololensmodel starts the creation of the Hololens Model
	 */

	angular.module(moduleName).service('modelProjectCreateHololensModelService', ModelProjectCreateHololensModelService);

	ModelProjectCreateHololensModelService.$inject = ['$http', '$injector'];

	function ModelProjectCreateHololensModelService($http, $injector) {
		this.createHololensModel = function createHololensModel() {
			var modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
			var selectedModelID = modelViewerModelSelectionService.getSelectedModelId();
			$http.post(globals.webApiBaseUrl + 'model/project/model/createhololensmodel', {Id: selectedModelID});
		};
	}
})(angular);
