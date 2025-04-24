/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainReplaceResourceService
	 * @function
	 * @requires $q
	 * @description
	 */
	angular.module(moduleName).factory('estimateMainReplaceResourceService', ['$q', '$http', '$injector', 'platformModalService', 'estimateMainReplaceResourceWizardController', 'estimateMainModifyResourceWizardController', 'estimateMainReplaceResourceCommonService',
		'estimateMainLookupService', 'estimateMainWizardContext', 'estimateMainResourceFrom', 'estimateMainResourceType',
		function ($q, $http, $injector, platformModalService, estimateMainReplaceResourceWizardController, estimateMainModifyResourceWizardController, estimateMainReplaceResourceCommonService,
			estimateMainLookupService, estimateMainWizardContext, estimateMainResourceFrom, estimateMainResourceType) {
			let service = {};

			let modalOptions = {
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/replace-resource/estimate-main-replace-resource-wizard.html',
				controller: ['$scope', '$injector', '$timeout', 'estimateMainFilterService', 'cloudDesktopPinningContextService', '$translate', 'platformGridAPI', 'platformContextService', 'basicsLookupdataLookupFilterService', 'estimateMainReplaceResourceUIService', 'estimateMainService', 'estimateMainReplaceResourceCommonService', 'estimateMainReplaceResourceFieldsGridDataService', 'estimateAssembliesFilterService', 'estimateMainResourceFrom', 'estimateMainWizardContext','estimateAssembliesService', 'estimateMainReplaceFunctionType', 'estimateMainResourceType', estimateMainReplaceResourceWizardController],
				backdrop: false,
				windowClass: 'form-modal-dialog',
				width: '700px',
				// height: '650px',
				resizeable: true
			};

			service.showReplaceResourceWizardDialog = function () {
				let q = $q.when();
				if(estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource)
				{
					let selectedResourceItem = $injector.get('estimateAssembliesResourceService').getSelected() || {};
					switch (selectedResourceItem.EstResourceTypeFk){
						case estimateMainResourceType.CostCode:{
							q = estimateMainLookupService.getEstCostCodesTreeForAssemblies();
							break;
						}
						case estimateMainResourceType.Material:{
							q = $injector.get('estimateMainPrjMaterialLookupService').loadPrjMaterialTree(true);
							break;
						}
						case estimateMainResourceType.PlantDissolved:
						case estimateMainResourceType.Plant:{
							q = $injector.get('estimateMainPlantAssemblyDialogService').getAssemblyByIdAsync(selectedResourceItem.EstAssemblyFk, true);
							break;
						}
						case estimateMainResourceType.Assembly:{
							q = $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies();
							break;
						}
					}
				}
				else{
					// will load lookup data into cache first
					let selectedResourceItem = $injector.get('estimateMainResourceService').getSelectedTargetReplacement() || {};
					let estHeaderInfo =  $injector.get('cloudDesktopPinningContextService').getPinningItem('estimate.main');
					let estHeader = !estHeaderInfo ? null : estHeaderInfo.id;

					switch (selectedResourceItem.EstResourceTypeFk){
						case estimateMainResourceType.CostCode:{
							q = estimateMainLookupService.loadPrjCostCodeNEstCostCode(true, estHeader);
							break;
						}
						case estimateMainResourceType.Material:{
							q = $injector.get('estimateMainPrjMaterialLookupService').loadPrjMaterialTree(true);
							break;
						}
						case estimateMainResourceType.PlantDissolved:
						case estimateMainResourceType.Plant:{
							$injector.get('estimateMainPlantAssemblyDialogService').setOptions({});
							q = $injector.get('estimateMainReplaceResourcePlantLookupService').getList();
							break;
						}
						case estimateMainResourceType.Assembly:{
							q = $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies();
							break;
						}
						case estimateMainResourceType.SubItem:{
							if(selectedResourceItem.EstAssemblyFk){
								q = $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies();
							}
							break;
						}
					}
					$injector.get('estimateMainReplaceResourcePlantLookupService').loadUsingPlantIds(estHeader);
				}

				q.then(function () {
					platformModalService.showDialog(modalOptions);
				});
			};

			service.showModifyResourceWizardDialog = function () {
				let modalOptionsCopy = angular.copy(modalOptions);
				// change to modify resource wizard controller
				modalOptionsCopy.controller = ['$scope', '$injector', '$timeout', 'estimateMainFilterService', 'cloudDesktopPinningContextService', '$translate', 'platformGridAPI', 'platformContextService', 'basicsLookupdataLookupFilterService', 'estimateMainReplaceResourceUIService', 'estimateMainService', 'estimateMainReplaceResourceCommonService', 'basicsCommonRuleEditorService', 'platformBulkEditorConfigurationService', 'estimateAssembliesFilterService', 'estimateMainResourceFrom', 'estimateMainWizardContext','estimateAssembliesService', estimateMainModifyResourceWizardController];
				// set up the bulk editor before show dialog
				let permisions = [];
				estimateMainReplaceResourceCommonService.loadUDPColumns();
				permisions.push(estimateMainReplaceResourceCommonService.getAllCharacteristic());
				permisions.push(estimateMainReplaceResourceCommonService.setUpBulkEditor());

				let selectedResourceItem = estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource ?
					$injector.get('estimateAssembliesResourceService').getSelected() || {} : $injector.get('estimateMainResourceService').getSelected() || {};
				let estHeaderInfo =  $injector.get('cloudDesktopPinningContextService').getPinningItem('estimate.main');
				let estHeader = !estHeaderInfo ? null : estHeaderInfo.id;
				let q = selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.CostCode ? estimateMainLookupService.getPrjCostCodesTree(true, estHeader) :
					selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Material ? $injector.get('estimateMainPrjMaterialLookupService').loadPrjMaterialTree(true):
						selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Assembly ? $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies():
							selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.SubItem && selectedResourceItem.EstAssemblyFk > 0 ? $injector.get('estimateMainResourceAssemblyLookupService').reloadAssemblies(): $q.when();

				permisions.push(q);
				$q.all(permisions).then(function () {
					platformModalService.showDialog(modalOptionsCopy);
				});
			};

			service.showInfoDialog = function () {
				platformModalService.showDialog({
					backdrop: false,
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/replace-resource/estimate-main-replace-resource-summary.html',
					width: '20%'
				});
			};

			return service;
		}]);
})();
