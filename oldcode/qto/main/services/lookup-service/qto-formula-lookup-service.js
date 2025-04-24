
(function (angular) {
	/* global _, globals */
	'use strict';
	var moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoFormulaLookupService',
		['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService', 'platformLookupDataServiceFactory', 'qtoMainDetailService',
			function ($http, $q, $injector, basicsLookupdataLookupDescriptorService, platformLookupDataServiceFactory, qtoMainDetailService) {
				var service = {};
				var operatorStrList = [];
				var lookupCurrentValue = '';

				service.getList = function getList(param) {
					operatorStrList = service.loadLookupData(param);
					return $q.when(operatorStrList);
				};

				service.getItemById = function getItemById(Code, param) {
					operatorStrList = service.loadLookupData(param);
					return _.find(operatorStrList, function (item) {
						return item[param.displayMember] === Code;
					});
				};

				service.getItemByKey = function getItemByKey(Code, param) {
					var item;
					var deferred = $q.defer();
					operatorStrList = service.loadLookupData(param);
					item = _.find(operatorStrList, function (item) {
						return item[param.displayMember] === Code;
					});
					deferred.resolve(item);
					return deferred.promise;
				};
				service.getItemByIdAsync = function getItemByIdAsync(value, param) {
					return service.getItemByKey(value, param);
				};

				service.getSearchList = function getSearchList(value, param) {
					var item = [];
					var deferred = $q.defer();
					operatorStrList = service.loadLookupData(param);
					var list = _.find(operatorStrList, function (item) {
						return item[param.displayMember] === value;
					});
					if (_.isArray(list)) {
						deferred.resolve(list);
					} else if (list) {
						item.push(list);
						deferred.resolve(item);
					} else {
						deferred.resolve(item);
					}

					return deferred.promise;
				};

				service.loadLookupData = function loadLookupData(param) {
					var selectQtoDetail = null;
					if (param.currentItem === null || param.currentItem === undefined) {
						selectQtoDetail = qtoMainDetailService.getSelected();
					} else {
						selectQtoDetail = param.currentItem;
					}

					qtoMainDetailService.filterByFormulaUom(selectQtoDetail);

					var operatorStr = [];
					operatorStrList = [];
					if (!!selectQtoDetail && !!selectQtoDetail.QtoFormula) {
						if (param) {
							var OperatorFiled = null;
							if (param.OperatorFiled) {
								OperatorFiled = param.OperatorFiled;
							} else {
								OperatorFiled = param.model;
							}
							operatorStr = selectQtoDetail.QtoFormula[OperatorFiled] ? _.split(selectQtoDetail.QtoFormula[OperatorFiled], '') : [];
							operatorStr = _.union(operatorStr);
							_.forEach(operatorStr, function (item) {
								var temp = {
									Id: item,
									Code: item
								};
								operatorStrList.push(temp);
							});
						}
					}
					return operatorStrList;
				};

				service.setValueOrOperFieldsToDisableByOperator = function (entity, operatorValue) {
					var platformGridAPI = $injector.get('platformGridAPI');
					var grid;
					if (platformGridAPI.grids.exist('39e55f17910246f4b46A0ddeed42403b')) {
						grid = platformGridAPI.grids.element('id', '39e55f17910246f4b46A0ddeed42403b');
					} else if (platformGridAPI.grids.exist('6d3013bd4af94808bec8d0ec864119c9')) {
						grid = platformGridAPI.grids.element('id', '6d3013bd4af94808bec8d0ec864119c9');
					}

					if (grid) {
						// var grid = platformGridAPI.grids.element('id','6d3013bd4af94808bec8d0ec864119c9');
						var operatorFiled = grid.instance.getColumns()[grid.instance.getActiveCell().cell];
						if (operatorValue === entity[operatorFiled]) {
							return;
						}

						qtoMainDetailService.setValueOrOperFieldsToDisableByOperator(entity, operatorFiled.name, operatorValue);
					}
					lookupCurrentValue = operatorValue;
				};

				service.reloadLookupData = function (entity) {
					return $http.get(globals.webApiBaseUrl + 'qto/formula/getQtoFormulaByKey?key=' + entity.QtoFormulaFk + '&uomFk=' + (entity.BasUomFk || 0));
				};

				service.updateFormulaUomOperatorCache = function (entity, formula) {
					if (entity.BasUomFk && entity.BasUomFk > 0) {
						var targetUomData = basicsLookupdataLookupDescriptorService.getData('QtoFormulaAllUom');
						var formulaUom = _.find(targetUomData, function (x) {
							return x.UomFk === entity.BasUomFk && x.QtoFormulaFk === entity.QtoFormulaFk;
						});

						if (formulaUom) {
							formulaUom.Operator1 = formula.Operator1;
							formulaUom.Operator2 = formula.Operator2;
							formulaUom.Operator3 = formula.Operator3;
							formulaUom.Operator4 = formula.Operator4;
							formulaUom.Operator5 = formula.Operator5;
							formulaUom.Value1IsActive = formula.Value1IsActive;
							formulaUom.Value2IsActive = formula.Value2IsActive;
							formulaUom.Value3IsActive = formula.Value3IsActive;
							formulaUom.Value4IsActive = formula.Value4IsActive;
							formulaUom.Value5IsActive = formula.Value5IsActive;
						} else {
							targetUomData[formula.Id] = {
								Id: formula.Id,
								UomFk: entity.BasUomFk,
								QtoFormulaFk: entity.QtoFormulaFk,
								Operator1: formula.Operator1,
								Operator2: formula.Operator2,
								Operator3: formula.Operator3,
								Operator4: formula.Operator4,
								Operator5: formula.Operator5,
								Value1IsActive: formula.Value1IsActive,
								Value2IsActive: formula.Value2IsActive,
								Value3IsActive: formula.Value3IsActive,
								Value4IsActive: formula.Value4IsActive,
								Value5IsActive: formula.Value5IsActive
							};
						}
					}
				};

				// this template property is used for validation while press Enter key or Teb key.
				service.setLookupCurrentValue = function (value) {
					lookupCurrentValue = value;
				};
				service.getLookupCurrentValue = function () {
					return lookupCurrentValue;
				};

				return service;
			}]);
})(angular);