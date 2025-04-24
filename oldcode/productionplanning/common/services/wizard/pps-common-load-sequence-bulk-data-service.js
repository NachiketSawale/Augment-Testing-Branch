/**
 * Created by mik on 01/10/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('productionplanningCommonLoadSequenceBulkDataService', ProductionplanningCommonLoadSequenceBulkDataService);

	ProductionplanningCommonLoadSequenceBulkDataService.$inject = ['_', 'moment'];

	function ProductionplanningCommonLoadSequenceBulkDataService(_, moment) {
		let service = this;
		let productList = [];
		let selectedEntity;
		let selectedEntities = [];

		service.getList = () => {
			return productList;
		};

		service.setList = (data) => {
			productList = _.cloneDeep(data);
		};

		service.getSelected = () => {
			return false;
		};

		service.getSelectedEntities = () => {
			return selectedEntities;
		};

		service.isSelectedContinual = () => {
			let isContinual = false;
			let lastProductIndex = -1;
			if (selectedEntities.length > 1) {
				isContinual = true;
				let productKeys = getSortedProductKeys(selectedEntities);

				productKeys.forEach(key => {
					if (lastProductIndex > -1 && (key-lastProductIndex) > 1) {
						isContinual = false;
						return false;
					}

					lastProductIndex = key;
				});
			}

			return isContinual;
		};

		service.invertSelectedEntities = () => {
			// let copySelected = _.cloneDeep(selectedEntities);
			let productKeys = getSortedProductKeys(selectedEntities);
			reorderSelected(productKeys);
		};

		function getSortedProductKeys(data) {
			let productKeys = [];
			data.forEach((item) => {
				let productIndex = productList.findIndex((product) => {
					return product.Id === item.Id;
				});
				productKeys.push(productIndex);
			});

			return productKeys.sort((a, b) => {
				return a - b;
			});
		}

		function reorderSelected(keys) {
			if (keys.length > 1) {
				const from = keys[0];
				const to = keys.at(-1);

				// remove first and last entry
				keys.splice(0, 1);
				keys.splice(-1, 1);

				orderProductList(from, to);
				reorderSelected(keys);
			}
		}

		service.getItemName = () => {
			return 'ProductDto';
		};

		service.getModule = () => {
			return {
				name:  moduleName
			};
		};

		service.setSelected = (entity, entities) => {
			selectedEntity = entity;
			selectedEntities = entities;
		};

		service.updateSelected = (property, value, selected) => {
			selected.forEach((item) => {
				productList.find((product) => {
					if (product.Id === item.Id) {
						product.time = moment(value);
					}
				});
			});
		};

		service.isReadonly = () => {
			return false;
		};

		service.supportsMultiSelection = () => {
			return true;
		};

		function orderProductList(from, to) {
			let tempProduct = _.cloneDeep(productList[from]);
			productList[from] = _.cloneDeep(productList[to]);
			productList[to] = tempProduct;

			productList.forEach((product, index) => product.fieldSequence = index + 1);
		}

		return service;
	}
})(angular);