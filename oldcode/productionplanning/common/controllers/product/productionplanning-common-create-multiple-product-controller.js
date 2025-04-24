/**
 * Created by anl on 15/06/2022.
 */

(function (angular) {
	'use strict';
	/* global angular, globals */

	let moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('productionplanningCommonCreateMultipleProductController', CreateMultipleProductController);
	CreateMultipleProductController.$inject = [
		'$scope',
		'$http',
		'basicsLookupdataLookupFilterService',
		'platformModalService',
		'$translate',
		'platformTranslateService',
		'productionplanningItemDailyProductionDataService',
		'params'];

	function CreateMultipleProductController($scope,
		$http,
		basicsLookupdataLookupFilterService,
		platformModalService,
		$translate,
		platformTranslateService,
		dailyProductionDataService,
		params) {

		let productService = params.productService;
		let PpsItem = params.PpsItem;
		let subPuSiteChildrenIds = params.subPuSiteChildrenIds;
		let isProcessConfigured = params.isProcessConfigured;
		let endDate = params.endDate;

		const close = () => {
			return $scope.$close(false);
		};

		const prodPlaceFilterKey = 'productMultipleCreationProductionPlaceSiteFilter';
		let filters = [{
			key: prodPlaceFilterKey,
			fn: (prodPlaceEntity) => subPuSiteChildrenIds.includes(prodPlaceEntity.BasSiteFk)
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		const createInputRows = () => {
			return {
				fid: 'productionplanning.common.product.multipleCreation',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'request',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}],
				rows: [
					{
						gid: 'request',
						rid: 'createNumber',
						type: 'integer',
						label: '*Create Number',
						label$tr$: 'productionplanning.common.product.createNumber',
						model: 'CreateNumber',
						sortOrder: 1
					}, {
						gid: 'request',
						rid: 'prodPlaceFk',
						model: 'ProdPlaceFk',
						sortOrder: 2,
						label$tr$: 'productionplanning.product.productionPlace.productionPlace',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'pps-production-place-dialog-lookup',
							lookupOptions: {
								lookupType: 'PpsProductionPlace',
								filterKey: prodPlaceFilterKey,
								showClearButton: true,
								version: 3
							}
						},
						readonly: !isProcessConfigured // if has no process config, then we cannot set PpsProcessFk of product on multiple creation, then we cannot finally assign production place to phase of process of product. for this situation, we will make this field readonly
					}]
			};
		};

		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(createInputRows())
		};
		$scope.formOptions.entity = {CreateNumber: 1};

		$scope.handleOK = () => {
			let productInfo = {
				Code: 'ProductInfo',
				ItemFk: PpsItem.Id,
				LgmJobFk: PpsItem.LgmJobFk,
				ProductionSetFk: PpsItem.ProductionSetId,
				ProductDescriptionFk: PpsItem.ProductDescriptionFk,
				ProdPlaceFk: $scope.formOptions.entity.ProdPlaceFk,
				EndDate: endDate,
				Count: $scope.formOptions.entity.CreateNumber
			};

			$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/multicreation', productInfo).then((result) => {
				if (result.data.length > 0) {
					productService.load();
					$scope.$close(false);
				}
			});
		};

		$scope.modalOptions = {
			headerText: $translate.instant('productionplanning.common.product.multipleCreation'),
			cancel: close
		};

		$scope.isOKDisabled = () => {
			return $scope.formOptions.entity.CreateNumber <= 0 || $scope.formOptions.entity.CreateNumber === null;
		};

		$scope.$on('$destroy', () => {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		});
	}
})(angular);