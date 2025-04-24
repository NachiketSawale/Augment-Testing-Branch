// /clv
(function(angular){

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).controller('procurementPesCreateDeltaPesWizardController', procurementPesCreateDeltaPesWizardController);
	procurementPesCreateDeltaPesWizardController.$inject = ['$scope', 'platformGridAPI', 'moment', 'procurementPesHeaderService', 'platformTranslateService', 'procurementPesCreateDeltaPesWizardService', 'basicsCommonHeaderColumnCheckboxControllerService',
		'prcGetIsCalculateOverGrossService'];

	function procurementPesCreateDeltaPesWizardController($scope, platformGridAPI, moment, procurementPesHeaderService, platformTranslateService, createDeltaPesWizardService, basicsCommonHeaderColumnCheckboxControllerService,
		prcGetIsCalculateOverGrossService){

		var pesItemGridId = 'ba4127f3aa54448cae22c30e9e42f97c';
		var isGrossMode = false;
		$scope.lookupOptions = {
			materialPriceList: {
				lookupType: 'pricelist',
				lookupModuleQualifier: 'basics.customize.pricelist',
				displayMember: 'Description',
				valueMember: 'Id',
				showClearButton: false,
				lookupSimpleLookup: true
			},
			validDateOptions: {
				required: true
			}
		};

		var priceListId = $scope.modalOptions.mdcPriceListId || null;
		$scope.models = {
			mdcPriceListEntity:{
				Id: priceListId
			},
			validDate: moment(createDeltaPesWizardService.getLastDateOfLastMonth()),
			dialogLoading: false,
			noteStr: noteStrFnc($scope.modalOptions.data) // maybe should use a function to do this kind of case.
		};

		$scope.methods = {

			create: createBtn,
			reloadPesItem: reloadPesItemBtn,
			okBtnDisabled: okBtnDisabled
		};

		$scope.pesItemGridOption = {
			state: pesItemGridId
		};

		initGrid();

		function noteStrFnc(data){

			var noteString = null;
			if(!data){
				noteString = 'procurement.common.noItemsFound';
				return noteString;
			}
			if(data.allNoStock){
				noteString = 'procurement.common.noPesItemWithStock';
			}else if(data.hasNoStock){
				noteString = 'procurement.common.somePesItemsWithoutStock';
			}else if(data.isNotAll || !data.items || !data.items.length){
				noteString = 'procurement.common.noItemsFound';
			}

			return noteString;
		}
		/*
		* */
		function initGrid(){

			var pesItemGrids = [
				{
					id: 'selected',
					field:'Selected',
					name:'Selected',
					name$tr$:'basics.material.record.selected',
					editor: 'boolean',
					domain: 'boolean',
					formatter: 'boolean',
					width: 80,
					headerChkbox: true
				},
				{
					id: 'itemNo',
					field: 'ItemNo',
					name: 'Item No.',
					name$tr$:'procurement.pes.entityItemNo',
					formatter:'code',
					readonly:true,
					width: 80
				},
				{
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$:'cloud.common.entityDescription',
					formatter:'description',
					readonly:true,
					width: 100
				},
				{
					id:'mdcMaterialNo',
					field:'MdcMaterialNo',
					name: 'Material No.',
					name$tr$:'procurement.common.prcItemMaterialNo',
					formatter:'description',
					readonly: true,
					width: 80
				},
				{
					id: 'basUomFk',
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
					id: 'basCurrencyFk',
					field: 'BasCurrencyFk',
					name: 'Currency',
					name$tr$: 'cloud.common.entityCurrency',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'currency',
						displayMember: 'Currency'
					},
					readonly: true,
					width: 100
				}
			];

			isGrossMode = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
			if (isGrossMode) {
				var grossModeFields = [
					{
						id: 'recordedPriceGross',
						field: 'RecordedPriceGross',
						name: 'Recorded Price Gross',
						name$tr$: 'procurement.common.entityRecordedPriceGross',
						formatter: 'money',
						width: 100
					},
					{
						id: 'latestPriceGross',
						field: 'LatestPriceGross',
						name: 'Latest Price Gross',
						name$tr$: 'procurement.common.entityLatestPriceGross',
						formatter: 'money',
						domain: 'money',
						editor: 'money',
						validator: latestPriceGrossValidator,
						width: 100
					},
					{
						id: 'varianceGross',
						field: 'VarianceGross',
						name: 'Variance Gross',
						name$tr$: 'procurement.common.varianceGross',
						formatter: 'money',
						readonly: true,
						width: 100
					}];
				pesItemGrids.splice(4, 0, grossModeFields[0], grossModeFields[1], grossModeFields[2]);
			}
			else {
				var netModeFields = [
					{
						id: 'recordedPrice',
						field: 'RecordedPrice',
						name: 'Recorded Price',
						name$tr$: 'procurement.common.entityRecordedPrice',
						formatter: 'money',
						width: 100
					},
					{
						id: 'latestPrice',
						field: 'LatestPrice',
						name: 'Latest Price',
						name$tr$: 'procurement.common.entityLatestPrice',
						formatter: 'money',
						domain: 'money',
						editor: 'money',
						validator: latestPriceValidator,
						width: 100
					},
					{
						id: 'variance',
						field: 'Variance',
						name: 'Variance',
						name$tr$: 'procurement.common.variance',
						formatter: 'money',
						readonly: true,
						width: 100
					}];
				pesItemGrids.splice(4, 0, netModeFields[0], netModeFields[1], netModeFields[2]);
			}

			var pesItemGridOptions = {
				tree: false,
				indicator: true,
				iconClass: '',
				idProperty: 'Id'
			};

			if(! platformGridAPI.grids.exist(pesItemGridId)){
				var gridConfig = {
					columns: angular.copy(pesItemGrids),
					data: $scope.modalOptions.items || [],
					id: pesItemGridId,
					lazyInit: true,
					options:pesItemGridOptions
				};
				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);

				basicsCommonHeaderColumnCheckboxControllerService.setGridId(pesItemGridId);
			}
		}


		/*
		* validate latest price.
		* */
		function latestPriceValidator(entity, value){
			var result = {
				apply: true,
				valid: true
			};
			if(value === undefined || value === ''){
				value = null;
			}
			if(value !== null){
				entity.Variance = value - entity.RecordedPrice;
			}else{

				entity.Variance = null;
			}

			return result;
		}

		function latestPriceGrossValidator(entity, value){
			var result = {
				apply: true,
				valid: true
			};
			if(value === undefined || value === ''){
				value = null;
			}
			if(value !== null){

				entity.VarianceGross = value - entity.RecordedPriceGross;
			}else{

				entity.VarianceGross = null;
			}

			return result;
		}

		/*
		* */
		function reloadPesItemBtn(){

			$scope.models.dialogLoading = true;
			var pesHeader = procurementPesHeaderService.getSelected();
			var priceListId = $scope.models.mdcPriceListEntity && $scope.models.mdcPriceListEntity.Id || -1;
			var validDate = $scope.models.validDate;

			if(pesHeader){

				var promise = createDeltaPesWizardService.loadMixedPesItem(false, validDate, priceListId);
				if(promise && angular.isFunction(promise.then)){

					promise.then(function(response){
						var items = ( response && response.data && response.data.items) || [];
						platformGridAPI.items.data(pesItemGridId, items);
						$scope.models.dialogLoading = false;
						$scope.models.noteStr = noteStrFnc(response && response.data);
					});
				}else{
					platformGridAPI.items.data(pesItemGridId, []);
					$scope.models.dialogLoading = false;
					$scope.models.noteStr = noteStrFnc(null);
				}
			}
		}

		/*
		* */
		function createBtn(){

			$scope.models.dialogLoading = true;
			var checkedPesItems = getCheckedPesItems();
			var promise = createDeltaPesWizardService.createDeltaPes(checkedPesItems || [], isGrossMode);
			if(promise && angular.isFunction(promise.then)) {

				promise.then(function (response) {
					$scope.models.dialogLoading = false;
					var deltaPes = response && response.data;
					if(deltaPes){
						createDeltaPesWizardService.showMsgAfterCreated(deltaPes).then(function(){
							$scope.$close();
							procurementPesHeaderService.handlePesCreatedSucceeded(deltaPes);
						});
					}
				});
			}else {
				// do something.
				$scope.models.dialogLoading = false;
			}
		}

		/*
		* */
		function okBtnDisabled(){

			var checkedPesItems = getCheckedPesItems();
			if(!checkedPesItems || checkedPesItems.length === 0){
				return true;
			}
			var disabled = true;
			angular.forEach(checkedPesItems, function(item){
				if (isGrossMode) {
					if(item.VarianceGross !== 0 && item.VarianceGross !== null && item.VarianceGross !== undefined && item.Selected === true){
						disabled = false;
					}
				}
				else {
					if(item.Variance !== 0 && item.Variance !== null && item.Variance !== undefined && item.Selected === true){
						disabled = false;
					}
				}
			});

			return disabled;
		}

		/*
		* */
		function getCheckedPesItems(){

			var pesItems = platformGridAPI.items.data(pesItemGridId);
			var checkedPesItems = [];

			angular.forEach(pesItems, function(item){
				if(item.Selected){
					checkedPesItems.push(item);
				}
			});

			return checkedPesItems;
		}
		$scope.$on('$destroy', function(){
			if (platformGridAPI.grids.exist(pesItemGridId)) {
				platformGridAPI.grids.unregister(pesItemGridId);
			}
		});
	}

})(angular);