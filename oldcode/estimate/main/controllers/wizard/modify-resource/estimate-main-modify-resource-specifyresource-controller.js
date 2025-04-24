/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainModifyResourceSpecifyResourceController
	 * @requires $scope
	 * @description use for modify estimate bulk editor
	 */
	angular.module(moduleName).controller('estimateMainModifyResourceSpecifyResourceController',

		['$scope', '$translate', '$injector', 'platformTranslateService', 'estimateMainReplaceResourceCommonService', 'estimateMainReplaceResourceUIService',
			'basicsLookupdataLookupFilterService', 'estimateMainResourceFrom', 'estimateMainWizardContext',
			function ($scope, $translate, $injector, platformTranslateService, estimateMainReplaceResourceCommonService, estimateMainReplaceResourceUIService,
				basicsLookupdataLookupFilterService, estimateMainResourceFrom, estimateMainWizardContext) {

				$scope.entity = {
					SpecifyType: -1// default value is empty
				};

				let formConfig = {
					configure: {
						fid: 'estimate.main.replaceResourceWizard.replaceform',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								isOpen: true,
								attributes: [
									'specifytype'
								]
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'specifytype',
								label: 'Specify Resource',
								label$tr$: 'estimate.main.modifyResourceWizard.specifyResource',
								model: 'SpecifyType',
								type: 'directive',
								directive: 'estimate-main-modify-resource-specify-type',
								options: {
									lookupType: 'specifytype',
									lookupDirective: 'estimate-main-modify-resource-specify-type',
									showClearButton: true,
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										width: 100,
										valueMember: 'Id',
										displayMember: 'Description',
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function onSelectedItemChangedHandler() {

												}
											}
										]
									}
								},
								visible: true,
								sortOrder: 1
							}
						]
					}
				};
				platformTranslateService.translateFormConfig(formConfig.configure);

				$scope.formOptionsSpectifyType = formConfig;

				let originalConfig = estimateMainReplaceResourceUIService.getSpecifyResourceLookupConfig();
				let originalJobConfig = estimateMainReplaceResourceUIService.getSpecifyResourceJobLookupConfig();

				function getConfigForLookup() {
					let newConfig = angular.copy(originalConfig);
					newConfig.groups = [newConfig.groups[0]];
					let specifyType = $scope.entity.SpecifyType === -1 ? 1 : $scope.entity.SpecifyType;
					newConfig.rows = specifyType === 4? [newConfig.rows[2]] : [newConfig.rows[specifyType - 1]];
					if($scope.entity.SpecifyType === -1){
						newConfig.rows[0].readonly = true;
					}
					return newConfig;
				}

				function getJobConfigForLookup(specifyResource) {
					if(originalJobConfig) {
						let newConfig = angular.copy(originalJobConfig);
						newConfig.groups = [newConfig.groups[0]];
						let specifyType = $scope.entity.SpecifyType === -1 ? 1 : $scope.entity.SpecifyType;
						let ignoreJob = newConfig.rows[3];
						newConfig.rows = [newConfig.rows[specifyType - 1]];
						if (!specifyResource) {
							newConfig.rows[0].readonly = true;
						}
						newConfig.rows.push(ignoreJob);
						return newConfig;
					}
					return [];
				}

				estimateMainReplaceResourceCommonService.onSpecifyResourceChanged.register(reloadJobLookup);

				let _firstTimeLoaded = true;
				$scope.$watch('entity.SpecifyType', function (specifyType) {
					$scope.entity.SpecifyType = specifyType || -1;

					$scope.entity.SpecifyLookupFk = null;
					$scope.entity.SpecifyLookupElement = null;
					$scope.entity.RepaceWithProjectCostCodeId = null;

					estimateMainReplaceResourceCommonService.setDefaultType(specifyType);
					estimateMainReplaceResourceCommonService.setSpecifyType(specifyType);
					formUpdate();
				});

				$scope.$watch('entity.IgnoreJob', function () {
					if(originalJobConfig) {
						$scope.$parent.entity.IgnoreJob = $scope.entity.IgnoreJob;
						// will not show target job lookup if true
						let formConfig = $scope.formOptionsJobLookup.configure;

						let hasTargetJob = _.find(formConfig.rows, function (item) {
							return item.rid === 'targetJob';
						});
						formConfig.rows[0].visible = !(hasTargetJob && hasTargetJob.visible);
						$scope.$broadcast('form-config-updated');
					}
				});

				$scope.$watch('entity.TargetJobFk', function () {
					$scope.$parent.entity.TargetJobFk = $scope.entity.TargetJobFk;
				});

				let filters = [
					{
						key: 'estimate-main-project-cost-code-job-filter',
						fn: function (item) {
							if($scope.entity.SpecifyLookupElement && $scope.entity.SpecifyLookupElement.MdcCostCodeFk)
							{
								return (item.MdcCostCodeFk === $scope.entity.SpecifyLookupElement.MdcCostCodeFk);
							}
							return false;
						}
					},
					{
						key: 'estimate-main-project-material-job-filter',
						fn: function (item) {
							if($scope.entity.SpecifyLookupElement && $scope.entity.SpecifyLookupElement.BasMaterial && $scope.entity.SpecifyLookupElement.MdcMaterialFk)
							{
								return (item.MdcMaterialFk === $scope.entity.SpecifyLookupElement.MdcMaterialFk);
							}
							else if($scope.entity.SpecifyLookupElement && $scope.entity.SpecifyLookupElement.Id){
								return (item.MdcMaterialFk === $scope.entity.SpecifyLookupElement.Id);
							}
							return false;
						}
					}
				];

				function reloadJobLookup (specifyResource) {
					if(originalJobConfig) {
						let newFormConfig = getJobConfigForLookup(specifyResource);
						if($scope.formOptionsJobLookup){
							$scope.formOptionsJobLookup.configure.rows[0].options = newFormConfig.rows[0].options;
							$scope.formOptionsJobLookup.configure.rows[0].readonly = newFormConfig.rows[0].readonly;
						}

						if(!specifyResource){
							$scope.entity.TargetJobFk = null;
							$scope.entity.TargetProjectCostCodeId = null;
							$scope.entity.RepaceWithProjectCostCodeId = null;
						}

						$scope.$broadcast('form-config-updated');

						// $scope.entity.TargetJobFk = estimateMainReplaceResourceCommonService.getDefaultCurrentElementJob();
					}
				}

				$scope.formOptionsSpectifyLookup = {
					configure: getConfigForLookup()
				};

				$scope.entity.isShowJob = !!originalJobConfig;

				if(originalJobConfig) {
					// job info
					$scope.formOptionsJobLookup = {
						configure: getJobConfigForLookup()
					};
				}

				function setDefaultJob() {
					if ($scope.entity.SpecifyLookupFk) {
						// set the target job with default value(if the jobs are exist, default is estimate job)
						let wizardConifg = estimateMainWizardContext.getConfig();
						let estHeader = $injector.get('estimateMainService').getSelectedEstHeaderItem();

						// estimateMainReplaceResourceCommonService.setReplaceElement(null);
						if(wizardConifg !== estimateMainResourceFrom.EstimateAssemblyResource) {
							if ($scope.entity.SpecifyLookupFk) {
								// default will set the Targetjobfk with header
								// let estHeader = estimateMainService.getSelectedEstHeaderItem();
								let headerJobFk = estHeader && estHeader.LgmJobFk ? estHeader.LgmJobFk : null;
								let lgmJobFk = $scope.entity.SpecifyLookupElement ? $scope.entity.SpecifyLookupElement.LgmJobFk : null;
								headerJobFk = lgmJobFk || headerJobFk;

								if ($scope.entity.SpecifyType === 1 && $scope.entity.SpecifyLookupElement) {
									let prjCostCodes = $injector.get('estimateMainLookupService').getEstCostCodesSyn();
									let mdcCostCodeFk = $scope.entity.SpecifyLookupElement.MdcCostCodeFk;
									let findPrjCostCode = _.find(prjCostCodes, function (item) {
										return item.MdcCostCodeFk === mdcCostCodeFk;
									});
									if(findPrjCostCode){
										if(headerJobFk){
											let secfindPrjCostCode = _.find(prjCostCodes, function (item) {
												return item.MdcCostCodeFk === mdcCostCodeFk && item.LgmJobFk === headerJobFk;
											});
											if(secfindPrjCostCode){
												findPrjCostCode = secfindPrjCostCode;
											}
										}
										$scope.entity.TargetProjectCostCodeId = findPrjCostCode.Id;
										$scope.entity.TargetJobFk = headerJobFk || findPrjCostCode.LgmJobFk;
										// estimateMainReplaceResourceCommonService.setReplaceElement(findPrjCostCode);
									}
									else{
										// set target job disabled
										$scope.entity.TargetProjectCostCodeId = null;
										// replaceElementJobDisabled = true;
										// setReplaceElementJobDisabled(true);
									}
								}
								else if ($scope.entity.SpecifyType === 2 && $scope.entity.SpecifyLookupElement) {
									let prjMaterials = $injector.get('estimateMainPrjMaterialLookupService').getPrjMaterialSyn();
									let findprjMaterials = _.find(prjMaterials, function (item) {
										return item.MdcMaterialFk === $scope.entity.SpecifyLookupFk;
									});
									if(findprjMaterials){
										if(headerJobFk){
											let secfindprjMaterials = _.find(prjMaterials, function (item) {
												return item.MdcMaterialFk === $scope.entity.SpecifyLookupFk && item.LgmJobFk === headerJobFk;
											});
											if(secfindprjMaterials){
												findprjMaterials = secfindprjMaterials;
											}
										}
										$scope.entity.TargetProjectCostCodeId = findprjMaterials.Id;
										$scope.entity.TargetJobFk = headerJobFk || findprjMaterials.LgmJobFk;
										// estimateMainReplaceResourceCommonService.setReplaceElement(findprjMaterials);
									}
									else{
										// set target job disabled
										$scope.entity.TargetProjectCostCodeId = null;
										// replaceElementJobDisabled = true;
										// setReplaceElementJobDisabled(true);
									}
								}
							}
						}
					}
					else {
						$scope.entity.TargetJobFk = null;
						$scope.entity.TargetProjectCostCodeId = null;
					}
				}

				function formUpdate() {
					$scope.entity.SpecifyLookupFk = null;

					let newFormConfig = getJobConfigForLookup();
					if($scope.formOptionsJobLookup){
						$scope.formOptionsJobLookup.configure.rows[0].options = newFormConfig.rows[0].options;
						$scope.formOptionsJobLookup.configure.rows[0].readonly = newFormConfig.rows[0].readonly;
					}

					newFormConfig = getConfigForLookup();
					$scope.formOptionsSpectifyLookup.configure.rows[0] = newFormConfig.rows[0];

					$scope.$broadcast('form-config-updated');
					if(_firstTimeLoaded) {
						$scope.entity.SpecifyLookupFk = estimateMainReplaceResourceCommonService.getDefaultCurrentElement();
						if ($scope.entity.SpecifyLookupFk) {
							$scope.entity.SpecifyLookupElement = estimateMainReplaceResourceCommonService.getSpecifyLookupElement();
							estimateMainReplaceResourceCommonService.setSpecifyResource($scope.entity.SpecifyLookupElement, false);
							reloadJobLookup($scope.entity.SpecifyLookupFk);
							// set default job info
							setDefaultJob();
						}
						_firstTimeLoaded = false;
					}
				}

				basicsLookupdataLookupFilterService.registerFilter(filters);

				function init() {
					let defaultType = estimateMainReplaceResourceCommonService.getDefaultType();
					$scope.entity.SpecifyType = defaultType === null ? null: defaultType;

					let estimateService = $injector.get('estimateMainService');
					let isAssemblyModule = $injector.get('platformGridAPI').grids.exist('234bb8c70fd9411299832dcce38ed118');
					if(estimateService && !isAssemblyModule){
						$scope.entity.EstHeaderFk = estimateService.getSelectedEstHeaderId();
					}
					else{
						$scope.entity.EstHeaderFk = null;
					}
				}
				init();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateMainReplaceResourceCommonService.onSpecifyResourceChanged.unregister(reloadJobLookup);
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});
			}]);
})();
