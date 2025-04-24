(function (angular) {
	'use strict';

	angular.module('businesspartner.evaluationschema').controller('businessPartnerEvaluationSchemaSubgroupController', [
		'globals',
		'$scope',
		'$translate',
		'platformModalService',
		'businessPartnerEvaluationSchemaSubgroupService',
		'businessPartnerEvaluationSchemaSubgroupUIStandardService',
		'businessPartnerEvaluationschemaSubgroupValidationService',
		'platformGridControllerService',
		function (globals,
			$scope,
			$translate,
			platformModalService,
			dataService,
			uiStandardService,
			validationService,
			platformGridControllerService) {

			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService(dataService), {});

			// open a popup to explain the conditions
			function showConditionExplanation() {
				return platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'businesspartner.evaluationschema/partials/evaluationschema-subgroup-formula-rules.html',
					backdrop: false,
					width: '700px',
					controller: ['$scope', function ($scope) {
						$scope.modalOptions = {
							headerText: $translate.instant('businesspartner.evaluationschema.formulaFieldRules'),
							cancel: function () {
								$scope.$close({isOk: false});
							},
							ok: function () {
								$scope.$close({isOk: true});
							}
						};
					}]
				});
			}

			$scope.addTools([{
				id: 't109',
				sort: 40,
				caption: $translate.instant('Formula Rules'),
				type: 'item',
				iconClass: 'tlb-icons ico-question',
				fn: showConditionExplanation
			}]);
		}
	]);
})(angular);