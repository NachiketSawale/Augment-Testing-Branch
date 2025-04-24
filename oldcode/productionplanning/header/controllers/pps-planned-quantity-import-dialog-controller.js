/**
 * Created by zwz on 2023/11/8.
 * It's mainly copied from file productionplanning.drawing\controllers\Wizard\productionplanning-drawing-import-part-list-dialog-controller.js
 */
(function (angular) {
	/* globals globals, JSZip, _ */
	'use strict';

	let removeExtension = (filename) => filename.substring(0, filename.lastIndexOf('.')) || filename;

	const moduleName = 'productionplanning.header';
	angular.module(moduleName).factory('productionplanningPlannedQuantityImportDialogConfigurations',
		[function () {
			function getConfig() {
				return {
					'fid': 'productionplanning.header.PQ.fileUpload',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'basicData'
						}
					],
					'rows': [
						{
							gid: 'basicData',
							rid: 'PlannedQuantityType',
							label: '*Type',
							label$tr$: 'productionplanning.header.wizard.importPQs.importType',
							model: 'plannedQuantityTypeId',
							type: 'select',
							required: true,
							options: {
								items: [{id: 8, description: 'ÖNORM Import'},
									{id: 9, description: 'Iron Import'}],
								valueMember: 'id',
								displayMember: 'description'
							}
						},
						{
							gid: 'basicData',
							rid: 'Files',
							model: 'files',
							label: '*File',
							label$tr$: 'productionplanning.header.wizard.importPQs.files',
							type: 'directive',
							directive: 'productionplanning-common-select-file-directive',
							required: true,
							options: {
								multiple: true
							},
							validator: (entity, value) => {
								let isValidationFailed = (value.length < 2)
									|| !_.some(value, e => e.name.toLowerCase().endsWith('.dta'))
									|| !_.some(value, e => e.name.toLowerCase().endsWith('.xml'));
								if (isValidationFailed) {
									return {apply: true, valid: false, error$tr$: 'productionplanning.header.wizard.importPQs.dtaAndXmlRequirementErrorMsg'};
								}
								return {apply: true, valid: true, error: ''};
							},
						},
						{
							gid: 'basicData',
							rid: 'PpsHeaderId',
							model: 'ppsHeaderId',
							label: '*Header',
							label$tr$: 'productionplanning.item.headerFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							readonly: true,
							options: {
								lookupDirective: 'productionplanning-Header-Dialog-Lookup',
								descriptionMember: 'DescriptionInfo.Translated',
							}
						}
					]
				};
			}

			return {getConfig: getConfig};
		}]
	);

	angular.module(moduleName).controller('productionplanningPlannedQuantityImportDialogController',
		[
			'$scope', '$options',
			'$translate',
			'productionplanningPlannedQuantityImportDialogConfigurations',
			'productionplanningDrawingImportPartListDialogService',
			'basicsCommonUploadDownloadControllerService',
			'platformModalService',
			'platformRuntimeDataService',
			'$q',
			'$http',
			'platformCreateUuid',
			'platformDataValidationService',
			'$injector',
			'$interval',
			'$timeout',
			'platformTranslateService',
			'cloudDesktopPinningContextService',
			'productionplanningHeaderDataService',
			'transportplanningTransportUtilService',
			'platformModuleStateService',
			'UploadBase',
			function ($scope, $options, $translate, config, importPartListDialogService, basicsCommonUploadDownloadControllerService,
				platformModalService,
				platformRuntimeDataService,
				$q,
				$http,
				platformCreateUuid,
				platformDataValidationService,
				$injector,
				$interval,
				$timeout,
				platformTranslateService,
				cloudDesktopPinningContextService,
				productionplanningHeaderDataService,
				utilService,
				platformModuleStateService,
				UploadBase) {

				var startSymbol = '▪';
				var autoProgress = null;

				let costCodeMappingConfig = $options.costCodeMappingConfig;
				$scope.title = $translate.instant('productionplanning.header.wizard.importPQs.title');
				$scope.entity = {
					ppsHeaderId: productionplanningHeaderDataService.getSelected().Id,
					plannedQuantityTypeId: 8,
					costCodeMappingConfig: costCodeMappingConfig
				};

				$scope.formOptions = {
					configure: config.getConfig()
				};
				platformTranslateService.translateFormConfig($scope.formOptions.configure);

				let isValidationNotPassed = (entity) => (entity.__rt$data && entity.__rt$data.errors && !_.isNil(entity.__rt$data.errors.files));
				$scope.isOKDisabled = function () {
					return $scope.isBusy || _.isNil($scope.entity.files) || isValidationNotPassed($scope.entity);
				};

				$scope.handleOK = function () {
					if ($scope.isOKDisabled()) {
						return;
					}
					updateProgress(0, 10, 'productionplanning.header.wizard.importPQs.compressing');
					let folder = $scope.entity.files[0].webkitRelativePath.split('/')[0];
					folder = _.isEmpty(folder) ? removeExtension($scope.entity.files[0].name) : folder;
					var jsZip = new JSZip();
					var promises = [];
					_.forEach($scope.entity.files, function (file) {
						promises.push(importPartListDialogService.readFile(jsZip, file));
					});
					$q.all(promises).then(function () {
						jsZip.generateAsync({
							type: 'blob',
							compression: 'DEFLATE'
						}).then(function (zipped) {
							var config = {
								url: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/plannedquantity/import',
								file: zipped,
								resumeChunkSize: '1mb',
								fields: {
									ExpectedChunkSize: 1048576,
									entity: angular.toJson($scope.entity),
									ppsHeaderId: $scope.entity.ppsHeaderId,
									plannedQuantityTypeId: $scope.entity.plannedQuantityTypeId,
									costCodeMappingConfig: $scope.entity.costCodeMappingConfig,
									uniqueFolder: platformCreateUuid(),
									zipFilename: folder + '.zip'
								}
							};

							updateProgress(10, 10 + config.fields.ExpectedChunkSize / config.file.size * 60, 'productionplanning.header.wizard.importPQs.uploading');//read file content done
							UploadBase.upload(config, true).then(function success(success) {
								updateProgress();
								/*
								if (success.data.Result && success.data.Result.HasError) {
									showError(true, success.data.Result.ErrorInfos.join('<br>' + startSymbol));
								}
								*/
								$scope.$close(true);
								// show success dialog
								platformModalService.showDialog({
									headerTextKey: $translate.instant('productionplanning.header.wizard.importPQs.title'),
									bodyTextKey: $translate.instant('productionplanning.header.wizard.importPQs.successMsg'),
									iconClass: 'info'
								});
								// refresh Planned Quantities containers
								let dataServiceFactory = $injector.get('ppsPlannedQuantityDataServiceFactory');
								if (utilService.hasShowContainer('productionplanning.header.plannedquantity.list')) {
									dataServiceFactory.getService({serviceName: 'productionplanning.header.plannedQuantity', parentService: 'productionplanningHeaderDataService', parentFilter: 'PpsHeaderFk'})
										.load();
								}
								if (utilService.hasShowContainer('productionplanning.header.plannedquantity.parentlist')) {
									dataServiceFactory.getService({serviceName: 'productionplanning.header.parentPlannedQuantity', parentService: 'productionplanningHeaderDataService', parentFilter: 'PpsHeaderFk'})
										.load();
								}
							}, function error() {
								updateProgress();
							}, function processBar(p) {
								if (!p.lengthComputable) {
									if (p.total - p.loaded <= config.fields.ExpectedChunkSize) {
										updateProgress(70, 99, 'productionplanning.header.wizard.importPQs.importing');
									} else {
										var percentage = 10 + p.loaded / p.total * 60;
										var maxPercentage = 10 + (p.loaded + config.fields.ExpectedChunkSize) / p.total * 60;
										updateProgress(percentage, maxPercentage, 'productionplanning.header.wizard.importPQs.uploading');
									}
								}
							});
						});
					});
				};

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

				$scope.$on('$destroy', function () {
					cancelProgress();
				});

				$scope.modalOptions = {
					headerText: $translate.instant('productionplanning.header.wizard.importPQs.title'),
					cancel: close
				};

				function close() {
					return $scope.$close(false);
				}

			}]);
})(angular);
