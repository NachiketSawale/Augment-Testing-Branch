/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 @ngdoc service
	 * @name estimateMainBoqSpecificationService
	 * @function
	 *
	 * @description
	 * Service for the Boq Specification view.
	 * Includes the textAngular html editor.
	 */
	angular.module(moduleName).factory('estimateMainBoqSpecificationService', ['boqMainServiceFactory',

		function (boqMainServiceFactory) {

			// The instance of the main service - to be filled with functionality below

			// Avoid that the navigation endpoint is routed to this service and that it triggers the update of the header information.
			let option = { addNavigationEndpoint: false,
				doUpdateHeaderInfo: false};

			let serviceContainer = boqMainServiceFactory.createNewBoqMainService(option);
			let service = serviceContainer.service;

			// This service is supposed to be readonly
			service.setReadOnly(true);
			serviceContainer.data.updateOnSelectionChanging = null; // Avoid triggering update for this service for it's meant to be readonly.
			serviceContainer.data.isRoot = false; // Avoid resetting object permission by selection change for this service for it's meant to be readonly.

			return service;

		}]);
})(angular);
