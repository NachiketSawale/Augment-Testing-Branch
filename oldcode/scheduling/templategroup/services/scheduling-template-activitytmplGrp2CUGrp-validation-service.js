/**
 * Created by leo on 17.11.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTemplateGroupValidationService
	 * @description provides validation methods for ActivityTemplateGroup instances
	 */
	angular.module('scheduling.templategroup').factory('schedulingTemplateActivityTmplGrp2CUGrpValidationService', ['platformDataValidationService', 'schedulingTemplateActivityTmplGrp2CUGrpService',

		function (platformDataValidationService, schedulingTemplateActivityTmplGrp2CUGrpService) {

			var service = {};

			service.validateControllingGroupFk = function validateControllingGroupFk(entity, value, model) {
				var result = platformDataValidationService.isMandatory(value, model);

				return platformDataValidationService.finishValidation(result, entity, value, model, service, schedulingTemplateActivityTmplGrp2CUGrpService);
			};
			service.validateControllingGroupDetailFk = function validateControllingGroupDetailFk(entity, value, model) {
				var result = platformDataValidationService.isMandatory(value, model);

				return platformDataValidationService.finishValidation(result, entity, value, model, service, schedulingTemplateActivityTmplGrp2CUGrpService);
			};

			return service;
		}

	]);

})(angular);
