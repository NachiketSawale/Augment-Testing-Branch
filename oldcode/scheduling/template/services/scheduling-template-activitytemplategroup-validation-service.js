/**
 * Created by leo on 17.11.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateGroupValidationService
	 * @description provides validation methods for ActivityTemplateGroup instances
	 */
	angular.module('scheduling.template').factory('schedulingTemplateGroupValidationService', ['platformDataValidationService', 'schedulingTemplateGrpMainService',

		function (platformDataValidationService, schedulingTemplateGrpMainService) {

			var service = {};

			service.validateCode = function (entity, value, model){
				var items = schedulingTemplateGrpMainService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, schedulingTemplateGrpMainService);
			};

			return service;
		}

	]);

})(angular);
