/**
 * Created by sandu on 09.06.2015.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.reporting';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsReportingReportListController
	 * @function
	 *
	 * @description
	 * Controller for the  report list view
	 **/
	angModule.controller('basicsReportingReportListController', basicsReportingReportListController);

	basicsReportingReportListController.$inject = ['$scope', 'basicsReportingMainReportService', 'basicsReportingReportUIService',
		'basicsReportingReportValidationService', 'platformGridControllerService', 'basicsReportingDownloadService', 'platformContextService'];

	/* jshint -W072 */
	function basicsReportingReportListController($scope, basicsReportingReportService, basicsReportingReportUIService, basicsReportingReportValidationService, platformGridControllerService, basicsReportingDownloadService, platformContextService) {

		var myGridConfig = {initCalled: false, columns: []};

		$scope.modalOptions = {
			templateUrl: 'basics.reporting/templates/reporting-folder-structure-template.html',
			controller: 'basicsReportingDialogController',
			width: 325
		};

		$scope.setReport = function () {
			$scope.addReportClick();
		};

		var toolbarItems = [{
			id: 't1',
			caption: 'Upload',
			type: 'item',
			cssClass: 'tlb-icons ico-upload',
			permission: '#w',
			fn: $scope.setReport,
			disabled: function () {
				if(!basicsReportingReportService.hasSelection()) {
					return true;
				}

				if(platformContextService.getCurrentUserId() === 1) {
					//return false;
					return !(_.isNil(basicsReportingReportService.getSelected().FilePath) || !basicsReportingReportService.getSelected().FilePath.startsWith('system'));
				} else {
					return !(_.isNil(basicsReportingReportService.getSelected().FilePath) || !basicsReportingReportService.getSelected().FilePath.startsWith('system'));
				}
			}
		}, {
			id: 't2',
			caption: 'Download',
			type: 'item',
			cssClass: 'tlb-icons ico-download',
			permission: '#r',
			fn: function () {
				var selectedReport = basicsReportingReportService.getSelected();
				var fileInfo = {
					FileName: selectedReport.FileName,
					FilePath: selectedReport.FilePath
				};
				basicsReportingDownloadService.downloadReport(fileInfo);
			},
			disabled: function () {
				return !basicsReportingReportService.hasSelection();
			}
		}];

		platformGridControllerService.initListController($scope, basicsReportingReportUIService, basicsReportingReportService,
			basicsReportingReportValidationService, myGridConfig);

		myGridConfig.rowChangeCallBack = function() {
			if ($scope.tools && _.isFunction($scope.tools.refresh)) {
				$scope.tools.refresh();
			}
		};

		platformGridControllerService.addTools(toolbarItems);
	}

})(angular);
