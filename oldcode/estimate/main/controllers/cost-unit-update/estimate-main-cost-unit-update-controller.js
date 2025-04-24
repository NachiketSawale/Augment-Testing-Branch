/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global _, globals */
	let modName = 'estimate.main';

	angular.module(modName).controller('estimateMainCostUnitUpdateController', ['$q','$http','$scope', '$injector', '$translate', 'platformGridAPI','platformTranslateService',
		'basicsLookupdataConfigGenerator','platformGridControllerService','platformRuntimeDataService',
		'estimateMainCostUnitListOfCostCodeUI','estimateMainCostUnitListOfMaterialUI','estimateMainCostUnitDataService',
		'projectCostCodesValidationService', 'projectMaterialValidationService', 'estimateMainResourceType',
		function ($q, $http,$scope, $injector,  $translate, platformGridAPI, platformTranslateService,
			basicsLookupdataConfigGenerator, platformGridControllerService, platformRuntimeDataService,
			estimateMainCostUnitListOfCostCodeUI,estimateMainCostUnitListOfMaterialUI,estimateMainCostUnitDataService,
			projectCostCodesValidationService, projectMaterialValidationService, estimateMainResourceType) {

			// $scope.configTitle = $translate.instant('estimate.main.costUnitUpdateCfg.costUnitUpdateTitle');
			$scope.modalOptions.headerText = $translate.instant('estimate.main.costUnitUpdateCfg.costUnitUpdateTitle');
			$scope.path = globals.appBaseUrl;

			$scope.canExecute = function () {
				if($scope.entity.__rt$data && $scope.entity.__rt$data.errors && $scope.entity.__rt$data.errors.JobCode){
					return false;
				}

				let list = $scope.entity.IsUpdate ? [dataService.getSelected()] : dataService.getList();
				if(!list || list.length === 0){
					return false;
				}

				if(!list[0]){
					return false;
				}

				if(list[0].__rt$data && list[0].__rt$data.errors && list[0].__rt$data.errors && _.find(list[0].__rt$data.errors, function (item) {return !!item;})){
					return false;
				}

				return $scope.entity.JobCode;
			};

			$scope.entity = {
				IsUpdate: true,
				ProjectFk:$injector.get('estimateMainService').getSelectedProjectId(),
				JobCode:'',
				JobDescription:'',
				OriginalJobCode:'',
				OriginalJobDesc:'',
				__rt$data:{ readonly:[
					{field: 'JobCode', readonly: true},
					{field: 'JobDescription', readonly: true}
				]}
			};

			$scope.formCostUnitUpdateOptionSettings = {
				configure: getFormConfig()
			};

			function getFormConfig(){
				let config =  {
					fid: 'estimate.main.updateCostUnit',
					addValidationAutomatically: true,
					version: '1.1.1',
					showGrouping: false,
					skipPermissionCheck: true,
					groups: [
						{
							gid: 'baseGroup',
							header: 'Base Group',
							isOpen: true,
							attributes: []
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'isupdate',
							label: 'Criteria Selection',
							label$tr$: 'estimate.main.costUnitUpdateCfg.selectCriteria',
							type: 'radio',
							model: 'IsUpdate',
							sortOrder: 1,
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								items: [
									{Id: 1, Description: $translate.instant('estimate.main.costUnitUpdateCfg.updateCurrentJob'), Value : true},
									{Id: 2, Description: $translate.instant('estimate.main.costUnitUpdateCfg.createNewJob'), Value : false}
								]},
							validator: function (entity, value) {
								platformRuntimeDataService.readonly(entity, [{field: 'JobCode', readonly: value}]);
								platformRuntimeDataService.readonly(entity, [{field: 'JobDescription', readonly: value}]);
								entity.JobCode = !value ? '' : entity.OriginalJobCode;
								entity.JobDescription = !value ? '' : entity.OriginalJobDesc;
								platformRuntimeDataService.applyValidationResult(true, entity, 'JobCode');
							}
						},
						{
							gid: 'baseGroup',
							label: 'Project Name',
							label$tr$: 'cloud.common.entityProjectName',
							model: 'ProjectFk',
							directive: 'basics-lookupdata-lookup-composite',
							rid: 'projectfk',
							sortOrder: 2,
							options:{
								descriptionMember: 'ProjectName',
								lookupDirective: 'procurement-project-lookup-dialog'
							},
							readonly: true,
							type: 'directive'
						},
						{
							gid: 'baseGroup',
							rid: 'jobCode',
							label: 'Job Code',
							label$tr$: 'estimate.main.costUnitUpdateCfg.jobCode',
							type: 'code',
							required: true,
							model: 'JobCode',
							sortOrder: 3,
							asyncValidator: function (entity, value, model) {
								return  $http.get(globals.webApiBaseUrl + 'logistic/job/isCodeUnique?code=' + value).then(function (response) {
									let result = {
										valid: response && response.data,
										error: $translate.instant('estimate.main.costUnitUpdateCfg.jobcodeexist')
									};
									platformRuntimeDataService.applyValidationResult(result, entity, model);

									return result;
								});
							}
						},
						{
							gid: 'baseGroup',
							rid: 'jobDescription',
							label: 'Job Description',
							label$tr$: 'estimate.main.costUnitUpdateCfg.jobDescription',
							type: 'description',
							model: 'JobDescription',
							sortOrder: 4
						}
					]

				};

				platformTranslateService.translateFormConfig(config);
				return config;
			}

			$scope.execute = function () {
				let defer;
				let grid = platformGridAPI.grids.element('id', $scope.gridId).instance;
				let editor = grid.getEditorLock();
				let selectedEntity = dataService.getSelected();
				if(editor && editor.commitCurrentEdit && editor.isActive()){
					if(entity.EstResourceTypeFk === estimateMainResourceType.Material){
						let activeCell = grid.getActiveCell();
						if(activeCell && activeCell.cell >= 0 && grid.getColumns()[activeCell.cell].id === 'prcpriceconditionfk1'){
							defer = $injector.get('projectMaterialPriceConditionServiceNew').reload(selectedEntity, selectedEntity.PrcPriceconditionFk);
						}
					}
					if(!defer){
						editor.commitCurrentEdit();
					}
				}
				if(!defer){
					defer = $q.defer();
					defer.resolve(true);
				}
				defer.promise.then(function (){

					let list = $scope.entity.IsUpdate ? [dataService.getSelected()] : dataService.getList();
					if(!list || list.length === 0){
						return false;
					}

					let updateEntity = list[0];

					let materialPortion2Save;

					let copyUpdateEntity = angular.copy(updateEntity);
					if(!$scope.entity.IsUpdate){
						updateEntity.LgmJobFk = 0;
						materialPortion2Save = $injector.get ('estimateMainMaterialPortionService').getList(); // to create new material portion
					}else{
						materialPortion2Save = $injector.get ('estimateMainMaterialPortionService').getMaterialPortion2Save(); // to update material portion
					}
					updateEntity.JobCode = $scope.entity.JobCode;
					updateEntity.JobDescription = $scope.entity.JobDescription;
					updateEntity.OldJobFk = $scope.entity.OldJobFk;

					let param = updateEntity;
					let postUrl;
					if(entity.EstResourceTypeFk === estimateMainResourceType.Material){
						param = {
							PrjMaterial:updateEntity,
							IsUpdate:$scope.entity.IsUpdate,
							PrjMaterialPortionToSave:materialPortion2Save,
							PrjMatPrcConditionsToSave:$injector.get('projectMaterialPriceConditionServiceNew').getList()
						};

						postUrl = 'project/material/updatejob';
					}else{
						postUrl = 'project/costcodes/job/rate/createorupdatejobrate';
					}

					$http.post(globals.webApiBaseUrl + postUrl, param).then(function (response) {

						if(response && response.data){
							let permission;
							let jobLookupServ = $injector.get('logisticJobLookupByProjectDataService');
							if(jobLookupServ){
								permission = jobLookupServ.resetCache({lookupType:'logisticJobLookupByProjectDataService'});
							}else{
								permission = $q.when('');
							}

							permission.then(function(){
								if(udpService) {
									if (!$scope.entity.IsUpdate) {
										updateEntity.LgmJobFk = response.data.LgmJobFk;
										udpService.copyNewUserDefinedColumnItem(copyUpdateEntity,updateEntity);
									}
									return udpService.update().then(function(){
										return $injector.get('estimateMainJobCostcodesLookupService').refreshEstCostCodesTree();
									});
								}
								return $q.when('');
							}).then(function (){
								entity.LgmJobFk = !$scope.entity.IsUpdate ? response.data.LgmJobFk : entity.LgmJobFk;
								entity.IsRate = updateEntity.IsRate;
								$injector.get('estimateMainResourceDetailService').fieldChange(entity, 'LgmJobFk');

								if(entity.EstResourceTypeFk !== 2 && updateEntity.modifiedJobRate && updateEntity.modifiedJobRate.length > 0){
									$http.post(globals.webApiBaseUrl + 'project/costcodes/job/rate/savejobrates', updateEntity.modifiedJobRate);
								}

								if(updateEntity.LgmJobFk !== 0) {
									let postData = {
										data: {
											calcRuleParam: false,
											updBoq: false,
											updPrjAssembly: false,
											updPrjCC: entity.EstResourceTypeFk === estimateMainResourceType.CostCode,
											updPrjMat: entity.EstResourceTypeFk === estimateMainResourceType.Material,
											lgmJobFk: response.data.LgmJobFk,

											// Update Resource CostUnit with button "Cost/Unit Update"
											IsUpdateResourceCostUnit: true,
											MdcCostCodeFk: entity.MdcCostCodeFk,
											ProjectCostCodeFk: entity.ProjectCostCodeFk,
											MdcMaterialFk: entity.MdcMaterialFk
										}
									};

									$injector.get('estimateMainUpdateItemsService').updateEstimateFromProject(postData).then(function () {
										$scope.$close(false);
									});
								}
							});
						}

						$scope.$close(false);
					});
				});
			};

			$scope.close = function () {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};


			$scope.gridId = 'e2661f71d1e24b07958b84ad026023d9';

			$scope.getContainerUUID = function () {
				return $scope.gridId;
			};
			$scope.setTools = function () {};

			let resourceDataService = $injector.get('estimateMainResourceService');
			let entity = resourceDataService.getSelected();
			let uiService = entity.EstResourceTypeFk === estimateMainResourceType.CostCode ? estimateMainCostUnitListOfCostCodeUI : estimateMainCostUnitListOfMaterialUI;
			uiService.setReadOnly(false);
			let validateService = entity.EstResourceTypeFk === estimateMainResourceType.CostCode ? projectCostCodesValidationService : projectMaterialValidationService;

			let dataOpt = {
				entity:entity,
				onlyShowSelected:true,
				uuid:$scope.gridId
			};

			let dataService = estimateMainCostUnitDataService.getDataService(dataOpt);

			let projectMaterialServiceOriginalGetSelected;
			let projectMaterialServiceParentService;
			let projectMaterialMarkItemAsModified;
			let projectMaterialServiceGridRefresh;
			let projectMaterialMainService = $injector.get('projectMaterialMainService');

			let projectMaterialPriceConditionService = $injector.get('projectMaterialPriceConditionServiceNew');
			let oldProjectMaterialAddEntityToModified;
			let oldProjectMaterialAssertTypeEntries;

			if(entity.EstResourceTypeFk === estimateMainResourceType.Material){
				projectMaterialServiceOriginalGetSelected = projectMaterialMainService.getSelected;
				projectMaterialServiceParentService = projectMaterialMainService.parentService;
				projectMaterialMarkItemAsModified = projectMaterialMainService.markItemAsModified;
				projectMaterialServiceGridRefresh = projectMaterialMainService.gridRefresh;
				projectMaterialMainService.getSelected = dataService.getSelected;
				projectMaterialMainService.parentService = function (){ return dataService;};
				projectMaterialMainService.markItemAsModified = function (){};
				projectMaterialMainService.gridRefresh = dataService.gridRefresh;

				oldProjectMaterialAddEntityToModified = projectMaterialPriceConditionService.addEntityToModified;
				oldProjectMaterialAssertTypeEntries = projectMaterialPriceConditionService.assertTypeEntries;
				projectMaterialPriceConditionService.addEntityToModified = projectMaterialPriceConditionService.assertTypeEntries = function (){};
				projectMaterialPriceConditionService.clearItems();
			}

			let udpService = dataService.registerUserDefinedColumnService(uiService,false);

			// region cost unit detail list
			let gridConfig = {
				columns: [],
				type:'costUnitDetail',
				property: 'LgmJobFk',
				grouping:false,
				skipPermissionCheck: true,
				cellChangeCallBack: function cellChangeCallBack(arg) {
					$injector.get('estimateMainMaterialPortionService').getMaterialPortion2Save();
					let item = arg.item;
					item.ProjectCostCodeFk = item.OriginalId;
					$injector.get('projectCostCodesJobRateMainService').calRealFactorOrQuantity(arg).then(function (newItem){
						newItem && dataService.markItemAsModified(item);
					});
					let field = arg.grid.getColumns()[arg.cell].field;
					if (udpService && udpService.isUserDefinedColumnField(field)) {
						udpService.fieldChange(item, field, item[field]);
					}
				},
				rowChangeCallBack: function () {
					let selectedItem = dataService.getSelected();
					if(selectedItem &&  entity.EstResourceTypeFk === estimateMainResourceType.Material){
						let materialPortionService = $injector.get('estimateMainMaterialPortionService');
						materialPortionService.setParentSelected(selectedItem);
						$injector.get('projectCostCodeLookupDataService').setJobId(selectedItem.LgmJobFk);
						materialPortionService.setParentService(dataService);
						materialPortionService.setMaterialId(selectedItem.Id);
						materialPortionService.load();
					}
				},
			};

			platformGridControllerService.initListController($scope, uiService, dataService, validateService, gridConfig);

			estimateMainCostUnitDataService.loadData(dataService, entity).then(function (data) {
				if(data && data.length > 0) {
					let item = data[0];
					$scope.entity.JobCode = $scope.entity.OriginalJobCode = item.JobCode;
					$scope.entity.JobDescription = $scope.entity.OriginalJobDesc = item.JobDescription;
					$scope.entity.OldJobFk = entity.LgmJobFk || entity.parentJobFk;
				}
				platformGridAPI.grids.resize($scope.gridId);
			});

			// endregion

			function onInitialized() {
				if(udpService) {
					udpService.loadDynamicColumns();
				}
			}
			$scope.tools = {update :function(){}};
			$scope.isHidden = (entity.EstResourceTypeFk === estimateMainResourceType.CostCode);
			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);
			// un-register on destroy
			$scope.$on('$destroy', function () {
				if(entity.EstResourceTypeFk === estimateMainResourceType.Material) {
					projectMaterialMainService.getSelected = projectMaterialServiceOriginalGetSelected;
					projectMaterialMainService.parentService = projectMaterialServiceParentService;
					projectMaterialMainService.markItemAsModified = projectMaterialMarkItemAsModified;
					projectMaterialMainService.gridRefresh = projectMaterialServiceGridRefresh;

					projectMaterialPriceConditionService.addEntityToModified = oldProjectMaterialAddEntityToModified;
					projectMaterialPriceConditionService.assertTypeEntries = oldProjectMaterialAssertTypeEntries;
				}

				dataService.unRegisterUserDefinedColumnService();
				platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
				$injector.get('platformGridAPI').grids.unregister($scope.gridId);
			});

		}]);

})(angular);
