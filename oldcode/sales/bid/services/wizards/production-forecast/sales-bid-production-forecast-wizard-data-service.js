(function () {
	'use strict';
	/* global angular, globals, _, Slick */

	let moduleName = 'sales.bid';

	angular.module(moduleName).factory('salesBidProductionForecastWizardDataService', ProductionForecastWizardDataService);

	ProductionForecastWizardDataService.$inject = ['$http', '$q', '$injector', 'platformTranslateService',
		'platformModalService', '$translate', 'platformGridAPI',
		'moment',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService'];

	function ProductionForecastWizardDataService($http, $q, $injector, platformTranslateService,
								platformModalService, $translate, platformGridAPI,
								moment,
								platformRuntimeDataService,
								basicsLookupdataLookupDescriptorService) {


		let service = {};
		let uuid = '32c9bb304f0d47108d1ac0b675192a30';
		let sitesInfo = [];
		let forecastItems = [];
		let selectedHeader = {};
		let dataItem = {};
		let scope = {};

		const gridColumns = [{
			id: 'Ref',
			field: 'Userdefined5',
			name: '*Ref.No',
			name$tr$: 'boq.main.Reference',
			formatter: 'description',
			width: 100,
			sortable: true,
		}, {
			id: 'Info',
			field: 'Comment',
			name: '*Info',
			name$tr$: 'sales.bid.wizard.productionForecast.info',
			formatter: 'description',
			width: 100,
			sortable: true,
		}, {
			id: 'quantity',
			formatter: 'decimal',
			field: 'Quantity',
			name: '*Quantity',
			name$tr$: 'cloud.common.entityQuantity',
			width: 100,
			sortable: true
		}, {
			id: 'Site',
			field: 'SiteFk',
			name: '*Site',
			name$tr$: 'basics.site.entitySite',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'MaterialSiteLookup',
				displayMember: 'Code',
				width: 140
			},
			editor: 'lookup',
			editorOptions: {
				directive: 'pps-header-material-site-lookup'
			},
			validator: (entity, value) => {
				const validItem = entity.InitSiteFk === value;
				setTimeout(() => {
					if (!validItem) {
						platformRuntimeDataService.applyValidationResult({
							apply: true,
							valid: false,
							error: '*Site has been changed. Need Recalculation.',
							error$tr$: 'productionplanning.header.wizard.createPreliminaryItem.siteChangedError'
						}, entity, 'SiteFk');
					} else {
						platformRuntimeDataService.applyValidationResult({
							apply: true,
							valid: true,
							error: ''
						}, entity, 'SiteFk');
					}
					platformGridAPI.rows.refreshRow({
						'gridId': uuid,
						'item': entity
					});
				}, 200);
				service.updateForecastItems([entity], value);
				return {apply: true, valid: validItem, error: ''};
			}
		}, {
			id: 'Material',
			field: 'MdcMaterialFk',
			name: '*Material',
			width: 120,
			name$tr$: 'productionplanning.common.product.material',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'MaterialCommodity',
				displayMember: 'Code',
			}
		}, {
			id: 'PlannedStart',
			formatter: 'dateutc',
			field: 'ProductionStart',
			name: '*ProductionStart',
			name$tr$: 'productionplanning.header.wizard.createPreliminaryItem.productionStart',
			width: 100,
			sortable: true
		}, {
			id: 'ProductionFinish',
			formatter: 'dateutc',
			field: 'ProductionFinish',
			name: '*ProductionFinish',
			name$tr$: 'productionplanning.header.wizard.createPreliminaryItem.productionFinish',
			width: 100,
			sortable: true
		}, {
			id: 'DeliveryStart',
			formatter: 'dateutc',
			field: 'DeliveryStart',
			name: '*DeliveryStart',
			name$tr$: 'productionplanning.header.wizard.createPreliminaryItem.deliveryStart',
			width: 100,
			sortable: true
		}, {
			id: 'DeliveryFinish',
			formatter: 'dateutc',
			field: 'DeliveryFinish',
			name: '*DeliveryFinish',
			name$tr$: 'productionplanning.header.wizard.createPreliminaryItem.deliveryFinish',
			width: 100,
			sortable: true
		}];

		service.getFormConfig = () => {
			const config = {
				title: $translate.instant('sales.bid.wizard.productionForecast.wizardTitle'),
				dataItem: null,
				formConfiguration: {
					fid: 'sales.bid.wizard.productionforecast.items',
					version: '1.0.0',
					showGrouping: false,
					addValidationAutomatically: true,
					groups: [{gid: 'baseGroup'}],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'projectfk',
							model: 'ProjectFk',
							sortOrder: 1,
							label: '*Project',
							label$tr$: 'sales.common.entityProjectFk',
							type: 'directive',
							directive: 'basics-lookup-data-project-project-dialog',
							readonly: true,
						}, {
							gid: 'baseGroup',
							rid: 'bidheaderfk',
							model: 'BidHeaderFk',
							sortOrder: 1,
							label: '*BID Header',
							label$tr$: 'sales.bid.entityBidHeaderFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							readonly: true,
							options: {
								lookupDirective: 'sales-bid-bid-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
							}
						}, {
							gid: 'baseGroup',
							rid: 'earliestStart',
							model: 'EarliestStart',
							sortOrder: 3,
							label: '*Earliest Production Date',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.earliestStart',
							type: 'dateutc',
							change: function (entity) {
								let startCopy = angular.copy(entity.EarliestStart);
								service.updateDataItem(entity);
							}
						}, {
							gid: 'baseGroup',
							rid: 'LatestEnd',
							model: 'LatestEnd',
							sortOrder: 4,
							label: '*Latest Production Date',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.latestEnd',
							type: 'dateutc'
						}, {
							gid: 'baseGroup',
							rid: 'duration',
							model: 'Duration',
							sortOrder: 5,
							label: '*Max Product Duration(weeks)',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.maxDuration',
							type: 'integer'
						}, {
							gid: 'baseGroup',
							rid: 'threshold',
							model: 'Threshold',
							sortOrder: 6,
							label: '*Threshold of Site Capacity',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.siteThreshold',
							type: 'integer'
						}],
					change: (entity, model, row) => {
						scope.filterRequestChanged = true;
					},
				}
			};
			platformTranslateService.translateFormConfig(config.formConfiguration);
			return config;
		};

		service.getGridConfig = (data) => {
			return {
				id: uuid,
				title: 'sales.bid.wizard.productionForecast.forecastItems',
				state: uuid,
				gridId: uuid,
				data: data,
				columns: gridColumns,
				lazyInit: true,
				options: {
					idProperty: 'Id',
					indicator: true,
					enableConfigSave: true,
					enableModuleConfig: true,
					selectionModel: new Slick.RowSelectionModel()
				}
			};
		};

		service.initData = ($scope, data) => {
			let datetimes = ['ProductionStart', 'ProductionFinish'];
			_.forEach(data.Items, function (item) {
				item.InitSiteFk = item.SiteFk;
				_.forEach(item, function (value, key) {
					let found = _.find(datetimes, (v) => {
						return v === key && value !== null;
					});
					if (found) {
						item[key] = moment.utc(value);
						const deliveryStart = _.get(item.DynamicDateTimes, 'DeliveryStart');
						const deliveryFinish = _.get(item.DynamicDateTimes, 'DeliveryFinish');
						if (angular.isDefined(deliveryStart) && angular.isDefined(deliveryFinish)) {
							item.DeliveryStart = moment.utc(deliveryStart);
							item.DeliveryFinish = moment.utc(deliveryFinish);
						}
					}
				});
			});
			service.resetSiteChangedState($scope);
		};

		service.initGrid = ($scope, data) => {
			let forecastItemGrid = service.getGridConfig(data);
			platformGridAPI.grids.config(forecastItemGrid);

			$scope.forecastItemGrid = forecastItemGrid;
			service.resetSiteChangedState($scope);
			platformGridAPI.grids.refresh($scope.forecastItemGrid.id, true);

			function onCellChanged(e, args) {
				$scope.forecastItemGrid.SiteChanged = args.item.SiteFk !== args.item.InitSiteFk;
			}

			platformGridAPI.events.register($scope.forecastItemGrid.id, 'onCellChange', onCellChanged);
		};

		service.setItems = (scope, dataItems) => {
			let grid = platformGridAPI.grids.element('id', uuid);
			if (grid.dataView) {
				grid.dataView.setItems(dataItems);
				dataItems.forEach((item) => {
					platformRuntimeDataService.readonly(item, !item.IsLive);
				});
				platformGridAPI.grids.refresh(scope.forecastItemGrid.id, true);
			}
		};

		service.init = ($scope, bidHeader, boqHeaderId) => {
			scope = $scope;
			scope.filterRequestChanged = true;
			selectedHeader = bidHeader;
			dataItem.ProjectFk = selectedHeader.ProjectFk;
			dataItem.BidHeaderFk = selectedHeader.Id;
			dataItem.EarliestStart = moment();
			dataItem.LatestEnd = moment().add(6, 'months');
			dataItem.Duration = 4;
			dataItem.Threshold = 120;
			dataItem.CreationChecked = false;
			dataItem.BoqHeaderId = boqHeaderId;

			service.updateDataItem(dataItem);
			service.initGrid(scope, []);
		};

		service.calculationForecastItems = () => {
			service.setBusy(true);
			let request = {
				HeaderId: dataItem.BoqHeaderId,
				Threshold: dataItem.Threshold,
				EarliestStart: dataItem.EarliestStart,
				LatestEnd: dataItem.LatestEnd,
				Duration: dataItem.Duration
			};

			if (service.getForecastItems().length > 0 && (service.hasSiteChanged() || service.hasFilterChanged())) {
				if (service.hasFilterChanged()) {
					request.changedItems = _.filter(service.getForecastItems(), (item) => {
						return item.SiteFk !== 0;
					});
				} else if (service.hasSiteChanged()) {
					request.changedItems = _.filter(service.getForecastItems(), (item) => {
						return item.SiteFk !== 0 && item.SiteFk !== item.InitSiteFk;
					});
				}
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/recalculation', request).then(function (response) {
					if (response.data.Items !== null) {
						service.initData(scope, response.data);
						service.updateForecastItems(response.data.Items);
					}
				}).finally(() => {
					service.setBusy(false);
					service.resetFilterState();
					service.gridRefresh(scope);
				});
			} else {
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/getForecastInfo', request).then(function (response) {
					if (response.data.Message !== null && response.data.Message.length !== 0) {
						platformModalService.showErrorBox(response.data.Message,
						  'sales.bid.wizard.productionForecast.wizardTitle', 'warning');
					} else if (response.data.Items !== null) {
						service.initData(scope, response.data);
						service.setForecastItems(response.data.Items);
						service.setSitesInfo(response.data.SitesInfo);
						service.setItems(scope, response.data.Items);
					}
				}).finally(() => {
					service.setEarliestStart();
					service.setBusy(false);
					service.resetFilterState();
					service.gridRefresh(scope);
				});
			}
		};

		service.getSitesInfo = () => {
			return sitesInfo;
		};

		service.setSitesInfo = (data) => {
			sitesInfo = data;
			basicsLookupdataLookupDescriptorService.updateData('MaterialSiteLookup', sitesInfo);
		};

		service.getSelected = () => {
			return platformGridAPI.rows.selection({gridId: uuid});
		};

		service.gridRefresh = (scope) => {
			let grid = platformGridAPI.grids.element('id', uuid);
			if (grid.dataView) {
				platformGridAPI.grids.refresh(scope.forecastItemGrid.id, true);
			}
		};

		service.getForecastItems = () => {
			return forecastItems;
		};

		service.setForecastItems = (items) => {
			forecastItems = items;
		};

		service.resetSiteChangedState = (scope) => {
			scope.forecastItemGrid.SiteChanged = false;
		};

		service.getSiteChangedState = (scope) => {
			return scope.forecastItemGrid.SiteChanged;
		};

		service.updateForecastItems = (entities, value) => {
			if (angular.isDefined(value)) {
				forecastItems.find((item) => item.Id === _.first(entities).Id).SiteFk = value;
			} else {
				entities.forEach((entity) => {
					let item = forecastItems.find((item) => item.Id === entity.Id);
					item.ProductionStart = entity.ProductionStart;
					item.ProductionFinish = entity.ProductionFinish;
					item.DeliveryStart = entity.DeliveryStart;
					item.DeliveryFinish = entity.DeliveryFinish;
					item.DynamicDateTimes = angular.copy(entity.DynamicDateTimes);
					item.EventConfigId = entity.EventConfigId;
					item.Userdefined5 = entity.Userdefined5;
					item.Code = entity.Code;
					item.SiteFk = entity.SiteFk;
					item.IsLive = entity.IsLive;
					item.Comment = entity.Comment;
					item.InitSiteFk = entity.InitSiteFk;

					setTimeout(() => {
						platformRuntimeDataService.applyValidationResult({
							apply: true,
							valid: true,
							error: ''
						}, item, 'SiteFk');
						platformGridAPI.rows.refreshRow({
							'gridId': uuid,
							'item': item
						});
					}, 200);
				});
			}
		};

		service.updateDataItem = (data) => {
			scope.dataItem = data;
		};

		service.setBusy = (isBusy) => {
			scope.isBusy = isBusy;
		};

		service.handleOK = () => {
			platformGridAPI.grids.commitEdit(scope.forecastItemGrid.id); // commit changes
			let request = {
				ForecastItems: _.filter(service.getForecastItems(), {'IsLive': true}),
				Threshold: dataItem.Threshold,
				Check: dataItem.CreationChecked,
				BoqHeaderId: dataItem.BoqHeaderId,
				ProjectId: dataItem.ProjectFk
			};
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/saveforecastitems', request).then(function (response) {
				return response.data;
			});
		};

		service.hasSiteChanged = () => {
			return service.getSiteChangedState(scope);
		};

		service.hasFilterChanged = () => {
			return scope.filterRequestChanged;
		};

		service.hasNewForecastItem = () => {
			return _.some(service.getForecastItems(), {IsLive: true});
		};

		service.resetFilterState = () => {
			scope.filterRequestChanged = false;
		};

		service.setEarliestStart = () => {
			let items = service.getForecastItems();
			let existedItems = _.filter(items, (item) => {
				return item.Version > 0 && item.ProductionStart !== null;
			});
			if (existedItems) {
				const startDate = angular.copy(moment.min(_.map(existedItems, 'ProductionStart').concat([dataItem.EarliestStart])));
				dataItem.EarliestStart = angular.copy(startDate);
				service.updateDataItem(dataItem);
			}
		};

		service.clearContext = () => {
			scope.dataItem = {};
			sitesInfo = [];
			forecastItems = [];
			platformGridAPI.grids.unregister(scope.forecastItemGrid.state);
		};

		return service;
	}
})();