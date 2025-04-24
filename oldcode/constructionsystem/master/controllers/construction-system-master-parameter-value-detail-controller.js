/**
 * Created by chk on 12/21/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').controller('constructionSystemMasterParameterValueDetailController',
		['$scope', '$translate', 'platformDetailControllerService', 'constructionSystemMasterParameterValueDataService',
			'constructionSystemMasterParameterValueValidationService', 'constructionSystemMasterParameterValueUIStandardService',
			'platformTranslateService', 'constructionSystemMasterParameterDataService',
			'constructionSystemMasterValidationHelperService',
			function ($scope, $translate, platformDetailControllerService, parameterValueDataService,
				parameterValueValidationService, parameterValueUIStandardService,
				platformTranslateService, parameterDataService, validationHelperService) {

				parameterDataService.parameterValidateComplete.register(parameterValidationComplete);

				function parameterValidationComplete() {
					validationHelperService.updateContainTools($scope, parameterValueDataService);

					var selectedItem = parameterDataService.getSelected();
					if (selectedItem && selectedItem.IsLookup !== true) {
						parameterValueDataService.deleteAll();
					}
				}

				platformDetailControllerService.initDetailController($scope, parameterValueDataService, parameterValueValidationService, parameterValueUIStandardService, {});
			}]);
})(angular);