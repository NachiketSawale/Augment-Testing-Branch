/**
 * Created by leo on 17.11.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTemplateValidationService
	 * @description provides validation methods for ActivityTemplate instances
	 */
	angular.module('scheduling.template').factory('schedulingTemplateActivityTemplateValidationService', ['platformDataValidationService', 'schedulingTemplateActivityTemplateService',

		function (platformDataValidationService, schedulingTemplateActivityTemplateService) {

			var service = {};

			service.validateCode = function (entity, value, model) {
				var items = schedulingTemplateActivityTemplateService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, schedulingTemplateActivityTemplateService);
			};

			return service;
		}

	]);

})(angular);
