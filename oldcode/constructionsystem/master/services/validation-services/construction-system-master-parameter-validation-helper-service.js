/**
 * Created by jes on 8/3/2016.
 */


(function (angluar) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	angluar.module(moduleName).factory('constructionSystemMasterParameterValidationHelperService', constructionSystemMasterParameterValidationHelperService);

	constructionSystemMasterParameterValidationHelperService.$inject = [
		'_',
		'PlatformMessenger',
		'platformRuntimeDataService',
		'constructionSystemMasterParameterTypeConverter'];

	function constructionSystemMasterParameterValidationHelperService(
		_,
		PlatformMessenger,
		platformRuntimeDataService,
		parameterTypeConverter) {

		var service = {
			validationInfoChanged: new PlatformMessenger(),
			applyDisable: applyDisable,
			applyHidden: applyHidden,
			applyError: applyError,
			handleValidatorInfo: handleValidatorInfo,
			copyValue: copyValue
		};

		return service;

		function applyDisable(info, item, model) {
			if (Object.prototype.hasOwnProperty.call(info,'IsDisabled')) {
				var fields = [{
					'field': model,
					'readonly': info.IsDisabled
				}];
				platformRuntimeDataService.readonly(item, fields);
			}
		}

		function applyHidden(info, item) {
			if(Object.prototype.hasOwnProperty.call(info,'IsHidden')) {
				item.__rt$data = item.__rt$data || {};
				item.__rt$data.hide = !!info.IsHidden;
			}
		}

		function applyError(info, item, model) {
			if (Object.prototype.hasOwnProperty.call(info,'HasError')) {
				var result = {};
				if (info.HasError) {
					result = {
						apply: true,
						valid: false,
						error: info.Error
					};
				} else {
					result.valid = true;
					result.apply = true;
				}
				platformRuntimeDataService.applyValidationResult(result, item, model);
			}
		}

		function handleValidatorInfo(validatedInfo, parameters, model) {
			parameters.forEach(function (param) {
				var vInfo = validatedInfo.filter(function (v) {
					return param.VariableName === v.Name;
				});
				if (vInfo) {
					var disableInfo = _.filter(vInfo, function (info) {
						return Object.prototype.hasOwnProperty.call(info,'IsDisabled');
					});
					_.forEach(disableInfo, function (info) {
						applyDisable(info, param, model);
					});

					var hiddenInfo = _.filter(vInfo, function (info) {
						return Object.prototype.hasOwnProperty.call(info,'IsHidden');
					});
					_.forEach(hiddenInfo, function (info) {
						applyHidden(info, param);
					});

					var errorInfo = _.filter(vInfo, function (info) {
						return Object.prototype.hasOwnProperty.call(info,'HasError')
							&& info.HasError === true;
					});
					if (errorInfo.length === 0) {
						applyError({HasError: false}, param, model); // no error at all, so clear previous error info if it exists
					} else {
						applyError(errorInfo[0], param, model); // always apply the first one
					}
				}
			});

			var needToHide = _.filter(validatedInfo, function (o){ return Object.prototype.hasOwnProperty.call(o,'IsHidden'); });

			service.validationInfoChanged.fire(needToHide, validatedInfo);
		}

		function copyValue(parameterList, cosParameterList) {
			if (angular.isArray(parameterList)) {
				_.forEach(parameterList, function (param) {
					var temp = _.find(cosParameterList, {Id: param.ParameterFk});
					if (temp) {
						if (temp.IsLookup) {
							param.InputValue = parameterTypeConverter.convertValue(temp.ParameterTypeFk, param.ParameterValue);
						} else {
							param.InputValue = param.ParameterValueVirtual;
						}
						param.VariableName = temp.VariableName;
					}
				});
			}
		}
	}

})(angular);
