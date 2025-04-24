/**
 * Created by waldrop on 01.15.2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainConfigDetailService', ['$http', 'globals', 'platformDomainService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', '_',
		function ($http, globals, platformDomainService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService, _) {

			var service = {};

			var selectedLookupItem = {};

			var material2CostCode = [];// material2costcode array

			var CalculateField = ['quantity', 'quantityfactor1', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
				'productivityfactor', 'efficiencyfactor1', 'efficiencyfactor2', 'quantityfactorcc', 'quantityreal', 'quantityinternal',
				'quantityunittarget', 'quantitytotal', 'costunit', 'costfactor1', 'costfactor2', 'costfactorcc', 'costunitsubitem',
				'costunitlineitem', 'costunittarget', 'costtotal', 'hoursunit', 'hoursunitsubitem', 'hoursunitlineitem',
				'hoursunittarget', 'hourstotal'];

			var columnConfig = {
				'columnInfo': {
					'code': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 4
					},
					'quantitydetail': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 5
					},
					'quantity': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 2
					},
					'basuomfk': {
						'readonly': true,
						'type': 'foreignkey',
						'calculatetype': 1
					},
					'quantityfactordetail1': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 1
					},
					'quantityfactordetail2': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 1
					},
					'quantityfactor1': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'quantityfactor2': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'quantityfactor3': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'quantityfactor4': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'productivityfactordetail': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 1
					},
					'productivityfactor': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'efficiencyfactordetail1': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 1
					},
					'efficiencyfactordetail2': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 1
					},
					'efficiencyfactor1': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'efficiencyfactor2': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'quantityfactorcc': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 2
					},
					'quantityreal': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'quantityinternal': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'quantityunittarget': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'quantitytotal': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 2
					},
					'costunit': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 1
					},
					'bascurrencyfk': {
						'readonly': true,
						'type': 'foreignkey',
						'calculatetype': 1
					},
					'costfactordetail1': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 1
					},
					'costfactordetail2': {
						'readonly': false,
						'type': 'string',
						'calculatetype': 1
					},
					'costfactor1': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'costfactor2': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 3
					},
					'costfactorcc': {
						'readonly': false,
						'type': 'numeric',
						'calculatetype': 2
					},
					'costunitsubitem': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'costunitlineitem': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'costunittarget': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'costtotal': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 2
					},
					'hoursunit': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'hoursunitsubitem': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'hoursunitlineitem': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'hoursunittarget': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'hourstotal': {
						'readonly': true,
						'type': 'numeric',
						'calculatetype': 1
					},
					'islumpsum': {
						'readonly': true,
						'type': 'bool',
						'calculatetype': 1
					},
					'isdisabled': {
						'readonly': true,
						'type': 'bool',
						'calculatetype': 1
					},
					'commenttext': {
						'readonly': true,
						'type': 'string',
						'calculatetype': 1
					}
				}
			};

			service.getColumnInfoByFieldName = function (fieldName) {

				var column = fieldName.toLowerCase();

				if (Object.prototype.hasOwnProperty.call(columnConfig.columnInfo,column)) {

					return columnConfig.columnInfo[column];
				}

				return null;

			};

			service.isReadonly = function (columnField) {

				var column = columnField.toLowerCase();

				if (Object.prototype.hasOwnProperty.call(columnConfig.columnInfo,column)) {

					return columnConfig.columnInfo[column].readonly;
				}

				return false;
			};

			service.isCalculateField = function (columnField) {
				var column = columnField.toLowerCase();
				return CalculateField.indexOf(column) > -1;
			};

			var lineItemIds = []; // lineItem id array which has get the material2costcode relationship
			service.addLineItemId = function (headerId, lineItemId) {
				if (_.findIndex(lineItemIds, {HeaderId: headerId, LineItemId: lineItemId}) < 0) {
					lineItemIds.push({HeaderId: headerId, LineItemId: lineItemId});
					var requestData = {};
					requestData.estHeaderId = headerId;
					requestData.estLineItemId = lineItemId;
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getmaterialcostcode', requestData).then(function (response) {
						material2CostCode = material2CostCode.concat(response.data);
					});
				}
			};

			service.addMatetial2CostCode = function addMatetial2CostCode(value) {
				if (_.findIndex(material2CostCode, {MaterialId: value.MaterialId}) < 0) {
					material2CostCode.push(value);
				}
			};
			service.getCostCodeByMaterialId = function (materialId) {
				var costCode = _.find(material2CostCode, {MaterialId: materialId});
				if (costCode) {
					return costCode;
				} else {
					var requestData = {};
					requestData.materialId = materialId;
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getmaterialcostcode', requestData).then(function (response) {
						if (response.data && response.data.length > 0) {
							material2CostCode = material2CostCode.concat(response.data);
							return response.data[0];
						} else {
							return null;
						}
					});
				}
			};

			// eslint-disable-next-line no-unused-vars
			var isColumnConfigShow = false;
			service.setColumnConfig = function (needToShow) {
				isColumnConfigShow = needToShow;
			};

			// cache which save the columnConfigDetail ,are used to calculate the dynamic column summary
			var columnConfigDetail = [];
			service.getColumnConfigDetails = function () {
				return columnConfigDetail;
			};
			service.setColumnConfigDetails = function (value) {
				columnConfigDetail = value;
			};
			service.getConfigDetialById = function (ConfigDetialId) {
				return _.find(columnConfigDetail, {Id: ConfigDetialId});
			};

			// save the costcode info which to be used when insert a new costcode resource
			var costCodeInfo = [];
			service.setCostCodeInfo = function (value) {
				costCodeInfo = value;
			};
			service.getCostCodeList = function () {
				return costCodeInfo;
			};
			service.getCostCodeById = function (costCodeId) {
				return _.find(costCodeInfo, {Id: costCodeId});
			};

			var dynimacColumns = [];
			service.setDynamicColumns = function (value) {
				dynimacColumns = value;
			};
			service.getDynamicColumns = function () {
				return dynimacColumns;
			};
			service.getIdByColumnId = function (columnId) {
				var columnItem = _.find(dynimacColumns, {ColumnId: columnId});
				if (columnItem === null) {
					return null;
				} else {
					return columnItem.Id;
				}
			};
			service.getFieldByColumnId = function (columnId) {
				var columnItem = _.find(dynimacColumns, {ColumnId: columnId});
				if (columnItem === null) {
					return null;
				} else {
					return columnItem.Field;
				}
			};

			service.getColumnIdByField = function (fieldName) {
				var columnItem = _.find(dynimacColumns, {Field: fieldName});
				if (columnItem === null) {
					return -1;
				} else {
					return columnItem.ColumnId;
				}
			};

			var materialInfo = [];
			service.setMaterialInfo = function (value) {
				materialInfo = value;
			};
			service.setMaterialInfo = function () {
				return materialInfo;
			};

			service.setInfo = function (InfoValue) {
				if (angular.isObject(InfoValue) && InfoValue !== null) {
					if (angular.isDefined(InfoValue.CostCode)) {
						costCodeInfo = InfoValue.CostCode;
					}
					if (angular.isDefined(InfoValue.Main)) {
						columnConfigDetail = InfoValue.Main;
					}
					if (angular.isDefined(InfoValue.DynamicColumns)) {
						dynimacColumns = InfoValue.DynamicColumns;
					}
					if (angular.isDefined(InfoValue.MaterialV)) {
						materialInfo = InfoValue.MaterialV;
					}
				}
			};

			service.onColumnConfigChanged = new Platform.Messenger();

			service.addExtendData = function (item, fieldNeedModify, fieldValueNeedModify, configDetailInfo) {
				item.ColumnId = configDetailInfo.MaterialLineId;
				item.EstResourceTypeFk = configDetailInfo.LineType;
				item.MdcCostCodeFk = configDetailInfo.MdcCostCodeFk;
				item.MdcMaterialFk = configDetailInfo.MdcMaterialFk;
				// modify the field directly
				if (configDetailInfo.ColumnId !== 1) {
					item[fieldNeedModify] = fieldValueNeedModify;
				}

				if (configDetailInfo.LineType === 1) {
					item.MdcMaterialFk = null;
					if (configDetailInfo.MdcCostCodeFk && configDetailInfo.MdcCostCodeFk > 0) {

						// use master cost code and project cost code to get the current Cost Code
						var estCostCodes = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');
						var currentCostCode = _.find(estCostCodes, {Id: configDetailInfo.MdcCostCodeFk});
						if (angular.isDefined(currentCostCode) && currentCostCode !== null) {
							service.setSelectedLookupItem(currentCostCode);
							item.Code = currentCostCode.Code;
							item.DescriptionInfo = currentCostCode.DescriptionInfo;
							item.CostUnit = currentCostCode.Rate;
							item.BasUomFk = currentCostCode.UomFk;
							item.BasCurrencyFk = currentCostCode.CurrencyFk;
							item.CostFactorCc = currentCostCode.RealFactorCosts;
							item.QuantityFactorCc = currentCostCode.RealFactorQuantity;
						}
					}

					item.EstResourceTypeFk = 1;
					item.EstResourceTypeFkExtend = 1;
				} else {
					item.EstResourceTypeFk = 2;
					item.EstResourceTypeFkExtend = 2;
				}

				if (item.MdcMaterialFk === 0) {
					item.MdcMaterialFk = null;
				}
				if (item.MdcCostCodeFk === 0) {
					item.MdcCostCodeFk = null;
				}
			};

			service.showColumnConfig = function () {
				service.onColumnConfigChanged.fire();
			};

			service.registerColumnConfigChanged = function registerColumnConfigChanged(handler) {
				service.onColumnConfigChanged.register(handler);
			};

			service.setRefLineItemDynamicColumnReadonly = function setRefLineItemDynamicColumnReadonly(itemList, fieldList, isReadOnly) {
				var fields = [];

				_.forEach(fieldList, function (columnItem) {
					var field = {field: columnItem.field, readonly: isReadOnly};
					fields.push(field);
				});

				if (_.isArray(itemList)) {
					angular.forEach(itemList, function (resItem) {

						if (resItem && resItem.Id && ((resItem.EstLineItemFk > 0) || (resItem.EstRuleSourceFk > 0))) {
							platformRuntimeDataService.readonly(resItem, fields);
						}
					});
				} else {
					platformRuntimeDataService.readonly(itemList, fields);
				}
			};

			service.isNumeric = function isNumeric(formatter) {
				var domainInfo = platformDomainService.loadDomain(formatter);
				if (domainInfo === undefined || domainInfo === null) {
					return false;
				}
				return !!(domainInfo.datatype === 'numeric' || domainInfo.datatype === 'integer');
			};

			service.hasSameUom = function hasSameUom(resourceList) {
				if (resourceList.length < 1) {
					return false;
				} else {
					var uomList = _.uniqBy(resourceList, 'uom');
					return uomList.length <= 1;
				}
			};

			service.hasSameCurrency = function hasSameCurrency(resourceList) {
				if (resourceList.length < 1) {
					return false;
				} else {
					var currencyList = _.uniqBy(resourceList, 'currency');
					return currencyList <= 1;
				}
			};

			service.setSelectedLookupItem = function setSelectedLookupItem(lookupItem) {
				selectedLookupItem = lookupItem;
			};

			service.getSelectedLookupItem = function setSelectedLookupItem() {
				return selectedLookupItem;
			};

			return service;
		}]);

})(angular);
