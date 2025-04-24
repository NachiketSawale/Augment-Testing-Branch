/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name modelMainPropertyKeyWizardService
	 * @description
	 * Launches the property key creation wizard from outside the model administration module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	//noinspection JSAnnotator
	angular.module('model.main').factory('modelMainPropertyKeyWizardService',
		['modelAdministrationPropertyKeyCreationService',
			function (modelAdministrationPropertyKeyCreationService) {
				var service = {};

				service.createPropertyKey = function createPropertyKey() {
					return modelAdministrationPropertyKeyCreationService.createPropertyKeyWithDialog({
						fromAdminModule: false
					});
				};

				return service;
			}
		]);
})(angular);
