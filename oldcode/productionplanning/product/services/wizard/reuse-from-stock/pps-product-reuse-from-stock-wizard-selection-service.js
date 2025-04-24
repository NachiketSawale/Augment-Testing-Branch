/**
 * Created by zwz on 07/01/2022.
 */

(function (angular) {
	'use strict';
	/* global angular, Slick, globals, _ */
	var moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('productionplanningProductReuseFromStockWizardSelectionService', Service);
	Service.$inject = ['$http', '$injector', '$q', '$translate', 'keyCodes',
		'platformTranslateService', 'platformGridAPI'];

	function Service($http, $injector, $q, $translate, keyCodes,
		platformTranslateService, platformGridAPI) {

		let service = {};
		let scope = {};
		let gridId = 'adfa860fda404411940e96aaefb9516c';

		function getSelectedItem(gridId) {
			let selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			return selected;
		}
		function onSelectedRowsChanged(e, args) {
			scope.context.selectedReusableProduct = getSelectedItem(args.grid.options.id);
		}

		function getFormConfig() {
			return {
				fid: 'productionplanning.product.bookStockLocation',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'site',
						model: 'SiteId',
						sortOrder: 1,
						label$tr$: 'basics.site.entitySite',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								// filterKey: 'to-do-filter' // add filter key if needs...
							},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					{
						gid: 'baseGroup',
						rid: 'material',
						model: 'MaterialId',
						label: '*Material',
						label$tr$: 'productionplanning.common.mdcMaterialFk',
						sortOrder: 2,
						type: 'directive',
						directive: 'basics-material-material-lookup',
						options: {
							initValueField: 'Code',
							showClearButton: true,
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					{
						gid: 'baseGroup',
						rid: 'length',
						model: 'Length',
						label: '*Length',
						label$tr$: 'productionplanning.common.product.length',
						sortOrder: 3,
						type: 'decimal'
					},
					{
						gid: 'baseGroup',
						rid: 'width',
						model: 'Width',
						label: '*Width',
						label$tr$: 'productionplanning.common.product.width',
						sortOrder: 4,
						type: 'decimal'
					}
				]
			};
		}

		function getGridConfig() {
			return {
				id: gridId,
				state: gridId,
				columns: [
					{
						id: 'PpsProductStatusFk',
						field: 'PpsProductStatusFk',
						name: 'Status*',
						name$tr$: 'productionplanning.common.product.productStatusFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.ppsproductstatus',
							displayMember: 'Description',
							valueMember: 'Id',
							imageSelector: 'platformStatusIconService'
						}
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						formatter: 'description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Length',
						field: 'Length',
						name: 'Length',
						name$tr$: 'productionplanning.common.product.length',
						formatter: 'decimal'
					},
					{
						'id': 'BasUomLengthFk',
						'field': 'BasUomLengthFk',
						'name': 'Length UoM',
						'name$tr$': 'productionplanning.common.product.lengthUom',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					},
					{
						id: 'Width',
						field: 'Width',
						name: 'Width',
						name$tr$: 'productionplanning.common.product.width',
						formatter: 'decimal'
					},
					{
						'id': 'BasUomWidthFk',
						'field': 'BasUomWidthFk',
						'name': 'Width UoM',
						'name$tr$': 'productionplanning.common.product.widthUom',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					},
					{
						id: 'PpsProductionSetFk',
						field: 'PpsProductionSetFk',
						name: 'ProductionSet*',
						name$tr$: 'productionplanning.common.product.productionSetFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProductionsetLookup',
							displayMember: 'Code',
							version: 3
						}
					},

				],
				options: {
					indicator: true,
					selectionModel: new Slick.RowSelectionModel()
				}
			};
		}

		function initFilterEntity(originalProduct) {
			scope.filterEntity = {
				SiteId: originalProduct.SiteFk,
				MaterialId: originalProduct.MaterialFk,
				Length: originalProduct.Length,
				LengthUomId: originalProduct.BasUomLengthFk,
				Width: originalProduct.Width,
				WidthUomId: originalProduct.BasUomWidthFk,
				StrandPatternId: originalProduct.PpsStrandPatternFk,
				IgnoredProductId: originalProduct.Id
			};
		}

		function createFilterRequest(scope) {
			let request = {
				'FurtherFilters': [],
				'Pattern': scope.filterEntity.searchValue,
				'IncludeNonActiveItems': false,
				'UseCurrentClient': true,
			};

			_.each(['StrandPatternId', 'SiteId', 'MaterialId', 'Length', 'LengthUomId', 'Width', 'WidthUomId', 'IgnoredProductId'], field => {
				if (scope.filterEntity[field]) {
					request.FurtherFilters.push(
						{
							'Token': field,
							'Value': scope.filterEntity[field]
						});
				}
			});

			return request;
		}

		service.initial = function initial($scope) {
			scope = $scope;
			scope.selecteReusableProduct = null;
			initFilterEntity(scope.context.originalProduct);
			// form config
			var filterFormConfig = getFormConfig();
			scope.filterFormOptions = {configure: platformTranslateService.translateFormConfig(filterFormConfig)};

			// grid config
			var gridConfig = getGridConfig();
			gridConfig.columns.current = gridConfig.columns;
			platformGridAPI.grids.config(gridConfig);
			scope.grid = gridConfig;

			scope.search = function () {
				scope.isLoading = true;
				scope.context.selectedReusableProduct = null;
				$http.post(globals.webApiBaseUrl + 'productionplanning/product/stock/reusableproduct/list', createFilterRequest(scope)).then(function (response) {
					if (response && response.data) {
						platformGridAPI.items.data(gridId, response.data);
					}
					scope.isLoading = false;
				}, function () {
					scope.isLoading = false;
				});
			};
			scope.onSearchInputKeydown = function () {
				if (event.keyCode === keyCodes.ENTER) {
					scope.search();
				}
			};

			service.registerSelectionChanged();
		};
		service.isValid = function () {
			return scope && scope.context && scope.context.selectedReusableProduct;
		};

		service.active = function () {
			let defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.unActive = function () {
			let defer = $q.defer();
			scope.context.filterEntity = scope.filterEntity;
			let reusableProduct = scope.context.selectedReusableProduct;
			if (reusableProduct.BasUomLengthFk === scope.filterEntity.LengthUomId
				&& reusableProduct.BasUomWidthFk === scope.filterEntity.WidthUomId) {
				reusableProduct.HasRemLength = reusableProduct.Length > scope.filterEntity.Length;
				reusableProduct.HasRemWidth = reusableProduct.Width > scope.filterEntity.Width;
				defer.resolve(true);
			} else {
				let request = {
					Length: reusableProduct.Length,
					LengthUomId: reusableProduct.BasUomLengthFk,
					Width: reusableProduct.Width,
					WidthUomId: reusableProduct.BasUomWidthFk,
					ComparedLength: scope.filterEntity.Length,
					ComparedLengthUomId: scope.filterEntity.LengthUomId,
					ComparedWidth: scope.filterEntity.Width,
					ComparedWidthUomId: scope.filterEntity.WidthUomId
				};
				$http.post(globals.webApiBaseUrl + 'productionplanning/product/stock/reusableproduct/checklengthwidth', request).then(function (response) {
					if (response && response.data) {
						reusableProduct.HasRemLength = response.data.HasRemLength;
						reusableProduct.HasRemWidth = response.data.HasRemWidth;
					}
					defer.resolve(true);
				});
			}
			return defer.promise;
		};

		service.registerSelectionChanged = function (){
			platformGridAPI.events.register(scope.grid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
		};
		service.unregisterSelectionChanged = function (){
			platformGridAPI.events.unregister(scope.grid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
		};

		return service;
	}

})(angular);
