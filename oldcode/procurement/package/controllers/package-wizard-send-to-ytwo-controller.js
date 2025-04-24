/**
 * Created by xai on 1/12/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	var angModule = angular.module(moduleName);

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	angModule.value('selectedPackageGrid', [
		{
			id: 'IsChecked',
			field: 'IsChecked',
			name$tr$: 'procurement.package.wizard.checkboxText',
			formatter: 'boolean',
			editor: 'boolean',
			width: 100,
			validator: 'setPackageCheck',
			headerChkbox: true
		},
		{
			id: 'code', field: 'code', name$tr$: 'cloud.common.entityPackageCode',
			formatter: 'code',sortable: true, resizable: true
		},
		{
			id: 'description', field: 'description', name$tr$: 'cloud.common.entityPackageDescription',
			formatter: 'description', sortable: true, resizable: true
		}
	]);

	angModule.controller('procurementPackageSendtoYtwoController',
		['basicsCommonHeaderColumnCheckboxControllerService','basicsCommonGridSelectionDialogService','$http','$scope', '$translate', 'platformTranslateService','platformGridAPI','selectedPackageGrid','platformModalService','procurementPackageValidationService','basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService','platformRuntimeDataService','procurementPackageWizardSendtoYtwoService',
			function (basicsCommonHeaderColumnCheckboxControllerService,basicsCommonGridSelectionDialogService,$http,$scope, $translate, platformTranslateService,platformGridAPI,selectedPackageGrid,platformModalService,validationService,basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService,platformRuntimeDataService,dataService) {
				var projectLookupDirective = 'procurement-project-lookup-dialog';
				$scope.options = $scope.$parent.modalOptions;
				$scope.currentItem = {
					ProjectFk: $scope.options.ProjectFk,
					PackageList:$scope.options.PackageList,
					GroupType:$scope.options.GroupType,
					ConfigurationFk:0
				};
				$scope.data = []; var selectedList=[];
				$scope.gridId = 'EEE39CED8A6A4BC9BC4B9DBB03BD9733';
				$scope.gridData = {
					state: $scope.gridId
				};
				initGrid();
				var checkAll = function (e) {
					var check=e.target.checked;
					if(check){
						if(_.isArray($scope.currentItem.PackageList) && $scope.currentItem.PackageList.length>0)
						{
							_.forEach($scope.currentItem.PackageList, function (item) {
								var index1=selectedList.indexOf(item.Id);
								if(index1===-1){
									selectedList.push(item.Id);
								}
							});
						}
					}
					else{
						if(_.isArray($scope.currentItem.PackageList) && $scope.currentItem.PackageList.length>0)
						{
							_.forEach($scope.currentItem.PackageList, function (item) {
								var index2=selectedList.indexOf(item.Id);
								if(index2>-1){
									selectedList.splice(index2,1);
								}
							});
						}
					}
				};
				var headerCheckBoxFields = ['IsChecked'];
				var headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn: checkAll
					}
				];
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataService, headerCheckBoxFields, headerCheckBoxEvents);

				function onBeforeEditCell(/* e,arg */) {
					return false;
				}
				$scope.setPackageCheck=function (entity, checked){
					if(checked && entity){
						if(_.isArray(selectedList) && selectedList.length>0)
						{
							var index1=selectedList.indexOf(entity.id);
							if(index1===-1){
								selectedList.push(entity.id);
							}
						}
						else{
							selectedList.push(entity.id);
						}
					}
					else{
						if(_.isArray(selectedList) && selectedList.length>0)
						{
							var index2=selectedList.indexOf(entity.id);
							if(index2>-1){
								selectedList.splice(index2,1);
							}
						}
					}
				};
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

				$scope.formOptions = {
					'fid': 'procurement.package.sendtoytwo',  // contract header form identifier
					'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
					showGrouping: true,
					title$tr$: '',

					'groups': [
						{
							'gid': 'setting',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1,
							'header$tr$': 'procurement.package.wizard.selectoneproject',
							'header':'Select One Project'
						}
					],
					'rows': [
						{
							'rid': 'projectfk',
							'gid': 'setting',
							'label$tr$': 'cloud.common.entityProjectName',
							'label': 'Project Name',
							'type': 'directive',
							'model': 'ProjectFk',
							'validator': validationService.validateProjectFk,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': projectLookupDirective,
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'initValueField': 'ProjectNo',
									'lookupKey': 'prc-req-header-project-property',
									'filterKey': 'procurement-package-header-project-assetmasterfk-filter',
									'showClearButton': true
								}
							}
						},
						{
							'rid': 'configuration',
							'gid': 'setting',
							'label': 'Configuration',
							'label$tr$': 'procurement.package.entityConfiguration',
							'type': 'directive',
							'model': 'ConfigurationFk',
							// 'validator': validationService.validateConfigurationFk,
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								'filterKey': 'procurement-package-configuration-filter'
							}
						},
						{
							'rid': 'showBy',
							'gid': 'setting',
							'label$tr$': 'procurement.package.wizard.forecastGroupType',
							'label': 'Forecast By',
							'type': 'directive',
							'model': 'GroupType',
							'directive': 'procurement-package-forecast-group-type-lookup',
							'options': {
								'lookupDirective': 'procurement-package-forecast-group-type-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									showClearButton: true
								}
							}
						}
					]
				};

				// translate form config.
				platformTranslateService.translateFormConfig($scope.formOptions);
				$scope.formContainerOptions = {
					statusInfo: function () {
					}
				};
				$scope.formContainerOptions.formOptions = {
					configure: $scope.formOptions,
					showButtons:[],
					validationMethod: function () {
					}
				};
				$scope.setTools = function(tools){
					$scope.tools = tools;
				};
				function updateValidation() {
					var result1 = validationService.validateProjectFk($scope.currentItem, $scope.currentItem.ProjectFk, 'ProjectFk');
					platformRuntimeDataService.applyValidationResult(result1, $scope.currentItem, 'ProjectFk');
					return result1 === true;
				}
				updateValidation();
				var selectPackageValidation= $scope.$watch('data', function () {
					$scope.isDisabled = isDisabledFn();
				});
				var projectFkPackageValidation=$scope.$watch('currentItem.ProjectFk', function () {
					$scope.isDisabled = isDisabledFn();
					$http
						.get(globals.webApiBaseUrl + 'procurement/package/wizard/getpackagelistbyprj?ProjectId=' + $scope.currentItem.ProjectFk)
						.then(function (response) {
							$scope.currentItem.PackageList=response.data || null;
							$scope.data = [];
							if (_.isArray($scope.currentItem.PackageList) && $scope.currentItem.PackageList.length>0) {
								_.forEach($scope.currentItem.PackageList, function (item) {
									if($scope.currentItem.ConfigurationFk!==0){
										if(item.ConfigurationFk===$scope.currentItem.ConfigurationFk){
											$scope.data.push({
												id:item.Id,
												code: item.Code,
												description: item.Description
											});
										}
									}
									else{
										$scope.data.push({
											id:item.Id,
											code: item.Code,
											description: item.Description
										});
									}
								});
								platformGridAPI.items.data($scope.gridId, $scope.data);
							}
						});
				});
				var configureFkPackageValidation=$scope.$watch('currentItem.ConfigurationFk', function () {
					if($scope.currentItem.ConfigurationFk!==0){
						$scope.isDisabled = isDisabledFn();
						$scope.data = [];
						if (_.isArray($scope.currentItem.PackageList) && $scope.currentItem.PackageList.length>0) {
							_.forEach($scope.currentItem.PackageList, function (item) {
								if(item.ConfigurationFk===$scope.currentItem.ConfigurationFk){
									$scope.data.push({
										id:item.Id,
										code: item.Code,
										description: item.Description
									});
								}
							});
							platformGridAPI.items.data($scope.gridId, $scope.data);
						}
					}
				});
				function isDisabledFn() {
					var ProjectFk = $scope.currentItem.ProjectFk;
					return (ProjectFk === -1 || ProjectFk === null);
				}
				$scope.modalOptions = {
					closeButtonText: 'Cancel',
					actionButtonText: 'OK',
					headerText: $translate.instant('procurement.package.wizard.sendPackagestoytwo'),
					bodyText:$translate.instant('procurement.package.wizard.selectpackages')
				};
				$scope.modalOptions.ok = function onOK() {
					var modalOptionsInfo={
						headerTextKey: $translate.instant('procurement.package.wizard.selectpackagedialogInfo'),
						showOkButton: true,
						iconClass: 'ico-warning',
						bodyTextKey:  $translate.instant('procurement.package.wizard.selectpackageValidationMsg')
					};
					var selectedPackages=[];
					if(_.isArray(selectedList) && selectedList.length > 0){
						_.forEach(selectedList, function (item) {
							selectedPackages.push(item);
						});
					}
					var resultPackagData={PrcPackageIds:selectedPackages,GroupType:$scope.currentItem.GroupType};
					if (updateValidation() && selectedPackages.length>0) {
						$scope.isDisabled = true;
						$scope.$close(resultPackagData);
					}
					else{
						platformModalService.showDialog(modalOptionsInfo);
					}
				};
				$scope.modalOptions.close = function onCancel() {
					$scope.$close(false);
				};
				$scope.modalOptions.cancel = $scope.modalOptions.close;

				function initGrid() {
					var columns = selectedPackageGrid; // UIStandardService.getStandardConfigForListView().columns;
					platformTranslateService.translateGridConfig(columns);

					if (!platformGridAPI.grids.exist($scope.gridId)) {
						var grid = {
							columns: angular.copy(columns), data: $scope.data, id: $scope.gridId, lazyInit: true,
							options: {tree: false, indicator: false, idProperty: 'id'}
						};
						platformGridAPI.grids.config(grid);
						if (_.isArray($scope.currentItem.PackageList) && $scope.currentItem.PackageList.length > 0) {
							_.forEach($scope.currentItem.PackageList, function (item) {
								if ($scope.currentItem.ConfigurationFk !== 0) {
									if (item.ConfigurationFk === $scope.currentItem.ConfigurationFk) {
										$scope.data.push({
											id: item.Id,
											code: item.Code,
											description: item.Description
										});
									}
								}
								else {
									$scope.data.push({
										id: item.Id,
										code: item.Code,
										description: item.Description
									});
								}
							});
							platformGridAPI.items.data($scope.gridId, $scope.data);
						}
						//                  platformGridAPI.items.data($scope.gridId, $scope.data);
					} else {
						platformGridAPI.columns.configuration($scope.gridId, angular.copy(columns));
					}
				}
				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					if (_.isFunction(projectFkPackageValidation)) {

						projectFkPackageValidation();
					}
					if (_.isFunction(configureFkPackageValidation)) {

						configureFkPackageValidation();
					}

					if(_.isFunction(selectPackageValidation)){
						selectPackageValidation();
					}
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
				});
			}]);
})(angular);