/**
 * Created by chk on 12/22/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').controller('constructionSystemMasterParameterGroupController',
		['$scope', '$translate', 'procurementCommonHelperService', 'constructionSystemMasterParameterGroupDataService',
			'platformGridControllerService', 'constructionSystemMasterParameterGroupUIStandardService',
			'constructionSystemMasterParameterGroupValidationService','constructionSystemMasterHeaderService',
			'constructionSystemMasterValidationHelperService',
			function ($scope, $translate, procurementCommonHelperService, parameterGroupDataService,
				platformGridControllerService, parameterGroupUIStandardService,
				parameterGroupValidationService,headerService,validationHelperService) {

				headerService.selectionHeaderChanged.register(function(){
					validationHelperService.updateContainTools($scope,parameterGroupDataService);
				});

				platformGridControllerService.initListController($scope, parameterGroupUIStandardService, parameterGroupDataService, parameterGroupValidationService, {});
			}
		]);
})(angular);