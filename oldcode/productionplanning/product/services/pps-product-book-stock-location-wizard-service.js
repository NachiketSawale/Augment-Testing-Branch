/**
 * Created by zwz on 01/18/2022.
 */

(function (angular) {
	'use strict';
	/* global angular, Slick, globals, _ */
	var moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('productionplanningProductBookStockLocationWizardService', WizardService);
	WizardService.$inject = ['$http', '$injector', '$translate',
		'platformTranslateService', 'platformGridAPI', 'platformContextService',
		'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
		'transportplanningBundleTrsProjectConfigService',];

	function WizardService($http, $injector, $translate,
		platformTranslateService, platformGridAPI, platformContextService,
		lookupdataConfigGenerator, lookupDescriptorService, lookupFilterService,
		trsProjectConfigService) {

		var service = {};

		function getFormConfig(scope) {
			return {
				fid: 'productionplanning.product.bookStockLocation',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'TargetStockId',
						model: 'TargetStockId',
						required: true,
						label: 'Target Stock*',
						label$tr$: 'productionplanning.product.wizard.targetStock',
						type: 'directive',
						directive: 'basics-site-stock-lookup-dialog',
						change: function (entity, model) {
							// reset TargetStockLocationId when TargetStockId is changed.
							entity.TargetStockLocationId = null;
						},
						options: {
							lookupOptions: {
								showClearButton: true
							},
							additionalFilters : [{
								getAdditionalEntity: function(){return scope.trsPrjConfig;},
								ProjectId: 'ProjectFk'
							}]
						}
					},
					{
						gid: 'baseGroup',
						rid: 'TargetStockLocationId',
						model: 'TargetStockLocationId',
						label: 'Target Stock Location*',
						label$tr$: 'productionplanning.product.wizard.targetStockLocation',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: lookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectStockLocationLookupDataService',
							enableCache: true,
							valMember: 'Id',
							dispMember: 'Code',
							filter: function (entity) {
								var stockId;
								if (entity) {
									stockId = entity.TargetStockId;
								}
								return stockId;
							}
						}).detail.options
					},
				]
			};
		}

		function getGridConfig($scope) {
			return {
				id: 'ae096a55081244d29520dbae0e9c89dd',
				state: 'ae096a55081244d29520dbae0e9c89dd',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						formatter: 'translation',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Bundle',
						field: 'TrsProductBundleFk',
						name: 'Bundle*',
						name$tr$: 'productionplanning.common.product.trsProductBundleFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TrsBundleLookup',
							displayMember: 'Code'
						}
					},
					{
						id: 'latestStock',
						field: 'LatestStockId',
						name: 'Latest Stock*',
						name$tr$: 'productionplanning.product.wizard.latestStock',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProjectStock',
							displayMember: 'Code'
						},
						readonly: true
					},
					{
						id: 'latestLocation',
						field: 'LatestStockLocationId',
						name: 'Latest Stock Location*',
						name$tr$: 'productionplanning.product.wizard.latestLocation',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProjectStock2ProjectStockLocation',
							displayMember: 'Code'
						}
					},

				],
				options: {
					indicator: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				data: $scope.products
			};
		}

		function getTrsPrjConfig(){
			let trsPrjConfig = {};

			let trsPrjConfigs = trsProjectConfigService.getConfigList();
			let loginComoanyId = platformContextService.getContext().clientId;
			let filterConfigs = _.filter(trsPrjConfigs, function (config) {
				return config.CompanyFk === loginComoanyId && config.IsDefault;
			});

			if(filterConfigs.length >= 1){
				let tmpConfig = _.find(filterConfigs, {IsDefault: true});
				if(!_.isNil(tmpConfig)){
					trsPrjConfig = tmpConfig;
				}
				else {
					trsPrjConfig = filterConfigs[0];
				}
			}
			return trsPrjConfig;
		}

		service.initial = function initial($scope, $options) {
			_.extend($scope, $options);

			$scope.entity = {Mode: '1', TargetStockId: null, TargetStockLocationId: null};

			$scope.trsPrjConfig = getTrsPrjConfig();

			// form config
			var filterFormConfig = getFormConfig($scope);
			$scope.formOptions = { configure: platformTranslateService.translateFormConfig(filterFormConfig) };

			// grid config
			var gridConfig = getGridConfig($scope);
			gridConfig.columns.current = gridConfig.columns;
			platformGridAPI.grids.config(gridConfig);
			$scope.grid = gridConfig;

			$scope.onCheckedMode1 = function (entity){
				//entity.Mode === '1'

			};

			$scope.onCheckedMode2 = function (entity){
				// entity.Mode === '2'
				//if(entity.Mode === '2'){
				//entity.TargetStockId = null;
				//entity.TargetStockLocationId = null;
				//}
			};


			$scope.isOKDisabled = function () {
				// check for mode, for mode "bookOrRebookProductToStock",TargetStockId is required.
				if($scope.entity.Mode === '1'){
					if(_.isNil($scope.entity.TargetStockId)){
						return true;
					}
				}
			};

			$scope.handleOK = function () {
				var products = $scope.grid.data;
				if($scope.entity.Mode === '1'){
					_.each(products,function (p){
						p.NextStockId = $scope.entity.TargetStockId;
						p.NextStockLocationId = $scope.entity.TargetStockLocationId;
					});
				}
				var updateDto = {
					ReceivingStockTransactionTypeId:$scope.wizardParas['receivingStockTransactionTypeId'],
					ConsumingStockTransactionTypeId:$scope.wizardParas['consumingStockTransactionTypeId'],
					Products: products
				};
				$http.post(globals.webApiBaseUrl+'productionplanning/common/productwithstockinfo/update',updateDto).then(function (respond){
					if($scope.productService && $scope.productService.handleBookProductsToStockLocationWizardDone){
						$scope.productService.handleBookProductsToStockLocationWizardDone(updateDto.Products);
					}
				});

				$scope.$close(true);
			};

			$scope.modalOptions = {
				headerText: $translate.instant('productionplanning.product.wizard.bookStockLocationTitle'),
				cancel: close
			};

			function close() {
				return $scope.$close(false);
			}
		};

		return service;
	}

})(angular);
