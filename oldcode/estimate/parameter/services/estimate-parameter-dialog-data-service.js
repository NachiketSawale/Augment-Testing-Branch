(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.parameter';

	angular.module(moduleName).factory('estimateParameterDialogDataService', ['_', '$q', '$http', '$translate', 'platformModalService', 'estimateParameterValueAssignmentGridService', '$injector',
		'estimateRuleParameterConstant', 'platformRuntimeDataService', 'platformDataServiceModificationTrackingExtension', 'PlatformMessenger',
		function (_, $q, $http, $translate, platformModalService, estimateParameterValueAssignmentGridService, $injector, estimateRuleParameterConstant, platformRuntimeDataService,
			platformDataServiceModificationTrackingExtension, PlatformMessenger) {
			let service = {};
			let currentEstParameter = null;

			service.onValueTypeChangeEvent = new PlatformMessenger();
			service.onIsLookupChangeEvent = new PlatformMessenger();

			service.getCurrentEstParameter = function () {
				return currentEstParameter;
			};

			service.setCurrentEstParameter = function (value) {
				currentEstParameter = value;
			};

			service.isLookUpChange = function (entity) {
				if (!entity.Islookup && estimateParameterValueAssignmentGridService.getList().length > 0) {
					platformModalService.showYesNoDialog('basics.customize.uncheckIsLooKupTip', 'basics.customize.uncheckIsLooKupTitle')
						.then(function (result) {
							if (result.yes) {
								reSetValue(entity, false);
								estimateParameterValueAssignmentGridService.deleteEntities(estimateParameterValueAssignmentGridService.getList());
								service.onIsLookupChangeEvent.fire(entity.Islookup);
							} else {
								entity.Islookup = !entity.Islookup;
							}
						});
				} else {
					reSetValue(entity, false);
					service.onIsLookupChangeEvent.fire(entity.Islookup);
				}
			};

			service.paramValueTypeChange = function (entity) {
				if (entity.Islookup) {
					platformModalService.showYesNoDialog('basics.customize.changeParameterTypeTip', 'basics.customize.changeParameterTypeTitle')
						.then(function (result) {
							if (result.yes) {
								reSetValue(entity, true);
								estimateParameterValueAssignmentGridService.deleteEntities(estimateParameterValueAssignmentGridService.getList());                                // fire update value
								entity.oldParamValueTypeFk = entity.ParamvaluetypeFk;
							} else {
								entity.ParamvaluetypeFk = entity.oldParamValueTypeFk;
							}
							setReadOnly(entity);
						});
				} else {
					reSetValue(entity, true);
					service.onValueTypeChangeEvent.fire();
					setReadOnly(entity);
				}
			};

			service.showDialog = function (entity) {
				let currentParameter = angular.copy(entity);
				setValueDetail(currentParameter);
				service.setCurrentEstParameter(currentParameter);
				setReadOnly(currentParameter);
				let dialogOptions = {
					templateUrl: globals.appBaseUrl + 'estimate.parameter/templates/estimate-parameter-dialog/estimate-parameter-dialog.html',
					controller: 'estimateParameterDialogController',
					width: '800px',
					backdrop: false,
					resizeable: true,
					windowClass: 'form-modal-dialog',
					uuid: '1adc803c87b943cabc25ae69e8298a2d'
				};

				loadParameterValue(entity).then(function () {
					platformModalService.showDialog(dialogOptions).then(function (result) {
						if (result.ok) {
							estimateParameterValueAssignmentGridService.deselect().then(function () {
								service.saveEstParameter(result.data);
							});
						}}
					);
				});
			};

			function loadParameterValue(entity) {
				let deferred = $q.defer();
				if (entity.Islookup) {
					estimateParameterValueAssignmentGridService.load().then(function () {
						deferred.resolve();
					});
				} else {
					deferred.resolve();
				}
				return deferred.promise;
			}

			service.saveEstParameter = function (saveEstParameter) {
				saveEstParameter.EstParameterValueToSave = estimateParameterValueAssignmentGridService.getItemsToSave();
				saveEstParameter.EstParameterValueToDelete = estimateParameterValueAssignmentGridService.getItemsToDelete();
				setActualValueToSave(saveEstParameter);
				$http.post(globals.webApiBaseUrl + 'basics/customize/estparameter/saveCompositeParameter', saveEstParameter).then(function (response) {
					if (response && response.data) {
						let customizeDataService = $injector.get('basicsCustomizeInstanceDataService');
						if (customizeDataService) {
							customizeDataService.load().then(function () {
								platformDataServiceModificationTrackingExtension.clearModificationsInRoot(customizeDataService);
								let list = customizeDataService.getList();
								let parameter = _.find(list, {Id: response.data.Id});
								if (parameter) {
									angular.extend(parameter, response.data);
								}
								customizeDataService.gridRefresh();
							});
						}
					}

				});
			};

			function setReadOnly(entity) {
				let fields = [
					{field: 'Islookup', readonly: entity.ParamvaluetypeFk === estimateRuleParameterConstant.Boolean}
				];
				platformRuntimeDataService.readonly(entity, fields);
			}

			function setValueDetail(currentParameter) {
				if (currentParameter.Islookup) {
					return;
				} else if (currentParameter.ParamvaluetypeFk === estimateRuleParameterConstant.Boolean) {
					currentParameter.ValueDetail = !!currentParameter.DefaultValue;
				} else if (currentParameter.ParamvaluetypeFk === estimateRuleParameterConstant.Text) {
					currentParameter.ValueDetail = currentParameter.ValueText;
				} else {   // means the valueType is Decimal2 or Boolean or the valueType is Undefined
					currentParameter.ValueDetail = currentParameter.DefaultValue;
				}
			}

			function setActualValueToSave(currentParameter) {
				if (currentParameter.Islookup) {
					let paramValue = _.find($injector.get('estimateParameterValueAssignmentGridService').getList(), function (item) {
						return item.Id === parseInt(currentParameter.ValueDetail);
					});
					if (!paramValue) {
						return;
					}
					if (currentParameter.ParamvaluetypeFk === estimateRuleParameterConstant.Text) {
						currentParameter.ValueText = paramValue.ValueText;
					} else {   // means the valueType is Decimal2 or the valueType is Undefined
						currentParameter.DefaultValue = paramValue.Value;
					}
				} else if (currentParameter.ParamvaluetypeFk === estimateRuleParameterConstant.Boolean) {
					currentParameter.ValueDetail = currentParameter.ValueDetail ? 1 : 0;
					currentParameter.DefaultValue = currentParameter.ValueDetail;
				} else if (currentParameter.ParamvaluetypeFk === estimateRuleParameterConstant.Text) {
					currentParameter.ValueText = currentParameter.ValueDetail;
				} else {   // means the valueType is Decimal2 or the valueType is Undefined
					currentParameter.DefaultValue = currentParameter.ValueDetail;
				}
			}

			function reSetValue(entity, isParamValueTypeChange) {
				if (isParamValueTypeChange) {
					if (entity.ParamvaluetypeFk === estimateRuleParameterConstant.Boolean) {
						entity.DefaultValue = null;
						entity.ValueText = null;
						entity.Islookup = false;
					} else if (entity.ParamvaluetypeFk === estimateRuleParameterConstant.Text) {
						entity.DefaultValue = null;
					} else {
						entity.ValueText = null;
					}
				} else {
					entity.ValueText = null;
					entity.DefaultValue = null;
				}

				entity.ValueDetail = null;
			}

			return service;

		}]);
})();
