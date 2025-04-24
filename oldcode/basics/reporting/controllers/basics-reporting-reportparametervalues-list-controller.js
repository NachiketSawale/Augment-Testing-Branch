/**
 * Created by sandu on 09.06.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.reporting';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name basicsReportingReportParameterValuesListController
     * @function
     *
     * @description
     * Controller for the  ReportParameterValues list view
     **/
	angModule.controller('basicsReportingReportParameterValuesListController', basicsReportingReportParameterValuesListController);

	basicsReportingReportParameterValuesListController.$inject = ['$scope', 'basicsReportingReportParameterValuesService', 'basicsReportingReportParameterValuesUIService', 'basicsReportingReportParameterValuesValidationService', 'platformGridControllerService'];

	function basicsReportingReportParameterValuesListController($scope, ReportParameterValuesService, ReportParameterValuesUIService, ReportParameterValuesValidationService, platformGridControllerService) {

		var myGridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, ReportParameterValuesUIService, ReportParameterValuesService, ReportParameterValuesValidationService, myGridConfig);

	}
})();