/**
 * Created by sandu on 09.06.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.reporting';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name basicsReportingReportParameterListController
     * @function
     *
     * @description
     * Controller for the  reportParameter list view
     **/
	angModule.controller('basicsReportingReportParameterListController', basicsReportingReportParameterListController);

	basicsReportingReportParameterListController.$inject = ['$scope', 'basicsReportingMainReportService', 'basicsReportingReportParameterUIService', 'basicsReportingReportParameterValidationService', 'platformGridControllerService', 'reportingPlatformService', 'basicsReportingReportParameterService'];

	function basicsReportingReportParameterListController($scope, basicsReportingMainReportService, basicsReportingReportParameterUIService, basicsReportingReportParameterValidationService, platformGridControllerService, reportingPlatformService, basicsReportingReportParameterService) {


		var myGridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, basicsReportingReportParameterUIService, basicsReportingReportParameterService, basicsReportingReportParameterValidationService, myGridConfig);

		var toolbarItems = [
			{
				id: 'defaultx01',
				caption: 'Refresh',
				type: 'item',
				cssClass: 'tlb-icons ico-refresh',
				fn: function () {
					basicsReportingReportParameterService.callParameter();
				}
			}
		];

		platformGridControllerService.addTools(toolbarItems);
	}
})();