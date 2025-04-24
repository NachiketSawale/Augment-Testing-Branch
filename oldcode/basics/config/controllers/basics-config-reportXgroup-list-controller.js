/**
 * Created by sandu on 28.05.2015.
 */

(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigReportXGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  ReportXGroup list view
	 **/
	angModule.controller('basicsConfigReportXGroupListController', basicsConfigReportXGroupListController);

	basicsConfigReportXGroupListController.$inject = ['$scope', 'basicsConfigReportXGroupService', 'basicsConfigReportXGroupUIService', 'basicsConfigReportXGroupValidationService', 'platformGridControllerService', 'platformGridAPI','$timeout'];

	function basicsConfigReportXGroupListController($scope, ReportXGroupService, ReportXGroupUIService, ReportXGroupValidationService, platformGridControllerService, platformGridAPI, $timeout) {

		var myGridConfig = {initCalled: false, columns: []};
		var toolbarItems = [
			{
				id: 't1',
				caption: 'basics.config.createDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-add',
				fn:  function(){
					ReportXGroupService.processInputDialog().then(function(){
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !ReportXGroupService.hasSelection() || ReportXGroupService.getSelected().Version === 0 || ReportXGroupService.getSelected().AccessRightDescriptor !== null;
				}
			},
			{
				id: 't1',
				caption: 'basics.config.deleteDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-delete',
				fn:  function(){
					ReportXGroupService.processYesNoDialog().then(function(){
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !ReportXGroupService.hasSelection() || ReportXGroupService.getSelected().Version === 0 || ReportXGroupService.getSelected().AccessRightDescriptor === null;
				}
			}
		];
		platformGridControllerService.initListController($scope, ReportXGroupUIService, ReportXGroupService, ReportXGroupValidationService, myGridConfig);
		platformGridControllerService.addTools(toolbarItems);

		var updateTools = function () {
			$timeout($scope.tools.update, 0, true);
		};

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateTools);
		platformGridAPI.events.register($scope.gridId, 'onBeforeCellEditorDestroy', updateTools);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', updateTools);
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeCellEditorDestroy', updateTools);
		});
	}
})();