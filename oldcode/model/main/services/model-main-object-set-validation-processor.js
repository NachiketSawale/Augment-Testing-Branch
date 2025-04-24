/**
 * Created by leo on 31.03.2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'model.main';

	angular.module(moduleName).factory('modelMainObjectSetValidationProcessor', modelMainObjectSetValidationProcessor);
	modelMainObjectSetValidationProcessor.$inject = ['platformRuntimeDataService', '$injector'];
	function modelMainObjectSetValidationProcessor(platformRuntimeDataService, $injector) {
		var service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.invoke(['modelMainObjectSetValidationService', function (modelMainObjectSetValidationService) {
					modelMainObjectSetValidationService.validateObjectSetStatusFk(item, item.ObjectSetStatusFk);
					modelMainObjectSetValidationService.validateObjectSetTypeFk(item, item.ObjectSetTypeFk);
				}]);
			}
		};
		return service;
	}
})(angular);