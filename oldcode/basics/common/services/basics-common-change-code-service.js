(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonChangeCodeService',
		['$injector', '$translate', 'platformModalService', '_', 'globals',
			function ($injector, $translate, platformModalService, _, globals) {
				let service = {};
				service.provideCodeChangeInstance = function (config) {

					function changeCode() {
						const mainService = config.mainService;
						const executionService = config.executionService || config.mainService;
						var header = executionService.getSelected();
						const title = config.title;
						if (!header || !header.Id) {
							const strTitle = $translate.instant('procurement.common.errorTip.noRecordSelectedTitle');
							const strBody = $translate.instant('procurement.common.errorTip.noRecordSelectedBody');
							platformModalService.showMsgBox(strBody, strTitle, 'info');
						} else {
							const validationName = config.validationService;
							const codeRow = {
								'rid': 'code',
								'gid': 'basicData',
								'label': 'Code',
								'label$tr$': 'cloud.common.entityCode',
								'type': 'code',
								'model': 'Code',
								'readonly': false,
								'required': true
							};
							const validateCodeFn = {};
							if (!_.isNil(validationName)) {
								let validationService = $injector.get(config.validationService);
								if (_.isFunction(validationService)) {
									validationService = validationService(executionService);
								}
								if (!_.isNil(validationService.validateCode) || !_.isNil(validationService.asyncValidateCode)) {
									if (!_.isNil(validationService.validateCode)) {
										validateCodeFn.validator = validationService.validateCode;
									}
									if (!_.isNil(validationService.asyncValidateCode)) {
										validateCodeFn.asyncValidator = validationService.asyncValidateCode;
									}
								}
							}

							const dataItem = angular.copy(header);
							dataItem.__rt$data = null;
							const defaultValue = {
								headerText: $translate.instant(title),
								resizeable: true,
								height: '200px',
								width: '350px',
								templateUrl: globals.appBaseUrl + 'basics.common/templates/change-code-template.html',
								controller: ['$scope', function controller($scope) {
									$scope.isLoading = false;
									$scope.modalOptions = {
										headerText: $translate.instant(title),
										cancel: function () {
											$scope.$close(false);
										}
									};
									$scope.currentItem = dataItem;
									$scope.configureOptions = {
										configure: {
											fid: 'change.code.form',
											version: '1.0.0',
											showGrouping: false,
											groups: [
												{
													gid: 'basicData'
												}
											],
											rows: [codeRow]
										}
									};
									$scope.okClicked = function ok() {
										$scope.isLoading = true;
										const entity = dataItem;
										let result = {
											apply: true,
											valid: true
										};
										if (!_.isNil(validateCodeFn.validator)) {
											result = validateCodeFn.validator(dataItem, dataItem.Code, 'Code');
										}
										dataItem.__rt$data = null;
										if (result.valid) {
											if (!_.isNil(validateCodeFn.asyncValidator)) {
												validateCodeFn.asyncValidator(dataItem, dataItem.Code, 'Code').then(function (res) {
													dataItem.__rt$data = null;
													if (!_.isNil(res) && ((_.isObject(res) && res.valid) || (_.isBoolean(res) && res))) {
														if(executionService.refreshSelectedEntities){
															executionService.refreshSelectedEntities().then(function (response) {
																header = executionService.getSelected();
																updateCode(header, entity, mainService, executionService, $scope);
															});

														}else{
															updateCode(header, entity, mainService, executionService, $scope);
														}

													} else {
														$scope.isLoading = false;
														if (!_.isNil(res) && !_.isNil(res.error)) {
															if (res.error$tr$) {
																res.error = $translate.instant(res.error$tr$);
															}
															platformModalService.showMsgBox(res.error, 'cloud.common.informationDialogHeader', 'ico-info');
														}
													}
												});
											} else {
												if(executionService.refreshSelectedEntities){
													executionService.refreshSelectedEntities().then(function (response) {
														header = executionService.getSelected();
														updateCode(header, entity, mainService, executionService, $scope);
													});

												}else{
													updateCode(header, entity, mainService, executionService, $scope);
												}
											}
										} else {
											$scope.isLoading = false;
											if (!_.isNil(result.error)) {
												if (result.error$tr$) {
													result.error = $translate.instant(result.error$tr$);
												}
												platformModalService.showMsgBox(result.error, 'cloud.common.informationDialogHeader', 'ico-info');
											}
										}
									};
									$scope.close = function onCancel() {
										$scope.$close(false);
									};
								}]
							};
							platformModalService.showDialog(defaultValue);
						}
					}

					return {
						fn: changeCode
					};
				};
				function updateCode(header, entity, mainService, executionService,$scope) {
					header.Code = entity.Code;
					executionService.fireItemModified(header);
					executionService.markCurrentItemAsModified();
					mainService.update().then(function () {
						executionService.gridRefresh();
					})
						.finally(function () {
							$scope.isLoading = false;
							$scope.$close({ok: true});
						});
				}
				return service;
			}
		]);

})(angular);