/**
 * Created by baf on 2018-08-27.
 */
(function (angular) {
	'use strict';
	var moduleName = 'platform';

	angular.module(moduleName).service('platformSourceWindowControllerService', PlatformSourceWindowControllerService);

	PlatformSourceWindowControllerService.$inject = ['_', '$controller', '$injector', 'platformContainerControllerService', 'platformGridAPI', '$timeout'];

	function PlatformSourceWindowControllerService(_, $controller, $injector, platformContainerControllerService, platformGridAPI, $timeout) {
		var self = this;

		this.initSourceFilterController = function initSourceFilterController($scope, uuid, moduleCIS, sourceFS, options) {
			var watchFilter = [];
			var filter = $scope.getContentValue('filter');
			var modCIS = $injector.get(moduleCIS);
			var conf = modCIS.getContainerInfoByGuid(uuid);

			var dataSrv = _.isString(conf.dataServiceName) ? $injector.get(conf.dataServiceName) : conf.dataServiceName;
			var filterSrv = $injector.get(sourceFS);
			var params = filterSrv.createFilterParams(filter, uuid);

			if (angular.isArray(filter)) {
				_.forEach(filter, function (fltr) {
					self.prepareWatchFilter(dataSrv, watchFilter, params, fltr);
				});
			} else {
				self.prepareWatchFilter(dataSrv, watchFilter, params, filter);
			}

			$scope.gridId = uuid;
			$scope.formOptions = {
				configure: params.config
			};
			$scope.entity = params.entity;
			$scope.subcontroller = self.provideSubControllerConstructor($scope, uuid, modCIS, options);

			var unRegister = $scope.$watchGroup(watchFilter, function watchFn(newVal, oldVal) {
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
			$scope.$on('$destroy', unRegister);
		};

		this.provideSubControllerConstructor = function provideSubControllerConstructor($scope, uuid, modCIS, options) {
			return function () {
				PlatformSourceListControllerService.$inject = ['$scope', 'platformContainerControllerService', 'platformGridAPI'];

				function PlatformSourceListControllerService($scope, platformContainerControllerService, platformGridAPI) {

					platformContainerControllerService.initController($scope, modCIS, uuid);

					if (_.get(options, 'afterInitSubController')) {
						options.afterInitSubController($scope);
					}

					var setCellEditable = function () {
						return false;
					};

					platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

					/*
						The form is initialized later than grid.
						If in form two inputs are displayed side by side, then the height of the grid will not be recalculated.
						Therefore this:
						info: 600 we need for Internet Explorer. 300 is okay for chrome and firefox
					 */
					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					}, 600);
				}

				return $controller(PlatformSourceListControllerService,
					{
						$scope: $scope,
						platformContainerControllerService: platformContainerControllerService,
						uuid: $scope.gridId,
						platformGridApi: platformGridAPI
					}).constructor;
			};
		};

		this.prepareWatchFilter = function prepareWatchFilter(dataSrv, watchFilter, params, filter) {
			watchFilter.push('entity.' + filter);
			params.entity[filter] = dataSrv.getSelectedFilter(filter);
		};
	}
})(angular);