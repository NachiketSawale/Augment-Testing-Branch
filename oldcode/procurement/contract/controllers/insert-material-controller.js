/**
 * Created by ltn on 8/9/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.contract').controller('procurementContractInsertMaterialController',
		['$scope', '$translate','platformModalService', 'platformTranslateService','basicsLookupdataLookupFilterService',
			function ($scope, $translate, platformModalService, platformTranslateService, basicsLookupdataLookupFilterService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.formOptions = {
					'fid': 'contract.wizard.insertMaterial',  // contract header form identifier
					'version': '1.0.0',     // if same version setting can be reused, otherwise discard settings
					showGrouping: false,
					title$tr$: '',

					'groups': [
						{
							'gid': 'InsertMaterial',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'materialcatalogfk',
							'gid': 'InsertMaterial',
							'label$tr$': 'procurement.common.wizard.insertMaterial.materialCatalog',
							'type': 'directive',
							'model': 'materialcatalogfk',
							'directive': 'basics-material-material-catalog-lookup',
							'options': {
								'showClearButton': true,
								'filterKey': 'procurement-contract-material-catalog-filter',
								'events':[
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if(args.entity.materialcatalogfk !== args.selectedItem.Id){
												args.entity.materialgroupfk = null;
											}
										}
									}
								]
							}
						},{
							'rid': 'materialgroupfk',
							'gid': 'InsertMaterial',
							'label$tr$': 'procurement.common.wizard.insertMaterial.materialGroup',
							'type': 'directive',
							'model': 'materialgroupfk',
							validator: 'materialIdChange',
							required: true,
							'directive': 'material-Group-Insert-Material-Lookup',
							'options': {
								'showClearButton': false,
								'filterKey': 'insert-material-group-filter',
								'events':[
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.materialcatalogfk = args.selectedItem.MaterialCatalogFk;
											$scope.isInValidGroup = false;
										}
									}
								]
							}
						},{
							'rid': 'materialdiscountgroupfk',
							'gid': 'InsertMaterial',
							'label$tr$': 'procurement.common.wizard.insertMaterial.discountGroup',
							'type': 'directive',
							'model': 'materialdiscountgroupfk',
							'directive': 'basics-material-material-discount-group-lookup',
							'options': {
								'showClearButton': true,
								'filterKey': 'procurement-contract-material-discount-group-filter',
								'events':[
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.materialcatalogfk = args.selectedItem.MaterialCatalogFk;
										}
									}
								]
							}
						}
					]
				};

				$scope.currentItem = {
					materialcatalogfk: null,
					materialgroupfk: null,
					materialdiscountgroupfk: null
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

				$scope.isInValidGroup = false;

				$scope.materialIdChange = function(entity,value) {
					if(value < 0) {
						$scope.isInValidGroup = true;
						return {apply:false, valid: false,error: $translate.instant('procurement.common.wizard.insertMaterial.invalidGroup')};
					}
				};

				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.common.wizard.insertMaterial.insertMaterialTitle')
				};

				$scope.modalOptions.ok = function onOK() {
					if($scope.currentItem.materialgroupfk === null) {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.insertMaterial.errorMessageInfo'), $translate.instant('procurement.common.wizard.insertMaterial.errorMessage'), 'warning');
						return;
					}

					$scope.$close($scope.currentItem);
				};
				$scope.modalOptions.close = function onCancel() {
					$scope.$close(false);
				};
				$scope.modalOptions.cancel = $scope.modalOptions.close;

				var filters = [{
					key: 'insert-material-group-filter',
					serverSide: true,
					fn: function (currentItem) {
						return currentItem.materialcatalogfk === null ? '' : 'MaterialCatalogFk=' + currentItem.materialcatalogfk;
					}
				},{
					key: 'procurement-contract-material-discount-group-filter',
					serverSide: true,
					fn: function (currentItem) {
						return currentItem.materialcatalogfk === null ? '' : 'MaterialCatalogFk=' + currentItem.materialcatalogfk;
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(filters);
				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});

			}]);
})(angular);




