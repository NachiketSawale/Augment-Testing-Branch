/**
 * Created by chk on 12/18/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').controller('constructionSystemMasterParameterValueController',
		['$scope', '$translate', 'procurementCommonHelperService', 'constructionSystemMasterParameterValueDataService',
			'platformGridControllerService', 'constructionSystemMasterParameterValueUIStandardService',
			'constructionSystemMasterParameterValueValidationService', 'constructionSystemMasterParameterDataService',
			'parameterDataLookup','constructionSystemMasterValidationHelperService',
			function ($scope, $translate, procurementCommonHelperService, parameterValueDataService,
				platformGridControllerService, parameterValueUIStandardService,
				parameterValueValidationService, parameterDataService,
				parameterDataLookup,validationHelperService) {

				parameterDataService.parameterValidateComplete.register(parameterValidationComplete);

				function parameterValidationComplete() {

					validationHelperService.updateContainTools($scope,parameterValueDataService,true);
					var selectedItem = parameterDataService.getSelected();
					if (selectedItem && selectedItem.IsLookup !== true) {
						parameterValueDataService.deleteAll();
					}
				}
				platformGridControllerService.initListController($scope, parameterValueUIStandardService, parameterValueDataService, parameterValueValidationService, {});
			}
		]);
})(angular);