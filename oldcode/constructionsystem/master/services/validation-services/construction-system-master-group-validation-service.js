/**
 * Created by wed on 6/20/2017.
 */
(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterGroupValidationService', [
		'platformRuntimeDataService',
		'basicsCommonCodeDescriptionSettingsService',
		'platformDataValidationService',
		'constructionSystemMasterGroupService',
		'cloudCommonGridService',
		'_',
		'$http',
		'$translate',
		function (
			platformRuntimeDataService,
			basicsCommonCodeDescriptionSettingsService,
			platformDataValidationService,
			constructionSystemMasterGroupService,
			cloudCommonGridService,
			_,
			$http,
			$translate
		) {
			var service = {
				asyncValidateCode:function (entity, value, model) {
					var result = {apply: true, valid: true};
					var tree = constructionSystemMasterGroupService.getTree(), items = cloudCommonGridService.flatten(tree, [], 'GroupChildren');

					var root = {
							Id:entity.Id,
							Code: value,
							CosGroupFk: entity.CosGroupFk
						}, parent = entity;
					while (parent.CosGroupFk) {
						parent = _.find(items, function (item) {
							return item.Id === parent.CosGroupFk;
						});
						root = {
							Id: parent.Id,
							Code: parent.Code,
							CosGroupFk: parent.CosGroupFk,
							GroupChildren: [root]
						};
					}

					var postData = {
						ValidateDto: root,
						Value: entity.Id,
						Model: model
					};

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, constructionSystemMasterGroupService);
					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'constructionsystem/master/group/validate', postData).then(function (response) {
						if (!response.data.ValidateResult) {
							result.valid = false;
							switch (response.data.ErrorCode){
								case '1001':
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage');
									break;
								case '1002':
									result.error = $translate.instant('constructionsystem.master.uniqueInSameGroupRoot');
									break;
							}
							platformRuntimeDataService.applyValidationResult(result, entity, model);
						} else {
							result.valid = true;
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							// constructionSystemMasterGroupService.gridRefresh();
						}

						return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, constructionSystemMasterGroupService);
					});
					return asyncMarker.myPromise;
				},
				validateSorting: function(entity, value, model){

					var result = true;
					if(value === null || value === ''){
						result={
							apply: true,
							valid: false,
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage'
						};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterGroupService);
				}
			};

			return service;
		}]);

})(angular);