/**
 * @author: chd
 * @date: 4/7/2021 11:14 AM
 * @description:
 */
(function (angular) {
	/* global globals, JSZip */
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('mtwo.aiconfiguration').directive('mtwoAiConfigurationModelFileInput', ['_', '$http', '$translate', '$log', '$interval', 'platformModalService',
		'UploadBase', 'platformCreateUuid', 'mtwoAiConfigurationParameterAliasService',
		function (_, $http, $translate, $log, $interval, platformModalService,
			UploadBase, platformCreateUuid, mtwoAiConfigurationParameterAliasService) {

			let template =
				'<div class="input-group form-control"> \
					<input type="text" class="input-group-content" ng-model="ngModel" readonly="true" placeholder="{{placeholder}}" /> \
					<span class="input-group-btn"> \
						<button id="importFileBtn" ngf-select="uploadFile($file, $invalidFiles)" accept={{filter}} class="btn btn-default tlb-icons ico-upload"></button> \
					</span> \
					<div data-cloud-common-overlay data-info2="info2" file="file" data-loading="viewContentLoading" data-css-class="css"></div>\
				</div>';

			return {

				restrict: 'A',

				replace: false,

				scope: {
					entity: '=',
					ngModel: '=',
					options: '='
				},

				link: linker,

				template: template
			};

			function linker(scope, elem) {
				scope.placeholder = scope.entity.placeholder;
				scope.viewContentLoading = false;

				let uploadMessage = $translate.instant('cloud.common.uploading');
				let checkVersionMessage = $translate.instant('mtwo.aiconfiguration.checkVersion');

				// set cssClass for overlay-container
				scope.css = 'spinner-inline-md spinner-span-nowrap';
				scope.filter = '.zip';
				if (scope.options && scope.options.fileFilter) {
					scope.filter = scope.options.fileFilter;
				}

				elem.on('$destroy', function () {
				});

				function onUploadFileDone(file) {
					scope.ngModel = file.name;
					scope.entity.Description = file.name;
					scope.entity.File = file;
					scope.entity.OkDisable = false;

					let parameterRequest = {
						MtoModelFk: scope.entity.ModelFk,
						ModelType: scope.entity.ModelType,
						Guid: scope.entity.uuid
					};

					$http.post(globals.webApiBaseUrl + 'mtwo/aiconfiguration/modelparameter/getparameterlist', parameterRequest).then(function (response) {
						if (response.data) {
							scope.entity.inputParameters = response.data.ModelParameterDtos;
							scope.entity.aliasMappingData = response.data.AliasMappingData;
							mtwoAiConfigurationParameterAliasService.attachData(response.data.AliasMappingData);
						}
					});

					reset();
				}

				function setMessage(message, fileName) {
					let displayMessage = message;
					if (!_.isEmpty(fileName)) {
						displayMessage = displayMessage.replace('##fileName##', fileName);
					}
					scope.info2 = displayMessage;
					scope.viewContentLoading = true;
				}

				function reset() {
					scope.info2 = null;
					scope.viewContentLoading = false;
				}

				scope.uploadFile = function (file, errFiles) {
					scope.errFile = errFiles && errFiles[0];
					if (file) {
						reset();
						let fileName = file.name,
							suffix = fileName.substr(fileName.lastIndexOf('.'), fileName.length - 1).toLowerCase();

						if (scope.options.fileFilter && scope.options.fileFilter.indexOf(suffix) !== -1) {
							setMessage(checkVersionMessage);
							let hasVersionFile = false;
							let hasMainPyFile = false;
							let jsZip = new JSZip();
							jsZip.loadAsync(file).then(function (res) {
								for (let key in res.files) {
									if (!res.files[key].dir) {
										let fileName = res.files[key].name;
										let pythonReg = /main.py/;
										let requirementReg = /requirements.json/;

										if (pythonReg.test(fileName)) {
											hasMainPyFile = true;
										}

										if (requirementReg.test(fileName)) {
											hasVersionFile = true;
											res.file(res.files[key].name).async('string').then(function (content) {
												if (content.length === 0) {
													let modalOptions = {
														headerTextKey: $translate.instant('mtwo.aiconfiguration.wizard.uploadFailure'),
														bodyText: $translate.instant('mtwo.aiconfiguration.wizard.requirementsNull'),
														iconClass: 'ico-error'
													};
													platformModalService.showDialog(modalOptions);
													reset();
												} else {
													$http.post(globals.webApiBaseUrl + 'mtwo/aiconfiguration/modelversion/compareimageversion', {Versions: JSON.parse(content)}).then(function (result) {
														if (result.data && result.data.CheckPass) {
															scope.entity.ImageFk = result.data.ImageFk;
															scope.entity.uuid = platformCreateUuid();
															let config = {
																url: globals.webApiBaseUrl + 'mtwo/aiconfiguration/model/uploadfile',
																file: file,
																resumeChunkSize: '2mb',
																fields: {
																	ExpectedChunkSize: 1048576,
																	uuid: scope.entity.uuid
																}
															};

															UploadBase.upload(config, true).then(function success(success) {
																onUploadFileDone(file);
																if (success.data.Result && success.data.Result.HasError) {
																	let modalOptions = {
																		headerTextKey: $translate.instant('mtwo.aiconfiguration.wizard.uploadFailure'),
																		bodyText: success.data.Result.ErrorInfos.join('<br>'),
																		iconClass: 'ico-error'
																	};
																	platformModalService.showDialog(modalOptions);
																}
															}, function error() {
																reset();
															}, function processBar(p) {
																let percentage = Math.floor(p.loaded / p.total * 100);
																setMessage(uploadMessage + ' ' + percentage + '%...', file.name);
															});

														} else {
															reset();
															let modalOptions = {
																headerTextKey: $translate.instant('mtwo.aiconfiguration.wizard.uploadFailure'),
																bodyText: $translate.instant('mtwo.aiconfiguration.wizard.noMatchImage'),
																iconClass: 'ico-error'
															};
															platformModalService.showDialog(modalOptions);
														}
													}).catch(
														e => {
															reset();
															throw e;
														}
													);
												}
											});
										}
									}
								}

								if (hasMainPyFile) {
									scope.entity.ModelType = 0;
								} else {
									scope.entity.ModelType = 1;
								}

								if (!hasVersionFile) {
									reset();
									let modalOptions = {
										bodyText: $translate.instant('mtwo.aiconfiguration.wizard.versionFileNotFound'),
										iconClass: 'ico-error'
									};
									platformModalService.showDialog(modalOptions);
								}
							}).catch(e => {
								reset();
								throw e;
							});

						} else {
							platformModalService.showErrorBox($translate.instant('model.project.errorNoSelection'), $translate.instant('model.project.errorTitle'));
							reset();
						}
					} else if (scope.errFile) {
						platformModalService.showErrorBox($translate.instant('model.project.errorNoSelection'), $translate.instant('model.project.errorTitle'));
						reset();
					}
				};
			}
		}]);
})(angular);
