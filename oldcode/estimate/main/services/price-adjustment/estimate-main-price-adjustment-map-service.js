(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainPriceAdjustmentMapService', ['_', '$translate',
		function (_, $translate) {
			// 1.Definition mapOption
			const URB_COUNT = 6; // URB

			const generateUrbRows = (count) =>
				Array.from({length: count}, (_, i) => {
					const num = i + 1;
					return [`Urb${num}`, {
						AdjType: $translate.instant('estimate.main.priceAdjust.URBreakdown', {num}),
						EstimatedPrice: `Urb${num}Estimated`,
						AdjustmentPrice: `Urb${num}Adjustment`,
						TenderPrice: `Urb${num}Tender`,
						DeltaA: `Urb${num}Delta`
					}];
				});

			const mapOption = {
				Rows: Object.fromEntries([
					...generateUrbRows(URB_COUNT),
					['EpNa', {AdjType: $translate.instant('estimate.main.priceAdjust.EpnaEstimagted'), EstimatedPrice: 'EpnaEstimagted'}],
					['Ur', {AdjType: $translate.instant('estimate.main.priceAdjust.URRate'), EstimatedPrice: 'UrEstimated', AdjustmentPrice: 'UrAdjustment', TenderPrice: 'UrTender', DeltaA: 'UrDelta'}],
					['Wq', {AdjType: $translate.instant('estimate.main.priceAdjust.WQ'), Quantity: 'WqQuantity', EstimatedPrice: 'WqEstimatedPrice', AdjustmentPrice: 'WqAdjustmentPrice', TenderPrice: 'WqTenderPrice', DeltaA: 'WqDeltaPrice'}],
					['Aq', {AdjType: $translate.instant('estimate.main.priceAdjust.AQ'), Quantity: 'AqQuantity', EstimatedPrice: 'AqEstimatedPrice', AdjustmentPrice: 'AqAdjustmentPrice', TenderPrice: 'AqTenderPrice', DeltaA: 'AqDeltaPrice'}],
					['TotalWq', {AdjType: $translate.instant('estimate.main.priceAdjust.TotalWQ'), Quantity: 'WqQuantity', EstimatedPrice: 'WqEstimatedPrice', AdjustmentPrice: 'WqAdjustmentPrice', TenderPrice: 'WqTenderPrice', DeltaA: 'WqDeltaPrice'}],
					['TotalAq', {AdjType: $translate.instant('estimate.main.priceAdjust.TotalAQ'), Quantity: 'AqQuantity', EstimatedPrice: 'AqEstimatedPrice', AdjustmentPrice: 'AqAdjustmentPrice', TenderPrice: 'AqTenderPrice', DeltaA: 'AqDeltaPrice'}]
				]),
				Columns: ['Id', 'AdjType', 'Quantity', 'EstimatedPrice', 'AdjustmentPrice', 'TenderPrice', 'DeltaA', 'DeltaB']
			};

			// 2. Use ES6 Class refactoring
			class AdjustmentTotalEntity {
				constructor(entity, vRoot, readOnlyURBFields) {
					this.entity = entity;
					this.Id = entity.Id;
					this.vRoot = vRoot;
					this.readOnlyURBFileds = new Set(readOnlyURBFields); 
					this.mapList = [];
					this.CreateGridList();
				}

				// 2.1. CreateGridList
				CreateGridList() {
					const {entity, vRoot, readOnlyURBFileds} = this;
					if (!entity || !vRoot) {
						return [];
					}

					const isExistUrb = readOnlyURBFileds.size < URB_COUNT;

					this.mapList = Object.keys(mapOption.Rows)
						.filter(r => !readOnlyURBFileds.has(r))
						.map(r => this.createRowItem(r, isExistUrb))
						.filter(Boolean); // filter not null

					return this.mapList;
				}

				// 2.2. createRowItem
				createRowItem(rowKey, isExistUrb) {
					const rowConfig = mapOption.Rows[rowKey];
					const item = {Id: rowKey, AdjType: rowConfig.AdjType};

					if (rowKey === 'Ur') {
						item.Status = this.entity.Status;
					}

					mapOption.Columns.forEach(c => {
						if (c === 'Id' || c === 'AdjType') {return;}
						const field = rowConfig[c];
						if (!field) {return;}
						item[c] = ['TotalWq', 'TotalAq'].includes(rowKey) ? this.vRoot[field] : this.entity[field];
					});

					return this.processSpecialCases(item, rowKey, isExistUrb);
				}

				// 2.3. processSpecialCases
				processSpecialCases(item, rowKey, isExistUrb) {
					if (rowKey === 'EpNa') {
						item.Quantity = item.AdjType;
						item.AdjType = '';
						const shouldAdd = this.entity.EpnaEstimagted !== null && this.entity.Id > -1 && isExistUrb;
						return shouldAdd ? item : null;
					}

					item.DeltaB = this.calculateDeltaB(item, rowKey);
					return item;
				}

				// 2.4. calculateDeltaB
				calculateDeltaB(item, rowKey) {
					if (rowKey === 'Ur' && this.entity.Id === -1) {
						return null;
					}
					const {AdjustmentPrice, TenderPrice} = item;
					return AdjustmentPrice !== null && TenderPrice !== null ? TenderPrice - AdjustmentPrice : AdjustmentPrice !== null ? 0 : null;
				}

				// 2.5. getGridData
				getGridData() {
					return this.mapList;
				}

				// 2.6. getMappingField
				getMappingField(item, field) {
					return mapOption.Rows[item.Id][field];
				}

				// 2.7. calculateDeltaBUpdate
				calculateDeltaBUpdate(item, newValue) {
					const {AdjustmentPrice, DeltaA, TenderPrice} = mapOption.Rows[item.Id];
					const targetField = this.entity[AdjustmentPrice] === null ? DeltaA : TenderPrice;
					this.entity[targetField] = targetField === DeltaA ? newValue : newValue + this.entity[AdjustmentPrice];
					return {newField: targetField, newValue: this.entity[targetField]};
				}
			}

			// 3. Export service
			return {
				CreateAdjustmentTotalEntity: (entity, vRoot, readOnlyURBFileds) =>
					new AdjustmentTotalEntity(entity, vRoot, readOnlyURBFileds)
			};
		}]);
})(angular);