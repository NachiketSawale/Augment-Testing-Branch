/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.material';
	angular.module(moduleName).component('basicsMaterialFilterItemPreview', {
		templateUrl: 'basics.material/templates/material-lookup/material-filter-item-preview-component.html',
		bindings: {
			searchViewOptions: '<',
			selectedItemDetail: '<'
		},
		controller: [
			'$scope',
			'$q',
			'$translate',
			'platformDialogService',
			'basicsMaterialMaterialBlobService',
			'basicsMaterialFilterSearchGridColumn',
			'materialDocumentPreviewConfigService',
			'basicsMaterialRecordUIConfigurationService',
			'basicsCharacteristicTypeHelperService',
			'basicsCharacteristicDataDiscreteValueLookupService',
			function (
				$scope,
				$q,
				$translate,
				platformDialogService,
				basicsMaterialMaterialBlobService,
				materialLookupGridColumn,
				materialDocumentPreviewConfigService,
				basicsMaterialRecordUIConfigurationService,
				basicsCharacteristicTypeHelperService,
				basicsCharacteristicDataDiscreteValueLookupService
			) {
				let attributes = [];
				let mdcAttributes = [];
				let characteristics = [];
				let characteristicValues = [];
				let documentData = [];
				const characteristicsText = $translate.instant('basics.material.lookup.characteristics');
				const attributesText = $translate.instant('basics.material.lookup.attributes');
				const documentsText = $translate.instant('basics.material.lookup.documents');

				const searchService = this.searchViewOptions.searchService;
				$scope.displayImage = this.searchViewOptions.showImageInPreview;
				$scope.searchViewOptions = this.searchViewOptions;
				$scope.selectedItemDetail = this.selectedItemDetail;
				$scope.entity = $scope.selectedItemDetail.selectedItem;
				$scope.displayAttributes = [];
				$scope.previewDocuments = [];
				$scope.previewDocumentTypes = [];
				$scope.internetCatalog = null;
				$scope.getDescription1 = function () { return getTranslated($scope.entity?.DescriptionInfo) };
				$scope.getDescription2 = function () { return getTranslated($scope.entity?.DescriptionInfo2) };
				$scope.onDocumentPreview = onDocumentPreview;

				this.$onInit = function onInit() {
					searchService.onItemUpdated.register(onMaterialItemUpdated);
				}

				function onMaterialItemUpdated() {
					updateAttributes();
				}

				function getAndUpdateAttributes() {
					if (!$scope.entity) {
						return;
					}

					const characteristicValueLookupOption = {
						lookupType: basicsCharacteristicDataDiscreteValueLookupService.getlookupType()
					};
					$q.all([
						searchService.getAttributesByMaterialId($scope.entity.Id),
						searchService.getCharacteristics($scope.entity.Id),
						searchService.getDocumentsByMaterialId($scope.entity.Id),
						basicsCharacteristicDataDiscreteValueLookupService.getList(characteristicValueLookupOption)]
					).then(function (response) {
						mdcAttributes = response[0];
						characteristics = response[1].data;
						documentData = response[2].Main;
						characteristicValues = response[3];
						$scope.previewDocuments = documentData;
						$scope.previewDocumentTypes = response[2].DocumentType;
						updateAttributes();
					});
				}

				function updateAttributes() {
					if (!$scope.entity) {
						return;
					}

					attributes = [];
					$scope.searchViewOptions.previewAttributes.forEach(function(attr) {
						if (attr.displayCharacteristic) {
							addCharacteristicsToAttributes(characteristics, attributes, attr.selected);
						} else if (attr.displayAttribute) {
							addMaterialAttributesToAttributes(mdcAttributes, attributes, attr.selected);
						} else if (attr.displayDocument) {
							addDocumentsToAttributes(documentData, attributes, attr.selected);
						} else {
							addGridColumnToAttributes(attributes, attr.key, attr.selected);
						}
					});
					updateDisplayAttributes(attributes);
				}

				function updateDisplayAttributes(attributes) {
					$scope.displayAttributes = attributes.filter(function (attr) {
						return attr.selected;
					});
				}

				function addGridColumnToAttributes(attributes, id, selected) {
					const column = materialLookupGridColumn.find(function (c) { return c.id === id});
					if (column) {
						const value = getDisplayValue($scope.entity, column);
						if (value !== '') {
							attributes.push(createAttribute(column.id, column.name, value, selected));
						}
					}
				}

				function getDisplayValue(material, column) {
					let value = material[column.field];
					if (_.isFunction(column.formatter)) {
						value = column.formatter(undefined, undefined, value, column, material);
					}
					value = _.isNil(value) ? '' : value.toString().trim();
					return value;
				}

				function getCharacteristicDisplayValue(item) {
					const characteristicLookupType = 10;
					if (item.CharacteristicEntity.CharacteristicTypeFk === characteristicLookupType && item.CharacteristicValueFk) {
						const valueItem = characteristicValues.find(function(c) {
							return c.Id === item.CharacteristicValueFk;
						});
						return getTranslated(valueItem?.DescriptionInfo);
					}
					return basicsCharacteristicTypeHelperService.convertValue(item.ValueText ,item.CharacteristicEntity.CharacteristicTypeFk);
				}

				function addMaterialAttributesToAttributes(materialAttributes, attributes, selected) {
					if (!materialAttributes?.length) {
						return;
					}

					attributes.push(createAttribute('materialAttr-title', attributesText, '', selected));

					materialAttributes.forEach(function (materialAttr, index) {
						attributes.push(createAttribute('materialAttr-' + index, $translate.instant(materialAttr.Property), materialAttr.Value, selected, false, true));
					});
				}

				function addCharacteristicsToAttributes(Characteristics, attributes, selected) {
					if (!Characteristics?.length) {
						return;
					}

					attributes.push(createAttribute('characteristic-title', characteristicsText, '', selected));

					Characteristics.forEach(function (characteristic) {
						const value = getCharacteristicDisplayValue(characteristic);
						const name = characteristic.CharacteristicEntity
							.Code + ' ' + getTranslated(characteristic.CharacteristicEntity.DescriptionInfo);
						attributes.push(createAttribute('characteristic-' + characteristic.Id, name, value, selected, false, true));
					});
				}

				function addDocumentsToAttributes(documents, attributes, selected) {
					if (!documents?.length) {
						return;
					}

					const documentsWithFile = documents.filter(d => d.FileArchiveDocFk);
					if (!documentsWithFile?.length) {
						return;
					}

					attributes.push(createAttribute('document', documentsText, documentsWithFile, selected, true));
				}

				function createAttribute(key, name, value, selected, isDocument, isAttributeItem) {
					return {
						selected: !!selected,
						key: key,
						name: name,
						value: value,
						isDocument: isDocument,
						isAttributeItem: isAttributeItem
					}
				}

				function updateImage() {
					if (!$scope.entity) {
						return;
					}
					basicsMaterialMaterialBlobService.provideImageNoPlaceholder($scope.entity);
				}

				function getTranslated(info) {
					return info?.Translated ?? '';
				}

				function onDocumentPreview(documentId, description) {
					return platformDialogService.showDialog({
						id: 'material.lookup.dialog.item.document.preview',
						headerText: description,
						bodyTemplateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-item-document-preview.html',
						width: '90%',
						height: '90%',
						resizeable: true,
						buttons: [{id: 'closeButton', caption$tr$: 'cloud.common.closeButton'}],
						documentOptions: {
							documentId: documentId,
							previewDocuments: _.cloneDeep($scope.previewDocuments),
							previewDocumentTypes: $scope.previewDocumentTypes
						}
					});
				}

				const unregisterWatchSelectedItem = $scope.$watch('selectedItemDetail.selectedItem', function (newSelectedItem) {
					$scope.entity = newSelectedItem;
					$scope.internetCatalog = $scope.entity?.InternetCatalogFk;
					updateImage();
					getAndUpdateAttributes();
				});

				const unregisterWatchShowImage = $scope.$watch('searchViewOptions.showImageInPreview', function (isDisplayImage) {
					$scope.displayImage = isDisplayImage;
				});

				const unregisterWatchPreviewAttributes = $scope.$watch('searchViewOptions.previewAttributes', function () {
					updateAttributes();
				});

				this.$onDestroy = function () {
					unregisterWatchSelectedItem();
					unregisterWatchShowImage();
					unregisterWatchPreviewAttributes();
					searchService.onItemUpdated.unregister(onMaterialItemUpdated);
				};
			}
		],
		controllerAs: 'basicsMaterialFilterItemDetail'
	});
})(angular);