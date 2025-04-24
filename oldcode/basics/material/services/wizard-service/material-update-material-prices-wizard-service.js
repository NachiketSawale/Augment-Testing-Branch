/**
 * Created by clv on 7/16/2018.
 */
(function(angular){


	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialUpdateMaterialPricesWizardService',basicsMaterialUpdateMaterialPricesWizardService);

	basicsMaterialUpdateMaterialPricesWizardService.$inject = ['$http', 'moment', 'globals', 'basicsMaterialMaterialCatalogService', 'platformGridAPI',
		'platformRuntimeDataService', '_', 'basicsMaterialRecordService', 'basicsMaterialMaterialGroupsService',
		'platformContextService', 'platformLanguageService','platformDomainService', 'accounting', 'platformModalService', 'prcCommonCalculationHelper'];
	function basicsMaterialUpdateMaterialPricesWizardService($http, moment, globals, basicsMaterialMaterialCatalogService, platformGridAPI,
	                                                         platformRuntimeDataService, _, basicsMaterialRecordService, materialGroupsService,
		platformContextService, platformLanguageService, platformDomainService, accounting, platformModalService, commonCalculationHelper){

		var service = {};
		var urlRoot = globals.webApiBaseUrl;
		service.dataProcessor = dataProcessor;
		//service.setMaterialCatalog = setMaterialCatalog;
		service.search = search;
		service.updateInsert = updateInsert;
		service.formatterMoneyType = formatterMoneyType;
		service.initialModalOption = initialModalOption;
		service.refresh = refresh;
		service.getModalOption = getModalOption;
		service.checkMaterialsIfSameCatalog = checkMaterialsIfSameCatalog;
		service.checkIfInternetCatalog = checkIfInternetCatalog;

		return service;

		function search(currentItem, options, gridId, radioOption){
			return basicsMaterialRecordService.updateAndExecute(function () {

				var selectedCatalog = basicsMaterialMaterialCatalogService.getSelected();
				var selectedMaterials = basicsMaterialRecordService.getSelectedEntities() || [];
				var materialSet = basicsMaterialRecordService.getList() || [];

				return $http.post(urlRoot + 'basics/material/wizard/updatematerialprice/getfromquoteorcontract',
					{
						MaterialCatalogId: selectedCatalog ? selectedCatalog.Id: null,
						QuoteStatusIds: currentItem.quoteStatus,
						ContractStatusIds: currentItem.contractStatus,
						QuoteStartDate: currentItem.quoteStartDate,
						QuoteEndDate: currentItem.quoteEndDate,
						ContractStartDate: currentItem.contractStartDate,
						ContractEndDate: currentItem.contractEndDate,
						IsCheckQuote: currentItem.isCheckQuote,
						IsCheckContract: currentItem.isCheckContract,
						Option: radioOption,
						BusinessPartnerId: currentItem.businessPartnerId,
						ProjectId: currentItem.projectId,
						materials: radioOption === 1? selectedMaterials: (radioOption === 2? materialSet: [])

					}).then(function (response) {
					var data = response && response.data || [];
					if(data.length === 0){
						var noItems = 'basics.material.updatePriceWizard.noItemsFound';
						var headerTitle = 'cloud.common.informationDialogHeader';
						platformModalService.showMsgBox(noItems, headerTitle, 'info');
					}
					dataProcessor(data, options.childProp);
					platformGridAPI.grids.invalidate(gridId);
					platformGridAPI.items.data(gridId, data);
				});
			});
		}

		function dataProcessor(list, childProp){
			if(!list.length){
				return;
			}
			for(var i = 0; i< list.length; i++){
				var item = list[i];
				platformRuntimeDataService.readonly(item, [{field: 'Selected', readonly: true}, {field: 'Weighting', readonly: true}]);
				var children = item[childProp];
				var len = children && children.length;
				if(len){
					for(var j = 0; j < len; j++){
						var child = children[j];
						if(item.BasCurrencyFk === child.BasCurrencyFk && item.BasUomFk === child.BasUomFk && item.PriceUnit === child.PriceUnit){
							if(!_.isNaN(child.UnitRate - item.UnitRate)) {
								child.Variance = commonCalculationHelper.round(child.UnitRate - item.UnitRate);
							}
						}
						if(child.DateAsked){
							child.DateAsked=moment.utc(child.DateAsked);
						}
						child.image = 'tlb-icons ico-preview-form';
						platformRuntimeDataService.readonly(child, [{field: 'PriceListFk', readonly: true}]);
					}
				}
			}
		}
		function updateInsert(versionFk, dataList, options){
			var list = [];
			var copyList = angular.copy(dataList);
			copyList.forEach(function(item){
				if(_.find(item[options.childProp], {Selected: true})) {
					item[options.childProp] = _.filter(item[options.childProp], {Selected: true});
					list.push(item);
				}
			});
			var request = {
				PriceVersionFk: versionFk,
				Materials: list
			};
			return $http.post(urlRoot+ 'basics/material/wizard/updatematerialprice/updateinsert', request).then(function(response){
				var data = response.data;
				if(data.materialUpdateCount || data.priceListInsertCount || data.priceListUpdateCount){
					basicsMaterialRecordService.refresh();// using refresh may be better than load.
				}
				return data;
			});
		}

		function formatterMoneyType( entity, field){

			var culture = platformContextService.culture(),
				cultureInfo = platformLanguageService.getLanguageInfo(culture),
				domainInfo = platformDomainService.loadDomain('money');
			var displayValue = entity[field];
			if (_.isNumber(displayValue)) {
				return accounting.formatNumber(displayValue, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
			}
			else {
				return displayValue;
			}
		}

		function initialModalOption(){

			var currentCatalog = basicsMaterialMaterialCatalogService.getSelected();
			var groups = materialGroupsService.getList() || [];
			var materials = basicsMaterialRecordService.getList() || [];
			var selectedMaterials = basicsMaterialRecordService.getSelectedEntities() || [];

			if(!currentCatalog && materials.length === 0 && selectedMaterials.length === 0){
				return platformModalService.showMsgBox('basics.material.updatePriceWizard.updateMaterialPriceNoMaterialCatalog', 'cloud.common.informationDialogHeader', 'info');
			}
			else if(currentCatalog && currentCatalog.IsInternetCatalog && materials.length === 0 && selectedMaterials.length === 0){
				return platformModalService.showMsgBox('basics.material.updatePriceWizard.cannotUpdateInternetMaterial', 'cloud.common.informationDialogHeader', 'info');
			}
			else{
            	//Only materials from same catalog can be processed. Please refine the selection
            	//has selected material.
				var modalOptions = getModalOption();
            	var option = 1;
				if(selectedMaterials.length <= 0){
            		//has material records.
            		option = 2;
            		if(materials.length <= 0){
            			//has selected catalog and has material groups.
            			option = 3;
            			if(groups.length <= 0){
							return platformModalService.showMsgBox('basics.material.updatePriceWizard.noMaterials', 'cloud.common.informationDialogHeader', 'info');
						}else{
            				return $http.get(urlRoot + 'basics/material/wizard/updatematerialprice/hasmaterialincatalog?catalogId=' + currentCatalog.Id).then(function(response){
            					if(response && response.data){
									modalOptions.option = option;
            						return platformModalService.showDialog(modalOptions);
								}else{
									return platformModalService.showMsgBox('basics.material.updatePriceWizard.noMaterials', 'cloud.common.informationDialogHeader', 'info');
								}
							});
						}
					}
				}
				modalOptions.option = option;
				platformModalService.showDialog(modalOptions);
			}
		}

		function getModalOption(){
			return {
				headerTextKey: 'basics.material.updatePriceWizard.updateMaterialPriceTitle',
				templateUrl: globals.appBaseUrl + 'basics.material/templates/wizards/material-update-material-prices-wizard.html',
				resizeable: true,
				minWidth: '600px',
				height: '400px',
				windowClass: 'form-modal-dialog',
				showCancelButton: true,
				step: 1
			};
		}

		function refresh(){
			basicsMaterialRecordService.refresh();
		}

		function checkMaterialsIfSameCatalog(option){

			var selectedMaterials = basicsMaterialRecordService.getSelectedEntities() || [];
			var materialsSet = basicsMaterialRecordService.getList() || [];
			if((option === 1 && selectedMaterials.length <= 1) || (option === 2 && materialsSet.length <= 1)){
				return true;
			}
			else{
				var flag = true;
				if(option === 1){
					var ids = selectedMaterials.map(function(item) {
						return item.MaterialCatalogFk;
					});
					var differentIds = _.difference(ids, [ids[0]]) || [];
					if(differentIds.length > 0){
						flag = false;
					}
				}
				else if(option === 2){
					var materialsSetIds = materialsSet.map(function(item) {
						return item.MaterialCatalogFk;
					});
					var materialIds = _.difference(materialsSetIds, [materialsSetIds[0]]) || [];
					if(materialIds.length > 0){
						flag = false;
					}
				}

				return flag;
			}
		}

		function checkIfInternetCatalog(){
			var selectedMaterials = basicsMaterialRecordService.getSelectedEntities();
			var materialSet = basicsMaterialRecordService.getList();
			return $http.post(urlRoot + 'basics/material/wizard/updatematerialprice/checkifinternetcatalog', {
				SelectedMaterials: selectedMaterials,
            	MaterialResultSet: materialSet
			});
		}
	}
})(angular);