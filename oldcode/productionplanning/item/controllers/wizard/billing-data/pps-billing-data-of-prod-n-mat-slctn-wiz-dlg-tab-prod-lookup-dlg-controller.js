/**
 * Created by zwz on 12/30/2024.
 */
(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabProductLookupDialogController', DialogController);

	DialogController.$inject = [
		'$scope', '$options',
		'platformGridAPI',
		'productionplanningCommonProductStatusLookupService',
		'productionplanningCommonProductUIStandardService',
		'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabProductLookupDataService',
		'lookupConverterService',
		'lookupFilterDialogControllerService',
		'$modalInstance'];

	function DialogController(
		$scope, $options,
		platformGridAPI,
		productStatusLookupService,
		productUIService,
		productLookupDataService,
		lookupConverterService,
		lookupFilterDialogControllerService,
		$modalInstance) {

		const getFormSettings = () => ({
			fid: 'productionplanning.product.filter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
				gid: 'baseGroup',
				isOpen: true,
				visible: true
			}],
			rows: [
				{
					gid: 'baseGroup',
					rid: 'projectId',
					model: 'projectId',
					sortOrder: 1,
					label$tr$: 'cloud.common.entityProject',
					label: 'Project',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						displayMember: 'Code',
						descriptionMember: 'ProjectName',
					},
					readonly: true,
				},
				{
					gid: 'baseGroup',
					rid: 'ordHeaderId',
					model: 'ordHeaderId',
					sortOrder: 2,
					label: 'Contract',
					label$tr$: 'productionplanning.common.ordHeaderFk',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'sales-common-contract-dialog-v2',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							filterKey: 'sales-contract-main-contract-filter-by-server',
							showClearButton: true
						}
					},
					readonly: true,
				},
				{
					gid: 'baseGroup',
					rid: 'ppsHeaderId',
					model: 'ppsHeaderId',
					sortOrder: 3,
					label: '*Production planning',
					label$tr$: 'productionplanning.header.entityHeader',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					readonly: true,
					options: {
						lookupDirective: 'productionplanning-Header-Dialog-Lookup',
						descriptionMember: 'DescriptionInfo.Translated',
					},
				},
				{
					gid: 'baseGroup',
					rid: 'jobIds',
					model: 'jobIds',
					sortOrder: 4,
					label: '*Job',
					label$tr$: 'logistic.job.entityJob',
					// readonly: true,
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'logistic-job-paging-extension-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							multipleSelection: true,
							showClearButton: true
						}
					}
				},
				{
					gid: 'baseGroup',
					rid: 'ppsItemIds',
					label: 'Production Unit',
					label$tr$: 'productionplanning.item.entityItem',
					type: 'directive',
					directive: 'productionplanning-item-item-lookup-dialog',
					options: {
						multipleSelection: true,
						lookupOptions: {
							multipleSelection: true,
							showClearButton: true
						},
						showClearButton: true
					},
					model: 'ppsItemIds',
					sortOrder: 5
				},
				{
					gid: 'baseGroup',
					rid: 'statusIds',
					label: '*Status',
					label$tr$: 'cloud.common.entityStatus',
					model: 'statusIds',
					sortOrder: 6,
					type: 'directive',
					directive: 'productionplanning-common-custom-filter-value-list',
					dropboxOptions: {
						items: productStatusLookupService.getList(),
						valueMember: 'Id',
						displayMember: 'Description'
					}
				},
				{
					gid: 'baseGroup',
					rid: 'material',
					model: 'materialIds',
					label: '*Material',
					label$tr$: 'productionplanning.common.mdcMaterialFk',
					sortOrder: 7,
					type: 'directive',
					directive: 'basics-material-material-lookup',
					options: {
						multipleSelection: true,
						initValueField: 'Code',
						showClearButton: true,
						lookupOptions: {
							multipleSelection: true,
							showClearButton: true
						}
					}
				},
				{
					gid: 'baseGroup',
					rid: 'engDrawing',
					label: '*Drawing',
					label$tr$: 'productionplanning.drawing.entityDrawing',
					model: 'drawingIds',
					sortOrder: 8,
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-drawing-dialog-lookup',
						descriptionMember: 'Description',
						lookupOptions: {
							multipleSelection: true,
							defaultFilter: {projectId: 'projectId'},
							showClearButton: true
						}
					}
				},

			]
		});

		// $scope.isCheckedValueChange = $options.isCheckedValueChange;

		const getGridSettings = () => {
			const gridColumns = _.cloneDeep(productUIService.getStandardConfigForListView().columns);
			_.forEach(gridColumns, function (o) {
				o.editor = null;
				o.navigator = null;
			});
			// add checked column
			gridColumns.unshift({
				editor: 'boolean',
				field: 'Checked',
				formatter: 'boolean',
				id: 'checked',
				width: 80,
				pinned: true,
				sortable: true,
				headerChkbox: true,
				validator: 'isCheckedValueChange',
				name$tr$: 'cloud.common.entitySelected'
			});

			return {
				columns: gridColumns,
				inputSearchMembers: ['Code', 'DescriptionInfo']
			}
		};

		const getLookupOptions = () => {


			return {
				lookupType: 'CommonProduct',
				valueMember: 'Id',
				displayMember: 'Code',
				defaultFilter: function (request) {
					return request;
				},
				filterOptions: {
					serverSide: true,
					serverKey: 'pps-common-billing-data-unassign-product-filter',
					fn: function (item) {
						const params = productLookupDataService.getFilterParams();
						$options.extendFilter(params);
						return params;
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'productionplanning.common.assignProduct',
				uuid: 'a70af18b20884ed19c3b4f15a5c58b88',
				// additional properties
				detailConfig: getFormSettings(),
				gridSettings: getGridSettings(),
				dataService: productLookupDataService,
			};
		};

		const lookupOptions = getLookupOptions();
		if ($options && $options.doBeforeInit) {
			$options.doBeforeInit(lookupOptions);
		}

		lookupConverterService.initialize($scope, lookupOptions);

		const PAGE_SIZE = 100;

		function checkItemsWithPreselectedProducts(data, preselectedProducts) {
			let items = [];
			let preselectedValidProducts = preselectedProducts.filter(x => data.some(id => id === x.Id));

			if (preselectedValidProducts?.length > 0) {
				const preselectedProductIds = preselectedValidProducts.map(e => e.Id);
				let mappedPreselectedItems = data.filter(x => preselectedProductIds.some(id => id === x.Id));
				let remainingItems = data.filter(x => !preselectedProductIds.some(id => id === x.Id));

				if (preselectedValidProducts.length === mappedPreselectedItems.length) {
					return mappedPreselectedItems.concat(remainingItems);
				} else {
					for (let i = 0; i < preselectedValidProducts.length; i++) {
						const tmpItem = mappedPreselectedItems.find(e => e.Id === preselectedValidProducts[i].Id);
						if (!_.isNil(tmpItem)) {
							preselectedValidProducts[i] = tmpItem;
						} else {
							if (preselectedValidProducts.length + remainingItems.length > PAGE_SIZE) {
								remainingItems.pop();
							}
						}
					}

					return preselectedValidProducts.concat(remainingItems);
				}
			} else {
				return data;
			}
		}

		$scope.options.processData = function processDataForArray(data) {
			const preselectedProducts = $scope.getPreselectedProductsFromProductContainer();
			const items = checkItemsWithPreselectedProducts(data, preselectedProducts);

			const statusList = productStatusLookupService.getList();
			_.forEach(items, function (item) {
				var status = _.find(statusList, {Id: item.ProductStatusFk});
				if (status.BackgroundColor) {
					item.BackgroundColor = status.BackgroundColor;
				}
			});

			let productsToCheck = preselectedProducts?.length > 0 ? items.filter(e => preselectedProducts.some(x => x.Id === e.Id)) : items;
			_.forEach(productsToCheck, function (item) {
				item.Checked = true;
			});
			$scope.updateCheckedProducts(productsToCheck);

			platformGridAPI.grids.resize('a70af18b20884ed19c3b4f15a5c58b88');

			return items;
		};
		lookupFilterDialogControllerService.initFilterDialogController($scope, $modalInstance);

		if ($options && $options.doAfterInit) {
			$options.doAfterInit($scope);

		}
	}

})(angular);

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';
	const serviceName = 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabProductLookupDataService';

	angular.module(moduleName).service(serviceName, LookupDataService);

	LookupDataService.$inject = ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator'];

	function LookupDataService(filterLookupDataService, basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'Id',
			dispMember: 'Code',
			columns: [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					width: 50,
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'Description',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					formatter: 'translation',
					width: 300,
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			uuid: 'd680aa8e7b6c41c4ae9bcc04077bbbc0'
		});

		const options = {};

		return filterLookupDataService.createInstance(options);
	}
})(angular);