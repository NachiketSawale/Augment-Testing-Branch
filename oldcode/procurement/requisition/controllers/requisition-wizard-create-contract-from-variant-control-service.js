(function (angular) {
	'use strict';
	let moduleName = 'procurement.requisition';
	angular.module(moduleName).factory('procurementRequisitionWizardCreateContractFromVariantControlService', procurementRequisitionWizardCreateContractFromVariantControlService);

	procurementRequisitionWizardCreateContractFromVariantControlService.$inject = [
		'platformGridAPI',
		'$q',
		'$http',
		'globals',
		'procurementRequisitionVariantUIStandardService',
		'platformTranslateService',
		'basicsLookupdataLookupControllerFactory',
		'_',
	];

	function procurementRequisitionWizardCreateContractFromVariantControlService(platformGridAPI, $q, $http, globals, procurementRequisitionVariantUIStandardService, platformTranslateService, basicsLookupdataLookupControllerFactory, _) {
		let service = {};
		service.initVariantControl = initVariantControl;
		return service;

		function initVariantControl(options) {
			if (!options) {
				return;
			}

			let gridId = options.variantGridId; // required
			let scope = options.scope; // required
			let reqHeader = options.reqHeader; // required
			let customCols = options.customCols; // optional
			let scopeOptions = {
				variantOptions: {
					isCreateFromVariants: false,
					doesVariantsSelectedHasDuplicateContent: false,
				},
			};

			_.extend(scope, scopeOptions);

			let isInitTools = options.isInitTools; // optional
			let variants = [];

			scope.variantGridId = gridId;
			scope.isCreateFromVariantsChanged = isCreateFromVariantsChanged;
			scope.hasSelectedVariants = hasSelectedVariants;
			scope.hasVariants = hasVariants;
			scope.getSelectedVariants = getSelectedVariants;
			scope.getVariants = getVariants;
			scope.variantGridData = {
				state: gridId,
			};
			scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist(gridId)) {
					platformGridAPI.grids.unregister(gridId);
				}
			});

			function getVariants() {
				initVariantGrid();
				if (!reqHeader) {
					return $q.when([]);
				}

				return $http.get(globals.webApiBaseUrl + 'procurement/requisition/variant/list?mainItemId=' + reqHeader.Id + '&need2CheckDup=true').then(function (response) {
					variants = response?.data ? response.data : [];
					variants.forEach((e) => {
						e.isChecked = false;
					});
					return variants;
				});
			}

			function getVariantColumns() {
				let columns = angular.copy(procurementRequisitionVariantUIStandardService.getStandardConfigForListView().columns);
				let addColumns = [
					{
						id: 'isChecked',
						field: 'isChecked',
						name: 'Checked',
						name$tr$: 'cloud.common.entityChecked',
						formatter: 'boolean',
						editor: 'boolean',
						width: 100,
						headerChkbox: true,
						cssClass: 'cell-center',
						validator: angular.isFunction(options.beforeValidateisChecked)
							? function (entity, value) {
									options.beforeValidateisChecked(entity, value);
									return validateisChecked(entity, value);
								}
							: validateisChecked,
					},
				];

				_.forEach(columns, function (col) {
					if (col.editor) {
						delete col.editor;
					}
					if (col.editorOptions) {
						delete col.editorOptions;
					}
				});

				let temp = addColumns;
				if (customCols) {
					temp = temp.concat(customCols);
				}

				columns = temp.concat(columns);

				return columns;
			}

			function initVariantGrid() {
				if (!platformGridAPI.grids.exist(gridId)) {
					let gridConfig = {
						columns: getVariantColumns(),
						data: [],
						id: gridId,
						gridId: gridId,
						lazyInit: true,
						options: {
							indicator: true,
							iconClass: '',
							enableDraggableGroupBy: true,
							enableColumnSort: true,
							skipPermissionCheck: true,
							enableModuleConfig: true,
							enableConfigSave: true,
						},
					};
					platformGridAPI.grids.config(gridConfig);
					platformTranslateService.translateGridConfig(gridConfig.columns);
					if (!scope.tools && isInitTools) {
						basicsLookupdataLookupControllerFactory.create(
							{
								grid: true,
								dialog: true,
								search: true,
							},
							scope,
							gridConfig,
						);
					}
				}
			}

			function updateGridData(data) {
				platformGridAPI.items.data(gridId, data);
				platformGridAPI.grids.refresh(gridId);
				setTimeout(function () {
					platformGridAPI.grids.resize(gridId);
				});
			}

			function isCreateFromVariantsChanged() {
				if (scopeOptions.variantOptions.isCreateFromVariants && hasVariants()) {
					updateGridData(variants);
				}

				let list = platformGridAPI.grids.element('id', gridId).dataView.getItems();
				checkHasDuplicateDataInVariantsSelected(list);
			}

			function getSelectedVariants() {
				if (!scopeOptions.variantOptions.isCreateFromVariants) {
					return null;
				}
				let list = platformGridAPI.grids.element('id', gridId).dataView.getItems();
				if (!list || list.length === 0) {
					return null;
				}
				return _.filter(list, function (item) {
					return item.isChecked;
				});
			}

			function hasVariants() {
				return variants && variants.length > 0;
			}

			function hasSelectedVariants() {
				let selected = getSelectedVariants();
				return selected && selected.length > 0;
			}

			function validateisChecked(entity, value) {
				let list = platformGridAPI.grids.element('id', gridId).dataView.getItems();
				entity.isChecked = value;
				checkHasDuplicateDataInVariantsSelected(list);
				return true;
			}

			function checkHasDuplicateDataInVariantsSelected(allVariants) {
				if (!scopeOptions.variantOptions.isCreateFromVariants) {
					scopeOptions.variantOptions.doesVariantsSelectedHasDuplicateContent = false;
					return;
				}

				if (!allVariants || allVariants.length === 0) {
					scopeOptions.variantOptions.doesVariantsSelectedHasDuplicateContent = false;
					return;
				}
				scopeOptions.variantOptions.doesVariantsSelectedHasDuplicateContent = false;
				allVariants.forEach((entity) => {
					if (entity.isChecked && entity.HasDuplicateDataVariantIds && entity.HasDuplicateDataVariantIds.length > 0) {
						let list = allVariants.filter((e) => e.isChecked && e.Id !== entity.Id).map((e) => e.Id);
						let dupVariantIds = entity.HasDuplicateDataVariantIds.filter((e) => e.Id !== entity.Id);
						scopeOptions.variantOptions.doesVariantsSelectedHasDuplicateContent = scopeOptions.variantOptions.doesVariantsSelectedHasDuplicateContent || _.intersection(list, dupVariantIds).length > 0;
					}
				});
			}
		}
	}
})(angular);
