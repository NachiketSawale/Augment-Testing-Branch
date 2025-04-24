/**
 * Created by sandu on 27.04.2015.
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
	angular.module('basics.config').controller('basicsConfigReportGroupDetailController', basicsConfigReportGroupDetailController);

	basicsConfigReportGroupDetailController.$inject = ['$scope', 'basicsConfigReportGroupService', 'platformDetailControllerService', 'basicsConfigReportGroupUIService', 'basicsConfigTranslationService', 'basicsConfigReportGroupValidationService'];

	function basicsConfigReportGroupDetailController($scope, ReportGroupService, platformDetailControllerService, ReportGroupUIService, basicsConfigTranslationService, ReportGroupValidationService) {

		platformDetailControllerService.initDetailController($scope, ReportGroupService, ReportGroupValidationService, ReportGroupUIService, basicsConfigTranslationService);

	}
})(angular);
