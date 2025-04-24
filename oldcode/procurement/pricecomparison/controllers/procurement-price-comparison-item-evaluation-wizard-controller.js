/*
 * created by miu on 07/18 2022
*/
(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonItemEvaluationWizardController', [
		'_', '$scope', '$translate', 'platformGridAPI', 'procurementPriceComparisonItemEvaluationService',
		function (_, $scope, $translate, platformGridAPI, itemEvaluationService) {
			$scope.modalOptions = {
				selectQuotes: $translate.instant('procurement.pricecomparison.itemEvaluation.selectQuotes'),
				selectTargetItems: $translate.instant('procurement.pricecomparison.itemEvaluation.selectTargetItems'),
				selectTargetBoqItems: $translate.instant('procurement.pricecomparison.itemEvaluation.selectTargetBoqItems'),
				targetItem: $translate.instant('procurement.pricecomparison.itemEvaluation.targetItem'),
				updateNotSubmitted: $translate.instant('procurement.pricecomparison.itemEvaluation.targetItemOption1New'),
				updateIsEvaluated: $translate.instant('procurement.pricecomparison.itemEvaluation.targetItemOption2New'),
				itemEvaluation: $translate.instant('procurement.pricecomparison.itemEvaluation.itemEvaluation'),
				noteTitle: $translate.instant('procurement.pricecomparison.itemEvaluation.noteTitle'),
				noteText1: $translate.instant('procurement.pricecomparison.itemEvaluation.noteText1'),
				noteText2: $translate.instant('procurement.pricecomparison.itemEvaluation.noteText2'),
				headerText: $translate.instant('procurement.pricecomparison.itemEvaluation.setAdHocPrice'),
				isLoading: false,
				okBtnDisabled: okBtnDisabled,
				step: 'step1'
			};

			let formOptions = {
				fid: 'procurement.pricecomparison.evaluation.wizard',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'procurement.pricecomparison.item.evaluation.wizard',
						header: '',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: 'procurement.pricecomparison.item.evaluation.wizard',
						label: '',
						rid: '1',
						type: 'directive',
						directive: 'procurement-price-comparison-evaluation-quote-header-list-directive'
					}
				]
			};

			$scope.containerOptions = {
				formOptions: {
					configure: formOptions
				}
			};

			/* boq item columns */
			$scope.updateModeOption = {
				columnModels: null,
				selectedColumns: []
			};

			$scope.updateNotSubmitted = true;
			$scope.updateIsEvaluated = true;

			// item evaluation combobox
			$scope.modalOptions.lookupValue = 6; // default: minimum
			$scope.options=[];
			let evaluateOption = {};
			function evaluate() {
				$scope.modalOptions.isLoading = true;
				buildOption();
				itemEvaluationService.doEvaluate(evaluateOption);
			}

			function buildOption() {
				evaluateOption.itemEvaluation = $scope.modalOptions.lookupValue;
			}

			function validateOption() {
				if (!evaluateOption.updateNotSubmitted && !evaluateOption.updateIsEvaluated) {
					return { result: false, message: 'noTargetItemWarning' };
				}
				return { result: true };
			}

			function closeDialog() {
				$scope.modalOptions.isLoading = false;
				$scope.$close(true);
			}

			function okBtnDisabled() {
				let selectedPrcItems = itemEvaluationService.selectedPrcItems();
				let selectedBoqItems = itemEvaluationService.selectedBoqItems();

				let hasPrcItems = !(selectedPrcItems && selectedPrcItems.length > 0);
				let hasBoqItems = !(selectedBoqItems && selectedBoqItems.length > 0);

				return hasPrcItems && hasBoqItems;
			}

			function nextBtnDisabled(){
				let selectedQuoteHeader = itemEvaluationService.quoteHeaders();
				let selectQuoteHeader = !(selectedQuoteHeader && selectedQuoteHeader.length > 0);
				let selectEvaluateOption = !($scope.updateNotSubmitted || $scope.updateIsEvaluated);
				return selectQuoteHeader || selectEvaluateOption;
			}

			function nextStep(){
				itemEvaluationService.updateNotSubmitted = $scope.updateNotSubmitted;
				itemEvaluationService.updateIsEvaluated = $scope.updateIsEvaluated;
				$scope.modalOptions.step = 'step2';
			}

			$scope.onUpdateNotSubmittedChange = function(){
				$scope.updateNotSubmitted = !$scope.updateNotSubmitted;
			}

			$scope.onUpdateIsEvaluatedChange = function(){
				$scope.updateIsEvaluated = !$scope.updateIsEvaluated;
			}

			angular.extend($scope.modalOptions, {
				onNexStep: function(){
					nextStep();
				},
				onPreviousStep: function(){
					$scope.modalOptions.step = 'step1';
				},
				onOk: function () {
					evaluate();
					$scope.$close(true);
				},
				cancel: function () {
					closeDialog();
				},
				isEvaluateItem: itemEvaluationService.isEvaluateItem,
				isEvaluateBoq: itemEvaluationService.isEvaluateBoq,
			});

			$scope.$on('$destroy', function () {
				itemEvaluationService.quoteHeaders([]);
			});
		}]);
})(angular);