/**
 * Created by lnt on 27/02/2023.
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name estPrjRestoreEstimateDialogController
	 * @requires $scope
	 * @description
	 * #
	 * estPrjRestoreEstimateDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('estPrjRestoreEstimateDialogController', ['$scope', '$q', '$http', '$translate', '$injector', 'platformTranslateService', 'platformModalService', 'estimateProjectService',
		'platformDataValidationService', 'platformRuntimeDataService',
		function ($scope, $q, $http, $translate, $injector, platformTranslateService, platformModalService, estimateProjectService,
			platformDataValidationService, runtimeDataService) {

			$scope.options = $scope.$parent.modalOptions;

			// restore Version Info
			let restoreVersionInfoData = $scope.options.restoreVersionInfoData;
			let isGenerated = restoreVersionInfoData.IsGenerated;
			let versionNo = restoreVersionInfoData.VersionNo;
			let versionJobCode = restoreVersionInfoData.VersionJobCode;
			let currentJobCode = restoreVersionInfoData.CurrentJobCode;

			// init current item.
			$scope.currentItem = {
				CurrentJob: isGenerated ? $translate.instant('cloud.common.isGenerated') : currentJobCode,
				CurrentJobDescription: '',
				VersionJob: isGenerated ? $translate.instant('cloud.common.isGenerated') : versionJobCode,
				VersionJobDescription: ''
			};

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			let formConfig = {
				'fid': 'estimate.project.restoreversion',
				'version': '1.1.0',
				showGrouping: false,
				title$tr$: '',
				skipPermissionCheck: true,
				'groups': [
					{
						'gid': 'RestoreEstimate',
						'header$tr$': '',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'CurrentJob',
						'gid': 'RestoreEstimate',
						'label$tr$': 'estimate.project.currentJob',
						'model': 'CurrentJob',
						'type': 'code',
						'mandatory': true,
						'required': true,
						'asyncValidator': function (entity, value, model) {
							return $http.get(globals.webApiBaseUrl + 'logistic/job/isCodeUnique?code=' + value).then(function (response) {
								let result = {
									valid: response && response.data,
									error: $translate.instant('estimate.project.jobCodeIsUnique')
								};

								if (result.valid && entity.VersionJob) {
									result.valid = entity.VersionJob !== value;
								}

								runtimeDataService.applyValidationResult(result, entity, model);

								return result;
							});
						},
						'readonly':  isGenerated
					},
					{
						'rid': 'CurrentJobDescription',
						'gid': 'RestoreEstimate',
						'label$tr$': 'cloud.common.entityDescription',
						'model': 'CurrentJobDescription',
						'type': 'description'
					},
					{
						'rid': 'VersionJob',
						'gid': 'RestoreEstimate',
						'label$tr$': 'estimate.project.versionJob',
						'model': 'VersionJob',
						'type': 'code',
						'mandatory': true,
						'required': true,
						'asyncValidator': function (entity, value, model) {
							return $http.get(globals.webApiBaseUrl + 'logistic/job/isCodeUnique?code=' + value).then(function (response) {
								let result = {
									valid: response && response.data,
									error: $translate.instant('estimate.project.jobCodeIsUnique')
								};

								if (result.valid && entity.CurrentJob) {
									result.valid = entity.CurrentJob !== value;
								}

								runtimeDataService.applyValidationResult(result, entity, model);

								return result;
							});
						},
						'readonly':  isGenerated
					},
					{
						'rid': 'VersionJobDescription',
						'gid': 'RestoreEstimate',
						'label$tr$': 'cloud.common.entityDescription',
						'model': 'VersionJobDescription',
						'type': 'description'
					}
				]
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];
			let index = 0;
			formConfig = angular.copy(formConfig);

			angular.forEach($scope.options.formRows, function (row) {
				row.rid = row.rid || 'formrowid' + index++;
				row.gid = 'CreateVersion';
				formConfig.rows.unshift(row);
			});

			// translate form config.
			platformTranslateService.translateFormConfig(formConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: formConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.hasErrors = function hasErrors() {
				let hasError = false;
				if($scope.currentItem.__rt$data && $scope.currentItem.__rt$data.errors){
					let errors = $scope.currentItem.__rt$data.errors;
					for (let prop in errors){
						if(errors[prop] !== null){
							hasError = true;
							break;
						}
					}
				}

				return hasError;
			};

			$scope.modalOptions.ok = function onOK() {
				let dataItem = $scope.currentItem;
				if (dataItem.CurrentJob === '') {
					let validateResult = platformDataValidationService.isMandatory('', 'CurrentJob');
					runtimeDataService.applyValidationResult(validateResult, dataItem, 'CurrentJob');
				}

				if(dataItem.VersionJob === ''){
					let validateResult = platformDataValidationService.isMandatory('', 'VersionJob');
					runtimeDataService.applyValidationResult(validateResult, dataItem, 'VersionJob');
				}

				if (!$scope.hasErrors()){
					estimateProjectService.restoreEstimateByVersion(dataItem);
					$scope.$close(false);
				}
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);