/**
 * Created by leo on 17.11.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTmpl2CUGrpValidationService
	 * @description provides validation methods for ActivityTmpl2CUGrp instances
	 */
	angular.module('scheduling.template').factory('schedulingTemplateActivityTmpl2CUGrpValidationService', ['platformDataValidationService', 'schedulingTemplateActivityTmpl2CUGrpService',

		function (platformDataValidationService, schedulingTemplateActivityTmpl2CUGrpService) {

			var service = {};

			service.validateControllingGroupFk = function validateControllingGroupFk(entity, value, model) {
				var result = platformDataValidationService.isMandatory(value, model);

				return platformDataValidationService.finishValidation(result, entity, value, model, service, schedulingTemplateActivityTmpl2CUGrpService);
			};
			service.validateControllingGroupDetailFk = function validateControllingGroupDetailFk(entity, value, model) {
				var result = platformDataValidationService.isMandatory(value, model);

				return platformDataValidationService.finishValidation(result, entity, value, model, service, schedulingTemplateActivityTmpl2CUGrpService);
			};

			return service;
		}

	]);

})(angular);
