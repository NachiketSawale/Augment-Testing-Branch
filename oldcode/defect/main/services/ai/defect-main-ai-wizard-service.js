/**
 * Created by gvj on 9/20/2018.
 */
/* global , globals */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';

	/**
	 * @ngdoc service
	 * @name defectMainAiWizardService
	 * @function
	 *
	 * @description
	 * This service provides Ai wizard,it compromise of
	 * 1) Prediction function which can predict the cost and labor hours based on the defect information
	 *
	 */
	angular.module(moduleName).factory('defectMainAiWizardService',
		['$http', '$translate', 'platformModalService','defectMainHeaderDataService', 'basicsCommonAIService',
			function ($http, $translate, platformModalService, defectMainHeaderDataService, basicsCommonAIService) {
				// initial service
				var service = {};

				function defectDurationPredict(beData) {
					$http.post(globals.webApiBaseUrl + 'defect/main/header/mtwoai/defectdurationprediction', beData)
						.then(function (response) {
							var EstimateStatusNotSupported = 2;
							if (response.data.EstimationStatus === EstimateStatusNotSupported) {
								platformModalService.showMsgBox('defect.main.aiWizard.CostAndSchedulingPredictionWarningNotSupported',
									'estimate.main.aiWizard.warning', 'warning');
								return;
							}
							var params = {
								gridId:'C2C170A8C20D411B8B3F7AD1C3214091',
								defectEstimationData:response.data
							};
							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'defect.main/partials/defect-ai-estimation-duration.html',
								backdrop: false,
								windowClass: 'form-modal-dialog',
								lazyInit: true,
								resizeable: true,
								width: '60%',
								height: '70%',
								params: params
							};
							platformModalService.showDialog(modalOptions);
						});
				}

				function defectCostPredict(beData) {
					$http.post(globals.webApiBaseUrl + 'defect/main/header/mtwoai/defectcostprediction', beData)
						.then(function (response) {
							var EstimateStatusNotSupported = 2;
							if (response.data.EstimationStatus === EstimateStatusNotSupported) {
								platformModalService.showMsgBox('defect.main.aiWizard.CostAndSchedulingPredictionWarningNotSupported',
									'estimate.main.aiWizard.warning', 'warning');
								return;
							}
							var params = {
								gridId:'E2C170A8D20D412B9B3F7AD1C3214092',
								defectEstimationData:response.data
							};
							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'defect.main/partials/defect-ai-estimation-cost.html',
								backdrop: false,
								windowClass: 'form-modal-dialog',
								lazyInit: true,
								resizeable: true,
								width: '60%',
								height: '70%',
								params: params
							};
							platformModalService.showDialog(modalOptions);
						});
				}

				service.defectDurationPredict = function () {
					var _param = defectMainHeaderDataService.getList();
					if (_param.length === 0) {
						platformModalService.showMsgBox('defect.main.aiWizard.CostAndSchedulingPredictionWarningNoDefects',
							'defect.main.aiWizard.warning', 'warning');
						return;
					}
					basicsCommonAIService.checkPermission('2d8aa8441f83469da2f08a924726c86c', true).then(function (canProceed) {
						if (!canProceed) {
							return;
						}
						var beData = {};
						var IdGroup = [];
						for (var i = 0; i < _param.length; i++) {
							IdGroup.push(_param[i].Id);
						}
						beData.DefectIds = IdGroup;
						beData.IsOverwrite = true; // currently always set to true
						defectMainHeaderDataService.updateAndExecute(function() {
							defectDurationPredict(beData);
						});
					});
				};

				service.defectCostPredict = function () {
					var _param = defectMainHeaderDataService.getList();
					if (_param.length === 0) {
						platformModalService.showMsgBox('defect.main.aiWizard.CostAndSchedulingPredictionWarningNoDefects',
							'defect.main.aiWizard.warning', 'warning');
						return;
					}
					basicsCommonAIService.checkPermission('2d8aa8441f83469da2f08a924726c86c', true).then(function (canProceed) {
						if (!canProceed) {
							return;
						}
						var beData = {};
						var IdGroup = [];
						for (var i = 0; i < _param.length; i++) {
							IdGroup.push(_param[i].Id);
						}
						beData.DefectIds = IdGroup;
						beData.IsOverwrite = true; // currently always set to true
						defectMainHeaderDataService.updateAndExecute(function() {
							defectCostPredict(beData);
						});
					});
				};

				return service;
			}
		]);
})(angular);
