/**
 * Created by lcn on 20/12/2024.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonCreateInterCompanyFactoryController', [
		'_', '$http', '$translate', 'moment', '$injector', 'platformContextService',
		'BasicsCommonDateProcessor', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupFilterService',
		'platformTranslateService', 'platformGridAPI', 'basicsLookupdataLookupDescriptorService', 'platformModuleNavigationService',
		function (
			_, $http, $translate, moment, $injector, platformContextService,
			BasicsCommonDateProcessor, basicsLookupdataLookupDataService, basicsLookupdataLookupFilterService,
			platformTranslateService, platformGridAPI, basicsLookupdataLookupDescriptorService, naviService
		) {
			const commonTranslate = 'procurement.common.wizard.createInterCompany.';
			const dateProcessor = new BasicsCommonDateProcessor(['EffectiveDate']);
			let currentId = 1;

			function assignIds(entities) {
				_.forEach(entities, entity => {
					entity.Id = currentId++;
					['DrillDownEntities', 'ChildItems'].forEach(key => {
						if (entity[key]?.length) {
							assignIds(entity[key]);
						}
					});
				});
			}

			function create(config) {
				const {$scope, gridId, translateSource, drillDownFactoryService, contextUrlSuffix, extendColumns, extraFilters, lookupUpdateArray} = config;
				const contextUrl = `${globals.webApiBaseUrl}${contextUrlSuffix}`;

				$scope.modalOptions = {
					headerText: $translate.instant(translateSource + 'title'),
					businessYear: $translate.instant(commonTranslate + 'businessYear'),
					businessPeriod: $translate.instant(commonTranslate + 'businessPeriod'),
					effectiveDate: $translate.instant(commonTranslate + 'effectiveDate'),
					notRecharged: $translate.instant(translateSource + 'notRecharged'),
					interCompanyCreated: $translate.instant(translateSource + 'interCompanyCreated'),
					cancel: () => $scope.$close()
				};
				$scope.entity = {CompanyYearId: null, CompanyPeriodId: null};
				$scope.isSuccess = false;
				$scope.hasItems = false;
				$scope.isLoading = false;
				$scope.validation = {effectiveDateError: $translate.instant(commonTranslate + 'effectiveDateError')};
				$scope.gridId = gridId;
				$scope.gridData = {state: gridId};
				$scope.yearOptions = {filterKey: 'basics-company-companyyear-filter'};
				$scope.periodOptions = {filterKey: 'basics-company-period-filter'};

				// Create filters
				const filters = createFilters($scope, extraFilters);
				basicsLookupdataLookupFilterService.registerFilter(filters);

				initializeData();

				// Watch for changes in CompanyPeriodId
				const unwatch = $scope.$watch('entity.CompanyPeriodId', function (newValue, oldValue) {
					if (oldValue !== newValue) {
						basicsLookupdataLookupDataService.getItemByKey('companyPeriod', newValue).then(({StartDate, EndDate}) => {
							Object.assign($scope.entity, {
								StartDate,
								EndDate,
								EffectiveDate: moment.utc(EndDate)
							});
							$scope.changedEffectiveDate();
						});
					}
				});

				$scope.changedEffectiveDate = function () {
					const {StartDate, EndDate, EffectiveDate} = $scope.entity;

					const formattedStartDate = moment(StartDate).format('YYYY-MM-DD');
					const formattedEndDate = moment(EndDate).format('YYYY-MM-DD');
					const formattedEffectiveDate = moment(EffectiveDate).format('YYYY-MM-DD');

					if (moment(formattedEffectiveDate).isBetween(moment(formattedStartDate), moment(formattedEndDate), 'day', '[]')) {
						$scope.isDateError = false;

						$http.get(`${contextUrl}getIcItems?startDate=${formattedStartDate}&endDate=${formattedEffectiveDate}`).then(({data}) => {
							if (data?.Main?.length) {
								assignIds(data.Main);
								platformGridAPI.items.data($scope.gridId, data.Main);
								updateLookup(data);
							} else {
								platformGridAPI.items.data($scope.gridId, []);
							}
						});
					} else {
						$scope.isDateError = true;
						platformGridAPI.items.data($scope.gridId, []);
					}
				};

				$scope.canOk = () => selectedData().length > 0;

				$scope.canGoto = function () {
					const gotoModule = 'procurement.invoice';
					return naviService.hasPermissionForModule(gotoModule) && collectGotoInvHeaderIds().length > 0;
				}

				$scope.onOk = function () {
					const data = {
						...$scope.entity,
						IcCompanyDic: undefined,
						SelectIcCompanyItems: selectedData()
					};
					dateProcessor.revertProcessItem(data);
					$scope.isLoading = true;

					$http.post(`${contextUrl}create`, data).then(res => {
						$scope.isSuccess = true;
						$scope.message = res.data || '';
					}).finally(() => $scope.isLoading = false);
				};

				$scope.onGoto = function () {
					const invHeaderIds = collectGotoInvHeaderIds();
					if (invHeaderIds.length > 0) {
						const gotoModule = 'procurement.invoice';
						naviService.navigate({moduleName: gotoModule, forceNewTab: true}, {FromGoToBtn: true,'Ids': invHeaderIds.join(',')}, 'Ids');
					}
				};

				$scope.success = () => $scope.$close();

				$scope.$on('$destroy', cleanUp);

				// Helper function to get selected data
				function selectedData() {
					return _.filter(platformGridAPI.items.data($scope.gridId), {Selected: true});
				}
				function collectGotoInvHeaderIds() {
					return [...new Set(
						selectedData()
							// Get DrillDownEntities, default to an empty array if undefined
							.flatMap(entity => entity.DrillDownEntities || [])
							// Include ChildItems along with the current drillDown item
							.flatMap(drillDown => [drillDown, ...(drillDown.ChildItems || [])])
							// Extract InvHeaderId from each item
							.map(item => item.InvHeaderId)
							// Filter out any undefined or null values
							.filter(id => id !== undefined && id !== null)
					)];
				}

				function initializeData() {
					$http.get(`${contextUrl}initialize`).then(({data}) => {
						if (!data) return;

						dateProcessor.processItem(data);
						Object.assign($scope, {
							entity: data,
							hasItems: !!data.HasIcCompanyItems
						});

						if (data.IcCompanyDic?.Main?.length) {
							const mainItems = data.IcCompanyDic.Main;
							assignIds(mainItems);
							platformGridAPI.items.data($scope.gridId, mainItems);
							updateLookup(data.IcCompanyDic);
						}
					});
					initializeGrid();
				}

				// Initialize the grid
				function initializeGrid() {
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						let gridColumns = createGridColumns();
						let gridConfig = {
							columns: angular.copy(gridColumns),
							data: [],
							id: $scope.gridId,
							lazyInit: true,
							options: {tree: false, indicator: true, idProperty: 'CompanyId'}
						};
						platformGridAPI.grids.config(gridConfig);
						platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);
						platformTranslateService.translateGridConfig(gridColumns);
					}
				}

				// Handle grid click
				function onGridClick(e, args) {
					const field = args.grid.getColumns()[args.cell].field;
					if (field === 'DrillDownBtn') {
						const dataItem = args.grid.getDataItem(args.row);
						drillDownFactoryService.openPopup(e, $scope, dataItem);
					}
				}

				// Grid columns configuration
				function createGridColumns() {
					return [
						{
							id: 'drillDown', field: 'DrillDownBtn', name: '', width: 32,
							formatter: () => '<button class="tlb-icons ico-export gridcell-ico"></button>',
						},
						{
							id: 'companyName', field: 'CompanyName', name: 'CompanyName', name$tr$: commonTranslate + 'forCompany', width: 190,
							formatter: 'description', readonly: true,
						},
						...(extendColumns ? extendColumns : []),
						{
							id: 'totalAmount', field: 'TotalAmount', name: 'TotalAmount', name$tr$: commonTranslate + 'totalAmount', width: 82,
							formatter: 'money', readonly: true
						},
						{id: 'selected', field: 'Selected', editor: 'boolean', formatter: 'boolean', name$tr$: commonTranslate + 'checked', width: 62}
					];
				}

				function createFilters($scope, extraFilters) {
					let filters = [
						{
							key: 'basics-company-companyyear-filter',
							serverSide: true,
							fn: () => 'CompanyFk=' + platformContextService.getContext().clientId
						},
						{
							key: 'basics-company-period-filter',
							fn: (item) => $scope.entity ? item.CompanyYearFk === $scope.entity.CompanyYearId : null
						}
					];

					return filters.concat(extraFilters || []);
				}

				function updateLookup(dic) {
					_.forEach(lookupUpdateArray, function (lookupName) {
						if (dic.hasOwnProperty(lookupName)) {
							basicsLookupdataLookupDescriptorService.updateData(lookupName, dic[lookupName]);
						}
					});
				}

				function cleanUp() {
					unwatch();
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
						platformGridAPI.grids.unregister($scope.gridId);
					}
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				}
			}

			return {create};
		}
	]);

})(angular);


