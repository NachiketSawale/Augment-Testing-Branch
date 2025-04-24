/**
 * Created by lav on 2/19/2019.
 */
/* global angular, globals */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateTransportRouteDialogService', Service);

	Service.$inject = [
		'$injector', '$translate',
		'transportplanningTransportMainService',
		'platformDataValidationService',
		'transportplanningTransportGoodsTabService',
		'$http',
		'transportplanningTransportCreateRouteDialogUIStandardService',
		'cloudDesktopPinningContextService',
		'cloudDesktopSidebarDateSearchService',
		'cloudDesktopSidebarService',
		'$q',
		'ppsCommonCodGeneratorConstantValue',
		'basicsCompanyNumberGenerationInfoService',
		'platformRuntimeDataService'];

	function Service($injector, $translate,
					 transportMainService,
					 platformDataValidationService,
					 transportGoodsTabService,
					 $http,
					 UIStandardService,
					 cloudDesktopPinningContextService,
					 cloudDesktopSidebarDateSearchService,
					 cloudDesktopSidebarService,
					 $q,
					 ppsCommonCodGeneratorConstantValue,
					 basicsCompanyNumberGenerationInfoService,
					 platformRuntimeDataService) {

		function initialize($scope) {

			var preSelectionSite;

			createNewRoute();

			var getScopeEntity = function () {
				return $scope.entity;
			};
			$scope.formOptions = UIStandardService.getFormOptions(getScopeEntity, !$scope.createWaypointForEachBundle);

			$scope.isOKDisabled = function () {
				return $scope.isBusy || platformDataValidationService.hasErrors(transportMainService) || !transportGoodsTabService.isValid();
			};

			$scope.isShowNext = function () {
				return true;
			};

			$scope.handleOK = function (next) {
				// UIStandardService.validateAll($scope.entity);
				transportGoodsTabService.endEdit();

				if ($scope.isOKDisabled()) {
					return false;
				}
				$scope.isBusy = true;
				var postData = {
					'TrsRoute': $scope.entity,
					'UpdateDateByDeliveryDate': true,
					'CreateWaypointForEachBundle': $scope.createWaypointForEachBundle,
				};
				_.extend(postData, transportGoodsTabService.getResult());

				$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createBySelectedGoods', postData).then(function (result) {
					if (result.data) {
						transportMainService.appendNewItem(result.data);
					}
					if (next) {
						createNewRoute();
					} else {
						$scope.$close(true);
					}
				}, function () {
					$scope.isBusy = false;
				});
			};

			$scope.handleNext = function () {
				$scope.handleOK(true);
			};

			$scope.modalOptions = {
				headerText: $translate.instant('transportplanning.transport.wizard.createTrasnsportRoute'),
				cancel: close
			};

			function close() {
				$scope.$close(false);
			}

			function createNewRoute() {
				$scope.isBusy = true;
				var projectId, jobId, eventTypeFk;
				if ($scope.entity) {
					projectId = $scope.entity.ProjectDefFk;
					jobId = $scope.entity.JobDefFk;
					eventTypeFk = $scope.entity.EventTypeFk;
				} else {
					var pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
					if (pinProjectEntity) {
						projectId = pinProjectEntity.id;
					}
				}
				var postData = {
					'projectId': projectId,
					'jobId': jobId,
					'EventTypeFk': eventTypeFk
				};
				$q.all([
						$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createroute', postData),
						getPreselectionSite()
					]
				).then(function (result) {
					if (result[0] && result[0].data) {
						if($scope.entity) {
							//merge the last value
							result[0].data.ProjectFk = $scope.entity.ProjectFk;
							result[0].data.LgmJobFk = $scope.entity.LgmJobFk;
							result[0].data.PlannedDelivery = $scope.entity.PlannedDelivery;
						}else {
							result[0].data.PlannedDelivery = getPreselectionPlannedDeliveryDate($scope.entity);
						}
						//set code to result[0].data
						var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(result[0].data.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportRoute);
						if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').hasToGenerateForRubricCategory(categoryId) )
						{
							result[0].data.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').provideNumberDefaultText(categoryId);
							platformRuntimeDataService.readonly(result[0].data, [{field: 'Code', readonly: true}]);
						}
						$scope.entity = result[0].data;
						$scope.entity.preSelectionSite = result[1];
						Object.keys($scope.entity).forEach(function (prop) {
							if (prop.endsWith('Fk')) {
								if ($scope.entity[prop] === 0) {
									$scope.entity[prop] = null;
								}
							}
						});

						// initial not nullable property if not set.
						$scope.entity.BasUomFk = $scope.entity.BasUomFk | 0;
						$scope.entity.CalCalendarFk = $scope.entity.CalCalendarFk | 0;
						$scope.entity.DefSrcWaypointJobFk = $scope.entity.DefSrcWaypointJobFk | 0;
						$scope.entity.PpsEventFk = $scope.entity.PpsEventFk | 0;

						$scope.entity.createWaypointForEachBundle = $scope.createWaypointForEachBundle; //set for the preselection filter of product/bnudle

						UIStandardService.updatePlannedDelivery($scope.entity);
						UIStandardService.validateAll($scope.entity);
						transportGoodsTabService.clear();
						$scope.isBusy = false;
					}
				});
			}

			// check if updateEntityAfterAddBundle is already set
			// default is set to true
			$scope.updateEntityAfterAddBundle = (!_.isUndefined($scope.updateEntityAfterAddBundle)) ? $scope.updateEntityAfterAddBundle : true;

			$scope.model = 'CreateNew';
			transportGoodsTabService.initialize($scope);

			function getPreselectionSite() {
				var defer = $q.defer();
				if (_.isUndefined(preSelectionSite)) {
					$http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/getCurrentClientStockSite').then(function (response) {
						if (response) {
							preSelectionSite = response.data;
							defer.resolve(preSelectionSite);
						}
					});
				} else {
					defer.resolve(preSelectionSite);
				}
				return defer.promise;
			}

			function getPreselectionPlannedDeliveryDate(entity) {
				function hasActiveDateSearch() {
					return cloudDesktopSidebarService.currentSearchType === 'google' &&
						cloudDesktopSidebarDateSearchService.currentModule === moduleName &&
						moduleName && cloudDesktopSidebarDateSearchService.selectedParameters.parameters.date &&
						cloudDesktopSidebarDateSearchService.selectedParameters.tab.calendar;
				}

				if (hasActiveDateSearch()) {
					return cloudDesktopSidebarDateSearchService.selectedParameters.parameters.date;
				} else if (!_.isNil(entity)) {
					return entity.PlannedDelivery;
				}
			}

			$scope.$on('$destroy', function () {
				platformDataValidationService.removeDeletedEntityFromErrorList($scope.entity, transportMainService);
				$injector.get('basicsLookupdataLookupDataService').unregisterDataProvider('logisticjobEx');//fixed the crash issue when refresh
				transportGoodsTabService.destroy();
			});
		}

		return {initialize: initialize};
	}
})(angular);
