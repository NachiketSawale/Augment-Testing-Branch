(function (angular) {
	'use strict';

	angular.module('platform').controller('infoBarController', infoBarController);

	infoBarController.$inject = ['_', '$scope', 'infoBarService', 'genericWizardService'];

	function infoBarController(_, $scope, infoBarService, genericWizardService) {
		$scope.info = infoBarService.getInfo();

		$scope.$watch(function () {
			return $scope.info;
		}, function (info) {
			if (_.isArray(info) && !_.isEmpty(info)) {
				watchFunction(info[0]);
			}
		}, true);

		function watchFunction(info) {
			if (_.isArray($scope.config) && !_.isEmpty($scope.config)) {
				var config = _.find($scope.config, function (conf) {
					return info.stepFk === conf.wzData;
				});

				if (config) {
					var indexToOverride = _.findIndex(config.headerInfos, function (headerInfo) {
						return headerInfo.uuid === info.uuid;
					});
					if (indexToOverride > -1) {
						config.headerInfos[indexToOverride] = info;
					} else {
						config.headerInfos.push(info);
					}

					var entityList = [];
					_.forEach(config.headerInfos, function (header) {
						header.filterFn = header.filterFn ? header.filterFn : function (list) {
							return list;
						};
						_.forEach(header.filterFn(header.list), function (entity) {
							entityList.push(entity);
						});
					});
					entityList = _.uniq(entityList, 'Id');

					config.entityCount = entityList.length;
				}
			}
		}

		var destroyWatch = $scope.$watch(function () {
			return $scope.steps;
		}, function (headerList) {
			if (_.isArray(headerList) && !_.isEmpty(headerList)) {
				$scope.config = [];
				_.forEach(headerList, function (header) {
					if (!genericWizardService.getStepById(header.wzData).Instance.IsHidden) {
						header.headerInfos = [];
						header.entityCount = 0;
						$scope.config.push(header);
					}
				});
				destroyWatch();
			}
		});

		$scope.$on('$destroy', function () {
			infoBarService.reset();
		});
	}
})(angular);