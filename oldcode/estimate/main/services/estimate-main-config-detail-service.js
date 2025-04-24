/**
 * Created by xia on 3/4/2016.
 */

(function(angular){
	/* global Platform */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainConfigDetailService',['$http','globals','platformDomainService','basicsLookupdataLookupDescriptorService','platformRuntimeDataService','_',
		function($http,globals,platformDomainService,basicsLookupdataLookupDescriptorService,platformRuntimeDataService,_){

			let service = {};

			let selectedLookupItem = {};

			let CalculateField = ['quantity','quantityfactor1', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
				'productivityfactor',  'efficiencyfactor1', 'efficiencyfactor2', 'quantityfactorcc', 'quantityreal', 'quantityinternal',
				'quantityunittarget', 'quantitytotal', 'costunit', 'costfactor1',  'costfactor2', 'costfactorcc','costunitsubitem',
				'costunitlineitem', 'costunittarget',  'costtotal', 'hoursunit', 'hoursunitsubitem', 'hoursunitlineitem',
				'hoursunittarget', 'hourstotal'];

			let columnConfig = {
				'columnInfo' :{
					'code' : {
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 4
					} ,
					'quantitydetail' :{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 5
					},
					'quantity' :{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 2
					},
					'basuomfk' :{
						'readonly' : true,
						'type' : 'foreignkey',
						'calculatetype' : 1
					},
					'quantityfactordetail1':{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 1
					},
					'quantityfactordetail2':{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 1
					},
					'quantityfactor1':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'quantityfactor2':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'quantityfactor3':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'quantityfactor4':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'productivityfactordetail':{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 1
					},
					'productivityfactor':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'efficiencyfactordetail1':{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 1
					},
					'efficiencyfactordetail2':{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 1
					},
					'efficiencyfactor1':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'efficiencyfactor2':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'quantityfactorcc':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 2
					},
					'quantityreal':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'quantityinternal':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'quantityunittarget':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'quantitytotal':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 2
					},
					'costunit':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'currency1fk':{
						'readonly' : true,
						'type' : 'foreignkey',
						'calculatetype' : 1
					},
					'currency2fk':{
						'readonly' : true,
						'type' : 'foreignkey',
						'calculatetype' : 1
					},
					'costexchangerate1':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'costexchangerate2':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'foreignbudget1':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'foreignbudget2':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'bascurrencyfk':{
						'readonly' : true,
						'type' : 'foreignkey',
						'calculatetype' : 1
					},
					'costfactordetail1':{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 1
					},
					'costfactordetail2':{
						'readonly' : false,
						'type' : 'string',
						'calculatetype' : 1
					},
					'costfactor1':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'costfactor2':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 3
					},
					'costfactorcc':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 2
					},
					'costunitsubitem':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'costunitlineitem':{
						'readonly' : false,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'costunittarget':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'costtotal':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 2
					},
					'riskcosttotal':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 2
					},
					'riskcostunit':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 2
					},
					'hoursunit':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'hoursunitsubitem':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'hoursunitlineitem':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'hoursunittarget':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'hourstotal':{
						'readonly' : true,
						'type' : 'numeric',
						'calculatetype' : 1
					},
					'islumpsum':{
						'readonly' : true,
						'type' : 'bool',
						'calculatetype' : 1
					},
					'isdisabled':{
						'readonly' : true,
						'type' : 'bool',
						'calculatetype' : 1
					},
					'commenttext':{
						'readonly' : true,
						'type' : 'string',
						'calculatetype' : 1
					}
				}
			};

			service.getColumnInfoByFieldName = function(fieldName){

				let column = fieldName.toLowerCase();

				// eslint-disable-next-line no-prototype-builtins
				if (columnConfig.columnInfo.hasOwnProperty(column)){

					return columnConfig.columnInfo[column];
				}

				return null;

			};

			service.isReadonly = function(columnField){

				let column = columnField.toLowerCase();

				// eslint-disable-next-line no-prototype-builtins
				if (columnConfig.columnInfo.hasOwnProperty(column)){

					return columnConfig.columnInfo[column].readonly;
				}

				return false;
			};

			service.isCalculateField = function(columnField){
				let column = columnField.toLowerCase();
				return CalculateField.indexOf(column) > -1;
			};

			let lineItemIds = []; // lineItem id array which has get the material2costcode relationship
			let material2CostCode = [];// material2costcode array

			service.addLineItemId = function(headerId,lineItemId){
				if(_.findIndex(lineItemIds,{HeaderId:headerId,LineItemId:lineItemId}) < 0){
					lineItemIds.push({HeaderId:headerId,LineItemId:lineItemId});
					let requestData = {};
					requestData.estHeaderId = headerId;
					requestData.estLineItemId = lineItemId;
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getmaterialcostcode',requestData).then(function(response){
						material2CostCode = material2CostCode.concat(response.data);
					});
				}
			};

			service.addMatetial2CostCode = function addMatetial2CostCode(value){
				if(_.findIndex(material2CostCode,{MaterialId:value.MaterialId}) < 0){
					material2CostCode.push(value);
				}
			};
			service.getCostCodeByMaterialId = function(materialId){
				let costCode = _.find(material2CostCode,{MaterialId:materialId});
				if(costCode){
					return costCode;
				}else{
					let requestData = {};
					requestData.materialId = materialId;
					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getmaterialcostcode',requestData).then(function(response){
						if(response.data && response.data.length > 0){
							material2CostCode = material2CostCode.concat(response.data);
							return response.data[0];
						}else{
							return null;
						}
					});
				}
			};

			let isColumnConfigShow = false;
			service.setColumnConfig = function(needToShow){
				isColumnConfigShow = needToShow;
			};

			service.getColumnConfig = function(){
				return isColumnConfigShow;
			};

			// cache which save the columnConfigDetail ,are used to calculate the dynamic column summary
			let columnConfigDetail = [];
			service.getColumnConfigDetails = function(){
				return columnConfigDetail;
			};
			service.setColumnConfigDetails = function(value){
				columnConfigDetail = value;
			};
			service.getConfigDetialById = function(ConfigDetialId){
				return _.find(columnConfigDetail,{Id:ConfigDetialId});
			};

			// save the costcode info which to be used when insert a new costcode resource
			let costCodeInfo = [];
			service.setCostCodeInfo = function(value){
				costCodeInfo = value;
			};
			service.getCostCodeList = function(){
				return costCodeInfo;
			};
			service.getCostCodeById = function(costCodeId){
				return _.find(costCodeInfo,{Id:costCodeId});
			};

			let prjCostCodeInfos = [];

			service.setPrjCostCodeInfos = function(value){
				prjCostCodeInfos = value;
			};

			service.getPrjCostCodeById = function(prjCostCodeId){
				return _.find(prjCostCodeInfos, {Id: prjCostCodeId});
			};

			service.getPrjCostCodeByMdcCostCodeFk = function(mdcCostCodeFk){
				return _.find(prjCostCodeInfos, {MdcCostCodeFk: mdcCostCodeFk});
			};

			let dynimacColumns = [];
			service.setDynamicColumns = function(value){
				dynimacColumns = value;
			};
			service.getDynamicColumns = function(){
				return dynimacColumns;
			};
			service.getIdByColumnId = function(columnId){
				let columnItem =  _.find(dynimacColumns,{ColumnId:columnId});
				if(!columnItem){
					return null;
				}else{
					return columnItem.Id;
				}
			};
			service.getFieldByColumnId = function(columnId){
				let columnItem =  _.find(dynimacColumns,{ColumnId:columnId});
				if(!columnItem){
					return null;
				}else{
					return columnItem.Field;
				}
			};

			service.getColumnIdByField = function(fieldName){
				let columnItem = _.find(dynimacColumns,{Field:fieldName});
				if(!columnItem){
					return -1;
				}else{
					return columnItem.ColumnId;
				}
			};

			let materialInfo = [];
			service.setMaterialInfo = function(value){
				materialInfo = value;
			};
			service.setMaterialInfo = function(){
				return materialInfo;
			};

			service.setInfo = function(InfoValue){
				if(angular.isObject(InfoValue) && InfoValue !== null){
					if(angular.isDefined(InfoValue.CostCode)){
						costCodeInfo = InfoValue.CostCode;
					}
					if(angular.isDefined(InfoValue.Main)){
						columnConfigDetail = InfoValue.Main;
					}
					if(angular.isDefined(InfoValue.DynamicColumns)){
						dynimacColumns = InfoValue.DynamicColumns;
					}
					if(angular.isDefined(InfoValue.MaterialV)){
						materialInfo = InfoValue.MaterialV;
					}
					if(angular.isDefined(InfoValue.PrjCostCode)){
						prjCostCodeInfos = InfoValue.PrjCostCode;
					}
				}
			};

			service.onColumnConfigChanged = new Platform.Messenger();

			service.addExtendData = function(item, fieldNeedModify, fieldValueNeedModify, configDetailInfo, currentCostCode){
				item.ColumnId = configDetailInfo.MaterialLineId;
				item.EstResourceTypeFk = configDetailInfo.LineType;
				item.MdcCostCodeFk = configDetailInfo.MdcCostCodeFk;
				item.MdcMaterialFk = configDetailInfo.MdcMaterialFk;
				// modify the field directly
				if(configDetailInfo.ColumnId !== 1) {
					item[fieldNeedModify] = fieldValueNeedModify;
				}

				if(configDetailInfo.LineType === 1){
					item.MdcMaterialFk = null;
					if(configDetailInfo.MdcCostCodeFk && configDetailInfo.MdcCostCodeFk > 0){

						if(angular.isDefined(currentCostCode) && currentCostCode !== null) {
							if (configDetailInfo.IsCustomProjectCostCode){
								currentCostCode.OriginalId = currentCostCode.Id;
								currentCostCode.IsOnlyProjectCostCode = true;
							}

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
				}else{
					item.EstResourceTypeFk = 2;
					item.EstResourceTypeFkExtend = 2;
				}

				if(item.MdcMaterialFk === 0){
					item.MdcMaterialFk = null;
				}
				if(!!item.MdcCostCodeFk || item.MdcCostCodeFk === 0 ){
					item.MdcCostCodeFk = null;
				}

				// todo-iron update udp value
				if(currentCostCode && Object.prototype.hasOwnProperty.call(currentCostCode,'UserDefinedcolVal')) {
					Object.keys(currentCostCode.UserDefinedcolVal).forEach(function (key) {
						if (key.indexOf('ColVal') !== -1) {
							if (Object.prototype.hasOwnProperty.call(item, key)) {
								item[key] = currentCostCode.UserDefinedcolVal[key];
								if (key.indexOf('Total') !== -1) {
									item[key] = currentCostCode.UserDefinedcolVal[key.replace('Total', '')] * item.CostFactor1 * item.CostFactor2 * item.CostFactorCc;
								}
							}
						}
					});
				}
			};

			service.showColumnConfig = function(){
				service.onColumnConfigChanged.fire();
			};

			service.registerColumnConfigChanged = function registerColumnConfigChanged(handler) {
				service.onColumnConfigChanged.register(handler);
			};

			service.setRefLineItemDynamicColumnReadonly = function setRefLineItemDynamicColumnReadonly(itemList,fieldList,isReadOnly){
				let fields = [];

				_.forEach(fieldList, function(columnItem) {
					let field = {field: columnItem.field , readonly: isReadOnly};
					fields.push(field);
				});

				if(_.isArray(itemList)){
					angular.forEach(itemList, function(resItem){

						if(resItem && resItem.Id && ((resItem.EstLineItemFk > 0) || (resItem.EstRuleSourceFk > 0))){
							platformRuntimeDataService.readonly(resItem, fields);
						}
					});
				}else{
					platformRuntimeDataService.readonly(itemList, fields);
				}
			};

			service.isNumeric = function isNumeric(formatter){
				let domainInfo = platformDomainService.loadDomain(formatter);
				if(domainInfo === undefined || domainInfo === null){
					return false;
				}
				return !!(domainInfo.datatype === 'numeric' || domainInfo.datatype === 'integer');
			};

			service.hasSameUom = function hasSameUom(resourceList){
				if(resourceList.length < 1){
					return false;
				}else{
					let uomList = _.uniqBy(resourceList,'uom');
					return uomList.length <= 1;
				}
			};

			service.hasSameCurrency = function hasSameCurrency(resourceList){
				if(resourceList.length < 1){
					return false;
				}else{
					let currencyList = _.uniqBy(resourceList,'currency');
					return currencyList <= 1;
				}
			};

			service.setSelectedLookupItem = function setSelectedLookupItem(lookupItem) {
				selectedLookupItem = lookupItem;
			};

			service.getSelectedLookupItem = function setSelectedLookupItem(){
				return selectedLookupItem;
			};

			return service;
		}]);

})(angular);
