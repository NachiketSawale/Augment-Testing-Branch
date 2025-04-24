/**
 * Created by myh on 11/01/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureTransferDataToBisDataValidationService',
		['_', '$translate', '$http', '$q', 'globals',
			function (_, $translate, $http, $q, globals) {

				var service = {};

				angular.extend(service, {
					handleValidateResult: handleValidateResult,
					validatedEstLineItems: [],
					validatedEstHeaderIds: [],
					validateActivities: [],
				});

				function handleValidateResult(scope, validateResult){
					var result = {
						errorShow: true,
						canContinue: true,
						message: '',
						errorType: 3// 3 for error, 2 fro warining
					};
					var estHeaderIds = _.isArray(validateResult.EstHeaderIds) ? validateResult.EstHeaderIds : [];
					service.validatedEstHeaderIds = estHeaderIds;
					var activities = _.isArray(validateResult.Activities) ? validateResult.Activities : [];
					service.validateActivities = activities;
					var periods = _.isArray(validateResult.Periods) ? validateResult.Periods : [];
					var estLineItems = _.isArray(validateResult.EstLineItems) ? validateResult.EstLineItems : [];
					service.validatedEstLineItems = estLineItems;

					if(estHeaderIds && estHeaderIds.length > 0){
						getQuantityLastModifiedDate(scope, estHeaderIds);

						if (activities.length === 0) {
							result.errorShow = false;
						}else if(periods.length <= 0 && activities.length > 0) {
							result.canContinue = false;
							result.message = getActivityValidateMessage(activities, null, 1);
						}else{
							if (estLineItems.length > 0){
								var noActivityMatchPeriod = validateResult.NoActivityMatchPeriod;
								// activity date range is out of period date range partly
								var activityCantMatchPeriod = validateResult.ActivityCantMatchPeriod;

								var noActivityMatchPeriodList = _.isArray(validateResult.NoActivityMatchPeriodList) ? validateResult.NoActivityMatchPeriodList : [];
								var activityCantMatchPeriodList = _.isArray(validateResult.ActivityCantMatchPeriodList) ? validateResult.ActivityCantMatchPeriodList : [];

								if (noActivityMatchPeriod && noActivityMatchPeriodList.length > 0) {
									result.canContinue = false;
									result.message = getActivityValidateMessage(noActivityMatchPeriodList, activityCantMatchPeriodList, 1);
								} else if (!noActivityMatchPeriod && activityCantMatchPeriod) {
									if(activityCantMatchPeriod){
										result.message = getActivityValidateMessage(noActivityMatchPeriodList, activityCantMatchPeriodList, 2);
										result.errorType = 2;
									}
									else{
										result.errorShow = false;
									}
								} else {
									result.errorShow = false;
								}
							}else{
								result.canContinue = false;
								result.message = $translate.instant('controlling.structure.coEstLineitemNullError');
							}
						}
					}
					else{
						result.canContinue = false;
						result.message = $translate.instant('controlling.structure.coEstHeaderNullError');
					}

					setErrorShow(scope, result);
				}

				function setErrorShow(scope, result) {
					scope.error.show = result.errorShow;
					scope.error.canContinue = result.canContinue;
					scope.error.message = result.message;
					scope.error.type = result.errorType;
					scope.isDisableOkBtn = scope.error.show && !scope.error.canContinue;
				}

				function getActivityValidateMessage(errorActivityList, warnActivityList, validateType) {
					var message = '';

					if (validateType === 1) {  // get message for all activity date range is out of periods datea range
						message += $translate.instant('controlling.structure.noMatchedActivityAndPeriodError') + '\n';

						_.forEach(errorActivityList, function (activity) {
							message += '[' + activity.Code + '],';
						});
					} else if (validateType === 2) { // get message for part of activity date range is out of periods datea range

						if ((errorActivityList === null || errorActivityList.length <= 0) && (warnActivityList === null || warnActivityList.length <= 0)) {
							message += 'No Error or Warn Activity.';
							return message;
						}

						if (errorActivityList !== null && errorActivityList.length > 0) {
							message += $translate.instant('controlling.structure.noMatchedActivityAndPeriodError') + '\n';

							_.forEach(errorActivityList, function (activity) {
								message += '[' + activity.Code + '],';
							});

							message = message.endsWith(',') ? message.substring(0, message.length - 1) + '\n' : message + '\n';
						}

						if (warnActivityList !== null && warnActivityList.length > 0) {
							message += $translate.instant('controlling.structure.activityCantMatchPeriodWarning') + '\n';

							_.forEach(warnActivityList, function (activity) {
								message += '[' + activity.Code + '],';
							});
						}

					}
					message = message.endsWith(',') ? message.substring(0, message.length - 1) + '\n' : message + '\n';
					return message;
				}

				// get last modified date in isControlling Estimate headers.
				function getQuantityLastModifiedDate(scope, estHeaderIds) {
					// If project has controlling Estimate Header, get quantity last update date;
					var promiseGetQuantityLastModifiedDate = function promiseGetQuantityLastModifiedDate(scope, estHeaderIds) {
						var defer = $q.defer();

						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitemquantity/getlastmodifieddate', estHeaderIds).then(function (response) {
							var dateInfo = response.data;

							if (dateInfo) {
								var lastUpdateLabel = $translate.instant('controlling.structure.lastUpdateAt');
								var noUpdateRecordLabel = $translate.instant('controlling.structure.noUpdateRecord');

								var AQLastModifiedDate = dateInfo.AQLastUpdateDate !== null ? dateInfo.AQLastUpdateDate : noUpdateRecordLabel;
								var IQLastModifiedDate = dateInfo.IQLastUpdateDate !== null ? dateInfo.IQLastUpdateDate : noUpdateRecordLabel;
								var BQLastModifiedDate = dateInfo.BQLastUpdateDate !== null ? dateInfo.BQLastUpdateDate : noUpdateRecordLabel;
								var FQLastModifiedDate = dateInfo.FQLastUpdateDate !== null ? dateInfo.FQLastUpdateDate : noUpdateRecordLabel;

								/* eslint-disable no-tabs */
								scope.entity.updateAQLabel = scope.entity.updateAQLabel + '		(' + lastUpdateLabel + ' : ' + AQLastModifiedDate + ')';
								scope.entity.updateIQLabel = scope.entity.updateIQLabel + '		(' + lastUpdateLabel + ' : ' + IQLastModifiedDate + ')';
								scope.entity.updateBQLabel = scope.entity.updateBQLabel + '		(' + lastUpdateLabel + ' : ' + BQLastModifiedDate + ')';
								scope.entity.updateFQLabel = scope.entity.updateFQLabel + '		(' + lastUpdateLabel + ' : ' + FQLastModifiedDate + ')';
								/* eslint-enable no-tabs */
							}

							defer.resolve();
						});

						return defer.promise;
					};

					return promiseGetQuantityLastModifiedDate(scope, estHeaderIds);
				}

				return service;
			}]);
})(angular);
