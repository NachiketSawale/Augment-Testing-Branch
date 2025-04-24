/**
 * Created by xia on 12/22/2016.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	// jshint -W072
	angular.module('qto.main').controller('qtoMainHeaderCreateDialogController',
		['$scope','$injector', '$http', 'qtoMainHeaderCreateDialogDataService', 'qtoMainHeaderValidationService','basicsLookupdataLookupDataService',
			'qtoMainHeaderDataService','qtoBoqType',
			function ($scope, $injector, $http, dialogConfigService, qtoMainHeaderValidationService,basicsLookupdataLookupDataService,qtoMainHeaderDataService,qtoBoqType) {
				$scope.path = globals.appBaseUrl;
				// $scope.modalTitle = dialogConfigService.getDialogTitle();
				$scope.modalOptions.headerText = dialogConfigService.getDialogTitle();
				$scope.dataItem = dialogConfigService.getDataItem();

				// set default readonly for QtoType
				if($scope.dataItem){
					dialogConfigService.updateReadOnly($scope.dataItem,'QtoTypeFk', !$scope.dataItem.ProjectFk);
				}
				var formConfig = dialogConfigService.getFormConfiguration();

				function getFormConfig(){
					var assignedType = $scope.dataItem ? $scope.dataItem.QtoTargetType : 0;

					if(assignedType === 2){
						angular.forEach(formConfig.rows, function (row){
							row.visible = (['ProjectFk','QtoTargetType','QtoTypeFk', 'BasRubricCategoryFk', 'PrjBoqFk','ClerkFk','Code','DescriptionInfo','OrdHeaderFk','IsBQ','IsIQ'].indexOf(row.model) >= 0 );

							if (row.model === 'IsBQ' || row.model === 'IsIQ') {
								row.readonly = false;
								row.required =false;

								$scope.dataItem[row.model] =true;							}

							if (row.model === 'IsAQ' || row.model === 'IsWQ') {
								$scope.dataItem[row.model] =false;
							}
						});
					}
					else if(assignedType === 3){
						angular.forEach(formConfig.rows, function (row){
							row.visible = !(row.model === 'PrjBoqFk' ||  row.model === 'OrdHeaderFk' || row.model === 'ConHeaderFk' || row.model === 'IsBQ' || row.model === 'IsIQ');
							if (row.model === 'IsAQ' || row.model === 'IsWQ') {
								row.readonly = false;
								row.required =false;
								$scope.dataItem[row.model] =true;
							}

							if (row.model === 'IsBQ' || row.model === 'IsIQ') {
								$scope.dataItem[row.model] =false;
							}
						});
					}
					else if(assignedType === 4){
						angular.forEach(formConfig.rows, function (row) {
							row.visible = (['ProjectFk', 'QtoTargetType', 'QtoTypeFk', 'BasRubricCategoryFk', 'PrjBoqFk', 'ClerkFk', 'Code', 'DescriptionInfo', 'IsAQ', 'IsWQ'].indexOf(row.model) >= 0);
							if (row.model === 'IsAQ' || row.model === 'IsWQ') {
								row.readonly = false;
								row.required =false;
								$scope.dataItem[row.model] =true;
							}

							if (row.model === 'IsBQ' || row.model === 'IsIQ') {
								$scope.dataItem[row.model] =false;
							}
						});
					} else {
						angular.forEach(formConfig.rows, function (row) {
							row.visible = !(row.model === 'PrjBoqFk' || row.model === 'OrdHeaderFk'|| row.model === 'IsAQ' || row.model === 'IsWQ');

							if (row.model === 'IsBQ' || row.model === 'IsIQ') {
								row.readonly = false;
								row.required =false;
								$scope.dataItem[row.model] =true;
							}

							if (row.model === 'IsAQ' || row.model === 'IsWQ') {
								$scope.dataItem[row.model] =false;
							}
						});
					}

					return formConfig;
				}

				$scope.formOptions = {
					configure: getFormConfig()
				};

				$scope.formContainerOptions = {
					formOptions: $scope.formOptions,
					setTools: function () {
					}
				};

				$scope.change = function change(item, model) {
					if (model === 'ProjectFk' && item.ProjectFk) {
						dialogConfigService.getProjectById(item.ProjectFk).then(function (project) {
							var clerkId = project && project.IsLive ? project.ClerkFk : 0;
							item.ClerkFk = clerkId;
							qtoMainHeaderValidationService.validateClerkFk(item, clerkId, 'ClerkFk');
							dialogConfigService.setQtoTypeAfterChangeProject(item, project);
						});

						item.PrcBoqFk = null;
						item.PrjBoqFk = null;
						item.OrdHeaderFk= null;
						item.ConHeaderFk= null;
						item.PackageFk = null;
						// procurement package
						basicsLookupdataLookupDataService.getList('PrcPackage').then(function (data) {
							if (data) {
								var prcPackage= _.filter(data,{'ProjectFk':item.ProjectFk});
								if (prcPackage && prcPackage.length === 1) {
									item.PackageFk = prcPackage[0].Id;

									// sub package
									autoAssignPackage2HeaderFk(item);
									qtoMainHeaderDataService.updateReadOnly(item,'Package2HeaderFK', item.PackageFk);
								}
							}
						});
						qtoMainHeaderDataService.updateReadOnly(item,'QtoTypeFk', item.ProjectFk);
						autoAssignProjectBoq(item);
					}
					else if ((model === 'PackageFk' && item.PackageFk)){
						autoAssignPackage2HeaderFk(item);
					}
					else if((model ==='ConHeaderFk' && item.ConHeaderFk)) {
						autoAssignPackage2HeaderFk(item);
					} else if(model ==='QtoTargetType'){
						item.OrdHeaderFk= null;
						item.ConHeaderFk= null;
						item.PackageFk = null;
					}
				};

				function autoAssignProjectBoq(item) {
					// If there is only one project BOQ, automatically assigned
					if(item.QtoTargetType === 2 && item.ProjectFk){
						item.PrjBoqFk = null;
						$injector.get('qtoProjectBoqDataService').getSearchList('PrjProjectFk ='+item.ProjectFk).then(function (data) {
							if (data) {
								if (data && data.length  === 1) {
									item.PrjBoqFk = data[0].Id;
									qtoMainHeaderValidationService.validatePrjBoqFk(item, item.PrjBoqFk, 'PrjBoqFk');
								}
							}
						});
					}
				}

				function  autoAssignPackage2HeaderFk(item) {
					// sub package
					$http.get(globals.webApiBaseUrl + 'procurement/package/prcpackage2header/getSubPackage?prcPackage=' + item.PackageFk + '&projectId=' + item.ProjectFk).then(function (response) {
						if (response.data) {
							var PrcPackage2Headers = response.data;
							if (PrcPackage2Headers && PrcPackage2Headers.length > 0) {
								// validate packageFK before set the subPackage
								qtoMainHeaderValidationService.validatePackageFk(item, item.PackageFk, 'PackageFk');
								item.Package2HeaderFK = PrcPackage2Headers[0].Id;
								item.PrcHeaderFkOriginal = PrcPackage2Headers[0].PrcHeaderFk;
								qtoMainHeaderDataService.updateReadOnly(item, 'PrcBoqFk', item.Package2HeaderFK);
								qtoMainHeaderValidationService.validatePackage2HeaderFK(item, item.Package2HeaderFK, 'Package2HeaderFK');
								if (item.ConHeaderFk) {
									checkConHeaderFk(item, item.ConHeaderFk);
								}
							} else if (item.ConHeaderFk) {
								qtoMainHeaderDataService.updateReadOnly(item, 'PackageFk', item.PackageFk);
								qtoMainHeaderDataService.updateReadOnly(item, 'PrcBoqFk', item.Package2HeaderFK);
								qtoMainHeaderDataService.updateReadOnly(item, 'Package2HeaderFK', item.Package2HeaderFK);
							}
						}
					});
				}
				function checkConHeaderFk(entity, value) {
					entity.PrcBoqFk = null;
					qtoMainHeaderDataService.getContractBoqHeaderId(value).then(function (response) {
						if (response.length > 0) {
							entity.BoqHeaderFk = response[0].BoqHeaderFk;
							qtoMainHeaderDataService.updateReadOnly(entity, 'PrcBoqFk', value);

							// If there is only one BOQ, automatically assigned
							qtoMainHeaderDataService.getBoqReferenceNo(true).then(function (data) {
								if (data && data.length === 1) {
									entity.BoqHeaderFk = data[0].BoqHeaderFk ? data[0].BoqHeaderFk : entity.BoqHeaderFk;
									entity.PrcBoqFk = data[0].Id;
									entity.BoqHeaderFk = data[0].BoqHeaderFk ? data[0].BoqHeaderFk : entity.BoqHeaderFk;
									qtoMainHeaderValidationService.validatePrcBoqFk(entity, entity.PrcBoqFk, 'PrcBoqFk');
								}
							});
						}
					});
				}

				function onSelectedQtoTargetTypeChanged(value){
					if(value !== null){
						if($scope.dataItem.__rt$data.errors){
							$scope.dataItem.__rt$data.errors.QtoTargetType = null;
						}
						$scope.dataItem.QtoTargetType = value;

						getFormConfig();

						$scope.$parent.$broadcast('form-config-updated', {}); // $scope.$emit('form-config-updated', {});
					}
				}

				dialogConfigService.onSelectedQtoTargetTypeChanged.register(onSelectedQtoTargetTypeChanged);

				dialogConfigService.onSelectedQtoTypeChanged.register(onSelectedQtoTypeChanged);
				function onSelectedQtoTypeChanged(item){
					$scope.dataItem.BasRubricCategoryFk = item.BasRubricCategoryFk;
					$scope.dataItem.BasGoniometerTypeFk = item.BasGoniometerTypeFk;
					if(item.isReSetPrcAndPrjBoq){
						$scope.dataItem.PrcBoqFk = null;
						$scope.dataItem.PrjBoqFk = null;
					}
				}

				$scope.hasErrors = function checkForErrors() {
					var hasError = false;
					if($scope.dataItem.__rt$data && $scope.dataItem.__rt$data.errors){
						var errors = $scope.dataItem.__rt$data.errors;
						for (var prop in errors){
							if(prop === 'DescriptionInfo') {
								continue;
							}

							if(errors[prop] !== null){
								if($scope.dataItem.QtoTargetType === 1 || $scope.dataItem.QtoTargetType === 3){
									if(prop === 'PrjBoqFk' || prop ==='OrdHeaderFk'){
										continue;
									}
								}else{
									if(['Package2HeaderFK','PackageFk','PrcBoqFk'].indexOf(prop) > -1 ){
										continue;
									}
								}

								hasError = true;
								break;
							}
						}
					}

					return hasError;
				};

				$scope.onOK = function () {
					if ($scope.dataItem.BoqHeaderFk) {
						var data = {
							BoqHeaderId: $scope.dataItem.BoqHeaderFk,
							QtoTargetTypeId: $scope.dataItem.QtoTargetType,
							qtoBoqType: qtoBoqType.QtoBoq
						};
						$http.post(globals.webApiBaseUrl + 'qto/main/header/getqtoheaderbyboqheaderid', data).then(function (response) {
							var data = response.data;
							var isExistQtoHeader2Boq = !!data;
							dialogConfigService.handlerError(isExistQtoHeader2Boq);
							if (!$scope.hasErrors()) {
								$scope.$close({ok: true, data: $scope.dataItem});
							}
						});
					} else {
						dialogConfigService.handlerError();
						if (!$scope.hasErrors()) {
							$scope.$close({ok: true, data: $scope.dataItem});
						}
					}
				};

				$scope.onCancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close({});
				};

				$scope.modalOptions.cancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close(false);
				};

				$scope.$on('$destroy', function () {
					dialogConfigService.clearDataItem();
					dialogConfigService.onSelectedQtoTargetTypeChanged.unregister(onSelectedQtoTargetTypeChanged);
					dialogConfigService.onSelectedQtoTypeChanged.unregister(onSelectedQtoTypeChanged);
				});
			}
		]
	);
})(angular);
