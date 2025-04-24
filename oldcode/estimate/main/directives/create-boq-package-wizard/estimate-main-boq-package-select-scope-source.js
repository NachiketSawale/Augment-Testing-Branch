/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainBoqPackageSelectScopeSource', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-boq-package-select-scope-source-template.html',
				controller: ['$scope', 'platformTranslateService', 'basicsLookupdataConfigGenerator',
					'estimateMainPackageSourceTypeConfigService', 'estimateMainWicBoqLookupService', 'estimateMainScopeSelectionService','estimateMainService',
					function ($scope, platformTranslateService, basicsLookupdataConfigGenerator,
						estimateMainPackageSourceTypeConfigService, estimateMainWicBoqLookupService, estimateMainScopeSelectionService,estimateMainService) {


						$scope.noLineItemSelected= !(estimateMainService.getSelectedEntities().length >0);
						$scope.estimateScope = $scope.$parent.entity.estimateScope;
						$scope.isSelectedReferenceLineItem = $scope.$parent.entity.isSelectedReferenceLineItem;
						$scope.isSelectedMultiplePackageAssignmentMode = $scope.$parent.entity.isSelectedMultiplePackageAssignmentMode;
						$scope.formOptions = {
							configure: platformTranslateService.translateFormConfig({
								fid: 'selectScopeSource',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [{
									gid: 'default'
								}],
								rows: [
									{
										gid: 'default',
										rid: 'groupStructureSourceType',
										model: 'groupStructureSourceType',
										type: 'select',
										change: 'changeSourceType',
										options: {
											valueMember: 'value',
											displayMember: 'label',
											items: estimateMainPackageSourceTypeConfigService.PACKAGE_SOURCE_TYPE.getAllSourceTypesAsArray()
										},
									}
								]
							})
						};
						$scope.changeSourceType = function(){
							$scope.$emit('form-config-updated-rendered');
						};

						$scope.onResult=function(value){
							$scope.estimateScope = value;
							$scope.$parent.entity.estimateScope=value;
						};

						$scope.wicGroupList = estimateMainWicBoqLookupService.list;

						$scope.ChooseSelectionStructureOption = {
							configure: platformTranslateService.translateFormConfig({
								fid: 'selectedPrcStructureIdList',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [{
									gid: 'default'
								}],
								rows: [
									{
										gid: 'default',
										rid: 'strurctrueSourceType',
										model: 'strurctrueSourceType',
										type: 'select',
										change: 'changeSourceType',
										options: {
											valueMember: 'value',
											displayMember: 'label',
											items: estimateMainPackageSourceTypeConfigService.PRC_STRUCTURE_TYPE.getAllStructureTypesAsArray()
										},
									}
								]
							})
						};

						/*  $scope.wicGroupFormOptions = {
                              configure: platformTranslateService.translateFormConfig({
                                  fid: 'selectWicBoq',
                                  showGrouping: false,
                                  skipPermissionsCheck: true,
                                  groups: [{
                                      gid: 'default'
                                  }],
                                  rows: [
                                      basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
                                              dataServiceName: 'estimateMainWicBoqLookupService',
                                              enableCache: false
                                          },
                                          {
                                              gid: 'default',
                                              rid: 'wicGroup',
                                              model: 'wicGroupId'
                                          }
                                      )
                                  ]
                              })
                          }; */
					}]
			};
		}
	]);

})(angular);
