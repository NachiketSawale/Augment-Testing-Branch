/**
 * Created by zwz on 2022/8/22.
 */
(function () {
	'use strict';
	/* global globals, angular, _ */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsPlannedQuantityPreviewedComponentsHandler', Handler);
	Handler.$inject = ['$q', '$http', '$injector'];

	function Handler($q, $http, $injector) {
		function processPreviewedComponents(previewedComponents, selectPUQty) {
			let id = 1;
			_.each(previewedComponents, (comp) => {
				if (comp.Id === 0) {
					comp.Id = id;
					++id;
				}
				comp.InsertedBy = 1;
				comp.QuantityPerUnit = comp.Quantity * selectPUQty;

				comp.BillingQuantityPerPU = comp.BillingQuantity * selectPUQty;
				comp.IsProportionalBill = true;

				if (comp.IsReadonly) {
					$injector.get('platformRuntimeDataService').readonly(comp, true);
				}
			});
		}

		this.createQuantityMappingInfos = function createQuantityMappingInfos(plannedquantityList, selectedPU) {
			if (plannedquantityList.length <= 0) {
				return [];
			}
			return plannedquantityList.map(function (item) {
				return {
					PpsProductTemplateId: selectedPU.ProductDescriptionFk,
					PpsPlannedQtyId: item.Id,
					Quantity: item.AssigningQuantityOneUnit,
					BillingQuantity: item.AssigningBillingQuantityPerProduct
				};
			});
		};

		this.getPreviewedComponents = function getPreviewedComponents(quantityMappingInfos, selectPUQty) {
			let defer = $q.defer();
			if (quantityMappingInfos.length <= 0) {
				defer.resolve([]);
			} else {
				let url = globals.webApiBaseUrl + 'productionplanning/drawing/component/previewcomponents';
				$http.post(url, quantityMappingInfos).then(function (response) {
					let previewedComponents = [];
					if (response.data) {
						previewedComponents = response.data;
						processPreviewedComponents(previewedComponents, selectPUQty);
					}
					defer.resolve(previewedComponents);
				});
			}
			return defer.promise;
		};

		this.mergeWithExistingComponents = function (newComponents, existingComponents, selectPUQty) {
			for (const comp of newComponents) {
				const existing = existingComponents.filter(i => i.Id === comp.Id)[0];
				if (existing) {
					comp.Quantity = existing.Quantity;
					comp.Quantity2 = existing.Quantity2;
					comp.Quantity3 = existing.Quantity3;
				}
			}
			processPreviewedComponents(newComponents, selectPUQty);
		};
	}
})();