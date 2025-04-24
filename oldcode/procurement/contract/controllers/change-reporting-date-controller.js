/**
 * Created by lnb on 11/17/2014.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.contract').controller('procurementContractChangeReportingDateDialogController',
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
						'header$tr$': 'procurement.contract.wizards.ChangeReportingDateHeader',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'Code',
						'gid': 'HeaderInfo',
						'label$tr$': 'cloud.common.entityReference',
						'type': 'directive',
						'directive': 'platform-composite-input',
						'model': 'Code',// use for validator
						'options': {
							'rows': [{
								'type': 'code',
								'model': 'Code',
								'readonly':true,
								'cssLayout': 'md-4 lg-4'
							}, {
								'type': 'description',
								'model': 'Description',
								'readonly':true,
								'cssLayout': 'md-8 lg-8',
								'validate': false
							}]
						}
					},
					{
						'rid': 'ConStatusFk',
						'gid': 'HeaderInfo',
						'label$tr$': 'cloud.common.entityStatus',
						'type': 'directive',
						'model': 'ConStatusFk',
						'directive': 'procurement-contract-header-status-combobox',
						'options':{
							readOnly: true
						}
					},
					{
						'rid': 'DateReported',
						'gid': 'HeaderInfo',
						'label$tr$': 'procurement.contract.ConHeaderDateReported',
						'type': 'dateutc',
						'model': 'DateReported'
					}
				]
			};

			$scope.currentItem =angular.copy($scope.options.currentItem);
			$scope.currentItem.DateReported = $scope.currentItem.DateReported || new Date();

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
				headerText: 'Change Reporting Date'
			};

			var unWatched = $scope.$watch('currentItem.DateReported',function(newVal){
				$scope.modalOptions.OKBtnRequirement = _.isNull(newVal) || !$scope.currentItem.DateReported || !$scope.currentItem.DateReported.isValid;
			});

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
				unWatched();
			};
			$scope.modalOptions.cancel = $scope.modalOptions.close;
		}]);
})(angular);