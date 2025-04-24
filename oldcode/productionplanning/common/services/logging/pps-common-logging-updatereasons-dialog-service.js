/**
 * Created by zov on 4/3/2020.
 */
(function () {
	'use strict';
	/*global  _*/

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonLoggingUpdateReasonsDialogService', [
		'$compile',
		'$translate',
		'ppsCommonLoggingUpdateReasonsConfigService',
		'ppsCommonLoggingConstant',
		'platformTranslateService',
		'ppsMasterDataServiceFactory',
		function ($compile,
		          $translate,
		          ppsCommonLoggingUpdateReasonsConfigService,
		          ppsCommonLoggingConstant,
			       platformTranslateService,
		          ppsMasterDataServiceFactory) {

			var logModInfoPropName = ppsCommonLoggingConstant.ModificationInfoPropName,
				logModPropsPropName = ppsCommonLoggingConstant.ModificationPropsPropName,
				logModifiedPropName = ppsCommonLoggingConstant.ModifiedPropPropName,
				logReasonPropName = ppsCommonLoggingConstant.ReasonPropName,
				logRemarkPropName = ppsCommonLoggingConstant.RemarkPropName;

			var self = this;
			let openedDialogs = [];

			self.initController = function ($scope, params) {
				// set current dialog closing function here:
				openedDialogs.push({ id: $scope.$id, closeFn: $scope.$dismiss });
				$scope.$on('$destroy', () => {_.remove(openedDialogs, { id: $scope.$id });});

				var formConfig = ppsCommonLoggingUpdateReasonsConfigService.createFormConfig($scope, params.entity, params.getModifiedProps(), params.schemaOption, params.translationSrv);
				platformTranslateService.translateFormConfig(formConfig);
				$scope.formContainerOptions = {
					formOptions: {
						configure: formConfig
					}
				};
				$scope.modalOptions.value = createDialogValueFormEntity(params.entity);
				$scope.modalOptions.value.formConfig = formConfig;
				$scope.warning = $translate.instant('productionplanning.common.msgNoNeedToEditReasons');
				$scope.showWarning = params.getModifiedProps().length <= 0;

				$scope.modalOptions.showApplyallButton = params.showApplyallButton;
				$scope.modalOptions.applyAllBtnText = $translate.instant('productionplanning.common.logLayout.applyAll');
				$scope.modalOptions.disableApplyallButton = function() {
					return self.disableOkButton($scope.modalOptions);
				};

				overrideButtonEvents($scope, $scope.modalOptions.value);
			};

			function overrideButtonEvents($scope, result) {
				var dialogScope = $scope;
				while (!Object.prototype.hasOwnProperty.call(dialogScope, 'modalOptions') && dialogScope.$parent) {
					dialogScope = dialogScope.$parent;
				}

				// override ok function, because it will commitAllGridEdits(see modaldialog-service.js)
				// which include other grids out of dialog
				dialogScope.modalOptions.ok = function () {
					dialogScope.$close({
						ok: true,
						value: result
					});
				};

				dialogScope.modalOptions.applyAll = function() {
					dialogScope.$close({
						applyAll: true,
						value: result
					});
				};
			}

			self.disableOkButton = function (modalOptions) {
				var disabled = false;
				if (modalOptions.value && modalOptions.value.formConfig) {
					if (modalOptions.value.formConfig.rows.length === 0) {
						disabled = true;
					} else {
						var requiredRows = modalOptions.value.formConfig.rows.filter(function (r) {
							return r.required;
						});
						for (var i = 0; i < requiredRows.length; i++) {
							var r = requiredRows[i];
							var rValue = _.get(modalOptions.value, r.model);
							if (_.isNil(rValue)) {
								disabled = true;
								break;
							}
						}
					}
				}

				return disabled;
			};

			self.setUpdateReasons = function (entity, result) {
				var props = _.get(entity, logModInfoPropName + '.' + logModPropsPropName);
				if (props) {
					props.forEach(function (modPropObj) {
						var propName = modPropObj[logModifiedPropName];
						ppsCommonLoggingUpdateReasonsConfigService.setUpdateInfo(result, propName,
							function (reason) {
								modPropObj[logReasonPropName] = reason;
							},
							function (remark) {
								modPropObj[logRemarkPropName] = remark;
							});
					});

					var compatibleCols = [];

					// get compatible columns of date shift
					if (_.isFunction(entity.getDataService().getDateshiftData)) {
						var config = entity.getDataService().getDateshiftData().config;
						compatibleCols = [config.start, config.end];
					}

					// set reason and remark to compatible columns
					if (compatibleCols.length > 0) {
						var unsolvedProps = props.filter(function (prop) {
							return _.isNil(prop[logReasonPropName]) && _.isNil(prop[logRemarkPropName]);
						});

						unsolvedProps.forEach(function (modPropObj) {
							if (compatibleCols.includes(modPropObj[logModifiedPropName])) {
								ppsCommonLoggingUpdateReasonsConfigService.setUpdateInfoForCompatibleCols(result, compatibleCols,
									function (reason) {
										modPropObj[logReasonPropName] = reason;
									},
									function (remark) {
										modPropObj[logRemarkPropName] = remark;
									});
							}
						});
					}

					// set masterdata after update reasons are set
					var ppsMasterService = ppsMasterDataServiceFactory.getMasterDataService('Event');
					if (ppsMasterService && _.isFunction(ppsMasterService.customMasterDataChanged)) {
						ppsMasterService.customMasterDataChanged([entity], {
							matchConfig: {
								Id: !_.isUndefined(entity.OriginalId) ? 'OriginalId' : 'Id'
							}
						});
					}
				}
			};

			self.closeOpenedDialogs = function() {
				if (_.isEmpty(openedDialogs)) {
					return;
				}
				_.forEach(openedDialogs, (openDialog) => {
					openDialog.closeFn();
					_.remove(openedDialogs, openDialog);
				});
			};

			function createDialogValueFormEntity(entity) {
				var modifiedProps = _.get(entity, logModInfoPropName + '.' + logModPropsPropName);
				if (!modifiedProps) {
					return {};
				}

				var value = {};
				modifiedProps.forEach(function (modPropObj) {
					var propName = ppsCommonLoggingConstant.ConvertPropName(modPropObj[logModifiedPropName]);
					_.set(value, propName + '.' + logReasonPropName, modPropObj[logReasonPropName]);
					_.set(value, propName + '.' + logRemarkPropName, modPropObj[logRemarkPropName]);
				});

				return value;
			}
		}
	]);
})();
