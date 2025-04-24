/**
 * Created by xai on 4/19/2018.
 */
(function () {

	'use strict';
	var moduleName = 'basics.materialcatalog';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsMaterialcatalogSyncCatalogSelectionController',
		['_', '$scope', '$translate', 'platformTranslateService','platformGridAPI','platformModalService','cloudCommonLanguageService','platformContextService','$http','globals','materialcatalogSyncFromYtwoService','basicsCommonHeaderColumnCheckboxControllerService',
			function (_, $scope, $translate, platformTranslateService,platformGridAPI,platformModalService,cloudCommonLanguageService,platformContextService,$http,globals,materialcatalogSyncFromYtwoService,basicsCommonHeaderColumnCheckboxControllerService) {
				var headerData=[],validateData=[];
				$scope.gridId = '800FF02308C345339CB8BB01CB51C797';
				$scope.gridSelectionData = {
					state: $scope.gridId
				};
				$scope.data=[]; var selectedList=[];
				$scope.result={
					data:$scope.data,
					selectList:selectedList
				};
				$scope.validateFlag=false;
				var updateSelectionsColumns = [
					{
						id: 'IsChecked',
						field: 'IsChecked',
						name$tr$: 'basics.materialcatalog.selectall',
						formatter: 'boolean',
						editor: 'boolean',
						width: 100,
						validator: 'setCatalogCheck',
						headerChkbox: true
					},
					{
						id: 'ytwocode', field: 'ytwocode', name$tr$: 'basics.materialcatalog.ytwocatalogcode',
						formatter: 'code',sortable: true, resizable: true
					},
					{
						id: 'code', field: 'code', name$tr$: 'basics.materialcatalog.itwocatalogcode',
						formatter: 'code',sortable: true, resizable: true,editor: 'description',
						validator: 'validateCodeUnique'
					},
					{
						id: 'updatestatus', field: 'updatestatus', name$tr$: 'basics.materialcatalog.updatestatus',
						formatter: 'description', sortable: true, resizable: true,width: 100
					},
					{
						id: 'companycode', field: 'companycode', name$tr$: 'basics.materialcatalog.itwocompanycode',
						formatter: 'description', sortable: true, resizable: true
					},
					{
						id: 'description', field: 'description', name$tr$: 'basics.materialcatalog.catalogdescription',
						formatter: 'description', sortable: true, resizable: true
					},
					{
						id: 'bpname', field: 'bpname', name$tr$: 'basics.materialcatalog.bpname',
						formatter: 'description', sortable: true, resizable: true
					}];
				platformTranslateService.translateGridConfig(updateSelectionsColumns);

				$scope.validateCodeUnique=function (entity, value) {
					if(_.isArray(selectedList) && selectedList.length>0)
					{
						_.forEach(selectedList, function (item) {
							if(item.ItwoCatalogCode === entity.itwocode){
								item.CatalogCode=value;
							}
						});
					}
				};
				initGrid();

				var checkAll = function (e) {
					var check=e.target.checked;
					if(check){
						if(_.isArray($scope.data) && $scope.data.length>0)
						{
							_.forEach($scope.data, function (item) {
								var findTrue= _.filter(selectedList,{ItwoCatalogCode:item.itwocode});
								if(findTrue.length === 0){
									selectedList.push({CatalogCode:item.code,CompanyCode:item.companycode,ItwoCatalogCode:item.itwocode,UpdateStatus:item.updatestatus,BpName:item.bpname});
								}
							});
						}
					}
					else{
						if(_.isArray($scope.data) && $scope.data.length>0)
						{
							_.forEach($scope.data, function (item) {
								var findTrue= _.filter(selectedList,{ItwoCatalogCode:item.itwocode});
								if(findTrue.length !== 0){
									_.remove(selectedList, { 'ItwoCatalogCode': item.itwocode });
								}
							});
						}
					}
					$scope.$emit('canFinish',{selectList:selectedList});
				};
				var headerCheckBoxFields = ['IsChecked'];
				var headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn: checkAll
					}
				];
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, materialcatalogSyncFromYtwoService, headerCheckBoxFields, headerCheckBoxEvents);

				var onBeforeEditCell = function (e, args) {
					var model = args.column.field, item = args.item, editable = false;
					if (model === 'code' && item.updatestatus === 'New') {
						editable = true;
					}
					return editable;
				};
				$scope.setCatalogCheck=function (entity, checked){
					var findTrue = null;
					if(checked && entity){
						if(_.isArray(selectedList) && selectedList.length>0)
						{
							findTrue= _.filter(selectedList,{ItwoCatalogCode:entity.itwocode});
							if(findTrue.length === 0){
								selectedList.push({CatalogCode:entity.code,CompanyCode:entity.companycode,ItwoCatalogCode:entity.itwocode,UpdateStatus:entity.updatestatus,BpName:entity.bpname});
							}
						}
						else{
							selectedList.push({CatalogCode:entity.code,CompanyCode:entity.companycode,ItwoCatalogCode:entity.itwocode,UpdateStatus:entity.updatestatus,BpName:entity.bpname});
						}
					}
					else{
						if(_.isArray(selectedList) && selectedList.length>0)
						{
							findTrue= _.filter(selectedList,{ItwoCatalogCode:entity.itwocode});
							if(findTrue.length !== 0){
								_.remove(selectedList, { 'ItwoCatalogCode': entity.itwocode });
							}
						}
					}
					$scope.$emit('canFinish',{selectList:selectedList});
				};
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
				function initGrid() {
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						var grid = {
							columns: angular.copy(updateSelectionsColumns),
							data: $scope.data,
							id: $scope.gridId,
							lazyInit: true,
							options: {tree: false, indicator: false, idProperty: 'itwocode'}
						};
						platformGridAPI.grids.config(grid);
						var resultData = materialcatalogSyncFromYtwoService.getUpdateSettings();
						if (resultData && _.isArray(resultData.data) && resultData.data.length > 0) {
							$scope.data=resultData.data;
							platformGridAPI.items.data($scope.gridId, $scope.data);
						}
					}
					else {
						platformGridAPI.columns.configuration($scope.gridId, angular.copy(updateSelectionsColumns));
					}
				}

				function validateCode(value) {
					validateData=[]; $scope.validateFlag=false;
					if (value && value.length !== 0) {
						if(headerData && headerData.length !== 0){
							_.forEach(headerData, function (item) {
								if(item.UpdateStatus === 'New'){
									var found = _.find(value, function (type) {
										return type === item.CatalogCode;
									});
									if(found){
										validateData.push({CatalogCode:item.CatalogCode,CompanyCode:item.CompanyCode,ItwoCatalogCode:item.ItwoCatalogCode,BpName:item.BpName});
									}
								}
							});
						}
						if(validateData && validateData.length !== 0){
							$scope.validateFlag=true;
							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'basics.materialcatalog/partials/sync-catalog-validate-view.html',
								resizeable: false,
								headerText:'Validate Catalog Code',
								bodyText:'These Code must be unique !',
								iconClass: 'ico-warning',
								actionButtonText:$translate.instant('cloud.common.ok'),
								header:validateData
							};
							platformModalService.showDialog(modalOptions);
						}
					}
				}
				function validationFn(value) {
					var searchResults=materialcatalogSyncFromYtwoService.getUpdateSettings();
					headerData=searchResults.selectList;
					if(headerData && headerData.length !== 0){
						validateCode(value);
					}
					materialcatalogSyncFromYtwoService.setValidateFlag($scope.validateFlag);
				}
				materialcatalogSyncFromYtwoService.onCatalogValidateFinishedEvent.register(validationFn);
				function updateSelectionFn() {
					materialcatalogSyncFromYtwoService.setUpdateSettings($scope.result);
				}
				materialcatalogSyncFromYtwoService.onCatalogUpdateFinishedEvent.register(updateSelectionFn);
				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					materialcatalogSyncFromYtwoService.onCatalogUpdateFinishedEvent.unregister(updateSelectionFn);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
					materialcatalogSyncFromYtwoService.onCatalogValidateFinishedEvent.unregister(validationFn);
				});
			}
		]);
})();