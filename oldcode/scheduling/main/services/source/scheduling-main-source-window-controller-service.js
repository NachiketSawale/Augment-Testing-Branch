/**
 * Created by leo on 15.02.2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';
	var modelMainModule = angular.module(moduleName);

	modelMainModule.factory('schedulingMainSourceWindowControllerService', ['_', 'platformContainerControllerService', '$controller', '$injector', 'platformGridAPI',
		function (_, platformContainerControllerService, $controller, $injector, platformGridAPI) {
			var service = {};

			service.initSourceFilterController = function ($scope, uuid) {
				var watchFilter = [];
				var filter = $scope.getContentValue('filter');
				var info = $injector.get('schedulingMainContainerInformationService');
				var conf = info.getContainerInfoByGuid(uuid);

				var dataSrv = conf.dataServiceName;
				var filterSrv = $injector.get('schedulingMainSourceFilterService');
				var params = filterSrv.createFilterParams(filter, uuid);

				if (angular.isArray(filter)) {
					for (var i = 0; i < filter.length; i++) {
						watchFilter.push('entity.' + filter[i]);
						params.entity[filter[i]] = dataSrv.getSelectedFilter(filter[i]);
					}
				} else {
					watchFilter.push('entity.' + filter);
					params.entity[filter] = dataSrv.getSelectedFilter(filter);
				}
				$scope.gridId = uuid;
				$scope.formOptions = {
					configure: params.config
				};
				$scope.entity = params.entity;
				$scope.subcontroller = function () {
					SchedulingMainSourceListControllerService.$inject = ['$scope', 'platformContainerControllerService', 'uuid', 'platformGridAPI', 'editable'];
					function SchedulingMainSourceListControllerService($scope, platformContainerControllerService, uuid, platformGridAPI, editable) {

						platformContainerControllerService.initController($scope, moduleName, uuid);
						let setCellEditable = function () {
							return editable;
						};

						platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
					}

					return $controller(SchedulingMainSourceListControllerService,
						{
							'$scope': $scope,
							'platformContainerControllerService': platformContainerControllerService,
							'uuid': $scope.gridId,
							'platformGridApi': platformGridAPI,
							'editable': conf.templInfo && conf.templInfo.editable ?  conf.templInfo.editable : false
						}).constructor;
				};

				var unregister = $scope.$watchGroup(watchFilter, function watchfn(newVal, oldVal) {
					if (!_.isUndefined(newVal) && newVal !== oldVal) {
						if (angular.isArray(filter)) {
							for (var i = 0; i < filter.length; i++) {
								if (newVal[i] !== oldVal[i]) {
									dataSrv.setSelectedFilter(filter[i], $scope.entity[filter[i]], filter);
								}
							}
						} else {
							dataSrv.setSelectedFilter(filter, $scope.entity[filter], filter);
						}
					}
				});
				var setEntity = function setEntity(entityName,value) {
					$scope.entity[entityName] = value;
				};
				dataSrv.registerFilterSetter(setEntity);
				$scope.$on('$destroy', function () {
					unregister();
					dataSrv.unRegisterFilterSetter();
				});
			};
			return service;
		}]);
})(angular);
