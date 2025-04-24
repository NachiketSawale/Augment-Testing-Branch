/**
 * Created by baf on 22.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationItemValidationService
	 * @description provides validation methods for timekeeping timeallocation item entities
	 */
	angular.module(moduleName).service('timekeepingTimeallocationItemValidationService', TimekeepingTimeallocationItemValidationService);

	TimekeepingTimeallocationItemValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingTimeallocationConstantValues', 'timekeepingTimeallocationItemDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function TimekeepingTimeallocationItemValidationService(platformValidationServiceFactory, timekeepingTimeallocationConstantValues, timekeepingTimeallocationItemDataService, platformDataValidationService, platformRuntimeDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingTimeallocationConstantValues.schemes.timeallocationitem, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingTimeallocationConstantValues.schemes.timeallocationitem)
		},
		self,
		timekeepingTimeallocationItemDataService);

		self.asyncValidateRecordFk = function validateArticleFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeallocationItemDataService);
			asyncMarker.myPromise = timekeepingTimeallocationItemDataService.setArticleInformation(entity, value).then(function (result) {
				return platformDataValidationService.finishAsyncValidation(true, result, value, model, asyncMarker, self, timekeepingTimeallocationItemDataService);
			});

			return asyncMarker.myPromise;
		};


		self.validateRecordFk = function validateRecordFk(entity, value) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'RecordFk', timekeepingTimeallocationItemDataService.getList(), self, timekeepingTimeallocationItemDataService);
		};


		self.validateRecordType = function validateRecordType(entity, value) {
			if (value === 1 && entity.IsGenerated) {
				platformRuntimeDataService.readonly(entity, [{field: 'TotalProductiveHours', readonly: true}]);
			} else {
				platformRuntimeDataService.readonly(entity, [{field: 'TotalProductiveHours', readonly: false}]);
			}
		};

	}
})(angular);
