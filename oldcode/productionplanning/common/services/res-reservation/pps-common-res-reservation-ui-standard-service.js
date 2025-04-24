/**
 * Created by zwz on 5/21/2018.
 */

/* global angular, _ */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name productionplanningCommonResourceReservationUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of resource entities
	 */

	angular.module(moduleName).factory('productionplanningCommonResourceReservationUIStandardService', UIStdService);

	UIStdService.$inject = ['basicsLookupdataConfigGenerator', 'resourceReservationUIStandardService', 'ppsCopyStandardUIService'];
	function UIStdService(basicsLookupdataConfigGenerator, resourceReservationUIStandardService, ppsCopyStandardUIService) {

		function setRequistionfkConfig(uiStdServ) {
			var requisitionfkLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'productionplanningCommonResourceRequisitionLookupDataService',
				cacheEnable: true,
				additionalColumns: false,
				navigator: {
					moduleName: 'resource.requisition'
				}
			});
			var col = _.find(uiStdServ.getStandardConfigForListView().columns, {id: 'requisitionfk'});
			if (col) {
				col.editorOptions = requisitionfkLookupConfig.grid.editorOptions;
				col.formatterOptions = requisitionfkLookupConfig.grid.formatterOptions;
				col.navigator = requisitionfkLookupConfig.grid.navigator;
			}
			var row = _.find(uiStdServ.getStandardConfigForDetailView().rows, {rid: 'requisitionfk'});
			if (row) {
				row.options = requisitionfkLookupConfig.detail.options;
				row.navigator = requisitionfkLookupConfig.detail.navigator;
				row.directive = requisitionfkLookupConfig.detail.directive;
			}
		}

		var uiStdServ = ppsCopyStandardUIService.copyUISrv(resourceReservationUIStandardService);
		setRequistionfkConfig(uiStdServ);//We need to use a simple lookup for requistionfk field of reservation container in enginering/transport module etc.
		return uiStdServ;

	}
})(angular);

