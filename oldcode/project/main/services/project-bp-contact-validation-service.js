
(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainGeneralValidationService
	 * @description provides validation methods for project generals entities
	 */
	angular.module(moduleName).service('projectPrj2BPContactValidationService', ProjectPrj2BPContactValidationService);

	ProjectPrj2BPContactValidationService.$inject = ['projectPrj2BPContactService', 'platformDataValidationService', 'platformRuntimeDataService', '$q', '$http', '$injector'];

	function ProjectPrj2BPContactValidationService(projectPrj2BPContactService, platformDataValidationService, platformRuntimeDataService, $q, $http, $injector) {
		var self = this;
		this.validateContactFk = function validateContactFk(entity, value, model) {
			var result =  platformDataValidationService.validateMandatory(entity, value, model, self, projectPrj2BPContactService);
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return result;
		};

		this.asyncValidateContactFk = function asyncValidateContaktFk(entity, value) {
			return applyAsyncFieldTest({Prj2BP: entity, NewIntValue: value});
		};

		function applyAsyncFieldTest(validationSpec) {
			var defer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'project/main/project2bpcontact/validate', validationSpec).then(function (result) {
				var serv = $injector.get('projectPrj2BPContactService');
				serv.takeOver(result.data);
				defer.resolve(true);
			});

			return defer.promise;
		}
	}
})(angular);
