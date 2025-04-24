/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainColumnConfigService', ['basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'estimateMainJobCostcodesLookupService',
		'estimateMainConfigDetailService', '$injector',
		function (basicsLookupdataLookupDescriptorService, platformRuntimeDataService, estimateMainJobCostcodesLookupService, estimateMainConfigDetailService, $injector) {
			let service = {};
			let _CostCodeIdToCollect = [];
			let _PrjCostCodeIdToCollect = [];
			let _CostCodeId2ResourceMap = {};
			let _PrjCostCodeId2ResourceMap = {};
			let _MaterialLineId2ResourceMap = {};
			let _NotAssignedResources = [];
			let ColumnId =
				{
					Code: 1,
					QuantityDetail: 3,
					Quantity: 4,
					UomFk: 5,
					QuantityFactorDetail1: 6,
					QuantityFactorDetail2: 7,
					QuantityFactor1: 8,
					QuantityFactor2: 9,
					QuantityFactor3: 10,
					QuantityFactor4: 11,
					ProductivityFactorDetail: 12,
					ProductivityFactor: 13,
					EfficiencyFactorDetail1: 14,
					EfficiencyFactorDetail2: 15,
					EfficiencyFactor1: 16,
					EfficiencyFactor2: 17,
					QuantityFactorCc: 18,
					QuantityReal: 19,
					QuantityInternal: 20,
					QuantityUnitTarget: 21,
					QuantityTotal: 22,
					CostUnit: 23,
					BasCurrencyFk: 24,
					CostFactorDetail1: 25,
					CostFactorDetail2: 26,
					CostFactor1: 27,
					CostFactor2: 28,
					CostFactorCc: 29,
					CostUnitSubitem: 30,
					CostUnitLineitem: 31,
					CostUnitTarget: 32,
					CostTotal: 33,
					HoursUnit: 34,
					HoursUnitSubitem: 35,
					HoursUnitLineitem: 36,
					HoursUnitTarget: 37,
					HoursTotal: 38,
					IsLumpSum: 39,
					IsDisabled: 40,
					CommentText: 41,
					CostTypeFk: 42,
					ResourceFlagFk: 43,
					IsDisabledPrc: 44,
					ProcurementPackage: 45,
					Budget: 46,
					ShortKey: 47,
					DescriptionInfo: 48,
					IndirectCost: 49,
					IsGerneratePrc: 50,
					Job: 51,
					ProcurementSubPackage: 52,
					ProcurementStructure: 53,
					CostUnitOriginal: 54
				};

			function getColumnName(estColumnConfigDetailEntity) {
				return 'ConfDetail' + estColumnConfigDetailEntity.Id;
			}

			function getSumValue(resources, field) {
				return resources && resources.length > 0 ? _.sumBy(resources, field) : 0;
			}

			function getNotAssignedCostTotal() {
				let value = !_NotAssignedResources || _NotAssignedResources.length === 0 ? 0 : _.sumBy(_NotAssignedResources, 'CostTotal');
				let resourcesCount = !_NotAssignedResources || _NotAssignedResources.length === 0 ? 0 : _NotAssignedResources.length;
				let isGeneratedByRule = !_NotAssignedResources || _NotAssignedResources.length === 0 ? false : _.some(_NotAssignedResources, function (item) {
					return item.EstRuleSourceFk && item.EstRuleSourceFk > 0;
				});

				return {
					IsGeneratedByRule: isGeneratedByRule,
					IsFixedRate: true,
					ResourcesCount: resourcesCount,
					Value: value
				};
			}

			function getIsRate(resources, lookupItem) {
				if (resources && resources.length > 0) {
					return resources[0].IsRate;
				}

				// eslint-disable-next-line no-prototype-builtins
				if (lookupItem && Object.prototype.hasOwnProperty.call(lookupItem, 'IsRate')) {
					return lookupItem.IsRate;
				}

				return true;
			}

			function getColumnValue(item, lineItem, resources, lookupItem) {
				let extendColumnValue = {};
				extendColumnValue.ColumnId = item.ColumnId;
				extendColumnValue.Value = null;
				extendColumnValue.IsFixedRate = getIsRate(resources, lookupItem);
				extendColumnValue.ResourcesCount = !resources || resources.length === 0 ? 0 : resources.length;
				extendColumnValue.IsGeneratedByRule = !resources || resources.length === 0 ? false : _.some(resources, function (item) {
					return item.EstRuleSourceFk && item.EstRuleSourceFk > 0;
				});

				switch (item.ColumnId) {
					case ColumnId.Code: {
						if (item.LineType === 1) {
							extendColumnValue.Value = item.IsCustomProjectCostCode === true ? item.ProjectCostCodeFk : item.MdcCostCodeFk;
						} else {
							extendColumnValue.Value = !resources || resources.length === 0 ? null : resources[0].MdcMaterialFk;
						}
						break;
					}
					case ColumnId.QuantityDetail: {
						extendColumnValue.Value = getValue(resources, 'QuantityDetail');
						break;
					}
					case ColumnId.Quantity: {
						extendColumnValue.Value = getValue(resources, 'Quantity');
						break;
					}
					case ColumnId.UomFk: {
						extendColumnValue.Value = getValue(resources, 'BasUomFk');
						break;
					}
					case ColumnId.QuantityFactorDetail1: {
						extendColumnValue.Value = getValue(resources, 'QuantityFactorDetail1');
						break;
					}
					case ColumnId.QuantityFactorDetail2: {
						extendColumnValue.Value = getValue(resources, 'QuantityFactorDetail2');
						break;
					}
					case ColumnId.QuantityFactor1: {
						extendColumnValue.Value = getValue(resources, 'QuantityFactor1');
						break;
					}
					case ColumnId.QuantityFactor2: {
						extendColumnValue.Value = getValue(resources, 'QuantityFactor2');
						break;
					}
					case ColumnId.QuantityFactor3: {
						extendColumnValue.Value = getValue(resources, 'QuantityFactor3');
						break;
					}
					case ColumnId.QuantityFactor4: {
						extendColumnValue.Value = getValue(resources, 'QuantityFactor4');
						break;
					}
					case ColumnId.ProductivityFactorDetail: {
						extendColumnValue.Value = getValue(resources, 'ProductivityFactorDetail');
						break;
					}
					case ColumnId.ProductivityFactor: {
						extendColumnValue.Value = getValue(resources, 'ProductivityFactor');
						break;
					}
					case ColumnId.EfficiencyFactorDetail1: {
						extendColumnValue.Value = getValue(resources, 'EfficiencyFactorDetail1');
						break;
					}
					case ColumnId.EfficiencyFactorDetail2: {
						extendColumnValue.Value = getValue(resources, 'EfficiencyFactorDetail2');
						break;
					}
					case ColumnId.EfficiencyFactor1: {
						extendColumnValue.Value = getValue(resources, 'EfficiencyFactor1');
						break;
					}
					case ColumnId.EfficiencyFactor2: {
						extendColumnValue.Value = getValue(resources, 'EfficiencyFactor2');
						break;
					}
					case ColumnId.QuantityFactorCc: {
						extendColumnValue.Value = getValue(resources, 'QuantityFactorCc');
						break;
					}
					case ColumnId.QuantityReal: {
						extendColumnValue.Value = getValue(resources, 'QuantityReal');
						break;
					}
					case ColumnId.QuantityInternal: {
						extendColumnValue.Value = getValue(resources, 'QuantityInternal');
						break;
					}
					case ColumnId.QuantityUnitTarget: {
						extendColumnValue.Value = getValue(resources, 'QuantityUnitTarget');
						break;
					}
					case ColumnId.QuantityTotal: {
						extendColumnValue.Value = getSumValue(resources, 'QuantityTotal');
						break;
					}
					case ColumnId.CostUnit: {
						extendColumnValue.Value = getValue(resources, 'CostUnit');
						break;
					}
					case ColumnId.BasCurrencyFk: {
						extendColumnValue.Value = getValue(resources, 'BasCurrencyFk');
						break;
					}
					case ColumnId.CostFactor1: {
						extendColumnValue.Value = getValue(resources, 'CostFactor1');
						break;
					}
					case ColumnId.CostFactor2: {
						extendColumnValue.Value = getValue(resources, 'CostFactor2');
						break;
					}
					case ColumnId.CostFactorDetail1: {
						extendColumnValue.Value = getValue(resources, 'CostFactorDetail1');
						break;
					}
					case ColumnId.CostFactorDetail2: {
						extendColumnValue.Value = getValue(resources, 'CostFactorDetail2');
						break;
					}
					case ColumnId.CostFactorCc: {
						extendColumnValue.Value = getValue(resources, 'CostFactorCc');
						break;
					}
					case ColumnId.CostUnitSubitem: {
						extendColumnValue.Value = getValue(resources, 'CostUnitSubItem');
						break;
					}
					case ColumnId.CostUnitLineitem: {
						extendColumnValue.Value = getSumValue(resources, 'CostUnitLineItem');
						break;
					}
					case ColumnId.CostUnitTarget: {
						extendColumnValue.Value = getValue(resources, 'CostUnitTarget');
						break;
					}
					case ColumnId.CostTotal: {
						extendColumnValue.Value = getSumValue(resources, 'CostTotal');
						break;
					}
					case ColumnId.HoursUnit: {
						extendColumnValue.Value = getValue(resources, 'HoursUnit');
						break;
					}
					case ColumnId.HoursUnitSubitem: {
						extendColumnValue.Value = getValue(resources, 'HoursUnitSubItem');
						break;
					}
					case ColumnId.HoursUnitLineitem: {
						extendColumnValue.Value = getSumValue(resources, 'HoursUnitLineItem');
						break;
					}
					case ColumnId.HoursUnitTarget: {
						extendColumnValue.Value = getValue(resources, 'HoursUnitTarget');
						break;
					}
					case ColumnId.HoursTotal: {
						extendColumnValue.Value = getSumValue(resources, 'HoursTotal');
						break;
					}
					case ColumnId.IsLumpSum: {
						extendColumnValue.Value = getValue(resources, 'IsLumpsum');
						break;
					}
					case ColumnId.IsDisabled: {
						extendColumnValue.Value = getValue(resources, 'IsDisabled');
						break;
					}
					case ColumnId.CommentText: {
						extendColumnValue.Value = getValue(resources, 'CommentText');
						break;
					}
				}

				return extendColumnValue;
			}

			function getValue(resources, field, defaultValue) {
				if (resources && resources.length > 0) {
					let valuesUniq = _.uniq(_.map(resources, field));
					return valuesUniq.length > 1 ? null : valuesUniq[0];
				}

				if (angular.isUndefined(defaultValue)) {
					return null;
				}

				return defaultValue;
			}

			function getCostCodeColumnCofig(costCodeId, isPrjCostCode) {
				if (isPrjCostCode) {
					return getCostCodeColumnConfigFromList(_PrjCostCodeIdToCollect, costCodeId, 'estmasterprojectcostcode');
				} else {
					return getCostCodeColumnConfigFromList(_CostCodeIdToCollect, costCodeId, 'costcode');
				}
			}

			function getCostCodeColumnConfigFromList(costCodeIdListToCollect, costCodeId, lookupTypeId) {
				if (costCodeIdListToCollect.indexOf(costCodeId) > -1) {
					return costCodeId;
				}

				let estCostCodesList = basicsLookupdataLookupDescriptorService.getData(lookupTypeId);
				let currentCostCode = _.find(estCostCodesList, {Id: costCodeId});
				while (currentCostCode) {
					if (currentCostCode && currentCostCode.CostCodeParentFk) {
						if (costCodeIdListToCollect.indexOf(currentCostCode.CostCodeParentFk) > -1) {
							return currentCostCode.CostCodeParentFk;
						}
						currentCostCode = _.find(estCostCodesList, {Id: currentCostCode.CostCodeParentFk});
					} else {
						currentCostCode = null;
					}
				}

				return null;
			}


			function addCostCode(resource) {
				let costCodeFkOfColumnConfig = null;

				if (resource.MdcCostCodeFk) {
					costCodeFkOfColumnConfig = getCostCodeColumnCofig(resource.MdcCostCodeFk, false);

					if (costCodeFkOfColumnConfig) {
						// eslint-disable-next-line no-prototype-builtins
						if (_CostCodeId2ResourceMap.hasOwnProperty(costCodeFkOfColumnConfig)) {
							_CostCodeId2ResourceMap[costCodeFkOfColumnConfig].push(resource);
						} else {
							_CostCodeId2ResourceMap[costCodeFkOfColumnConfig] = [resource];
						}
					} else {
						_NotAssignedResources.push(resource);
					}
				}
				if (resource.ProjectCostCodeFk) {
					costCodeFkOfColumnConfig = getCostCodeColumnCofig(resource.ProjectCostCodeFk, true);

					if (costCodeFkOfColumnConfig) {
						// eslint-disable-next-line no-prototype-builtins
						if (_PrjCostCodeId2ResourceMap.hasOwnProperty(costCodeFkOfColumnConfig)) {
							_PrjCostCodeId2ResourceMap[costCodeFkOfColumnConfig].push(resource);
						} else {
							_PrjCostCodeId2ResourceMap[costCodeFkOfColumnConfig] = [resource];
						}
					} else {
						_NotAssignedResources.push(resource);
					}
				} else {
					_NotAssignedResources.push(resource);
				}
			}

			function addMaterial(resource) {
				// eslint-disable-next-line no-prototype-builtins
				if (_MaterialLineId2ResourceMap.hasOwnProperty(resource.ColumnId)) {
					_MaterialLineId2ResourceMap[resource.ColumnId].push(resource);
				} else {
					_MaterialLineId2ResourceMap[resource.ColumnId] = [resource];
				}
			}

			function addNotAssignedResource(resource) {
				_NotAssignedResources.push(resource);
			}

			function process(resources) {
				if (!resources || !angular.isArray(resources) || resources.length === 0) {
					return;
				}
				let firstLevelResources = _.filter(resources, {EstResourceFk: null});
				let resourceQueue = [].concat(firstLevelResources);
				let estimateMainResourceType = $injector.get('estimateMainResourceType');
				while (resourceQueue.length > 0) {
					let current = resourceQueue.shift();
					switch (current.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode:
						case estimateMainResourceType.Assembly: { // ProjectCostCodeFk
							if (!current.MdcCostCodeFk && !current.ProjectCostCodeFk) {
								addNotAssignedResource(current);
								continue;
							}
							addCostCode(current);
							break;
						}
						case estimateMainResourceType.Material: {
							if (!current.MdcMaterialFk) {
								addNotAssignedResource(current);
								continue;
							}
							if (current.ColumnId > 0) {
								addMaterial(current);
							} else {
								addCostCode(current);
							}
							break;
						}
						case estimateMainResourceType.SubItem: {
							if (angular.isArray(current.EstResources) && current.EstResources.length > 0) {
								_.forEach(current.EstResources, function (item) {
									resourceQueue.push(item);
								});
							}
							break;
						}
						default:
							break;
					}
				}
			}

			function initialize(columnConfigDetails) {
				_CostCodeIdToCollect = _.map(_.filter(columnConfigDetails, function (e) {
					return e.MdcCostCodeFk && e.IsCustomProjectCostCode === false;
				}), 'MdcCostCodeFk');
				_PrjCostCodeIdToCollect = _.map(_.filter(columnConfigDetails, function (e) {
					return e.MdcCostCodeFk && e.IsCustomProjectCostCode === true;
				}), 'MdcCostCodeFk');
				_CostCodeId2ResourceMap = {};
				_PrjCostCodeId2ResourceMap = {};
				_MaterialLineId2ResourceMap = {};
				_NotAssignedResources = [];
			}

			function setExtendColumnReadonly(lineItem, columnName, extendColumnValueObj) {
				// Editable By default
				platformRuntimeDataService.readonly(lineItem, [{field: columnName, readonly: false}]);

				// Conditions
				if (lineItem.EstLineItemFk || extendColumnValueObj.ResourcesCount > 1 || extendColumnValueObj.IsGeneratedByRule) {
					platformRuntimeDataService.readonly(lineItem, [{field: columnName, readonly: true}]);
				} else {
					let field = estimateMainConfigDetailService.getFieldByColumnId(extendColumnValueObj.ColumnId);

					if (field === 'CostUnit') {
						platformRuntimeDataService.readonly(lineItem, [{
							field: columnName,
							readonly: extendColumnValueObj.IsFixedRate
						}]);
					}
				}
			}

			function attachExtendColumnsToLineItem(lineItem, resources, columnConfigDetails, lookupItem) {
				initialize(columnConfigDetails);
				process(resources);
				_.forEach(columnConfigDetails, function (item) {
					let costCodeResources = [];

					if (item.LineType === 1) {
						if (item.IsCustomProjectCostCode === true) {
							// eslint-disable-next-line no-prototype-builtins
							if (item.MdcCostCodeFk && _PrjCostCodeId2ResourceMap.hasOwnProperty(item.MdcCostCodeFk)) {
								costCodeResources = _PrjCostCodeId2ResourceMap[item.MdcCostCodeFk];
							}
						} else {
							// eslint-disable-next-line no-prototype-builtins
							if (item.MdcCostCodeFk && _CostCodeId2ResourceMap.hasOwnProperty(item.MdcCostCodeFk)) {
								costCodeResources = _CostCodeId2ResourceMap[item.MdcCostCodeFk];
							}
						}
					} else {
						// eslint-disable-next-line no-prototype-builtins
						if (_MaterialLineId2ResourceMap.hasOwnProperty(item.MaterialLineId)) {
							costCodeResources = _MaterialLineId2ResourceMap[item.MaterialLineId];
						}
					}

					let costCodeEntity;

					if(item.Project2mdcCstCdeFk){
						costCodeEntity = estimateMainConfigDetailService.getPrjCostCodeById(item.Project2mdcCstCdeFk);
					}else if(item.MdcCostCodeFk){
						costCodeEntity = estimateMainConfigDetailService.getPrjCostCodeByMdcCostCodeFk(item.MdcCostCodeFk);

						if(!costCodeEntity){
							costCodeEntity = estimateMainConfigDetailService.getCostCodeById(item.MdcCostCodeFk);
						}
					}

					/* attach extend column to lineItem */
					let extendColumnName = getColumnName(item);

					let extendColumnValueObj = getColumnValue(item, lineItem, costCodeResources, lookupItem || costCodeEntity);

					lineItem[extendColumnName] = extendColumnValueObj.Value;

					/* set the extend column readonly */
					setExtendColumnReadonly(lineItem, extendColumnName, extendColumnValueObj);

					// //Attach to each line item to keep track of processor
					let key = extendColumnName;
					let columnValue = extendColumnValueObj;
					lineItem[key] = columnValue.Value;
					lineItem['__' + key] = {columnName: key, recordsInfo: columnValue};
				});

				lineItem.NotAssignedCostTotal = getNotAssignedCostTotal().Value;
			}

			function getResourcesByCostCode(resources, columnConfigDetails, costCodeFk) {
				initialize(columnConfigDetails);

				process(resources);

				// PrjCostCode Or MdcCostCodeFk
				// eslint-disable-next-line no-prototype-builtins
				return _CostCodeId2ResourceMap.hasOwnProperty(costCodeFk) ? _CostCodeId2ResourceMap[costCodeFk] :
					// eslint-disable-next-line no-prototype-builtins
					_PrjCostCodeId2ResourceMap.hasOwnProperty(costCodeFk) ? _PrjCostCodeId2ResourceMap[costCodeFk] : [];
			}

			service.getResourcesByCostCode = getResourcesByCostCode;
			service.attachExtendColumnsToLineItem = attachExtendColumnsToLineItem;

			return service;
		}]);
})(angular);
