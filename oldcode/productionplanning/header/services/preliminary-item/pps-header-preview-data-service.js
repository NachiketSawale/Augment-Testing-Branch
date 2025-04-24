(function (angular) {
	'use strict';
	/* globals _*/

	let moduleName = 'productionplanning.header';

	angular.module(moduleName).factory('ppsHeaderPreviewPreliminaryItemDataService', PreviewPreliminaryItemDataService);

	PreviewPreliminaryItemDataService.$inject = ['$http', '$q', '$injector', 'platformTranslateService',
		'platformModalService', '$translate', 'platformGridAPI',
		'moment',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService'];

	function PreviewPreliminaryItemDataService($http, $q, $injector, platformTranslateService,
											   platformModalService, $translate, platformGridAPI,
											   moment,
											   platformRuntimeDataService,
											   basicsLookupdataLookupDescriptorService) {
		let service = {};
		let uuid = '619f149dd7fb4a418c6e290556b7a590';
		let sitesInfo = [];
		let preliminaryItems = [];

		const gridColumns = [
			{
				id: 'code',
				field: 'Comment',
				name: '*Code',
				name$tr$: 'cloud.common.entityCode',
				formatter: 'description',
				width: 100,
				sortable: true,
			}, {
				id: 'quantity',
				formatter: 'decimal',
				field: 'Quantity',
				name: '*Planned Quantity',
				name$tr$: 'productionplanning.common.serialProduction.plannedQuantity',
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
						if(!validItem) {
							platformRuntimeDataService.applyValidationResult({
								apply: true,
								valid: false,
								error: '*Site has been changed. Need Recalculation.',
								error$tr$: 'productionplanning.header.wizard.createPreliminaryItem.siteChangedError'
							}, entity, 'SiteFk');
						}else{
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
					service.updatePreliminaryItems([entity], value);
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

		service.getGridConfig = (data) => {
			return {
				id: uuid,
				title: 'productionplanning.header.wizard.createPreliminaryItem.preliminaryItems',
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
						if (angular.isDefined(deliveryStart) && angular.isDefined(deliveryFinish) ) {
							item.DeliveryStart = moment.utc(deliveryStart);
							item.DeliveryFinish = moment.utc(deliveryFinish);
						}
					}
				});
			});
			service.resetSiteChangedState($scope);
		};

		service.initGrid = ($scope, data) => {
			let preliminaryItemGrid = service.getGridConfig(data);
			platformGridAPI.grids.config(preliminaryItemGrid);

			$scope.preliminaryItemGrid = preliminaryItemGrid;
			service.resetSiteChangedState($scope);
			platformGridAPI.grids.refresh($scope.preliminaryItemGrid.id, true);

			function onCellChanged(e, args) {
				$scope.preliminaryItemGrid.SiteChanged = args.item.SiteFk !== args.item.InitSiteFk;
			}

			platformGridAPI.events.register($scope.preliminaryItemGrid.id, 'onCellChange', onCellChanged);
		};

		service.setItems = (scope, dataItems) => {
			let grid = platformGridAPI.grids.element('id', uuid);
			if (grid.dataView) {
				grid.dataView.setItems(dataItems);
				dataItems.forEach((item) => {
					platformRuntimeDataService.readonly(item, !item.IsLive);
				});
				platformGridAPI.grids.refresh(scope.preliminaryItemGrid.id, true);
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
				platformGridAPI.grids.refresh(scope.preliminaryItemGrid.id, true);
			}
		};

		service.getPreliminaryItems = () => {
			return preliminaryItems;
		};

		service.setPreliminaryItems = (items) => {
			preliminaryItems = items;
		};

		service.resetSiteChangedState = (scope) => {
			scope.preliminaryItemGrid.SiteChanged = false;
		};

		service.getSiteChangedState = (scope) => {
			return scope.preliminaryItemGrid.SiteChanged;
		};

		service.updatePreliminaryItems = (entities, value) => {
			if (angular.isDefined(value)) {
				preliminaryItems.find((item) => item.Id === _.first(entities).Id).SiteFk = value;
			} else {
				entities.forEach((entity) => {
					let item = preliminaryItems.find((item) => item.Id === entity.Id);
					item.ProductionStart = entity.ProductionStart;
					item.ProductionFinish = entity.ProductionFinish;
					item.DeliveryStart = entity.DeliveryStart;
					item.DeliveryFinish = entity.DeliveryFinish;
					item.DynamicDateTimes = angular.copy(entity.DynamicDateTimes);
					item.EventConfigId = entity.EventConfigId;
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

		service.clearContext = (scope) => {
			sitesInfo = [];
			preliminaryItems = [];
			platformGridAPI.grids.unregister(scope.preliminaryItemGrid.state);
		};

		return service;
	}

	angular.module(moduleName).directive('ppsHeaderMaterialSiteLookup', MaterialSiteLookup);

	MaterialSiteLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', '$q',
		'ppsHeaderPreviewPreliminaryItemDataService'];

	function MaterialSiteLookup(BasicsLookupdataLookupDirectiveDefinition, $q,
								previewPreliminaryItemDataService) {

		let defaults = {
			lookupType: 'MaterialSiteLookup',
			valueMember: 'Id',
			displayMember: 'Code',
			editable: 'false',
			columns: [
				{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'Description',
					field: 'DescriptionInfo.Description',
					name: 'Description',
					name$tr$: 'cloud.common.descriptionInfo'
				}
			]
		};

		function getList(options) {
			let result = previewPreliminaryItemDataService.getSitesInfo();
			return $q.when(result);
		}

		function getItemByKey(key) {
			let result = _.find(previewPreliminaryItemDataService.getSitesInfo(), {Id: key});
			return $q.when(result);
		}

		let provider = {
			dataProvider: {
				getList: getList,
				getItemByKey: getItemByKey
			},
			processData: (dataList) => {
				let selection = previewPreliminaryItemDataService.getSelected();
				return dataList.filter((item) => {
					return item.MaterialFk === selection.MdcMaterialFk;
				});
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, provider);
	}

})(angular);