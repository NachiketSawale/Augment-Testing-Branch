/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular){
	/* global globals */
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).factory('controllingConfigColumnFormulaLookupService', ['_', '$http','$q', '$translate', 'contrConfigFormulaTypeHelper',
		'definitionType',
		function (_, $http, $q, $translate, contrConfigFormulaTypeHelper,
			definitionType) {
			let cacheData = [];

			function getList() {
				cacheData = [];
				return $http.get(globals.webApiBaseUrl + 'controlling/configuration/versioncompdetail/getcolumnformulalist').then(function (response) {
					if(response && response.data){
						let columns = response.data.ColumnPreDefs;
						let formulas = response.data.FormulaDefs;
						let id = 1;
						_.forEach(columns, function (column) {
							cacheData.push({
								Id: id++,
								Code: column.Code,
								Description: column.Description,
								ColumnType: $translate.instant('controlling.configuration.ConfColumnDefinitionTitle'),
								itemId: column.Id,
								Type: definitionType.COLUMN
							});
						});
						_.forEach(formulas, function (formula) {
							if(contrConfigFormulaTypeHelper.isCac_m(formula.BasContrColumnTypeFk)
								|| contrConfigFormulaTypeHelper.isWcfOrBcf(formula.BasContrColumnTypeFk)
								|| contrConfigFormulaTypeHelper.isCustFactor(formula.BasContrColumnTypeFk)
								|| !formula.IsVisible){
								return;
							}

							cacheData.push({
								Id: id++,
								Code: formula.Code,
								Description: formula.DisplayInfo,
								ColumnType: $translate.instant('controlling.configuration.ConfFormulaDefinitionTitle'),
								itemId: formula.Id,
								Type: definitionType.FORMULA
							});
						});
					}
					return cacheData = _.orderBy(cacheData, ['Type', 'Code'], ['asc', 'asc']);
				});
			}

			function getItemByKey(value) {
				return getItemByIdAsync(value);
			}

			function getItemById (value) {
				return _.find(cacheData, {Id: value});
			}

			function getItemByIdAsync(value) {
				let deferred = $q.defer();
				let item = _.find(cacheData,{'Id':value});
				if(item){
					deferred.resolve(item);
				}
				return deferred.promise;
			}

			function getSearchList() {
				return cacheData;
			}

			function getFormulaId(formulaKey){
				let matched = _.find(cacheData, {Type: definitionType.FORMULA, itemId: formulaKey});
				return matched ? matched.Id : null;
			}

			function getColumnId(columnKey){
				let matched = _.find(cacheData, {Type: definitionType.COLUMN, itemId: columnKey});
				return matched ? matched.Id : null;
			}

			return {
				getList: getList,
				getItemById: getItemById,
				getItemByIdAsync:getItemByIdAsync,
				getItemByKey:getItemByKey,
				getSearchList: getSearchList,
				getFormulaId: getFormulaId,
				getColumnId: getColumnId
			};
		}]);

})(angular);