/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.assemblies';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateConfigTotalService
	 * @function
	 *
	 * @description
	 * estimateLineItemTotalService is the data service for totals of line items.
	 */
	estimateMainModule.factory('estimateAssembliesConfigTotalService', [
		'platformDataServiceFactory',
		'estimateAssembliesFilterService',
		'cloudDesktopSidebarService',
		'estimateAssembliesService',
		'$translate',
		'estimateMainFilterCommon',
		// 'platformGridAPI',
		'_',
		function (platformDataServiceFactory,
			estimateAssembliesFilterService,
			cloudDesktopSidebarService,
			estimateAssembliesService,
			$translate,
			estimateMainFilterCommon,
			// platformGridAPI,
			_
		) {

			let totalTitles = {
				// 'configTotalGrand': 'estimate.main.grandTotalContainer',
					'configTotalLineItem': 'estimate.main.lineItemTotalContainer'
				// 'configTotalFilter': 'estimate.main.filteredTotalContainer'
				},
				calculatorIcon = {
					id: 'estimate-main-config-total-recalculate',
					caption: 'estimate.main.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					fn: function () {
						// only do the re-calculation once the user click on a calc-button
						// loadTotalData(currentActiveIcon);
						recalculate();
					}
				};

			// let currentActiveIcon = 'configTotalGrand';

			// request params to server
			let requestParams = {};

			function getAssemblyHeaderId() {
				let estHeaderFk = -1;
				try{
					estHeaderFk = estimateAssembliesService.getContext().EstHeaderFk || estimateAssembliesService.getContext().HeaderFk || -1;
				}catch (e) {
					estHeaderFk = -1;
				}
				return estHeaderFk;
			}


			function initRequestParams() {
				let initParams = {
					estHeaderFk: getAssemblyHeaderId()
					// prjProjectFk: cloudDesktopSidebarService.filterRequest.projectContextId || null
				};
				return initParams;
			}


			let options = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateConfigTotalService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/resource/assembliesconfigtotal',
						endRead: '/',
						initReadData: function initReadData(readData) {
							angular.extend(readData, requestParams);
							readData.estHeaderFk = getAssemblyHeaderId();
							let selLineItems = estimateAssembliesService.getSelectedEntities();
							if (_.isArray(selLineItems) && selLineItems.length > 0) {
								readData.lineItemIds = _.map(selLineItems, 'Id');
							}else{
								readData.lineItemIds = [];
							}
						},
						usePostForRead: true
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						node: {
							itemName: 'ConfigTotal',
							parentService: estimateAssembliesService
						}
					},
					actions: {}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(options),
				service = serviceContainer.service;

			function generateStyle(item, configDetails) {
				// the styles from total config
				let cssClass = '',
					config = _.find(configDetails, function(c){
						return c.Id === item.Id;
					}) || {};
				if (config.IsBold) {
					cssClass += ' cm-strong ';
				}
				if (config.IsUnderline) {
					cssClass += ' cm-link '; // from \cloud.style\content\css\lib\codemirror.css
				}
				if (config.IsItalic) {
					cssClass += ' cm-em ';
				}

				// item.cssClass = styleConfigs[item.Id];
				// apply the css class to cell
				_.intersection(['Description', 'Quantity', 'UoM', 'Total', 'Currency'], _.keys(item))
					.map(function (field) {
						item.__rt$data = item.__rt$data || {};
						item.__rt$data.cellCss = item.__rt$data.cellCss || {};
						item.__rt$data.cellCss[field] = item.__rt$data.cellCss[field] || '';
						item.__rt$data.cellCss[field] += cssClass;
					});
			}



			function incorporateDataRead(readData, data) {

				let listData = readData.ConfigTotalResult || [],
					completeConfig = readData.totalComplelteConfig || {},
					configDetails = completeConfig.EstTotalsConfigDetails || [];

				listData.map(function(i){
					i.Total = i.CostTotal;
					i.Quantity = i.QuantityTotal || '';
					i.Description = i.DescriptionInfo.Translated || '';

					generateStyle(i, configDetails);

				});
				// resolve the data
				return data.handleReadSucceeded(listData, data);

			}


			function getFilterConditions() {
				let filterKeys = {
						ASSEMBLYCAT: 'EstAssemblyCatFk',
						LICCOSTGROUP1: 'LicCostGroup1Fk',
						LICCOSTGROUP2: 'LicCostGroup2Fk',
						LICCOSTGROUP3: 'LicCostGroup3Fk',
						LICCOSTGROUP4: 'LicCostGroup4Fk',
						LICCOSTGROUP5: 'LicCostGroup5Fk'
					},
					conditions = {};
				let filterType = estimateAssembliesFilterService.getFilterFunctionType();
				let allFilterIds = estimateAssembliesFilterService.getAllFilterIds() || {};
				_.map(filterKeys, function(dtoField, filterKey){
					if(allFilterIds[filterKey]) {
						let conds = allFilterIds[filterKey] || [];
						// type 0 - assigned;
						// type 1 - assigned and not assigned
						// type 2 - not assigned
						if (filterType === 2) {
							conds = []; // empty the conditions
						}
						conditions[dtoField] = conds;
					}
				});
				return conditions;
			}


			function buildRequestParams(totalKey) {
				if(!_.includes(_.keys(totalTitles), totalKey)) {
					totalKey = _.first(_.keys(totalTitles));
				}
				let params = {
					readyToLoad: true
				};

				switch (totalKey)
				{
					case 'configTotalGrand':
						params.configTotalType = 'grand_total';
						break;
					case 'configTotalLineItem':
						// eslint-disable-next-line no-case-declarations
						let currentLineItem = estimateAssembliesService.getSelected();
						params.lineItemIds = [];
						if(_.isEmpty(currentLineItem)) {
							params.readyToLoad = false;
						}else{
							params.lineItemIds.push(currentLineItem.Id);
						}
						break;
					case 'configTotalFilter':
						// get all the filter conditions from leading structure
						// eslint-disable-next-line no-case-declarations
						let filterConditions = getFilterConditions() || {};
						params = angular.extend(params, filterConditions);
						break;
				}
				return params;
			}


			// click the calculator button
			function recalculate(totalKey) {
				// first save the data and then calculate again
				estimateAssembliesService.update().then(function () {
					loadTotalData(totalKey);
				});
			}


			function loadTotalData(totalKey) {
				// build the request parameters
				requestParams = angular.extend(
					initRequestParams(),
					buildRequestParams(totalKey)
				);
				if(requestParams.readyToLoad === true) {
					service.load();
				}else{
					service.setList([]);
				}
			}


			function activateIcon(scope, totalKey){
				loadTotalData(totalKey);
			}

			// set the active total icon
			// NO USE, FOR BACKUP ONLY
			// function setActiveIconBak(scope, totalKey) { // jshint ignore:line
			// if(!_.includes(_.keys(totalTitles), totalKey)) {
			// totalKey = _.first(_.keys(totalTitles));
			// }
			// try {
			// if(scope.tools) {
			// _.find(scope.tools.items, function (i) {
			// return i.totalIconsGroup === '3typesOfTotal';
			// }).list.activeValue = totalKey;
			// setContainerTitle(scope, totalKey);
			// scope.tools.update();
			// currentActiveIcon = totalKey;
			// }
			// } catch (e) {
			// // eslint-disable-next-line no-console
			// console.error(e);
			// }
			//
			// }

			// set the container title on run time
			// function setContainerTitle(scope, totalKey) {
			// let title = $translate.instant(totalTitles[totalKey]);
			// if(_.isEmpty(title)) {
			// return false;
			// }
			// try{
			// // scope.subviewCtrl.content[scope.subviewCtrl.activeTab].title =title ;
			// scope.title =title;
			// }catch (e){
			// // eslint-disable-next-line no-console
			// console.error(e);
			// }
			//
			// }


			function initTotalIcons(/* scope */) {
				// let totalKey = 'configTotalLineItem';
				// setContainerTitle(scope, totalKey);
				let tools = [
					{
						totalIconsGroup: '3typesOfTotal', // a flag to distinguish the icons
						type: 'sublist',
						list: {
							cssClass: 'radio-group',
							// activeValue: totalKey,
							showTitles: true,
							items: [
								calculatorIcon
							]
						}
					}
				];
				return tools;
			}


			// For back up only, no other use
			// -W098
			// function initTotalIconsBak(scope) { // jshint ignore:line
			// let totalKey = 'configTotalGrand';
			// setContainerTitle(scope, totalKey);
			// let tools = [
			// {
			// totalIconsGroup: '3typesOfTotal', // a flag to distinguish the icons
			// type: 'sublist',
			// list: {
			// cssClass: 'radio-group',
			// // activeValue: totalKey,
			// showTitles: true,
			// items: [
			// {
			// id: 'estimate-main-config-total-recalculate',
			// caption: 'estimate.main.dirtyRecalculate',
			// type: 'item',
			// iconClass: 'control-icons ico-recalculate',
			// fn: function () {
			// // only do the re-calculation once the user click on a calc-button
			// // loadTotalData(currentActiveIcon);
			// recalculate(currentActiveIcon);
			// }
			// },
			// {
			// id: 'config_total_grand',
			// caption: totalTitles.configTotalGrand,
			// type: 'radio',
			// value: 'configTotalGrand',
			// iconClass: 'tlb-icons ico-total-grand',
			// fn: function () {
			// // setActiveIcon(scope, 'configTotalGrand');
			// // loadTotalData('configTotalGrand');
			// activateIcon(scope, 'configTotalGrand');
			// },
			// disabled: function () {
			// return false;
			// // return !self.areFiltersAvailable();
			// }
			// },
			// {
			// id: 'config_total_line_item',
			// caption: totalTitles.configTotalLineItem,
			// type: 'radio',
			// value: 'configTotalLineItem',
			// iconClass: 'tlb-icons ico-total-line-item',
			// fn: function () {
			// // setActiveIcon(scope, 'configTotalLineItem');
			// // loadTotalData('configTotalLineItem');
			// activateIcon(scope, 'configTotalLineItem');
			// },
			// disabled: function () {
			// return false;
			// // return !self.areFiltersAvailable();
			// }
			// },
			// {
			// id: 'config_total_filter',
			// caption: totalTitles.configTotalFilter,
			// type: 'radio',
			// value: 'configTotalFilter',
			// iconClass: 'tlb-icons ico-total-filter',
			// fn: function () {
			// // setActiveIcon(scope, 'configTotalFilter');
			// // loadTotalData('configTotalFilter');
			// activateIcon(scope, 'configTotalFilter');
			// },
			// disabled: function () {
			// return false;
			// // return !self.areFiltersAvailable();
			// }
			// }
			// ]
			// }
			// }
			//
			// ];
			// return tools;
			// }

			function isFilterConditionSet() {
				let filterConditions = getFilterConditions() || {},
					rs = false;
				_.values(filterConditions).map(function(ids){
					if(_.isArray(ids) && ids.length > 0){
						rs = true;
					}
				});
				return rs;
			}


			return angular.extend(service, {
				toolHasAdded: false,
				loadTotalData: loadTotalData,
				isFilterConditionSet: isFilterConditionSet,
				initTotalIcons: initTotalIcons,
				activateIcon: activateIcon
				// setActiveIcon: setActiveIcon
			});
		}]);
})();
