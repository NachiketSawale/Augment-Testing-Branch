/**
 * Created by lav on 4/2/2019.
 */
(function (angular) {
	/*global JSZip */
	'use strict';
	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).factory('productionplanningDrawingImportPartListDialogConfigurations',
		['$translate',
			'productionplanningDrawingMainService',
			'platformDataValidationService',
			'platformRuntimeDataService',
			'basicsLookupdataConfigGenerator',
			'productionplanningDrawingUIStandardService',
			'productionplanningDrawingValidationService',
			'basicsLookupdataLookupFilterService',
			function ($translate,
					  drawingMainService,
					  platformDataValidationService,
					  platformRuntimeDataService,
					  basicsLookupdataConfigGenerator,
					  drawingUIStandardService,
					  productionplanningDrawingValidationService,
					  basicsLookupdataLookupFilterService) {

				var filter = {
					key: 'import-cad-wizard-import-model-lookup-filter',
					serverSide: false,
					fn: function (item) {
						return !_.includes([3, 9], item.Id);
					}
				};
				basicsLookupdataLookupFilterService.registerFilter(filter);

				function getConfig(scope) {
					var configurations = {
						'fid': 'productionplanning.drawing.PL.fileUpload',
						'showGrouping': false,
						'groups': [
							{
								'gid': 'basicData'
							}
						],
						'rows': [
							{
								gid: 'basicData',
								rid: 'ImportMode',
								model: 'importModel',
								label: '*Mode',
								label$tr$: 'productionplanning.drawing.mode',
								type: 'directive',
								required: true,
								directive: 'pps-cad-import-import-model-combobox',
								change: function (entity, model) {
									scope.onPropertyChange(entity, model);
								},
								options: {
									filterKey: 'import-cad-wizard-import-model-lookup-filter'
								}
							},
							{
								gid: 'basicData',
								rid: 'ImportType',
								label: '*Type',
								label$tr$: 'productionplanning.drawing.wizard.importType',
								model: 'type',
								type: 'select',
								required: true,
								options: {
									serviceName: 'ppsDrawingImportTypeService',
									valueMember: 'Id',
									displayMember: 'Description'
								}
							},
							{
								gid: 'basicData',
								rid: 'Files',
								model: 'files',
								label$tr$: 'productionplanning.drawing.partListFolder',
								type: 'directive',
								directive: 'productionplanning-common-select-file-directive',
								required: true,
								options: {
									chooseFolder: true
								},
								validator: function (entity, modelValue, field) {
									return platformDataValidationService.validateMandatory(entity, modelValue, field, null, drawingMainService);
								},
								change: function (entity, model) {
									if (entity[model]) {
										var folder = entity[model][0].webkitRelativePath.split('/')[0];
										if (entity.Version < 1) {
											change(entity, 'Code', folder.substring(0, 252));
										}
									}
								}
							},
							{
								gid: 'basicData',
								rid: 'Plan',
								model: 'plan',
								label: 'Plan',
								label$tr$: 'productionplanning.drawing.plan',
								type: 'directive',
								directive: 'productionplanning-common-select-file-directive',
								options: {
									readonly: false,
									getFileName: true
								},
								change: function (entity, model) {
									var plan = entity[model];
									// var lastIndex = plan.lastIndexOf('.');
									if (plan) {
										// can not handle all cases intelligently, e.g. plan='50285.5'
										// so ignore below process and use the original input value - zov
										// let conewagoCase = ['.csv', '.xls', '.xlsx', '.dxf'].some(x=>plan.toLowerCase().endsWith(x));
										// if(conewagoCase) {
										// 	plan = plan.substring(0, lastIndex);
										// } else {
										// 	while (lastIndex > -1) {
										// 		var num = plan.substring(lastIndex + 1, plan.length);
										// 		plan = plan.substring(0, lastIndex);
										// 		if (_.isInteger(parseInt(num))) {
										// 			break;
										// 		}
										// 		lastIndex = plan.lastIndexOf('.');
										// 	}
										// }
										// entity[model] = plan;
										if (entity.Version < 1) {
											change(entity, 'Code', plan);
										}
									}
								}
							},
							{
								gid: 'basicData',
								rid: 'Configuration',
								model: 'configuration',
								label$tr$: 'productionplanning.drawing.configurationFile',
								type: 'directive',
								directive: 'productionplanning-common-select-file-directive'
							}
						]
					};
					var needRowRids = ['code', 'engdrawingstatusfk', 'engdrawingtypefk', 'prjprojectfk', 'lgmjobfk', 'basclerkfk', 'ppsitemfk'];
					var needRows = _.filter(_.cloneDeep(drawingUIStandardService.getStandardConfigForDetailView().rows), function (row) {
						return needRowRids.indexOf(row.rid) > -1;
					});
					configurations.rows = configurations.rows.concat(needRows);
					var index = 1;
					_.forEach(configurations.rows, function (row) {
						row.gid = 'basicData';
						row.sortOrder = index++;
						var colField = row.model.replace(/\./g, '$');
						var syncName = 'validate' + colField;
						var asyncName = 'asyncValidate' + colField;
						if (productionplanningDrawingValidationService[syncName]) {
							row.validator = productionplanningDrawingValidationService[syncName];
						}
						if (productionplanningDrawingValidationService[asyncName]) {
							row.asyncValidator = productionplanningDrawingValidationService[asyncName];
						}
					});
					return configurations;

					function change(entity, model, value) {
						entity[model] = value;
						var row = _.find(configurations.rows, {'model': model});
						if (row.validator) {
							var result = row.validator(entity, entity[model], model);
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							if (!result.valid) {
								return;
							}
						}
						if (row.asyncValidator) {
							row.asyncValidator(entity, entity[model], model).then(function (result) {
								platformRuntimeDataService.applyValidationResult(result, entity, model);
							});
						}
					}
				}

				return {getConfig: getConfig};
			}]
	);

	angular.module(moduleName).controller('productionplanningDrawingImportPartListDialogController',
		[
			'$scope',
			'$translate',
			'productionplanningDrawingImportPartListDialogConfigurations',
			'productionplanningDrawingImportPartListDialogService',
			'basicsCommonUploadDownloadControllerService',
			'platformModalService',
			'platformRuntimeDataService',
			'$q',
			'$http',
			'platformCreateUuid',
			'platformDataValidationService',
			'$interval',
			'$timeout',
			'platformTranslateService',
			'cloudDesktopPinningContextService',
			'productionplanningDrawingMainService',
			'platformModuleStateService',
			'UploadBase',
			function ($scope, $translate, config, importPartListDialogService, basicsCommonUploadDownloadControllerService,
					  platformModalService,
					  platformRuntimeDataService,
					  $q,
					  $http,
					  platformCreateUuid,
					  platformDataValidationService,
					  $interval,
					  $timeout,
					  platformTranslateService,
					  cloudDesktopPinningContextService,
					  drawingMainService,
					  platformModuleStateService,
					  UploadBase) {

				var startSymbol = '▪';
				var autoProgress = null;
				var newItem;
				var existing;

				var emptyEntity = {
					fileName: '',
					files: '',
					plan: '',
					type: 1
				};

				$scope.onPropertyChange = function (entity, model) {
					switch (model) {
						case 'importModel':
							switch (entity[model]) {
								case 1:
									if (!newItem) {
										var projectPinningItem = cloudDesktopPinningContextService.getPinningItem('project.main');
										$scope.isBusy = true;
										$http.post(globals.webApiBaseUrl + 'productionplanning/drawing/create', {'PKey1': _.get(projectPinningItem, 'id')}).then(function (result) {
											newItem = result.data;
											_.extend(newItem, emptyEntity);
											drawingMainService.enSureInvalidValue(newItem);
											$scope.entity = newItem;
											$scope.entity[model] = entity[model];
											setRowsReadonly(false);
											$scope.isBusy = false;
										});
									} else {
										$scope.entity = newItem;
										$scope.entity[model] = entity[model];
										setRowsReadonly(false);
									}
									break;
								default:
									if (!existing) {
										existing = _.clone(drawingMainService.getSelected());
										_.extend(existing, emptyEntity);
									}
									$scope.entity = existing;
									$scope.entity[model] = entity[model];
									setRowsReadonly(true);
									break;
							}
							break;
					}
				};

				if (drawingMainService.getSelected()) {
					$scope.onPropertyChange({importModel: 2}, 'importModel');
				} else {
					$scope.onPropertyChange({importModel: 1}, 'importModel');
				}

				$scope.formOptions = {
					configure: config.getConfig($scope)
				};
				platformTranslateService.translateFormConfig($scope.formOptions.configure);

				$scope.isOKDisabled = function () {
					return $scope.isBusy || hasErrors();
				};

				$scope.handleOK = function () {
					showError(false);
					_.forEach($scope.formOptions.configure.rows, function (row) {
						if (row.validator && row.rid !== 'code') {
							var result = row.validator($scope.entity, $scope.entity[row.model], row.model);
							platformRuntimeDataService.applyValidationResult(result, $scope.entity, row.model);
						}
					});
					validateCode().then(function () {
						if ($scope.isOKDisabled()) {
							return;
						}
						updateProgress(0, 10, 'productionplanning.drawing.wizard.compressing');
						var folder = $scope.entity.files[0].webkitRelativePath.split('/')[0];
						var jsZip = new JSZip();
						var promises = [];
						_.forEach($scope.entity.files, function (file) {
							promises.push(importPartListDialogService.readFile(jsZip, file));
						});
						if ($scope.entity.configuration) {
							promises.push(importPartListDialogService.readFile(jsZip, $scope.entity.configuration));
						}
						$q.all(promises).then(function () {
							jsZip.generateAsync({
								type: 'blob',
								compression: 'DEFLATE'
							}).then(function (zipped) {
								var config = {
									url: globals.webApiBaseUrl + 'productionplanning/drawing/importPartList',
									file: zipped,
									resumeChunkSize: '1mb',
									fields: {
										ExpectedChunkSize: 1048576,
										entity: angular.toJson($scope.entity),
										model: $scope.entity.importModel,
										type: $scope.entity.type,
										uniqueFolder: platformCreateUuid(),
										zipFilename: folder + '.zip'
									}
								};
								if (!_.isEmpty($scope.entity.plan)) {
									config.fields.plan = $scope.entity.plan;
								}
								if ($scope.entity.configuration) {
									config.fields.configurationName = $scope.entity.configuration.name;
								}
								updateProgress(10, 10 + config.fields.ExpectedChunkSize / config.file.size * 60, 'productionplanning.drawing.wizard.uploading');//read file content done
								UploadBase.upload(config, true).then(function success(success) {
									updateProgress();
									if (success.data.Result && success.data.Result.HasError) {
										showError(true, success.data.Result.ErrorInfos.join('<br>' + startSymbol));
									} else if (success.data.Dto) {
										drawingMainService.updateSelection(success.data.Dto);
										$scope.$close(true);
									}
								}, function error() {
									updateProgress();
								}, function processBar(p) {
									if (!p.lengthComputable) {
										if (p.total - p.loaded <= config.fields.ExpectedChunkSize) {
											updateProgress(70, 99, 'productionplanning.drawing.wizard.importing');
										} else {
											var percentage = 10 + p.loaded / p.total * 60;
											var maxPercentage = 10 + (p.loaded + config.fields.ExpectedChunkSize) / p.total * 60;
											updateProgress(percentage, maxPercentage, 'productionplanning.drawing.wizard.uploading');
										}
									}
								});
							});
						});
					});
				};

				function setRowsReadonly(readonly) {
					var needRowRids = ['Code', 'EngDrawingStatusFk', 'EngDrawingTypeFk', 'PrjProjectFk', 'LgmJobFk', 'BasClerkFk', 'PpsItemFk'];
					var fileds = needRowRids.map(function (f) {
						return {
							field: f,
							readonly: readonly
						};
					});
					fileds.push({
						field: 'importModel',
						readonly: !existing
					});
					platformRuntimeDataService.readonly($scope.entity, fileds);
				}

				function validateCode() {
					if ($scope.entity.Version > 0) {
						return $q.when();
					}
					var row = _.find($scope.formOptions.configure.rows, {'rid': 'code'});
					var result = row.validator($scope.entity, $scope.entity[row.model], row.model);
					if (!result.valid) {
						return $q.when();
					}
					platformRuntimeDataService.applyValidationResult(result, $scope.entity, row.model);
					$scope.progressInfo = null;
					$scope.isBusy = true;
					var defer = $q.defer();
					row.asyncValidator($scope.entity, $scope.entity[row.model], row.model).then(function (result) {
						$scope.isBusy = false;
						platformRuntimeDataService.applyValidationResult(result, $scope.entity, row.model);
						defer.resolve();
					});
					return defer.promise;
				}

				function showError(isShow, message) {
					$scope.error = {
						show: isShow,
						message: startSymbol + message
					};
				}

				function updateProgress(percentage, nextMaxProgress, message) {
					if (_.isNil(percentage)) {
						percentage = 100;
					}
					percentage = Math.floor(percentage);
					nextMaxProgress = Math.floor(nextMaxProgress);
					message = $translate.instant(message) || '';
					$scope.progressInfo = message + ' ' + percentage + '%...';
					if (percentage === 0) {
						$scope.isBusy = true;
					} else if (percentage === 100) {
						$timeout(function () {
							$scope.isBusy = false;
						});
					}
					cancelProgress();
					autoProgress = $interval(function () {
						if (percentage < nextMaxProgress) {
							percentage += 1;
							$scope.progressInfo = message + ' ' + percentage + '%...';
						}
					}, 500);
				}

				function cancelProgress() {
					if (autoProgress) {
						$interval.cancel(autoProgress);
					}
				}

				function removeError() {
					if (newItem) {
						platformDataValidationService.removeDeletedEntityFromErrorList(newItem, drawingMainService);
					}
					if (existing) {
						platformDataValidationService.removeDeletedEntityFromErrorList(existing, drawingMainService);
					}
				}

				function hasErrors() {
					var modState = platformModuleStateService.state(drawingMainService.getModule ? drawingMainService.getModule() : drawingMainService.getService().getModule());

					if (modState.validation && modState.validation.issues) {
						return !!_.find(modState.validation.issues, function (issue) {
							return issue.entity.Id === $scope.entity.Id;
						});
					}
				}

				$scope.$on('$destroy', function () {
					removeError();
					cancelProgress();
				});
			}]);
})(angular);
