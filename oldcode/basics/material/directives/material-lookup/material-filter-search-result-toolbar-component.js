/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.material';
	angular.module(moduleName).component('basicsMaterialFilterSearchResultToolbar', {
		templateUrl: 'basics.material/templates/material-lookup/material-filter-search-result-toolbar-component.html',
		bindings: {
			defaultDisplayFields: '<',
			searchViewOptions: '<',
			gridId: '<'
		},
		controller: [
			'$scope',
			'$translate',
			'platformGridAPI',
			'basicsMaterialSearchSortOptions',
			'materialLookupDialogSearchOptionService',
			'platformDialogService',
			'basicsMaterialFilterItemPreviewAttributesService',
			function (
				$scope,
				$translate,
				platformGridAPI,
				searchSortOptions,
				searchOptionService,
				platformDialogService,
				previewAttributesService
			) {
				const materialLookupDialogGridId = this.gridId;
				const searchViewOptions = this.searchViewOptions;
				const defaultDisplayFields = this.defaultDisplayFields;
				const materialText = $translate.instant('basics.material.record.material');

				$scope.searchService = this.searchViewOptions.searchService;
				$scope.searchOptions = this.searchViewOptions.searchService.searchOptions;
				$scope.tools = {};
				$scope.getGridTitle = function getGridTitle() {
					let count = $scope.searchService.data?.matchedCount;

					if (count && $scope.searchService.data?.hasMoreMaterials) {
						count += '+';
					}

					return count ? `${materialText} (${count})` : materialText;
				}

				this.$onInit = function onInit() {
					previewAttributesService.setDefaultDisplayFields(defaultDisplayFields);
					initWhetherShowImage();
					updatePreviewAttributes();
					updateTools();
				}

				function updateTools() {
					$scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						version: 1,
						items: getToolBarItems()
					};
				}

				function getToolBarItems() {
					return [
						{
							sort: 1,
							id: 'layoutSetting',
							type: 'dropdown-btn',
							tooltip: 'basics.material.lookup.setting',
							iconClass: 'tlb-icons ico-settings',
							list: {
								showImages: false,
								cssClass: 'dropdown-menu-left',
								items: getToolBarSettingItems()
							}
						}
					];
				}

				function onShowImageChange(isShow) {
					const materialDefOfShowImage = searchOptionService.getMaterialSearchOption('showImageInPreview');
					if (materialDefOfShowImage !== isShow) {
						searchViewOptions.showImageInPreview = isShow;
						searchOptionService.postMaterialSearchOption({showImageInPreview: isShow});
					}
				}

				function initWhetherShowImage() {
					const materialDefOfShowImage = searchOptionService.getMaterialSearchOption('showImageInPreview');
					if (_.isBoolean(materialDefOfShowImage)) {
						searchViewOptions.showImageInPreview = materialDefOfShowImage;
					}
				}

				function onFilterByHeaderStructureChange(isFilter) {
					const isFilterByHeaderStructure = searchOptionService.getMaterialSearchOption('isFilterByHeaderStructure');
					if (isFilterByHeaderStructure !== isFilter) {
						searchOptionService.postMaterialSearchOption({isFilterByHeaderStructure: isFilter});
					}
				}

				function getToolBarSettingItems() {
					const isFilterByHeaderStructureSystemOption = searchViewOptions.getFilterByHeaderStructureSystemOption();
					const isFilterByHeaderStructureFromOption = searchOptionService.getMaterialSearchOption('isFilterByHeaderStructure');
					const isFilterByHeaderStructure = isFilterByHeaderStructureSystemOption ?
						true :
						!!isFilterByHeaderStructureFromOption;

					return [{
						sort: 1,
						id: 'filterByHeaderPrcStructure',
						type: 'check',
						caption$tr$: 'basics.material.lookup.filterByHeaderPrcStructure',
						disabled: isFilterByHeaderStructureSystemOption,
						value: isFilterByHeaderStructure,
						fn: function () {
							onFilterByHeaderStructureChange(this.value);
						}
					}, {
						sort: 2,
						id: 'filterItemsByHeaderPrcStructureDivider',
						type: 'divider'
					}, {
						sort: 3,
						id: 'configureTable',
						type: 'item',
						caption$tr$: 'basics.material.lookup.configureTable',
						fn: function () {
							platformGridAPI.configuration.openConfigDialog(materialLookupDialogGridId);
						}
					}, {
						sort: 4,
						id: 'gridLayoutDivider',
						type: 'divider'
					}, {
						sort: 5,
						id: 'configurePreview',
						type: 'item',
						caption$tr$: 'basics.material.lookup.configurePreview',
						fn: openPreviewCustomizeDialog
					}, {
						sort: 6,
						id: 'showImageInPreview',
						type: 'check',
						caption$tr$: 'basics.material.lookup.showImageInPreview',
						value: searchViewOptions.showImageInPreview,
						fn: function () {
							onShowImageChange(this.value);
						}
					}];
				}

				function openPreviewCustomizeDialog() {
					platformDialogService.showDialog({
						headerText$tr$: 'basics.material.lookup.customizePreview',
						bodyTemplateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-item-preview-customize.html',
						showOkButton: false,
						showCancelButton: true,
						resizeable: true,
						height: '500px',
						width: '400px',
						buttons: [{
							id: 'save',
							caption$tr$: 'basics.common.button.save',
							fn: savePreviewAttributes
						}],
						attributes: _.cloneDeep(searchViewOptions.previewAttributes)
					});
				}

				function updatePreviewAttributes(attributes) {
					searchViewOptions.previewAttributes = attributes ?? previewAttributesService.getPreviewAttributes();
				}

				function savePreviewAttributes(adjustedAttributes) {
					updatePreviewAttributes(adjustedAttributes);
					const savedPreviewAttributes = adjustedAttributes.map(function(attr) {
						return { selected: attr.selected, key: attr.key };
					});
					searchOptionService.postMaterialSearchOption({previewAttributes: savedPreviewAttributes});
				}

				this.$onDestroy = function () {
				};
			}
		],
		controllerAs: 'basicsMaterialFilterSearchToolbar'
	});

	angular.module(moduleName).service('basicsMaterialFilterItemPreviewAttributesService', [
		'$translate',
		'materialLookupDialogSearchOptionService',
		'basicsMaterialFilterSearchGridColumn',
		function(
			$translate,
			searchOptionService,
			materialLookupGridColumn
		) {
			const characteristicsText = $translate.instant('basics.material.lookup.characteristics');
			const attributesText = $translate.instant('basics.material.lookup.attributes');
			const documentsText = $translate.instant('basics.material.lookup.documents');
			const gridColumns = [...materialLookupGridColumn].filter(function (c) {
				return !_.includes(['selected', 'indicator', 'DescriptionInfo', 'DescriptionInfo2'], c.field);
			});
			const otherColumns = [
				{ id: 'attr_characteristics', name: characteristicsText, displayCharacteristic: true },
				{ id: 'attr_attributes', name: attributesText, displayAttribute: true },
				{ id: 'attr_documents', name: documentsText, displayDocument: true }
			];
			let defaultDisplayFields = [];

			this.setDefaultDisplayFields = function(fields) {
				defaultDisplayFields = fields;
			}

			this.getPreviewAttributes = function getPreviewAttributes() {
				const materialDefOfPreviewAttributes = searchOptionService.getMaterialSearchOption('previewAttributes');
				if (materialDefOfPreviewAttributes) {
					return getDefaultPreviewAttributesByDef(materialDefOfPreviewAttributes);
				}

				return getDefaultPreviewAttributes();
			}

			function getDefaultPreviewAttributesByDef(materialDefOfPreviewAttributes) {
				const attributes = [];
				const allColumns = gridColumns.concat(otherColumns);
				const keysOfMaterialDef = materialDefOfPreviewAttributes.map(function(attr) { return attr.key;});
				const newAttributes = allColumns.filter(function(attr) { return !_.includes(keysOfMaterialDef, attr.id)});

				materialDefOfPreviewAttributes.forEach(function(attr) {
					const findAttributes = allColumns.find(function (a) { return a.id === attr.key; });
					if (findAttributes) {
						attributes.push(createAttributeEntity(findAttributes, attr.selected));
					}
				});

				newAttributes.forEach(function(attr) {
					attributes.push(createAttributeEntity(attr, false));
				});

				return attributes;
			}

			function getDefaultPreviewAttributes() {
				let attributes = [];
				const defaultDisplayLowerCaseFields = defaultDisplayFields.map(function(f) { return f.toLowerCase(); });

				gridColumns.forEach(function (column) {
					const isSelected = _.includes(defaultDisplayLowerCaseFields, column.field.toLowerCase()) ||
						_.includes(defaultDisplayLowerCaseFields, column.id.toLowerCase());
					attributes.push(createAttributeEntity(column, isSelected));
				});

				attributes = attributes.concat(otherColumns.map(function (attr) {
					return createAttributeEntity(attr, false);
				}));

				return attributes;
			}

			function createAttributeEntity(attr, selected) {
				return {
					selected: selected,
					key: attr.id,
					name: attr.name,
					displayAttribute: attr.displayAttribute,
					displayCharacteristic: attr.displayCharacteristic,
					displayDocument: attr.displayDocument
				};
			}
		}
	]);
})(angular);