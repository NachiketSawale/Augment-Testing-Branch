/**
 * Created by lnt on 03/02/2023.
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name estPrjCreateVersionDialogController
	 * @requires $scope
	 * @description
	 * #
	 * estPrjCreateVersionDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('estPrjCreateVersionDialogController', ['$q', '$scope', '$http', '$translate', '$injector', 'platformTranslateService', 'platformModalService', 'estimateProjectService',
		'platformDataValidationService', 'platformRuntimeDataService',
		function ($q, $scope, $http, $translate, $injector, platformTranslateService, platformModalService, estimateProjectService,
			platformDataValidationService, runtimeDataService) {

			$scope.options = $scope.$parent.modalOptions;

			// generate Version Info
			let generateVersionInfoData = $scope.options.generateVersionInfoData;
			let isGenerated = generateVersionInfoData.IsGenerated;
			let versionNo = generateVersionInfoData.VersionNo;
			let versionJobCode = generateVersionInfoData.VersionJobCode;

			// init current item.
			$scope.currentItem = {
				JobCode:  isGenerated ? $translate.instant('cloud.common.isGenerated') : versionJobCode,
				JobDescription: '',
				VersionNo: versionNo,
				VersionDescription: '',
				VersionComment: ''
			};

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			let formConfig = {
				'fid': 'estimate.project.createversion',
				'version': '1.1.0',
				showGrouping: false,
				title$tr$: '',
				skipPermissionCheck: true,
				'groups': [
					{
						'gid': 'CreateVersion',
						'header$tr$': '',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'JobCode',
						'gid': 'CreateVersion',
						'label$tr$': 'estimate.project.lgmJobFk',
						'model': 'JobCode',
						'type': 'code',
						'mandatory': true,
						'required': true,
						'asyncValidator': function (entity, value, model) {
							return $http.get(globals.webApiBaseUrl + 'logistic/job/isCodeUnique?code=' + value).then(function (response) {
								let result = {
									valid: response && response.data,
									error: $translate.instant('estimate.project.jobCodeIsUnique')
								};

								runtimeDataService.applyValidationResult(result, entity, model);

								return result;
							});
						},
						'readonly': isGenerated
					},
					{
						'rid': 'JobDescription',
						'gid': 'CreateVersion',
						'label$tr$': 'cloud.common.entityDescription',
						'model': 'JobDescription',
						'type': 'description'
					},
					{
						'rid': 'VersionNo',
						'gid': 'CreateVersion',
						'label$tr$': 'estimate.project.versionNo',
						'model': 'VersionNo',
						'type': 'description',
						'readonly': true
					},
					{
						'rid': 'VersionDescription',
						'gid': 'CreateVersion',
						'label$tr$': 'estimate.project.versionDesc',
						'model': 'VersionDescription',
						'type': 'description'
					},
					{
						'rid': 'VersionComment',
						'gid': 'CreateVersion',
						'label$tr$': 'estimate.project.versionComment',
						'model': 'VersionComment',
						'type': 'comment'
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
				if (dataItem.JobCode === '') {
					let validateResult = platformDataValidationService.isMandatory('', 'JobCode');
					runtimeDataService.applyValidationResult(validateResult, dataItem, 'JobCode');
				}

				if (!$scope.hasErrors()){
					estimateProjectService.createEstimateBackup(dataItem);
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