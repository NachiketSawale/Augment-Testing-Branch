/**
 * Created by reimer on 25.03.2015.
 */

(function (angular) {

	'use strict';

	angular.module('basics.userform').factory('basicsUserformFormValidationService', ['platformDataValidationService', 'basicsUserformMainService', function (platformDataValidationService, dataService) {

		var service = {};

		service.validateValidFrom = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
		};

		service.validateValidTo = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
		};

		return service;
	}
	]);

})(angular);

