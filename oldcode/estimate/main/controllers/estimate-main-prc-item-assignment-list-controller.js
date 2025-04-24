

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainPrcItemAssignmentListController',
		['_','$scope', '$injector', '$translate', 'platformGridAPI', 'platformGridControllerService','estimateMainPrcItemAssignmentListUIService', 'estimateMainService', 'estimateMainPrcItemAssignmentListService','estimateMainPrcItemAssignmentListValidationService','platformDialogService','platformWizardDialogService','estimateMainUpdatePackageBoqWizardService',
			function (_,$scope, $injector, $translate, platformGridAPI, platformGridControllerService, estimateMainPrcItemAssignmentListUIService, estimateMainService,estimateMainPrcItemAssignmentListService,estimateMainPrcItemAssignmentListValidationService,platformDialogService,platformWizardDialogService,estimateMainUpdatePackageBoqWizardService) {

				let gridConfig = {
					initCalled: false,
					columns: [],
					grouping: true,
					marker:false
				};

				platformGridControllerService.initListController($scope, estimateMainPrcItemAssignmentListUIService, estimateMainPrcItemAssignmentListService, estimateMainPrcItemAssignmentListValidationService, gridConfig);
				$scope.tools.items = _.filter($scope.tools.items,function (d) {
					return d.id !=='t14' && d.id !=='t108' && d.id !=='t199';
				});
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				estimateMainPrcItemAssignmentListService.onToolsUpdated.register(disableDeleteButton);
				$scope.setTools = function (tools) {
					if($scope.tools){
						$scope.tools.items = _.filter(tools.items,function (d) {
							return d.id !=='t14' && d.id !=='t108' && d.id !=='t199';
						});
						tools.update = function () {
							tools.version += 1;
						};
						$scope.tools.update();
					}
				};

				$scope.tools.update();
				let _protectContractedPackageItemAssignment = false;   // default
				function getProtectContractedPackageItemAssignment() {
					if(!_protectContractedPackageItemAssignment){
						let basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
						basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(10095).then(function (val) {
							_protectContractedPackageItemAssignment = (val === '1');
						});
					}
				}
				function onSelectedRowsChanged(){
					if(!$scope.tools){
						$scope.updateTools();
					}else {
						_.forEach($scope.tools.items,function (d) {
							if(d.id ==='delete' || d.id ==='t14'){
								d.disabled = function () {
									let selectedItem = estimateMainPrcItemAssignmentListService.getSelected();
									estimateMainPrcItemAssignmentListService.processItem(estimateMainPrcItemAssignmentListService.getLookupData());
									return _protectContractedPackageItemAssignment && selectedItem && (selectedItem.IsPackageStatusContracted || selectedItem.IsContracted);
								};
							}
						});
						$scope.tools.update();
						platformGridAPI.grids.refresh ($scope.gridId);
					}
				}
				getProtectContractedPackageItemAssignment();
				function disableDeleteButton() {
					onSelectedRowsChanged ();
				}

				// tools in summary container
				let updatePackageTools =
					[
						{
							id: 'updatePackageMenu',
							caption: $translate.instant('estimate.main.updatePackageMenu'),
							type: 'dropdown-btn',
							iconClass: 'tlb-icons ico-price-update',
							list: {
								showImages: false,
								activeValue: 'updatePackage',
								items: [
									{
										id: 'updateMaterial',
										type: 'item',
										value: 'updateMaterial',
										caption: 'estimate.main.updateMaterPackage',
										fn: function () {
											OpenWizardUpdateMaterial();
										}
									},
									{
										id: 'updateBoq',
										type: 'item',
										value: 'updateBoq',
										caption: 'estimate.main.updateBoQPackage',
										fn: function () {
											openWizardUpdateBoQ();
										}
									},
								]
							}
						}
					];
				if(!estimateMainService.isReadonly()){
					$scope.addTools(updatePackageTools);
				}
				function OpenWizardUpdateMaterial(){
					let wzConfig = {
						title$tr$: 'estimate.main.updateMaterialPackageWizard.updateMaterialPackage',
						steps: [{
							id: '168ec8eaefad4b98a66194e7a1bee6d5',
							title: 'Select Estimate Scope',
							title$tr$: 'estimate.main.updateMaterialPackageWizard.selectEstimateScope',
							width: '650px',
							height:'300px',
							disallowBack: false,
							disallowNext: false,
							canFinish: false
						},{
							id: 'f3c1633fd1c44ad8acebb9c545396a7d',
							title: 'Update Package',
							title$tr$: 'estimate.main.updateMaterialPackageWizard.updatePackage',
							width: '900px',
							height:'720px',
							disallowBack: false,
							disallowNext: false,
							canFinish: true
						}],
					};
					platformWizardDialogService.translateWizardConfig(wzConfig);
					let obj = {
						selector: {},
						__selectorSettings: {}
					};
					let dlgConfig = {
						id: '299c743f12bc4a2a8118f96547af8725',
						headerText$tr$: 'estimate.main.updateMaterialPackageWizard.updateMaterialPackage',
						templateUrl: globals.appBaseUrl + 'estimate.main/templates/sidebar/wizard/estimate-main-update-material-package-wizard.html',
						resizeable: true,
						width:'650px',
						height:'300px',
						value: {
							wizard: wzConfig,
							entity:obj,
							wizardName: 'wzdlg1'
						}
					};

					return platformDialogService.showDialog(dlgConfig);
				}

				function openWizardUpdateBoQ(){
					let lineItems = estimateMainService.getSelectedEntities();
					let lineItemIds = _.map(lineItems, 'Id');
					let estHeaderId = estimateMainService.getSelectedEstHeaderId();
					if (estHeaderId <= 0) {
						return;
					}
					estimateMainUpdatePackageBoqWizardService.execute({
						selectedIds: lineItemIds,
						filterRequest: estimateMainService.getLastFilter(),
						currentEstHeaderId: estHeaderId
					});
				}

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					estimateMainPrcItemAssignmentListService.onToolsUpdated.unregister(onSelectedRowsChanged);
				});
			}]);

})();
