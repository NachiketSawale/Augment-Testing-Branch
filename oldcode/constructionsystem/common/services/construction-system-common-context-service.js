
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemCommonContextService',
		['$timeout', 'PlatformMessenger',
			function ($timeout, PlatformMessenger) {
				var service = {};
				var moduleContext = {};
				var timeout = {};

				service.cosCommonMainService = 'cos.current.mainservice';

				service.moduleValueChanged = new PlatformMessenger();

				service.setModuleValue = function setModuleValue(key, value){
					if (angular.isString(key)) {
						if (angular.isUndefined(value)) {
							value = null;
						}

						if (timeout[key]) {
							$timeout.cancel(timeout[key]);
						}

						if (!moduleContext[key] || moduleContext[key].val !== value) {
							moduleContext[key] = {val: value};
							service.moduleValueChanged.fire(key);
						}
					}
				};

				service.getModuleValue = function getModuleValue(key){
					// eslint-disable-next-line no-undef
					if (angular.isString(key) && Object.prototype.hasOwnProperty.call(moduleContext,key)) {
						return moduleContext[key].val;
					}
					return null;
				};

				service.removeModuleValue = function removeModuleValue(key){
					if (angular.isString(key) && Object.prototype.hasOwnProperty.call(moduleContext,key)) {
						if (!timeout[key]) {
							timeout[key] = $timeout(function () {
								delete moduleContext[key];
								timeout[key] = null;
							}, 1000);
						}

						return true;
					}
					return false;
				};

				service.getMainService = function getMainService(){
					return service.getModuleValue(service.cosCommonMainService);
				};

				service.setMainService = function setMainService(moduleService){
					service.setModuleValue(service.cosCommonMainService, moduleService);
				};

				service.getModuleName = function getModuleStatus(){
					var mainService = service.getMainService();
					if(!mainService){
						throw new Error('The main service should be set!');
					}

					return mainService.getModule().name;
				};

				return service;

			}]);
})(angular);