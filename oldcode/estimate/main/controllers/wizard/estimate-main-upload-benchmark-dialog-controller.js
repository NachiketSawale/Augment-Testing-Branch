/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainUploadBenchmarkFormConfig', ['$injector', 'basicsLookupdataConfigGenerator', function($injector, basicsLookupdataConfigGenerator) {

		let service = {};
		service.formConfiguration = {
			'fid': 'estimate.main.wizard.uploadBenchmarkConfig',
			'version': '1.1.0',
			showGrouping: false,
			title$tr$: '',
			skipPermissionCheck: true,
			change: 'change',
			'groups': [
				{
					'gid': 'UploadBenchmark',
					'header$tr$': '',
					'isOpen': true,
					'visible': true,
					'sortOrder': 1
				}
			],
			'rows': [
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
					'basics.customize.externalsource',
					'Description',
					{
						gid: 'UploadBenchmark',
						rid: 'ExternalSourceFk',
						model: 'ExternalSourceFk',
						label: 'External Source',
						label$tr$: 'basics.customize.externalsource',
						sortOrder: 0
					},
					false,
					{
						filterKey: 'externalSourceFilter',
						required: true,
						showClearButton: false,
						events: [
							{
								name: 'onSelectedItemChanged', // register event and event handler here.
								handler: function (e, args) {
									let selectedItem = args.selectedItem;
									let externalSources = args.entity.ExternalSources;
									let externalSource = _.find(externalSources, {Id: selectedItem.Id});
									$injector.get('estimateMainUploadBenchmarkDialogService').setExternalConfigId(externalSource.ExternalconfigFk);
								}
							}
						]
					}
				),
				{
					gid: 'UploadBenchmark',
					rid: 'ProjectFk',
					label$tr$: 'project.main.sourceProject',
					type: 'directive',
					model: 'ProjectFk',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						descriptionMember: 'ProjectName',
						lookupOptions: {
							initValueField: 'ProjectNo',
							showClearButton: false
						}
					},
					readonly: true
				},
				{
					gid: 'UploadBenchmark',
					rid: 'EstimateId',
					label$tr$: 'estimate.main.estimate',
					type: 'directive',
					model: 'EstimateId',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'estimate-main-header-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							showClearButton: false
						}
					},
					readonly: true
				},
				{
					gid: 'UploadBenchmark',
					rid: 'GroupSetting',
					label$tr$: 'estimate.main.uploadEstimateToBenchmark.entityGroupConfig',
					model: 'GroupSettings',
					type: 'directive',
					directive: 'estimate-main-group-setting-grid'
				}
			]
		};

		service.getFormConfiguration = function getFormConfiguration() {
			return service.formConfiguration;
		};

		return service;
	}]);

	/**
	 * @ngdoc controller
	 * @name estimateMainUploadBenchmarkDialogController
	 * @requires $scope
	 * @description
	 * #
	 * estimateMainUploadBenchmarkDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('estimateMainUploadBenchmarkDialogController', [
		'$scope', '$translate', '$injector', 'platformTranslateService', 'platformModalService', 'platformRuntimeDataService', 'estimateMainUploadBenchmarkFormConfig',
		'estimateMainUploadBenchmarkDialogService', 'basicsLookupdataLookupFilterService',
		function ($scope, $translate, $injector, platformTranslateService, platformModalService, platformRuntimeDataService, formConfig,
			estimateMainUploadBenchmarkDialogService, basicsLookupdataLookupFilterService) {

			let filters = [
				{
					key: 'externalSourceFilter',
					serverSide: false,
					fn: function boqTypeFilter(dataItem) {
						let existItems = _.filter($scope.options.currentItem.ExternalSources, {Id: dataItem.Id});
						return existItems && existItems.length > 0;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = true;

			// init current item.
			$scope.currentItem = {
				EstimateId: $scope.options.currentItem.EstimateId,
				ProjectFk: $scope.options.currentItem.ProjectFk,
				ExternalSourceFk: $scope.options.currentItem.ExternalSources[0].Id,
				ExternalSources: $scope.options.currentItem.ExternalSources
			};

			estimateMainUploadBenchmarkDialogService.setExternalConfigId($scope.options.currentItem.ExternalSources[0].ExternalconfigFk);

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];
			let cxbmFormConfig = angular.copy(formConfig.getFormConfiguration());

			// translate form config.
			platformTranslateService.translateFormConfig(cxbmFormConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: cxbmFormConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions.ok = function onOK() {
				estimateMainUploadBenchmarkDialogService.uploadFileToBenchmark($scope.currentItem);
				$scope.$close(false);
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$injector.get('estimateMainGroupSettingService').onItemChange.register(setOKButtonStatus);
			function setOKButtonStatus(value){
				$scope.isOkDisabled = value;
			}

			$scope.$on('$destroy', function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				$injector.get('estimateWizardGenerateSourceLookupService').setIsCXBM(false);
			});
		}
	]);
})(angular);
