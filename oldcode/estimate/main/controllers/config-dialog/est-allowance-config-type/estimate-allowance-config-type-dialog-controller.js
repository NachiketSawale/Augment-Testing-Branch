
(function (angular) {
	'use strict';

	angular.module('estimate.main').controller('estimateAllowanceConfigTypeDialogController',
		['_','$http','globals', '$log', '$timeout', '$scope', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'platformTranslateService', 'estimateAllowanceConfigTypeDialogUIService','estimateAllowanceAssignmentGridService',
			function (_,$http,globals, $log, $timeout, $scope, $injector, $translate, platformDataValidationService, platformRuntimeDataService, platformTranslateService, estimateAllowanceConfigTypeDialogUIService,estimateAllowanceAssignmentGridService) {


				$scope.options = $scope.$parent.modalOptions;
				$scope.dataItem = $scope.options.dataItem;
				$scope.modalOptions = {
					headerText: $scope.options.headerText,
					closeButtonText: $translate.instant('basics.common.cancel'),
					actionButtonText: $translate.instant('basics.common.ok')
				};


				// set readonly rows and unvisbile rows
				function getFormConfig() {
					return  estimateAllowanceConfigTypeDialogUIService.getFormConfig();
				}

				// translate form config.
				let formConfig = getFormConfig();

				platformTranslateService.translateFormConfig(formConfig);

				$scope.formContainerOptions = {
					statusInfo: function () {
					}
				};

				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: []
				};

				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};

				function int(){
					if($scope.dataItem.MasterdataContextFk){
						$injector.get('platformRuntimeDataService').readonly($scope.dataItem, [{field: 'MasterdataContextFk', readonly: true}]);
					}
				}

				$scope.hasErrors = function checkForErrors() {
					let valiationErrors = _.filter(estimateAllowanceAssignmentGridService.getList(),'__rt$data.errors.MdcAllowanceFk');
					let hasErrors = false;
					if( valiationErrors && valiationErrors.length){
						hasErrors = true;
					}

					let noAllowances = _.filter(estimateAllowanceAssignmentGridService.getList(),function(d){
						return  !d.MdcAllowanceFk || d.MdcAllowanceFk<=0;
					});
					return (noAllowances && noAllowances.length) || !$scope.dataItem.MasterdataContextFk ||hasErrors;
				};

				$scope.onOK = function () {
					$scope.$close({ok: true, data: $scope.dataItem});
				};

				$scope.onCancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close();
				};

				$scope.modalOptions.cancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close(false);
				};
				int();

				// estimateAllowanceAssignmentGridService.setDataList($scope.CostCodes);

				$scope.$on('$destroy', function () {
					estimateAllowanceAssignmentGridService.clear([]);
				});
			}
		]
	);
})(angular);
