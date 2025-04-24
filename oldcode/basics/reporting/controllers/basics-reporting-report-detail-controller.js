/**
 * Created by sandu on 09.06.2015.
 */
(function (angular) {

	'use strict';

	/**
     * @ngdoc controller
     * @name basicsConfigReportGroupDetailController
     * @function
     *
     * @description
     * Controller for the  detail view of reportgroup entities.
     **/
	/* jshint -W072 */
	angular.module('basics.reporting').controller('basicsReportingReportDetailController', basicsReportingReportDetailController);

	basicsReportingReportDetailController.$inject = ['$scope', 'basicsReportingMainReportService', 'platformDetailControllerService', 'basicsReportingReportUIService', 'basicsReportingTranslationService', 'basicsReportingReportValidationService'];

	function basicsReportingReportDetailController($scope, basicsReportingMainReportService, platformDetailControllerService, basicsReportingReportUIService, basicsReportingTranslationService, basicsReportingReportValidationService) {

		platformDetailControllerService.initDetailController($scope, basicsReportingMainReportService, basicsReportingReportValidationService, basicsReportingReportUIService, basicsReportingTranslationService);

	}
})(angular);
