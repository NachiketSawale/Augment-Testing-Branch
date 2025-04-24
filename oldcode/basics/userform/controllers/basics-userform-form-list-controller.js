(function () {

	'use strict';
	var moduleName = 'basics.userform';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsUserformListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of userform entities.
	 **/
	angModule.controller('basicsUserformListController',
		['$scope', 'basicsUserformMainService', 'basicsUserformUIStandardService', 'platformGridControllerService', '$translate', 'cloudDesktopSidebarService', 'basicsUserformFormValidationService', 'basicsUserformFiledropExtension', '$timeout', 'platformGridAPI',
			function ($scope, basicsUserformMainService, basicsUserformUIStandardService, platformGridControllerService, $translate, cloudDesktopSidebarService, basicsUserformFormValidationService, filedropExtension, $timeout, platformGridAPI) {

				var myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, basicsUserformUIStandardService, basicsUserformMainService, basicsUserformFormValidationService, myGridConfig);

				// works only on current selected row
				// filedropExtension.addFiledropSupport($scope, basicsUserformMainService);

				// unregister messenger
				$scope.$on('$destroy', function () {
					basicsUserformMainService.unregisterSelectionChanged(selectedItemChanged);
				});

				// region workaround since grid will not be updated when file name was changed

				$scope.selectedItem = null;

				// subscriber of characteristic data item selection changed event
				function selectedItemChanged() {
					$timeout(function () {
						$scope.selectedItem = basicsUserformMainService.getSelected();
					}, 0);
				}

				basicsUserformMainService.registerSelectionChanged(selectedItemChanged);

				$scope.$watch('selectedItem', function (newVal, oldVal) {
					// ignore initial call and row changes!
					if (newVal && oldVal && Object.prototype.hasOwnProperty.call(newVal, 'Id') && Object.prototype.hasOwnProperty.call(oldVal, 'Id') && newVal.Id === oldVal.Id) {
						if (newVal.HtmlTemplateFileName !== oldVal.HtmlTemplateFileName) {
							var gridId = $scope.getContainerUUID();
							platformGridAPI.grids.invalidate(gridId);
							platformGridAPI.grids.refresh(gridId);
							basicsUserformMainService.markCurrentItemAsModified();
						}
					}
				}, true);

				// endregion

				var toolbarItems = [
					{
						id: 't100',
						caption: 'Preview',
						type: 'item',
						cssClass: 'tlb-icons ico-preview-form',
						fn: function () {
							basicsUserformMainService.previewSelectedForm();
						}
					}
				];

				platformGridControllerService.addTools(toolbarItems);

				var init = function () {
				};
				init();

			}
		]);
})();