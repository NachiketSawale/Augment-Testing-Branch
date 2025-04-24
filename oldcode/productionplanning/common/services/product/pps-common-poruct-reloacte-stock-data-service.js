(angular => {
	'use strict';
	/* global _, globals */

	const moduleName = 'productionplanning.common';
	const module = angular.module(moduleName);

	module.factory('ppsCommonProductRelocateStockDataService', ProductRelocateStockFactory);

	ProductRelocateStockFactory.$inject = ['$q', '$http', '$translate', 'platformTranslateService'];

	function ProductRelocateStockFactory($q, $http, $translate, platformTranslateService) {
		let service = {};

		service.getFormConfig = () => {
			const config = {
				title: $translate.instant('productionplanning.item.deleteItemTitle'),
				dataItem: null,
				formConfiguration: {
					fid: 'productionplanning.common.relocateStock.',
					version: '1.0.0',
					showGrouping: false,
					addValidationAutomatically: true,
					groups: [{gid: 'baseGroup'}],
					rows: [ {
						gid: 'baseGroup',
						rid: 'availablequantity',
						model: 'AvailableQuantity',
						sortOrder: 5,
						label: '*Available Quantity',
						label$tr$: 'productionplanning.common.product.availableQuantity',
						type: 'quantity',
						readonly: true
					}, {
						gid: 'baseGroup',
						rid: 'planquantity',
						model: 'PlanQuantity',
						sortOrder: 6,
						label: '*Plan Quantity',
						label$tr$: 'productionplanning.common.product.planQuantity',
						type: 'quantity'
					}]
				}
			};
			platformTranslateService.translateFormConfig(config.formConfiguration);
			return config;
		};

		service.init = (ppsItem) => {
			let defer = $q.defer();
			let request = {
				SiteId: ppsItem.SiteFk,
				MdcMaterialId: ppsItem.MdcMaterialFk === null ? 0 : ppsItem.MdcMaterialFk
			};
			let dataItem = {
				MdcMaterialFk: ppsItem.MdcMaterialFk === null ? 0 : ppsItem.MdcMaterialFk,
				SiteFk: ppsItem.SiteFk,
				PpsHeaderFk: ppsItem.PPSHeaderFk,
				PpsItemFk: ppsItem.Id,
				AvailableQuantity: 0,
				PlanQuantity: 0
			};
			$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/getlinkedinternalproducts', request).then(function (response) {
				if (response.data !== null) {
					dataItem.AvailableQuantity = response.data;
				}
				defer.resolve(dataItem);
			});

			return defer.promise;
		};

		service.handleOK = (dataItem) => {
			let request = {
				SiteId: dataItem.SiteFk,
				MdcMaterialId: dataItem.MdcMaterialFk,
				TargetItemId: dataItem.PpsItemFk,
				PlanQuantity: dataItem.PlanQuantity
			};
			return $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/updatelinkedinteralproduct', request).then(function (response) {
				return response.data;
			});
		};

		return service;
	}

})(angular);

