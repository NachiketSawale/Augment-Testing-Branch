/**
 * Created by lvy on 4/17/2018.
 */
/* global _ */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstanceHeaderParameterListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance header parameter grid.
	 */
	angular.module(moduleName).controller('constructionSystemMainInstanceHeaderParameterListController',
		['$scope', 'platformGridControllerService', 'constructionSystemMainInstanceHeaderParameterUIConfigService',
			'constructionSystemMainInstanceHeaderParameterService', 'constructionSystemMainInstanceHeaderParameterValidationService',
			'basicsLookupdataLookupDescriptorService', 'platformGridAPI', 'basicsUserformCommonService', '$http',
			'constructionSystemCommonParameterErrorFormInputDialog',
			'constructionSystemMasterParameterValidationHelperService', 'constructionSystemMainInstanceService', 'platformNavBarService',
			'constructionSystemMainInstanceHeaderParameterFormatterProcessor', 'platformModuleStateService', '$injector',
			function ($scope, platformGridControllerService, uiConfigService, dataService, validationService,
				basicsLookupdataLookupDescriptorService, platformGridAPI, basicsUserformCommonService, $http,
				errorFormInputDialogService,
				cosParameterValidationHelperService, constructionSystemMainInstanceService, platformNavBarService,
				formatterProcessor, platformModuleStateService, $injector) {
				platformGridControllerService.initListController($scope, uiConfigService, dataService, validationService, {});

				// for sidebar favorite navigate
				var loadCosMainInstanceHeaderParameter = window.setInterval(function () {
					if (dataService.insHeaderId || dataService.insHeaderId === 0) {
						window.clearInterval(loadCosMainInstanceHeaderParameter);
						dataService.load();
					}
				}, 100);
				// dataService.load();

				var originalFn = platformNavBarService.getActionByKey('save').fn;
				platformNavBarService.getActionByKey('save').fn = function () {
					dataService.saveInstanceHeaderParameter();
					var modState = platformModuleStateService.state(dataService.getModule());
					var constructionSystemMainInstanceService = $injector.get('constructionSystemMainInstanceService');
					var instance = constructionSystemMainInstanceService.getSelected();
					modState.modifications.MainItemId = instance.Id;

					if (originalFn) {
						originalFn();
					}
				};
				var instanceHeaderParameterRefreshDisable = false;
				var refreshToolItems = {
					id: 'refresh',
					caption: 'platform.formContainer.refresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					fn: function() {
						refreshViewerPage();
					},
					disabled: function() {
						return instanceHeaderParameterRefreshDisable;
					}
				};
				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools'
				});
				$scope.tools.items.unshift(refreshToolItems);
				const deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 't14';
				});
				$scope.tools.items.splice(deleteBtnIdx, 1);
				// fix null reference error.
				if($scope.tools && _.isFunction($scope.tools.update)){
					$scope.tools.update();
				}
				function refreshViewerPage() {
					instanceHeaderParameterRefreshDisable = true;
					var selectedItem = dataService.getSelected();
					dataService.confirmRefreshNew().then(function(result) {
						if(result.yes){
							dataService.refresh(null,true).then(function(data) {
								dataService.setDescriptionForParameterValue(data.data.cosglobalparamvalue);
								dataService.setCosParameterTypeFkAndIslookup(data.data);
								basicsLookupdataLookupDescriptorService.attachData(data.data || {});
								angular.forEach(data.data.dtos, function(e) {
									formatterProcessor.processItem(e);
								});
								dataService.setList(data.data.dtos);
								if (selectedItem) {
									dataService.setSelected(_.find(data.data.dtos, {Id: selectedItem.Id}));
									dataService.removeModified();
								}
								instanceHeaderParameterRefreshDisable = false;
								// fix null reference error.
								if($scope.tools && _.isFunction($scope.tools.update)){
									$scope.tools.update();
								}
							}, function() {
								instanceHeaderParameterRefreshDisable = false;
								$scope.tools.update();
							});
						} else {
							instanceHeaderParameterRefreshDisable = false;
							$scope.tools.update();
						}
					});

				}

				dataService.registerSelectionChanged(function(){
					// fix null reference error.
					if($scope.tools && _.isFunction($scope.tools.update)){
						$scope.tools.update();
					}
				});
			}
		]);

})(angular);
