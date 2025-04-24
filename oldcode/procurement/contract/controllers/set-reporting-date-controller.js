/**
 * Created by lnb on 11/17/2014.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.contract').controller('procurementContractSetReportingDateDialogController',
		['$scope', '$translate', 'platformTranslateService', function ($scope, $translate, platformTranslateService) {
			$scope.options = $scope.$parent.modalOptions;
			$scope.formOptions = {
				'fid': 'contract.wizard.setReportingDate',  // contract header form identifier
				'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
				showGrouping: true,
				title$tr$: '',

				'groups': [
					{
						'gid': 'HeaderInfo',
						'header$tr$': 'procurement.contract.wizards.SetReportingDateHeader',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'DateReported',
						'gid': 'HeaderInfo',
						'label$tr$': 'procurement.contract.wizards.ConHeaderDateReported',
						'type': 'dateutc',
						'model': 'DateReported'
					},{
						'rid': 'ConStatusFk',
						'gid': 'HeaderInfo',
						'label$tr$': 'procurement.contract.wizards.ConHeaderStatus',
						'type': 'directive',
						'model': 'ConStatusFk',
						'directive': 'procurement-contract-header-status-combobox'
					}
				]
			};

			$scope.currentItem = {
				ConStatusFk: $scope.options.ConStatusFk,
				DateReported: new Date()
			};

			// translate form config.
			platformTranslateService.translateFormConfig($scope.formOptions);
			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};
			$scope.formContainerOptions.formOptions = {
				configure: $scope.formOptions,
				showButtons:[],
				validationMethod: function () {
				}
			};

			$scope.setTools = function(tools){
				$scope.tools = tools;
			};

			$scope.modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'OK',
				headerText: 'Set Reporting Date'
			};

			$scope.modalOptions.ok = function onOK() {
				var dateReported = $scope.currentItem.DateReported;
				if(dateReported && angular.isDefined(dateReported.isValid)){
					if(!dateReported.isValid()){
						$scope.currentItem.DateReported = null;
					}
				}
				$scope.$close($scope.currentItem);
			};
			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};
			$scope.modalOptions.cancel = $scope.modalOptions.close;
		}]);
})(angular);