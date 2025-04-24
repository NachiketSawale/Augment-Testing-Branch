/**
 * Created by aljami on 30.06.2020.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigModuleViewListController
	 * @function
	 *
	 * @description
	 *
	 **/
	angModule.controller('basicsConfigModuleViewListController', basicsConfigModuleViewListController);

	basicsConfigModuleViewListController.$inject = ['$scope',
		'_',
		'$http',
		'basicsConfigModuleViewsService',
		'basicsConfigModuleViewsUIService',
		'basicsConfigModuleViewsValidationService',
		'platformGridControllerService',
		'platformDialogService'];

	function basicsConfigModuleViewListController($scope,
												  _,
												  $http,
												  parentService,
												  uiService,
												  validationService,
												  platformGridControllerService,
												  platformDialogService) {


		var myGridConfig = {initCalled: false, grouping: true, columns: []};

		platformGridControllerService.initListController($scope,
			uiService,
			parentService,
			validationService,
			myGridConfig);

		var reloadContainer = function () {
			parentService.load();
		};

		function displaySuccessMessage() {
			platformDialogService.showMsgBox('basics.config.moduleViews.infoBodyText', 'basics.config.moduleViews.infoDialogHeader', 'info').then(function (res) {
				reloadContainer();
			}, function () {
				reloadContainer();
			});
		}

		var forceResetFn = function () {
			var selectedEntities = parentService.getSelectedEntities();
			if (selectedEntities.length === 0) {
				return;
			}
			var viewIds = _.map(selectedEntities, 'Id');
			var moduleId = selectedEntities[0].Moduleid;
			var requestData = {
				moduleId: moduleId,
				viewIds: viewIds
			};
			$http.post(globals.webApiBaseUrl + 'basics/config/moduleViews/forceReset', requestData).then(function (response) {
				if (response.status === 200) {
					displaySuccessMessage();
				}
			});
		};
		var divider = {
			id: 'd0',
			type: 'divider',
			sort:-3
		};

		var forceResetViewBtn = {
			id: 'forceResetView',
			type: 'item',
			caption: 'basics.config.moduleViews.forceResetButtonTooltip',
			iconClass: 'tlb-icons ico-force-reset',
			sort:-2,
			fn: forceResetFn,
			disabled: function () {
				var selectedItem = parentService.getSelectedEntities();
				return selectedItem.length === 0;
			}
		};

		platformGridControllerService.addTools([forceResetViewBtn, divider]);
		$scope.tools.update();

		parentService.registerSelectedEntitiesChanged(function () {
			$scope.tools.update();
		});
	}
})();