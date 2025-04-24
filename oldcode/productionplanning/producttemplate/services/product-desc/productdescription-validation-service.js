/**
 * Created by zwz on 5/6/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';

	angular.module(moduleName).factory('productionplanningProducttemplateProductDescriptionValidationService', ValidationService);

	ValidationService.$inject = ['productionplanningProducttemplateProductDescriptionValidationServiceFactory', 'productionplanningProducttemplateMainService'];

	function ValidationService(validationSeviceFactory, dataServ) {
		return validationSeviceFactory.getService(dataServ);
	}
})(angular);

