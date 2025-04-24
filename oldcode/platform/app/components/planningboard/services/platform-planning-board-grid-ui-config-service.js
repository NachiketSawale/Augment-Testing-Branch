(function () {
	'use strict';
	angular.module('platform').service('platformPlanningBoardGridUiConfigService', PlatformPlanningBoardGridUiConfigService);
	PlatformPlanningBoardGridUiConfigService.$inject = ['_', '$injector'];

	function PlatformPlanningBoardGridUiConfigService(_, $injector) {
		var self = this;
		var clonedGridConfigurations = {};

		function initGridConfigCopyAsReadonly(serviceName) {
			clonedGridConfigurations[serviceName] = _.map(_.cloneDeep($injector.get(serviceName).getStandardConfigForListView().columns), function (config) {
				config.readonly = true;
				config.editor = null;
				return config;
			});
		}

		self.getSupplierGridConfigService = function getSupplierGridConfigService(supplierGridConfigServiceName) {
			if (!clonedGridConfigurations[supplierGridConfigServiceName]) {
				initGridConfigCopyAsReadonly(supplierGridConfigServiceName);
			}
			return getServiceMock(clonedGridConfigurations[supplierGridConfigServiceName]);
		};

		self.getDemandGridConfigService = function getDemandGridConfigService(demandGridConfigServiceName) {
			if (!clonedGridConfigurations[demandGridConfigServiceName]) {
				initGridConfigCopyAsReadonly(demandGridConfigServiceName);
			}
			return getServiceMock(clonedGridConfigurations[demandGridConfigServiceName]);
		};

		function getServiceMock(data) {
			return {
				addValidationAutomatically: true,
				getStandardConfigForListView: function () {
					return {columns: data};
				}
			};
		}
	}
})(angular);