/**
 * Created by clv on 7/16/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialUpdateMaterialPricesWizardController', basicsMaterialUpdateMaterialPricesController);

	basicsMaterialUpdateMaterialPricesController.$inject = ['$scope', '$translate', 'platformGridAPI',
		'platformTranslateService', 'basicsCommonHeaderColumnCheckboxControllerService', 'basicsMaterialUpdateMaterialPricesWizardService',
		'_', 'platformModalService', 'basicsMaterialMaterialCatalogService', 'basicsMaterialRecordService', 'prcCommonCalculationHelper'];
	function basicsMaterialUpdateMaterialPricesController($scope, $translate, platformGridAPI,
	                         platformTranslateService, basicsCommonHeaderColumnCheckboxControllerService, UpdateMaterialPricesWizardService,
	                         _, platformModalService, basicsMaterialMaterialCatalogService, basicsMaterialRecordService, commonCalculationHelper){
		var priceItemsGridId = '87c664435ffc4146b8ccfc6dba2616df';
		$scope.priceItemsGridConfig = {
			state: priceItemsGridId
		};
		var currentCatalog = basicsMaterialMaterialCatalogService.getSelected();
		var materials = basicsMaterialRecordService.getList() || [];
		var selectedMaterials = basicsMaterialRecordService.getSelectedEntities() || [];
		var selectedCatalogId = selectedMaterials[0]? selectedMaterials[0].MaterialCatalogFk : null;
		var setCatalogId = materials[0]? materials[0].MaterialCatalogFk : null;
		var catalogId = currentCatalog ? currentCatalog.Id : null;

		$scope.initialOptions = {
			radioValue: {
				selectedMaterial: 1,
				material: 2,
				catalog: 3
			},
			radioOption : $scope.modalOptions.option,
			dialogLoading: $scope.modalOptions.step === 1 ? true : false,
			loadingInfo :'loading',
			step: $scope.modalOptions.step,
			//isFromSameCatalog: null,
			//catalogIsInternet: null
			selectedMIsInternet: $scope.modalOptions.selectedMIsInternet,
			setMIsInternet: $scope.modalOptions.setMIsInternet,
			selectedCatalogId: selectedCatalogId,
			setCatalogId: setCatalogId,
			catalogId: catalogId,
			nextStep: nextStep,
			preStep: preStep,
			updateInsert: updateInsert,
			search: search,
			titleText: $translate.instant('basics.material.updatePriceWizard.updateMaterialPriceTitle'),
			fromLabel: $translate.instant('basics.material.updatePriceWizard.fromLabel'),
			quotationLabel: $translate.instant('basics.material.updatePriceWizard.quotationLabel'),
			contractLabel: $translate.instant('basics.material.updatePriceWizard.contractLabel'),
			startLabel: $translate.instant('basics.material.updatePriceWizard.startLabel'),
			endLabel: $translate.instant('basics.material.updatePriceWizard.endLabel'),
			updateInsertToLabel: $translate.instant('basics.material.updatePriceWizard.updateInsertToLabel')
		};

		var gridOptions = {
			tree: true,
			childProp: 'Children',
			indicator: true,
			iconClass: '',
			idProperty: 'Id',
			initialState: 'collapse'
		};

		function nextStep(){

			var modalOptions = UpdateMaterialPricesWizardService.getModalOption();
			modalOptions.step = 2;
			modalOptions.minWidth = '1200px';
			modalOptions.height = '600px';
			modalOptions.option = $scope.initialOptions.radioOption;
			modalOptions.selectedMIsInternet = $scope.initialOptions.selectedMIsInternet;
			modalOptions.setMIsInternet = $scope.initialOptions.setMIsInternet;
			$scope.$close(true);
			platformModalService.showDialog(modalOptions);
		}
		function preStep(){

			var modalOptions = UpdateMaterialPricesWizardService.getModalOption();
			modalOptions.step = 1;
			modalOptions.option = $scope.initialOptions.radioOption;
			modalOptions.selectedMIsInternet = $scope.initialOptions.selectedMIsInternet;
			modalOptions.setMIsInternet = $scope.initialOptions.setMIsInternet;
			$scope.$close(true);
			platformModalService.showDialog(modalOptions);
		}
		$scope.lookupOptions = {
			businessPartner: {
				lookupDirective: 'business-partner-main-business-partner-dialog',
				lookupOptions: {
					showClearButton: true,
					readonly: false
				}
			},
			project: {
				lookupDirective: 'basics-lookup-data-project-project-dialog',
				descriptionMember: 'ProjectName',
				lookupOptions: {
					showClearButton: true,
					readonly: false
				}
			}
		};
		//search filter fields.
		$scope.currentItem = {
			catalogId: $scope.initialOptions.radioOption === 1? $scope.initialOptions.selectedCatalogId : ($scope.initialOptions.radioOption === 2 ? $scope.initialOptions.setCatalogId: $scope.initialOptions.catalogId),
			quoteStatus: [],
			quoteStatusFk: null,
			contractStatus: [],
			contractStatusFk: null,
			quoteStartDate: null,
			quoteEndDate: null,
			contractStartDate: null,
			contractEndDate: null,
			isCheckQuote: true,
			isCheckContract: true,
			priceVersionFk: 0,
			businessPartnerId: null,
			projectId: null
		};
		$scope.entityConfigs = {
			quoteDateConfig: {
				rt$hasError: function(){
                	return $scope.currentItem.quoteStartDate && $scope.currentItem.quoteEndDate && $scope.currentItem.quoteStartDate > $scope.currentItem.quoteEndDate;
				},
        		rt$errorText: function(){
                	// if (flag === 1 && this.rt$hasError()){
                	// 	return $translate.instant('basics.material.updatePriceWizard.startDateError', {field: 'End date'});
					// }else if(flag === 2 && this.rt$hasError()){
                	// 	return $translate.instant('basics.material.updatePriceWizard.endDateError', {field: 'Start date'});
					//}
					if (this.rt$hasError()){
						return $translate.instant('basics.material.updatePriceWizard.DateError', {startDate: 'Start date', endDate: 'End date'});
					}

					return '';
				}
			},
			contractDateConfig: {
				rt$hasError: function(){
					return $scope.currentItem.contractStartDate && $scope.currentItem.contractEndDate && $scope.currentItem.contractStartDate > $scope.currentItem.contractEndDate;
				},
				rt$errorText: function(){
                	// if(flag === 1 && this.rt$hasError()){
					//     return $translate.instant('basics.material.updatePriceWizard.startDateError', {field: 'End date'});
					// }
					// else if(flag===2 && this.rt$hasError()){
					//     return $translate.instant('basics.material.updatePriceWizard.endDateError', {field: 'Start date'});
					// }
					if (this.rt$hasError()){
						return $translate.instant('basics.material.updatePriceWizard.DateError', {startDate: 'Start date', endDate: 'End date'});
					}

					return '';
				}
			}
		};

		function search(){
        	$scope.initialOptions.dialogLoading = true;
			UpdateMaterialPricesWizardService.search(angular.copy($scope.currentItem), gridOptions, priceItemsGridId, $scope.initialOptions.radioOption).then(function(){
				$scope.initialOptions.dialogLoading = false;
			});
		}
		function updateInsert(){ //need priceVersionFk, data
			var data = platformGridAPI.items.data(priceItemsGridId);
			$scope.initialOptions.dialogLoading = true;
			UpdateMaterialPricesWizardService.updateInsert($scope.currentItem.priceVersionFk, data, gridOptions).then(function(data){
				$scope.initialOptions.dialogLoading = false;
				if(data){
					var bodyText = null;
					if(data.failedMaterialCodes && data.failedMaterialCodes.length > 0){
						bodyText = $translate.instant('basics.material.updatePriceWizard.partialUpdated', {p_0: data.failedMaterialCodes.length}) + data.failedMaterialCodes.join(', ');
					}
					else{
						bodyText = $translate.instant('basics.material.updatePriceWizard.allUpdated', {p_0: data.successMaterialCodes.length});
					}
					platformModalService.showMsgBox(bodyText, 'cloud.common.informationDialogHeader', 'info').then(function(){
						$scope.$close();
						UpdateMaterialPricesWizardService.refresh();
					});
				}
			});
		}
		$scope.canUpdateOrInsert = function(){
			var data = platformGridAPI.items.data(priceItemsGridId);
			if(data){
				var len = data.length;
				for(var i=0; i< len; i++) {
					if (_.find(data[i][gridOptions.childProp], {Selected: true})) {
						return true;
					}
				}
			}
			return false;
		};
		$scope.canSearch = function(){
			//return $scope.currentItem.isCheckQuote || $scope.currentItem.isCheckContract;
        	var valid = true;
        	if($scope.currentItem.isCheckQuote){
        		if($scope.entityConfigs.quoteDateConfig.rt$hasError()){
					valid = false;
				}
			}
			if($scope.currentItem.isCheckContract){
				if($scope.entityConfigs.contractDateConfig.rt$hasError()){
					valid = false;
				}
			}

			if(!$scope.currentItem.isCheckQuote && !$scope.currentItem.isCheckContract){
				valid = false;
			}

			return valid;
		};

		//grid's columns
		var priceItemsColumns = [
			{
				id: 'Selected',
				field:'Selected',
				name:'Selected',
				name$tr$:'basics.material.record.selected',
				editor: 'dynamic',
				domain: function(item){
					var domain;
					if(!item.TypeName){
						domain= 'description';
					}else{
						domain = 'boolean';
					}
					return domain;
				},
				formatter: function (row, cell, value, columnDef, dataContext) {
					var template;

					value = dataContext[columnDef.field];
					if(!dataContext.TypeName){
						template = '';
					}else{
						template = '<input type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
					}

					return '<div class="text-center" >' + template + '</div>';
				},
				headerChkbox: false
			},
			{
				id:'Type',
				field:'TypeName',
				name: 'Type',
				name$tr$:'basics.material.record.prcItemFromType',
				formatter:'description',
				readonly:true,
				width: 80
			},
			{
				id: 'Code',
				field: 'Code',
				name: 'Code',
				name$tr$:'cloud.common.entityCode',
				formatter:'code',
				readonly:true,
				width: 80
			},
			{
				id: 'Description',
				field: 'DescriptionInfo.Description',
				name: 'Description',
				name$tr$:'cloud.common.entityDescription',
				formatter:'description',
				readonly:true,
				width: 100
			},
			{
				id: 'UoM',
				field: 'BasUomFk',
				name: 'UoM',
				name$tr$:'cloud.common.entityUoM',
				formatter:'lookup',
				formatterOptions: {
					lookupType: 'UoM',
					displayMember: 'Unit'
				},
				readonly:true,
				width: 80
			},
			{
				id: 'UnitRate',
				field:'PriceListFk',
				name: 'Unit Rate',
				name$tr$:'basics.material.record.UnitRate',
				editor: 'lookup',
				editorOptions : {
					lookupDirective: 'material-update-price-unit-rate-combobox',
					showClearButton: false,
					valueMember: 'Id',
					displayMember: 'Cost'
				},
				formatter: function(row, cell, value, setting, entity){
					//material dialog, item value.
					var field = 'UnitRate';
					return UpdateMaterialPricesWizardService.formatterMoneyType(entity, field);
				},
				validator: validateUnitRate,
				width: 100
			},
			{
				id: 'Variance',
				field: 'Variance',
				name: 'Variance',
				width: 100,
				name$tr$: 'basics.common.variance',
				formatter: 'money',
				readonly: true
			},
			{
				id: 'CurrencyFk',
				field: 'BasCurrencyFk',
				name: 'Currency',
				width: 100,
				name$tr$: 'basics.common.CurrencyFk',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'Currency',
					displayMember: 'Currency'
				}
			},
			{
				id: 'PriceUnit',
				field: 'PriceUnit',
				name: 'Price Unit',
				width: 100,
				name$tr$: 'basics.common.PriceUnit',
				formatter: 'description'
			},
			{
				id: 'UoMUnit',
				field: 'BasUomPriceUnitFk',
				name: 'Price Unit UoM',
				width: 100,
				name$tr$: 'basics.common.PriceUnitUoM',
				formatter: 'lookup',
				formatterOptions:{
					lookupType: 'UoM',
					displayMember: 'Unit'
				}
			},
			{
				id: 'BusinessPartnerFk',
				field: 'BusinessPartnerFk',
				name: 'Business Partner',
				width: 100,
				name$tr$: 'basics.common.BusinessPartner',
				formatter: 'lookup',
				formatterOptions:{
					lookupType: 'BusinessPartner',
					displayMember: 'BusinessPartnerName1'
				}
			},
			{
				id: 'Weighting',
				field: 'Weighting',
				name: 'Weighting',
				width: 100,
				name$tr$: 'basics.common.Weighting',
				formatter: 'integer',
				domain: 'integer',
				editor: 'integer',
				validator: function(entity, value, model){
					var result = {
						apply: true,
						valid: true
					};
					if(value < 0)
					{
						entity[model] = 1;
						result.apply = false;
					}
					return result;
				}
			},{
				id: 'DateAsked',
				field: 'DateAsked',
				name: 'Date Quoted/Ordered',
				width: 100,
				name$tr$: 'basics.material.record.dateQuotedOrOrdered',
				formatter: 'dateutc',
				readonly: true
			}
		];

		initial();
		function initial(){
			if($scope.initialOptions.step === 2){
				initGrid();
			}
			if($scope.initialOptions.step === 1){
				checkCatalog();
			}
		}

		$scope.$watch('initialOptions.radioOption', function(newVal, oldVal){
		    if(newVal !== oldVal){
				checkCatalog();
			}
		});

		function checkCatalog(){
			if($scope.initialOptions.radioOption === 1 || $scope.initialOptions.radioOption === 2){
				$scope.initialOptions.isNotFromSameCatalog = !UpdateMaterialPricesWizardService.checkMaterialsIfSameCatalog($scope.initialOptions.radioOption);

            	if($scope.initialOptions.selectedMIsInternet === undefined && $scope.initialOptions.setMIsInternet === undefined){
					UpdateMaterialPricesWizardService.checkIfInternetCatalog().then(function(response){
                    	if(response && response.data){
							var data = response.data;
							$scope.initialOptions.selectedMIsInternet = data.selectedMaterials;
							$scope.initialOptions.setMIsInternet = data.materialSet;
							$scope.initialOptions.catalogIsInternet = $scope.initialOptions.radioOption === 1 ? data.selectedMaterials: data.materialSet;
							$scope.initialOptions.dialogLoading = false;
						}
					});
				}
				else{
					$scope.initialOptions.catalogIsInternet = $scope.initialOptions.radioOption === 1 ? $scope.initialOptions.selectedMIsInternet: $scope.initialOptions.setMIsInternet;
					$scope.initialOptions.dialogLoading = false;
				}
			}
			else if($scope.initialOptions.radioOption === 3){
				$scope.initialOptions.isNotFromSameCatalog = false;
				$scope.initialOptions.catalogIsInternet = currentCatalog.IsInternetCatalog;
				$scope.initialOptions.dialogLoading = false;
			}
		}

		function initGrid(){
			if(! platformGridAPI.grids.exist(priceItemsGridId)){
				var gridConfig = {
					columns: angular.copy(priceItemsColumns),
					data: [],
					id: priceItemsGridId,
					lazyInit: true,
					options:gridOptions

				};
				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);
			}
			basicsCommonHeaderColumnCheckboxControllerService.setGridId(priceItemsGridId);
		}

		function validateUnitRate(entity){
			var children = entity.Children || [];
			if(children.length > 0){
				_.forEach(children, function(child){
					if(entity.BasCurrencyFk === child.BasCurrencyFk && entity.BasUomFk === child.BasUomFk && entity.PriceUnit === child.PriceUnit){
                    	if(!_.isNaN(child.UnitRate - entity.UnitRate)){
							child.Variance = commonCalculationHelper.round(child.UnitRate - entity.UnitRate);
						}
					}
				});
			}
			platformGridAPI.grids.refresh(priceItemsGridId);

			return true;
		}
	}
})(angular);
