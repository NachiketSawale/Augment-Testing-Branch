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
	angular.module('scheduling.templategroup').factory('schedulingTemplateActivityTemplateGroupValidationService', ['platformDataValidationService', 'schedulingTemplateGrpEditService',

		function (platformDataValidationService, schedulingTemplateGrpEditService) {

			var service = {};

			service.validateCode = function (entity, value, model){
				var items = schedulingTemplateGrpEditService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, schedulingTemplateGrpEditService);
			};

			return service;
		}

	]);

})(angular);
