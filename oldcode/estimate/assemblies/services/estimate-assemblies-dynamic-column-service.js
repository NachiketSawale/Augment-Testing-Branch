/**
 * Created by lnt on 7/21/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _ */
	'use strict';
	let moduleName = 'estimate.assemblies';
	let estimateAssembliesModule = angular.module(moduleName);

	// TODO: ngdoc
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateAssembliesModule.factory('estimateAssembliesDynamicColumnService',
		['$q', '$http', '$injector', 'platformGridAPI', 'platformTranslateService', 'estimateMainCommonService',
			'estimateAssembliesConfigurationService',
			function ($q, $http, $injector, platformGridAPI, platformTranslateService, estimateMainCommonService,
				estimateAssembliesConfigurationService) {

				let service = {};
				let sectionId = 30;
				let charactCols = [];

				function reloadDynamicColumnAndData(estimateAssembliesService) {
					asyncLoadDynamicColumns(estimateAssembliesService);
				}

				function asyncLoadDynamicColumns(estimateAssembliesService) {
					function refreshColumns() {
						estimateMainCommonService.generateCharacteristicColumns(estimateAssembliesService, sectionId).then(function (data) {
							estimateMainCommonService.appendCharactiricColumnData(data, estimateAssembliesService);
							// charactiric culomn
							charactCols = estimateMainCommonService.getCharactCols(data);
							service.resizeAssemblyGrid(estimateAssembliesService);
							return charactCols;
						});
					}

					let estHeaderId = estimateAssembliesService.getSelectedEstHeaderId() || -1;
					let qDefer = $q.defer();
					if (estHeaderId >= -1) {
						let cols = refreshColumns();
						qDefer.resolve(cols);
					} else {
						qDefer.resolve([]);
					}
					return qDefer.promise;
				}

				function asyncLoadCharacteristicColumn(estimateAssembliesService) {
					function refreshColumns() {
						estimateMainCommonService.generateCharacteristicColumns(estimateAssembliesService, sectionId).then(function (data) {
							estimateMainCommonService.appendCharactiricColumnData(data, estimateAssembliesService);
							let basicsCharacteristicCodeLookupService = $injector.get('basicsCharacteristicCodeLookupService');
							let charcteristics = angular.copy(basicsCharacteristicCodeLookupService.getListBySection(sectionId));
							if (charcteristics && _.size(charcteristics) > 0) {
								charcteristics.forEach((e) => {
									e.CharacteristicEntity = e;
									e.CharacteristicFk = e.Id;
									e.CharacteristicSectionFk = e.sectionId;
								});
								charactCols = estimateMainCommonService.getCharactCols(charcteristics);
							}
							service.resizeAssemblyGrid(estimateAssembliesService);
							return charactCols;
						});
					}

					let qDefer = $q.defer();
					let cols = refreshColumns();
					qDefer.resolve(cols);
					return qDefer.promise;
				}

				service.resizeAssemblyGrid = function resizeAssemblyGrid(estimateAssembliesService) {
					let assemblyGridId = estimateAssembliesService.getAssemblyGridId();
					if (true === platformGridAPI.grids.exist(assemblyGridId)) {
						platformGridAPI.columns.configuration(assemblyGridId, getStaticColumns(estimateAssembliesService).concat(charactCols));
						platformGridAPI.configuration.refresh(assemblyGridId);
						platformGridAPI.grids.resize(assemblyGridId);
					}
				};

				let estAssemblyStandardConfig = getEstAssemblyStandardConfig();

				function getStaticColumns(estimateAssembliesService) {
					let loadedCols = {};
					let originalCols = angular.copy(estAssemblyStandardConfig.columns || []);
					// current = hidden + visible;
					// current: all loaded columns
					let assemblyGridId = estimateAssembliesService.getAssemblyGridId();
					let columns = platformGridAPI.columns.configuration(assemblyGridId);
					let currentColumns = (columns || {}).current || [];
					_.map(currentColumns, function (col) {
						let colId = col.id;
						if (!_.isEmpty(colId)) {
							loadedCols[colId] = col;
						}
					});
					let modifiedCols = _.map(originalCols, function (oriCol) {
						let colId = oriCol.id;
						if (!_.isEmpty(colId) && loadedCols[colId]) {
							oriCol = _.merge(oriCol, loadedCols[colId]);
						}
						return oriCol;
					});

					// fix issue that the group column will disappear after clicking refresh button
					if(columns && columns.visible){
						let groupColumn = _.find(columns.visible, {id:'group',field:'group'});
						if(groupColumn){
							modifiedCols.push(groupColumn);
						}
					}

					// 3 cost group column
					if(estimateAssembliesService.costGroupCatalogs){
						let costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(estimateAssembliesService.costGroupCatalogs, false);
						modifiedCols = modifiedCols.concat(costGroupColumns);
					}

					// 4 userdefined column
					let userDefinedColumnServiceName = estimateAssembliesService.getIsPrjAssembly() ? 'projectAssemblyDynamicUserDefinedColumnService' : 'estimateAssembliesDynamicUserDefinedColumnService';
					let udpColumns = $injector.get(userDefinedColumnServiceName).getDynamicColumns();
					if(udpColumns && udpColumns.length){
						modifiedCols = modifiedCols.concat(udpColumns);
					}

					return angular.copy(modifiedCols);
				}

				function getEstAssemblyStandardConfig() {

					let standardConfig = estimateAssembliesConfigurationService.getStandardConfigForListView();

					if (!standardConfig.isTranslated) {

						platformTranslateService.translateGridConfig(standardConfig.columns);

						standardConfig.isTranslated = true;
					}

					return standardConfig;
				}

				service.isExistColumn = function isExistColumn(idorField) {
					let colData = _.filter(charactCols, {'id': idorField});
					return !(!colData || (colData && colData.length === 0));
				};

				service.addColumn = function addColumn(item, columnIdorField, columnName) {
					let charCol = estimateMainCommonService.createCharactCol(item, columnIdorField, columnName);
					let charCols = [];
					charCols.push(charCol);
					charactCols = charactCols.concat(charCols);
				};

				service.removeColumn = function removeColumn(oldIdorField) {
					charactCols = _.filter(charactCols, function (col) {
						return col.id !== oldIdorField;
					});
				};

				service.reloadDynamicColumnAndData = reloadDynamicColumnAndData;
				service.asyncLoadDynamicColumns = asyncLoadDynamicColumns;
				service.asyncLoadCharacteristicColumn = asyncLoadCharacteristicColumn;

				return service;
			}]);
})();
