/**
 * Created by wed on 12/13/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationGroupDataValidationServiceFactory', [
		'_',
		'$translate',
		'platformRuntimeDataService',
		'commonBusinessPartnerEvaluationServiceCache',
		'platformDataValidationService',
		function (_, $translate,
			platformRuntimeDataService,
			serviceCache,
			platformDataValidationService) {

			function createService(serviceDescriptor, evaluationDetailService, groupDataService) {

				if (serviceCache.hasService(serviceCache.serviceTypes.GROUP_VALIDATION, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.GROUP_VALIDATION, serviceDescriptor);
				}

				var service = {};

				angular.extend(service, {
					validatePoints: validatePoints,
					validateRemark: validateRemark,
					asyncValidatePoints: asyncValidatePoints
				});

				function asyncValidatePoints(entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, groupDataService);
					entity.Points = value;
					asyncMarker.myPromise = groupDataService.recalculateAll()
						.then(function (results) {
							var result = {valid: true, apply: true};
							if (!results) {
								return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, groupDataService);
							}

							if (results.error) {
								if (!(value >= entity.PointsMinimum && value <= entity.PointsPossible)) {
									result.valid = false;
									result.error = $translate.instant('businesspartner.main.amongValueErrorMessage', {
										value: value,
										min: entity.PointsMinimum,
										max: entity.PointsPossible
									});
								}

								return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, groupDataService);
							}

							var list = groupDataService.getList();

							var item = _.find(list, {Id: entity.Id});
							if (item) {
								var res = results[item.Id];
								if (res && res.HasError) {
									result.valid = false;
									if (res.ErrorCode === 1) {
										value = res.Arg3;
										result.error = $translate.instant('businesspartner.main.amongValueErrorMessage', {
											min: res.Arg1,
											max: res.Arg2,
											value: value
										});
									}
									else if (res.ErrorCode === 2) {
										result.error = $translate.instant('businesspartner.main.failToExecuteFormula', {
											formulaParsed: res.Arg1,
											formula: res.Arg2
										});
									} else if (res.ErrorCode === 3) {
										result.error = $translate.instant('businesspartner.main.failToExecuteSql', {
											formula: res.Arg1,
											message: res.Arg2
										});
									}
								}
							}
							return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, groupDataService);
						});

					return asyncMarker.myPromise;
				}

				function validatePoints() {
					return true;
				}

				function validateRemark(entity) {
					if (entity) {
						var tree = groupDataService.getTree();
						var parentItem = _.find(tree, {Id: entity.PId});
						if (parentItem && (parentItem.InsertedBy === null || parentItem.InsertedBy <= 0)) {
							groupDataService.setIsCreateByUserModified(parentItem);
							groupDataService.markItemAsModified(parentItem);
						}
						groupDataService.setIsCreateByUserModified(entity);
					}
				}

				serviceCache.setService(serviceCache.serviceTypes.GROUP_VALIDATION, serviceDescriptor, service);

				return service;
			}

			return {
				createService: createService
			};
		}]);
})(angular);
