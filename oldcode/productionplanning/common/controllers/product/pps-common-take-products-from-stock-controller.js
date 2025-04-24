(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonTakeProductsFromStockController', controller);
	controller.$inject = ['$scope', '$injector', 'platformTranslateService', 'platformGridAPI', 'basicsLookupdataLookupDescriptorService', 'ppsCommonStockProductDataService'];

	function controller(scope, $injector, platformTranslateService, platformGridAPI, lookupDescriptorService, ppsCommonStockProductDataService) {
		const editableField = {
			ppsHeaderId: 'PpsHeaderId',
			productTemplateId: 'PpsProductTemplateId',
			quantityToTake: 'QuantityToTake',
		};
		scope.isLoading = true;

		const formConfig = {
			fid: moduleName + '.takeFromStock',
			id: '3c563f81364f4a7abda52c20f0076aca',
			showGrouping: false,
			skipPermissionsCheck: true,
			groups: [{
				gid: 'baseGroup',
				attributes: ['ppsHeader'],
			}],
			rows: [
				{
					gid: 'baseGroup',
					rid: 'ppsHeader',
					label: '*Pps Header',
					label$tr$: 'productionplanning.header.entityHeader',
					model: editableField.ppsHeaderId,
					sortOrder: 1,
					visible: true,
					required: true,
					change: entity => {
						resetOtherFields(entity);
						enableField(editableField.productTemplateId);
					},
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-Take-Products-From-Stock-Header-Combobox',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PpsHeader',
						displayMember: 'Code',
						version: 3
					}
				},
				{
					gid: 'baseGroup',
					rid: 'ppsProductTemplate',
					label: '*Pps Product Template',
					label$tr$: 'productionplanning.producttemplate.entityProductDescription',
					model: editableField.productTemplateId,
					sortOrder: 2,
					visible: true,
					required: true,
					change: entity => {
						entity.QuantityToTake = 0;
						ppsCommonStockProductDataService.setAvailableQuantity();
						setProducts(entity.PpsHeaderId, entity.PpsProductTemplateId);
						enableField(editableField.quantityToTake);
					},
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-Take-Products-From-Stock-product-template-Combobox',
						descriptionMember: 'DescriptionInfo.Translated',
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PPSProductDescription',
						displayMember: 'Code',
						version: 3
					}
				},
				{
					gid: 'baseGroup',
					rid: 'availableQuantity',
					label: '*Available Quantity',
					label$tr$: 'productionplanning.common.product.availableQuantity',
					model: 'AvailableQuantity',
					sortOrder: 3,
					visible: true,
					type: 'integer',
					readonly: true,
				},
				{
					gid: 'baseGroup',
					rid: 'quantity',
					label: '*Quantity To Be Taken',
					label$tr$: 'productionplanning.common.product.quantityToBeTaken',
					model: editableField.quantityToTake,
					sortOrder: 4,
					visible: true,
					required: true,
					type: 'integer',
					validator: (entity, value, field) => {
						return $injector.get('platformDataValidationService').isAmong(entity, value, 'number', 1, entity.AvailableQuantity);
					},
				}
			]
		};
		scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(formConfig),
			entity: scope.options.dataItem,
		};

		const gridConfig = {
			id: '5d12b3028a4d4927931467cb5e66cf4a',
			state: '5d12b3028a4d4927931467cb5e66cf4a',
			lazyInit: true,
			columns: getProductColumns(),
			options: {
				indicator: true,
				editable: false,
				idProperty: 'Id',
				multiSelect: false,
				skipPermissionCheck: true,
				selectionModel: new Slick.RowSelectionModel()
			},
		};
		// todo add btns
		platformGridAPI.grids.config(gridConfig);
		scope.gridData = gridConfig;

		disableField(editableField.productTemplateId);
		disableField(editableField.quantityToTake);

		const selectedPpsItem = getSelectedPpsItem();
		ppsCommonStockProductDataService.loadData(selectedPpsItem, getMasterProductTemplateId(selectedPpsItem));

		ppsCommonStockProductDataService.registerDataLoaded(onDataLoaded);

		scope.$on('$destroy', () => {
			ppsCommonStockProductDataService.unregisterDataLoaded(onDataLoaded);
		});

		function onDataLoaded() {
			scope.isLoading = false;
		}

		function getProductColumns() {
			const columns = _.cloneDeep($injector.get('productionplanningCommonProductUIStandardService').getStandardConfigForListView().columns);
			columns.forEach(col => {
				col.editor = null;
				col.editorOptions = null;
				col.navigator = null;
			});
			return columns;
		}

		function getSelectedPpsItem() {
			return $injector.get('productionplanningItemDataService').getSelected();
		}

		function getMasterProductTemplateId(selectedPU) {
			const ppsPD = lookupDescriptorService.getLookupItem('PPSProductDescription', selectedPU.ProductDescriptionFk);
			return ppsPD.MdcProductDescriptionFk;
		}

		function setProducts(ppsHeaderId, ppsProductTemplateId) {
			scope.isLoading = true;
			ppsCommonStockProductDataService.loadProducts(ppsHeaderId, ppsProductTemplateId).then(products => {
				scope.gridData.dataView.setItems(products);
				scope.isLoading = false;
			});
		}

		function enableField(field) {
			changeFieldStatus(field, false);
		}

		function disableField(field) {
			changeFieldStatus(field, true);
		}

		function changeFieldStatus(field, readonly) {
			const platformRuntimeDataService = $injector.get('platformRuntimeDataService');
			const fields = [{field: field, readonly: readonly}];
			platformRuntimeDataService.readonly(scope.options.dataItem, fields);
		}

		function resetOtherFields(entity) {
			entity.PpsProductTemplateId = null;
			entity.AvailableQuantity = 0;
			entity.QuantityToTake = 0;
		}
	}
})(angular);