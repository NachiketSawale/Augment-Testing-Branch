(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingSourceDataServiceFactory
	 * @description provides data services for the source window in scheduling main
	 */
	angular.module(moduleName).service('logisticDispatchingSourcePlantAllocationDataService', LogisticDispatchingSourcePlantAllocationDataService);

	LogisticDispatchingSourcePlantAllocationDataService.$inject = ['_', 'logisticJobPlantAllocationUIStandardService', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingSourcePlantAllocationDataService(_, logisticJobPlantAllocationUIStandardService, logisticDispatchingHeaderDataService) {
		var servData = { };
		servData.service = this;

		function filterControllingUnitByPerformingProject(hdrServ) {
			var sel = hdrServ.getSelected();
			var prj;
			if (sel) {
				prj = sel.PerformingProjectFk;
			}

			return prj;
		}

		function adjustControllingUnitFk(gridLayout) {
			var col = _.find(gridLayout.columns, function(item) {
				return item.id === 'controllingunitfk';
			});
			col.editorOptions.lookupOptions.filter = function() {
				return filterControllingUnitByPerformingProject(logisticDispatchingHeaderDataService);
			};
			col.formatterOptions.filter = function() {
				return filterControllingUnitByPerformingProject(logisticDispatchingHeaderDataService);
			};
		}

		(function createDataService(serviceData) {
			var dtoScheme = logisticJobPlantAllocationUIStandardService.getDtoScheme();
			serviceData.detailLayout = _.cloneDeep(logisticJobPlantAllocationUIStandardService.getStandardConfigForDetailView());
			serviceData.gridLayout = _.cloneDeep(logisticJobPlantAllocationUIStandardService.getStandardConfigForListView());

			adjustControllingUnitFk(serviceData.gridLayout);

			serviceData.service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
				return servData.detailLayout;
			};

			serviceData.service.getStandardConfigForListView = function getStandardConfigForListView() {
				return servData.gridLayout;
			};

			serviceData.service.getDtoScheme = function () {
				return dtoScheme;
			};

		})(servData);
	}
})(angular);
