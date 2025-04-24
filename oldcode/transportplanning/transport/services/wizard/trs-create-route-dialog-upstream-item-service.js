(function () {
	'use strict';
	/* global globals _ */

	const moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('trsCreateRouteDialogUpstreamItemService', [
		'$http',
		'$injector',
		'$translate',
		'platformGridAPI',
		'platformGridDialogService',
		'packageTypes',
		'upstreamGoodsTypes',
		'transportplanningTransportCreateTransportRouteDialogServiceFactory',
		function ($http,
			$injector,
			$translate,
			platformGridAPI,
			platformGridDialogService,
			packageTypes,
			upstreamGoodsTypes,
			transportplanningTransportCreateTransportRouteDialogServiceFactory) {

			const gridId = '9a01d69a6f8e4ee180b467f7db7d79e2';
			const displayCols = ['ppsitemfk', 'ppsupstreamstatusfk', 'ppsupstreamtypefk', 'ppsupstreamgoodstypefk', 'upstreamgoods',
				'upstreamgoodsdescription', 'quantity', 'uomfk', 'uomfkdescription', 'comment', 'isfortransport'];
			const displayColumns = getDisplayColumns(displayCols);
			const service = transportplanningTransportCreateTransportRouteDialogServiceFactory.createInstance({});

			service.createItem = function (entity) {
				if (!entity) {
					return;
				}

				if (entity.ProjectDefFk === null) {
					$injector.get('platformDialogService')
						.showErrorDialog($translate.instant('transportplanning.transport.wizard.requiredProjectDefFk'));
					return;
				}

				$http.get(globals.webApiBaseUrl + 'productionplanning/item/upstreamitem/gettransportableitem?projectFk=' + entity.ProjectDefFk).then(res => {
					if (res && res.data) {
						const dialogOptions = {
							id: gridId,
							headerText: '*Assign Upstream Item',
							headerText$tr$: 'transportplanning.transport.dialogTitleUpstreamItem',
							columns: displayColumns,
							items: res.data,
							idProperty: 'Id',
							showColumnFilter: true, // There is an issue in grid-dialog-body.js, the options showColumnFilter and showGridFilter are not working.
							showGridFilter: true,
							minHeight: '450px',
						};
						platformGridDialogService.showDialog(dialogOptions).then(result => {
							if (result.ok && result.success) {
								const selectedItems = result.value.filter(i => result.selectedIds.includes(i.Id));
								service.createReferences(selectedItems);
							}
						});
					}
				});
			};

			service.onAddNewItem = function (item) {
				item.PQuantity = item.Quantity;
				item.PUomFk = item.UomFk;
			};

			service.getResult = function() {
				const result = {
					Materials: [],
					Resources: [],
					Plants: [],
					Products: [],
				};
				_.forEach(service.getList(), function(item) {
					const [type, typeId, id] = getGoodsTypeAndId(item);
					result[type].push({
						Id: id,
						PpsUpstreamItemFk: item.Id,
						Quantity: item.PQuantity,
						UomFk: item.PUomFk,
						PkgType: typeId,
						Description: item.freeDescription,
						UserDefined1: item.PrefillUserdefined1,
						UserDefined2: item.PrefillUserdefined2,
						UserDefined3: item.PrefillUserdefined3,
						UserDefined4: item.PrefillUserdefined4,
						UserDefined5: item.PrefillUserdefined5
					});
				});
				return result;
			};

			function getGoodsTypeAndId(upstreamItem) {
				switch (upstreamItem.PpsUpstreamGoodsTypeFk) {
					case upstreamGoodsTypes.Material:
						return ['Materials', packageTypes.Material, upstreamItem.MdcMaterialFk];
					case upstreamGoodsTypes.Resource:
						return ['Resources', packageTypes.Resource, upstreamItem.ResResourceFk];
					case upstreamGoodsTypes.Plant:
						return ['Plants', packageTypes.Plant, upstreamItem.EtmPlantFk];
					case upstreamGoodsTypes.Product:
						return ['Products', packageTypes.Product, upstreamItem.PpsProductFk];
					default:
						throw new Error('Unsupported upstream goods type');
				}
			}

			function getDisplayColumns(displayCols) {
				const dataService = $injector.get('ppsUpstreamItemDataService').getService();
				const uiService = $injector.get('ppsUpstreamItemUIStandardService').getService(dataService);

				let copiedCols = _.cloneDeep(uiService.getStandardConfigForListView().columns);
				copiedCols = copiedCols.filter(i => displayCols.includes(i.id));
				copiedCols.forEach(col => {
					if (col.editor) {
						col.editor = null;
						col.editorOptions = null;
					}
					if (col.navigator) {
						col.navigator = null;
					}
				});
				return copiedCols;
			}

			return service;
		}
	]);
})();