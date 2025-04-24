(function (angular) {
	'use strict';
	let moduleName='qto.main';
	// jshint -W072
	angular.module(moduleName).controller('qtoMainHeaderGridController',
		['$scope','platformModalService', '$injector','$translate','platformGridControllerService', 'platformGridControllerService', 'qtoMainHeaderUIStandardService', 'qtoMainHeaderDataService',
			'qtoMainHeaderValidationService', 'procurementCommonHelperService','qtoMainLocationDataService','platformPermissionService',// qtoMainLocationDataService for initial
			function ($scope,platformModalService, $injector,$translate,platformGridControllerService, gridControllerService, gridColumns, qtoMainHeaderDataService, validationService, procurementCommonHelperService, qtoMainLocationDataService,platformPermissionService) {

				let permissionUuid = '7cbac2c0e6f6435aa602a72dccd50881';
				let gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function (arg) {
						let currentItem = arg.item;
						let colId = arg.grid.getColumns()[arg.cell].id;
						if(colId === 'nodecimals'){
							if(currentItem.NoDecimals === '' || currentItem.NoDecimals === 0){
								currentItem.NoDecimals = 3;
							}
						}else if(colId === 'qtotypefk'){
							qtoMainHeaderDataService.getGoniometer(arg.item);
						}
					},
					rowChangeCallBack: function rowChangeCallBack() {
						let selectedLineItem = qtoMainHeaderDataService.getSelected();
						if(selectedLineItem){
							$injector.get('qtoMainCommonService').setLookupWithProjectId(selectedLineItem.ProjectFk);

							$injector.get('qtoMainStrucutrueFilterService').removeFilter('QtoSheets');
							$injector.get('qtoMainStrucutrueFilterService').onFilterMarksChanged.fire(false);
						}
					}
				};

				gridControllerService.initListController($scope, gridColumns, qtoMainHeaderDataService, validationService, gridConfig);

				// update header info
				qtoMainHeaderDataService.setShowHeaderAfterSelectionChanged(function (headerItem) {
					qtoMainHeaderDataService.updateModuleHeaderInfo(headerItem);
				});

				qtoMainHeaderDataService.updateModuleHeaderInfo();

				function setRubricCatagoryReadOnly(){
					let qtoHeader = qtoMainHeaderDataService.getSelected();
					qtoMainHeaderDataService.updateReadOnly(qtoHeader,'BasRubricCategoryFk');
				}

				qtoMainHeaderDataService.setRubricCatagoryReadOnly.register(setRubricCatagoryReadOnly);

				qtoMainHeaderDataService.registerSelectionChanged(setSelectEdHeader);

				function setSelectEdHeader(e, selectItem){
					let qtoMainDetailService =  $injector.get('qtoMainDetailService');
					let qtoMainBoqFilterService = $injector.get('qtoMainBoqFilterService');
					let qtoDetailDataFilterService  = $injector.get('qtoDetailDataFilterService');
					let functionalRoleService = $injector.get('salesCommonFunctionalRoleService');
					
					qtoMainDetailService.filterBillTos = [];
					qtoMainDetailService.filterLocations = [];
					qtoMainDetailService.filterBoqs = [];

					qtoMainBoqFilterService.removeFilter('BillTos',true);
					qtoMainBoqFilterService.removeFilter('Locations',true);
					qtoMainBoqFilterService.removeFilter('BoqItem',true);

					let oldSelectedProject = qtoMainHeaderDataService.getLastProjectId();
					if(selectItem) {
						qtoMainHeaderDataService.setSelectedHeader(selectItem.Id);
						qtoMainHeaderDataService.setSelectProjectId(selectItem.ProjectFk);
						functionalRoleService.handleFunctionalRole(selectItem.OrdHeaderFk);   // handle functional roles for billing methods
					}else{
						qtoMainHeaderDataService.setSelectProjectId(-1);
						functionalRoleService.handleFunctionalRole(null);   // unapply functional role
					}
					qtoMainHeaderDataService.setPreviousProjectId(oldSelectedProject);

					if(qtoMainHeaderDataService.costGroupCatalogService && (oldSelectedProject !== selectItem.ProjectFk || oldSelectedProject === -1)){
						qtoMainHeaderDataService.costGroupCatalogService.loadData();
						qtoMainHeaderDataService.costGroupCatalogService.clearCostGroupStructureList();
					}

					qtoDetailDataFilterService.clearFilter();

					qtoMainDetailService.updateQtoLineToolsOnHeaderSelectedChange.fire();
				}


				$scope.showDocumentProperties = function () {
					let qtoHeader = qtoMainHeaderDataService.getSelected();
					$injector.get('qtoMainPropertiesDialogService').showDialog(qtoHeader);
				};

				let tools = [];
				tools.push({
					id: 'qtoHeaderDocumentProperties',
					caption: $translate.instant('cloud.common.documentProperties'),
					type: 'item',
					iconClass: 'tlb-icons ico-settings-doc',
					fn: $scope.showDocumentProperties,
					disabled: function () {
						let qtoHeader = qtoMainHeaderDataService.getSelected();
						if(!qtoHeader){
							return true;
						}

						if (qtoHeader.IsBackup){
							return true;
						}

						let hasCreate = platformPermissionService.hasCreate(permissionUuid);
						let hasWrite =  platformPermissionService.hasWrite(permissionUuid);
						return !(hasCreate || hasWrite);
					}
				}, {
					id: 't14',
					caption: $translate.instant('qto.main.filterVersionQto'),
					type: 'check',
					value: qtoMainHeaderDataService.getFilterVersion(),
					iconClass: 'tlb-icons ico-filter-current-version',
					fn: function () {
						qtoMainHeaderDataService.setFilterVersion(this.value);
						qtoMainHeaderDataService.load();
					}
				});

				platformGridControllerService.addTools(tools);

				$scope.$on('$destroy', function () {
					qtoMainHeaderDataService.setRubricCatagoryReadOnly.unregister(setRubricCatagoryReadOnly);
					qtoMainHeaderDataService.unregisterSelectionChanged(setSelectEdHeader);
				});
			}]);
})(angular);