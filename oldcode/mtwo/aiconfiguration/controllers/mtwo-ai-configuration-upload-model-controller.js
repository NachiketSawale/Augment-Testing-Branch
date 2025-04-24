/**
 * @author: chd
 * @date: 3/16/2021 11:29 AM
 * @description:
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).controller('mtwoUploadAIModelController', ['$scope', '$rootScope', '$translate', '$http', '$log', 'platformTranslateService', 'platformGridAPI',
		'mtwoAIConfigurationModelListDataService', 'basicsLookupdataConfigGenerator', 'mtwoAiConfigurationParameterAliasService',
		function ($scope, $rootScope, $translate, $http, $log, platformTranslateService, platformGridAPI,
			mtwoAIConfigurationModelListDataService, basicsLookupdataConfigGenerator, mtwoAiConfigurationParameterAliasService) {

			let modelSelectedId = 1;
			let modelSelected = mtwoAIConfigurationModelListDataService.getSelected();
			if (modelSelected) {
				modelSelectedId = modelSelected.Id;
			}

			$scope.entity = {
				placeholder: $translate.instant('mtwo.aiconfiguration.import.placeholder'),
				File: null,
				ModelFk: modelSelectedId,
				ModelType: 0,
				ImageFk: null,
				uuid: null,
				Description: null,
				OkDisable: true,
				inputParameters: null,
				aliasMappingData: null
			};

			$scope.isBusy = false;
			let canUploadFile = function canUploadFile() {
				return function () {
					return $scope.entity.canUpload;
				};
			};

			let formConfigImportFile =
				{
					showGrouping: true,
					groups: [
						{
							gid: 'model',
							header: 'Model',
							visible: true,
							sortOrder: 1,
							header$tr$: 'model.main.entityModel',
							isOpen: true
						},
						{
							gid: 'inputParameters',
							header: 'Model Input Parameter Mapping',
							header$tr$: 'mtwo.aiconfiguration.modelInputMapping',
							isOpen: true,
							visible: true,
							sortOrder: 2,
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'mtwoAiModelListLookupDataService',
						},
						{
							gid: 'model',
							rid: 'modelfk',
							label: 'Model Case',
							label$tr$: 'mtwo.aiconfiguration.modelList',
							model: 'ModelFk',
							sortOrder: 1,
							readonly: true
						}
						),
						{
							gid: 'model',
							rid: 'description',
							label: 'Description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							visible: true,
							sortOrder: 3
						},
						{
							gid: 'model',
							rid: 'ngmodel',
							label: 'Model File',
							label$tr$: 'mtwo.aiconfiguration.wizard.modelFile',
							type: 'directive',
							model: 'ngModel',
							directive: 'mtwo-ai-configuration-model-file-input',
							options: {
								fileFilter: '.zip',
								canUpload: canUploadFile
							},
							visible: true,
							sortOrder: 4,
							change: function () {
								reloadFromModelFile();
							}
						},
						{
							gid: 'inputParameters',
							rid: 'inputParameters',
							type: 'directive',
							directive: 'mtwo-ai-configuration-input-parameter-wizard-grid',
							model: 'inputParameters',
							visible: true
						}
					]
				};

			$scope.formOptions = {
				configure: formConfigImportFile
			};

			$scope.isOKDisabled = function () {
				return $scope.entity.OkDisable;
			};

			function reloadFromModelFile() {
				if ($scope.entity.File === null) {
					return;
				}

				let parameterRequest = {
					MtoModelFk: $scope.entity.ModelFk,
					ModelType: $scope.entity.ModelType,
					Guid: $scope.entity.uuid
				};

				$http.post(globals.webApiBaseUrl + 'mtwo/aiconfiguration/modelparameter/getparameterlist', parameterRequest).then(function (response) {
					if (response.data) {
						$scope.entity.inputParameters = response.data.ModelParameterDtos;
						$scope.entity.aliasMappingData = response.data.AliasMappingData;
						mtwoAiConfigurationParameterAliasService.attachData(response.data.AliasMappingData);
					}
				});
			}

			$scope.handleOK = function () {
				let file = $scope.entity.File;
				if (file) {
					$scope.entity.OkDisable = true;
					let creatVersionData = {
						Description: $scope.entity.Description,
						Guid: $scope.entity.uuid,
						MtoImageFk: $scope.entity.ImageFk,
						MtoModelFk: $scope.entity.ModelFk,
						ModelType: $scope.entity.ModelType,
						InputParameters: $scope.entity.inputParameters,
						AliasMapping: $scope.entity.aliasMappingData,
						IsLive: true
					};

					$http.post(globals.webApiBaseUrl + 'mtwo/aiconfiguration/modelversion/createversion', creatVersionData).then(function (result) {
						if (result.data) {
							$scope.$close(true);
							mtwoAIConfigurationModelListDataService.refresh();
						}
					}).catch(e => {
						throw e;
					});
				}
			};

			$scope.$on('$destroy', function () {
			});
		}
	]);

})(angular);
