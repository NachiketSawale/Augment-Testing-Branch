/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainReplaceResourceSummaryController
	 * @requires $scope
	 * @description use for modify estimate summary information
	 */
	angular.module(moduleName).controller('estimateMainReplaceResourceSummaryController', ['$scope','$sce', '$translate','$injector', 'estimateMainReplaceResourceCommonService', function ($scope, $sce, $translate, $injector, estimateMainReplaceResourceCommonService) {

		let dialogContext = estimateMainReplaceResourceCommonService.getDialogContext();
		let isModify = dialogContext === 'Modify';

		let configTitle = isModify ? $translate.instant('estimate.main.modifyResourceWizard.configTitle') : $translate.instant('estimate.main.replaceResourceWizard.configTitle');

		$scope.modalOptions.headerText = configTitle;
		$scope.entity = estimateMainReplaceResourceCommonService.getSummaryInfo();
		$scope.trustAsHtml = $sce.trustAsHtml;

		$scope.executionresult = $translate.instant('estimate.main.replaceResourceWizard.executionResult');

		let translateKeyForSummary = isModify ? 'estimate.main.modifyResourceWizard.summary' : 'estimate.main.replaceResourceWizard.summary';
		$scope.summary = $translate.instant(translateKeyForSummary, {'TotalCount': $scope.entity.TotalCount, 'SucceedCount': $scope.entity.SucceedCount, 'FailedCount': $scope.entity.FailedCount});

		if($scope.entity.ContractedResCount){
			$scope.summary += '<br/>' + $translate.instant('estimate.main.replaceResourceWizard.contractRsNum', {'contractResCount': $scope.entity.ContractedResCount});
		}

		$scope.isErrorMessageShow = $scope.entity.ErrorMessage && $scope.entity.ErrorMessage !== '';
		$scope.errorMessage = $translate.instant('estimate.main.replaceResourceWizard.errorMessage', { 'ErrorMessage': $scope.entity.ErrorMessage });

		$scope.isWarnMessageShow = $scope.entity.WarnMessage && $scope.entity.WarnMessage !== '';
		$scope.warnMessage = $scope.isWarnMessageShow ? $translate.instant('estimate.main.replaceResourceWizard.warnMessage', { 'WarnMessage': $scope.entity.WarnMessage }) : '';

		if($scope.entity.ContractedResCount){
			$scope.isWarnMessageShow = true;
			$scope.warnMessage += ($scope.warnMessage !== '' ? '<br/>' : '') + $translate.instant('estimate.main.replaceResourceWizard.contractedResCanNotDel');
		}

		$scope.close = function () {
			$scope.$parent.$close(false);
		};

		$scope.modalOptions.cancel = function () {
			$scope.$close(false);
		};
		$scope.$on('$destroy', function () {
			$injector.get('estimateMainReplaceResourceCommonService').clear();
		});
	}]);
})();
