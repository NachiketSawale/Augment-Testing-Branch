/**
 * Created by lvy on 5/9/2018.
 */
(function (angular) {
	'use strict';
	var modulename = 'constructionsystem.master';
	angular.module(modulename).controller('constructionSystemMasterGlobalParameterValueDetailController',
		['$scope', '$translate', 'platformDetailControllerService', 'constructionSystemMasterGlobalParameterValueDataService',
			'constructionSystemMasterGlobalParameterValueValidationService', 'constructionSystemMasterGlobalParameterValueUIStandardService',
			'platformTranslateService', 'constructionSystemMasterGlobalParameterDataService',
			'constructionSystemMasterValidationHelperService',
			function ($scope, $translate, platformDetailControllerService, GlobalParameterValueDataService,
				GlobalParameterValueValidationService, GlobalParameterValueUIStandardService,
				platformTranslateService, GlobalParameterDataService, validationHelperService) {

				GlobalParameterDataService.parameterValidateComplete.register(parameterValidationComplete);

				function parameterValidationComplete() {
					validationHelperService.updateContainTools($scope, GlobalParameterValueDataService);

					var selectedItem = GlobalParameterDataService.getSelected();
					if (selectedItem && selectedItem.IsLookup !== true) {
						GlobalParameterValueDataService.deleteAll();
					}
				}

				platformDetailControllerService.initDetailController($scope, GlobalParameterValueDataService, GlobalParameterValueValidationService, GlobalParameterValueUIStandardService, {});
			}]);
})(angular);
