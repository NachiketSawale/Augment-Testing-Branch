/*globals angular */
(function (angular) {
	'use strict';

	function basicsWorkflowTypeService(_, platformTranslateService) {
		var service = {};

		service.asArray =
			[
				{id: 1, key: 'basics.workflow.template.type.1'},
				{id: 2, key: 'basics.workflow.template.type.2'}
			];

		service.workflow = service.asArray[0];
		service.escalation = service.asArray[1];

		service.getById = function (id) {
			return _.find(service.asArray, {id: id});
		};

		service.getTranslated = function (workflowType) {
			var translatedArray = [];
			var typs = [];

			if (angular.isArray(workflowType)) {
				_.each(workflowType, function (item) {
					translatedArray.push(item.key);
				});
				typs = workflowType;
			} else {
				translatedArray.push(workflowType.key);
				typs.push(workflowType);
			}

			return platformTranslateService.translate(translatedArray, false).then(function (response) {
				_.each(typs, function (typ) {
					typ.description = response[typ.key];
				});
				return typs;
			});

		};

		return service;
	}

	angular.module('basics.workflow').factory('basicsWorkflowTypeService',
		['_', 'platformTranslateService', basicsWorkflowTypeService]);

})(angular);
