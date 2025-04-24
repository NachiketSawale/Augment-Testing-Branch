(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.ticketsystem';

	/**
	 * @ngdoc service
	 * @name procurement.ticketsystem.procurementTicketsystemCartDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide ticketsystem data
	 */
	angular.module(moduleName).factory('procurementTicketsystemCartDataService',
		['_', '$q', '$http', 'platformContextService', 'platformModalService', 'basicsMaterialMaterialBlobService','moment', 'basicsMaterialCatalogType', 'procurementContextService','platformLanguageService',
			function (_, $q, $http, platformContextService, platformModalService, basicsMaterialMaterialBlobService,moment, basicsMaterialCatalogType, procurementContextService,platformLanguageService) {
				var service = {
					catalogs: [],
					cartList: [],
					cartSummary: {
						homeCurrency: '',
						cartCount: null,
						selectCartCount:0,
						cartTotal: 0
					},
					defaultConfigurationForCon: null,
					defaultConfigurationForReq: null
				};
				var LoginCompanyId = platformContextService.getContext().clientId,
					queryHttp = globals.webApiBaseUrl + 'procurement/ticketsystem/cartitem/',
					getDefaultConfigurationUrl = globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/defaultbyrubric';

				getDefaultConfiguration();

				function refreshSummary() {
					_.forEach(service.cartList, function (item) {
						service.computeSubTotal(item);
					});

					var orderList = service.getOrderList();

					var total = _.sumBy(orderList, function (item) {
						var subTotal = ((item.Material.ShowCost) / item.Material.PriceUnit * item.Material.FactorPriceUnit);
						if (item.Material.deliveryOptionShow) {
							subTotal = subTotal + item.Material.deliverys;
						}
						subTotal = subTotal * item.Material.Requirequantity;
						subTotal = subTotal / item.ExchangeRate;
						return subTotal;
					}).toFixed(2);
					service.cartSummary.selectCartCount=service.getOrderList().length;
					service.cartSummary.cartCount = service.cartList.length;
					//service.cartSummary.cartTotal = formatMoney(total, 2);
					service.cartSummary.cartTotal = formatNumber(total);
				}

				function formatNumber(number){
					var floatNumber = parseFloat(number);
					var decimalPlaces = 2;
					var pow = Math.pow(10, decimalPlaces);
					var result = (Math.round(floatNumber * pow) / pow);

					var culture = platformContextService.culture();
					var cultureInfo = platformLanguageService.getLanguageInfo(culture);
					return accounting.formatNumber(result, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
				}

				function formatMoney(mVal,iAccuracy){
					function format(strNum){
						var dotPos = strNum.length;
						var buff = [];
						for(var i = strNum.length - 1; i >= 0; i--){
							if(strNum[i] === '.'){
								dotPos = i;
							}
							buff.unshift(strNum[i]);
						}
						var count = 0;
						for( i = dotPos; i > 0; i-- ){
							if(count === 3){
								buff.splice(i,0,',');
								count = 1;
							}else{
								count ++;
							}
						}
						return buff.join('');
					}
					if(typeof mVal === 'number'){
						return format(mVal.toFixed(iAccuracy));
					}else if(typeof mVal === 'string'){
						return format(parseFloat(mVal).toFixed(iAccuracy));
					}
				}

				service.refreshSummary=function(){
					refreshSummary();
				};

				function refreshPriceView(){
					_.forEach(service.cartList, function (item) {
						var entity=item.Material;
						refreshPriceViewByMaterial(entity);
					});

				}

				function refreshPriceViewByMaterial(entity){
					var priceConditions=entity.PriceConditions;
					if(priceConditions) {
						var TotalOc = 0;
						for (var i = 0; i < priceConditions.length; i++) {
							var priceCondition = priceConditions[i];
							if (priceCondition.PriceConditionType.IsShowInTicketSystem && priceCondition.IsActivated) {
								TotalOc = TotalOc + priceCondition.TotalOc;
							}
						}
						entity.ShowCost = (entity.Cost - TotalOc).toFixed(2);
					}
					else{
						entity.ShowCost = entity.Cost.toFixed(2);
					}
				}

				function requireDate(leadTime) {
					var currentDate = new Date().getTime();
					var maxDate = currentDate + leadTime * 24 * 60 * 60 * 1000;
					var maxMomentDate = moment(maxDate);
					if (maxMomentDate._isValid) {
						return maxMomentDate.toDate();
					}
					else {
						return moment(currentDate).toDate();
					}
				}

				function getMaxRequireDate(materials) {
					var maxItem = _.maxBy(materials, function (item) {
						return item.Material.LeadTime;
					});
					var maxLeadTime = maxItem.Material.LeadTime;

					if (_.isNil(maxLeadTime)) {
						maxLeadTime = 0;
					}

					return requireDate(maxLeadTime);
				}

				function getDefaultConfiguration() {
					$http.get(getDefaultConfigurationUrl + '?rubric=' + procurementContextService.contractRubricFk).then(function (response) {
						service.defaultConfigurationForCon = response.data.Id;
					});
					$http.get(getDefaultConfigurationUrl + '?rubric=' + procurementContextService.requisitionRubricFk).then(function (response) {
						service.defaultConfigurationForReq = response.data.Id;
					});
				}

				function getDefaultCofigurationByPrcType(type) {
					// type, 2 - requisition, 1 - contract
					if (type === 2) {
						return service.defaultConfigurationForReq;
					}
					else if (type === 1) {
						return service.defaultConfigurationForCon;
					}
					return null;
				}

				service.materialPriceCondition=function(item){
					// item.Material.PriceConditions
					if(item.PriceConditions&&item.PriceConditions.length>0){
						item.deliveryShow=true;
						item.deliveryOptionShow=false;
						var deliverys=0;
						var arrPriceConditions=item.PriceConditions;
						for (var i = 0; i < arrPriceConditions.length; i++) {
							var _priceCondition = arrPriceConditions[i];
							if (_priceCondition.IsActivated) {
								deliverys += _priceCondition.TotalOc;
								item.deliveryOptionShow = true;
							}
						}
						item.deliverys = deliverys;
					}
				};

				service.updateCatalogs = function () {
					var mergedItems = _.filter(service.cartList, function (item) {
						// return item.catalogKey != null;
						return !_.isNil(item.catalogKey);
					});
					var normalItems = _.filter(service.cartList, function (item) {
						// return item.catalogKey == null;
						return _.isNil(item.catalogKey);
					});
					var itemsWithBp = _.filter(normalItems, function (item) {
						// return item.Material.BpdBusinesspartnerFk != null;
						return !_.isNil(item.Material.BpdBusinesspartnerFk);
					});
					var itemsWithoutBp = _.filter(normalItems, function (item) {
						// return item.Material.BpdBusinesspartnerFk == null;
						return _.isNil(item.Material.BpdBusinesspartnerFk);
					});
					var catalogs = _.groupBy(itemsWithBp, function (item) {
						if (_.isNil(item.Material.InternetCatalogFk)) {
							return item.Material.MdcMaterialCatalogFk;
						}
						return item.Material.InternetCatalogFk;
					});
					var mergedCatalogs = _.groupBy(mergedItems, 'catalogKey');

					// add group of no bp assigned
					if (itemsWithoutBp.length) {
						catalogs.generic = itemsWithoutBp;
					}

					// add custom groups of merged
					_.forOwn(mergedCatalogs, function (materials, pKey) {
						catalogs[pKey] = materials;
					});

					// clear items for each group, but keep group info.
					_.forEach(service.catalogs, function (catalog) {
						catalog.items = [];
					});

					// group by material catalog
					_.forOwn(catalogs, function (materials, pKey) {
						var catalog = _.find(service.catalogs, {key: pKey});

						if (_.isNil(catalog)) {
							catalog = {
								key: pKey,
								checked: true,
								businessPartnerFk: null, // vendor
								contactFk: null,
								prcType: materials[0].PrcType, // procurement type, 2 - requisition, 1 - contract
								requireDate: null, // required date
								collapsed: false,// fold or expand,
								isFrameworkType: materials[0].Material.MaterialCatalogTypeFk === basicsMaterialCatalogType.framework,
								items: [],
								docs: []
							};
							catalog.configurationFk = getDefaultCofigurationByPrcType(catalog.prcType);
							service.catalogs.push(catalog);
						}

						catalog.items = materials;

						if (_.isNil(catalog.businessPartnerFk)) {
							catalog.businessPartnerFk = materials[0].Material.BpdBusinesspartnerFk;
						}

						catalog.requireDate = getMaxRequireDate(materials);

						if(catalog.isFrameworkType) {
							catalog.prcType = 1; // if it is framework, only contract can be created.
						}
					});

					service.catalogs = _.filter(service.catalogs, function (catalog) {
						return catalog.items.length > 0;
					});
				};

				service.canMergeCatalogs = function () {
					var checkedCatalogs = _.filter(service.catalogs, {checked: true});
					var targetCatalogs = _.filter(checkedCatalogs, {isFrameworkType: false});
					return targetCatalogs.length > 1;
				};

				service.mergeCatalogs = function () {
					var checkedCatalogs = _.filter(service.catalogs, {checked: true});
					var uncheckedCatalogs = _.filter(service.catalogs, {checked: false});
					var excludeCatalogs = _.filter(checkedCatalogs, {isFrameworkType: true});
					var targetCatalogs = _.filter(checkedCatalogs, {isFrameworkType: false});

					service.catalogs = uncheckedCatalogs.concat(excludeCatalogs);

					if (targetCatalogs.length) {
						var mergeCatalog;

						if (targetCatalogs.length === 1) {
							mergeCatalog = targetCatalogs[0];
						}
						else {
							mergeCatalog = {
								key: '',
								checked: true,
								merged: true,
								businessPartnerFk: null, // vendor
								contactFk: null,
								prcType: 2, // procurement type, 2 - requisition, 1 - contract
								requireDate: null, // required date
								collapsed: false,// fold or expand,
								isFrameworkType: false,
								items: [],
								docs: []
							};

							_.forEach(targetCatalogs, function (catalog) {
								if (mergeCatalog.key.length) {
									mergeCatalog.key += '-';
								}
								mergeCatalog.key += catalog.key;
								mergeCatalog.items = mergeCatalog.items.concat(catalog.items);
								mergeCatalog.docs = mergeCatalog.docs.concat(catalog.docs);
							});

							mergeCatalog.requireDate = getMaxRequireDate(mergeCatalog.items);

							_.forEach(mergeCatalog.items, function (item) {
								item.catalogKey = mergeCatalog.key;
							});
						}
						mergeCatalog.configurationFk = getDefaultCofigurationByPrcType(mergeCatalog.prcType);
						service.catalogs.push(mergeCatalog);
					}
				};

				service.getSelectedCatalogs = function () {
					return service.catalogs.filter(function (group) {
						return group.checked;
					});
				};

				service.getOrderList = function () {
					var orderList = [];

					service.catalogs.filter(function (group) {
						return group.checked;
					}).forEach(function (group) {
						orderList = orderList.concat(group.items);
					});

					return orderList;
				};

				service.refreshCart = function () {
					return $http.get(queryHttp + 'list').then(function (response) {
						service.cartList = response.data.Items;
						service.cartList.forEach(function (item) {
							item.Material.Requirequantity = item.Quantity;
							service.materialPriceCondition(item.Material);

						});
						service.cartSummary.homeCurrency = response.data.HomeCurrency;
						service.updateCatalogs();
						refreshPriceView();
						refreshSummary();
						basicsMaterialMaterialBlobService.provideImage(response.data.Items.map(function (item) {
							return item.Material;
						}));
						return service.cartList;
					});
				};

				service.initialCart = function () {
					if (service.cartSummary.cartCount !== null) {
						return $q.when(service.cartSummary);
					}
					return service.refreshCart();
				};

				service.deliveryChange=function(priceCondition){
					priceCondition.UpdatedAt=moment();
					var queryHttp = globals.webApiBaseUrl + 'basics/material/pricecondition/';
					$http({
						method: 'POST',
						url: queryHttp + 'update',
						data:priceCondition
					}).then(function (response) {
						priceCondition.Version=response.data.Version;
					});
				};

				service.add = function (mid, quantity, priceListFk,co2Project,co2Source,co2SourceFk,co2SourceName) {
					return $http({
						method: 'POST',
						url: queryHttp + 'add',
						data: {
							LoginCompanyId: LoginCompanyId,
							MdcMaterialFk: mid,
							Quantity: quantity,
							PriceListFk: priceListFk
						}
					}).then(function (response) {

						var foundMaterial = _.find(service.cartList, function (item) {
							return item.Material.Id === response.data.Material.Id;
						});
						if (foundMaterial) {
							foundMaterial.Material.Requirequantity = response.data.Quantity;
							foundMaterial.Material.Cost = response.data.Material.Cost;
							foundMaterial.Material.PriceForShow = response.data.Material.Cost;
							foundMaterial.Material.EstimatePrice = response.data.Material.EstimatePrice;
							foundMaterial.Material.PriceReferenceForShow = response.data.Material.EstimatePrice;
							foundMaterial.Material.BasCurrencyFk = response.data.Material.BasCurrencyFk;
							foundMaterial.Material.Currency = response.data.Material.Currency;
							foundMaterial.Material.LeadTime = response.data.Material.LeadTime;
							foundMaterial.Material.MinQuantity = response.data.Material.MinQuantity;
							foundMaterial.Material.SellUnit = response.data.Material.Cost;
							foundMaterial.Material.PriceExtra = response.data.Material.PriceExtra;

							if(foundMaterial.Material.PrcPriceconditionFk !== response.data.Material.PrcPriceconditionFk){
								foundMaterial.Material.PrcPriceconditionFk = response.data.Material.PrcPriceconditionFk;
								foundMaterial.Material.PriceConditions = response.data.Material.PriceConditions;
								service.materialPriceCondition(foundMaterial.Material);
							}
						} else {
							response.data.Material.Requirequantity = response.data.Quantity;

							service.materialPriceCondition(response.data.Material);

							basicsMaterialMaterialBlobService.provideImage([response.data.Material]);
							service.cartList.push(response.data);
							foundMaterial=response.data;
						}
						foundMaterial.Material.Co2Project = co2Project;
						foundMaterial.Material.Co2Source = co2Source;
						foundMaterial.Material.BasCo2SourceFk = co2SourceFk;
						foundMaterial.Material.BasCo2SourceName = co2SourceName;
						service.updateCatalogs();
						refreshPriceViewByMaterial(foundMaterial.Material);
						refreshSummary();
						return service.cartList;
					});
				};

				service.addAll = function (items) {
					return $http({
						method: 'POST',
						url: queryHttp + 'additems',
						data: {
							LoginCompanyId: LoginCompanyId,
							Items: items
						}
					}).then(function (response) {
						var dataItems = response.data;

						dataItems.forEach(function (dataItem) {
							var foundMaterial = _.find(service.cartList, function (item) {
								return item.Material.Id === dataItem.Material.Id;
							});
							if (foundMaterial) {
								foundMaterial.Material.Requirequantity = dataItem.Quantity;
							} else {
								dataItem.Material.Requirequantity = dataItem.Quantity;
								basicsMaterialMaterialBlobService.provideImage([dataItem.Material]);
								service.cartList.push(dataItem);
							}
						});

						service.updateCatalogs();
						refreshSummary();
						return service.cartList;
					});
				};

				service.delete = function (materialId) {
					return $http.get(queryHttp + 'delete?materialId=' + materialId).then(function () {
						service.cartList = _.filter(service.cartList, function(item){
							return item.Material.Id !== materialId;
						});
						service.updateCatalogs();
						refreshSummary();
						return service.cartList;
					});
				};

				service.clearSave = function (cartItems) {
					return $http.post(queryHttp + 'clear', _.map(cartItems, _.property('Id'))).then(function () {
						service.cartList = _.filter(service.cartList, function (item) {
							return !_.some(_.map(cartItems, _.property('MdcMaterialFk')), function (id) {
								return item.Material.Id === id;
							});
						});
						service.updateCatalogs();
						refreshSummary();
						return service.cartList;
					});
				};

				service.clear = function () {
					return $http.post(queryHttp + 'clear',[]).then(function () {
						service.cartList = [];
						service.updateCatalogs();
						refreshSummary();
						return service.cartList;
					});
				};

				service.update = function (item) {
					return $http({
						method: 'POST',
						url: queryHttp + 'update',
						data: {
							MdcMaterialFk: item.Id,
							Quantity: item.Requirequantity
						}
					}).then(function () {
						refreshSummary();
						return service.cartList;
					});
				};

				service.getFormatQty = function (entity) {

					if (!entity) {
						return '';
					}

					if (!angular.isDefined(entity.Requirequantity)) {
						entity.Requirequantity = 0;
					}

					return parseFloat(entity.Requirequantity).toFixed(3).toUserLocaleNumberString() + ' ' + entity.Uom;
				};

				service.canPlaceOrder = function () {
					return service.getOrderList().length > 0;
				};

				service.validate = function () {
					var error = '';
					var contracts = service.catalogs.filter(function (group) {
						return group.checked && group.prcType === 1;
					});

					if (contracts.some(function (group) {
						return _.isNil(group.businessPartnerFk);
					})) {
						error = 'procurement.ticketsystem.lackOfVendor';
					}

					return error;
				};

				service.placeOrder = function () {
					var orderList = service.getOrderList();

					if (orderList && orderList.length > 0) {
						var error = service.validate();

						if (error) {
							platformModalService.showErrorBox(error, 'procurement.ticketsystem.placeOrderDialog.title');
						}
						else {
							platformModalService.showDialog({
								headerText$tr$: 'procurement.ticketsystem.placeOrderDialog.title',
								templateUrl: globals.appBaseUrl + 'Procurement.Ticketsystem/partials/place-order-dialog.html',
								backdrop: false,
								windowClass: 'form-modal-dialog',
								value: {
									cartList: orderList
								},
								resizeable: true
							});
						}
					}
				};

				service.submit= function () {
					// var cartPriceConditions=[];
					// var IsFlex=false;
					if (service.cartList && service.cartList.length > 0) {

						var maxObj = _.maxBy(service.cartList, function (item) {
							var entity = item.Material;
							var LeadTimeExtra = 0;
							if (entity.deliveryOptionShow && entity.LeadTimeExtra) {
								LeadTimeExtra = entity.LeadTimeExtra;
							}
							var leadTime = entity.LeadTime;
							return leadTime + LeadTimeExtra;
						});
						var maxEntity = maxObj.Material;
						var currentDate = (new Date()).getTime();
						var LeadTimeExtra1 = 0;
						if (maxEntity.deliveryOptionShow && maxEntity.LeadTimeExtra) {
							LeadTimeExtra1 = maxEntity.LeadTimeExtra;
						}
						var leadTime1 = maxEntity.LeadTime;
						var maxDate = currentDate + (leadTime1 + LeadTimeExtra1) * 24 * 60 * 60 * 1000;
						// var _deliverDate = moment(maxDate).format("DD/MM/YYYY");
						// get ticket system supplier mode value.
						// $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/getticketsystemsuppliermode').then(function (response) {
						// $scope._deliverDate=_deliverDate;

						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'Procurement.Ticketsystem/partials/submit-dialog.html',
							backdrop: false,
							windowClass: 'form-modal-dialog',
							value: {
								deliverDate: maxDate,
								cartList: service.cartList// ,
								// ticketsystemsuppliermode: response.data
							}
						});
						// });

					}
				};

				service.updateCarStatus = function (dataSource, carList) {
					_.forEach(dataSource, function (item) {
						var isAdded = _.find(carList, function (carItem) {
							return carItem.Material.Id === item.Id;
						});
						item.IsAdded = !!isAdded;
					});
				};

				service.computeSubTotal = function (item) {
					// item.subTotal = (item.Requirequantity * item.Cost).toFixed(2);
					var subTotal = ((item.Material.ShowCost) / item.Material.PriceUnit * item.Material.FactorPriceUnit );
					if(item.Material.deliveryOptionShow){
						subTotal=subTotal+item.Material.deliverys;
					}
					subTotal=subTotal*item.Material.Requirequantity;
					//subTotal = formatMoney(subTotal,2);
					item.Material.subTotal = formatNumber(subTotal);
				};

				return service;
			}]);
})(angular);
