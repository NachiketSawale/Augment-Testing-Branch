/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationQuickCreateService';

	myModule.factory(svcName, modelAnnotationQuickCreateService);

	modelAnnotationQuickCreateService.$inject = ['platformModalFormConfigService', '$translate',
		'platformTranslateService', 'platformRuntimeDataService', '$q', '$http', '_',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerModelSelectionService',
		'basicsLookupdataConfigGenerator', 'platformDialogService', 'modelAnnotationDataService',
		'modelAnnotationCameraUtilitiesService', 'modelAnnotationTypes'];

	function modelAnnotationQuickCreateService(platformModalFormConfigService, $translate,
		platformTranslateService, platformRuntimeDataService, $q, $http, _,
		modelViewerCompositeModelObjectSelectionService, modelViewerModelSelectionService,
		basicsLookupdataConfigGenerator, platformDialogService, modelAnnotationDataService,
		modelAnnotationCameraUtilitiesService, modelAnnotationTypes) {

		function showAddAnnotationDialog(config) {
			const effectiveConfig = _.assign({

			}, _.isObject(config) ? config : {}, {
				hasSuggestedObjectLinks() {
					return this.suggestedObjectLinks && !this.suggestedObjectLinks.isEmpty();
				},
				hasSuggestedCamera() {
					return this.isBasedUponViewer();
				},
				isBasedUponViewer() {
					return Boolean(this.viewerInfo);
				}
			});

			const prepPromises = {
				defaults: $http.get(globals.webApiBaseUrl + 'model/annotation/defaults')
			};

			return $q.all(prepPromises).then(function (results) {
				const defaults = (function prepareDefaults(data) {
					const result = data;
					result.byBaseTypeId = {};
					if (Array.isArray(result.BaseTypeDefaults)) {
						for (let typeDefaults of result.BaseTypeDefaults) {
							result.byBaseTypeId[typeDefaults.RawType] = {
								CategoryFk: typeDefaults.CategoryFk > 0 ? `${typeDefaults.RawType}/${typeDefaults.CategoryFk}` : null
							};
						}
					}
					delete result.BaseTypeDefaults;
					return result;
				})(results.defaults.data);

				const newAnnotationSettings = {
					Description: '',
					Remark: '',
					BaseType: modelAnnotationTypes.byCode.standalone.id,
					CategoryFk: defaults.byBaseTypeId[modelAnnotationTypes.byCode.standalone.id].CategoryFk,
					PriorityFk: defaults.PriorityFk,
					SaveCamera: effectiveConfig.hasSuggestedCamera(),
					SaveObjectLinks: effectiveConfig.hasSuggestedObjectLinks()
				};

				const dlgConfig = {
					title: $translate.instant('model.annotation.quickCreate.title'),
					dataItem: newAnnotationSettings,
					formConfiguration: {
						fid: 'model.annotation.quickcreate',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'desc',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							maxLength: 42
						}, {
							gid: 'default',
							rid: 'remark',
							label$tr$: 'model.annotation.remark',
							model: 'Remark',
							type: 'directive',
							directive: 'platform-form-editor'
						}, {
							gid: 'default',
							rid: 'baseType',
							label$tr$: 'model.annotation.type',
							model: 'BaseType',
							type: 'imageselect',
							options: {
								serviceName: 'modelAnnotationCreatableTypeIconService'
							},
							change: function (item) {
								item.CategoryFk = defaults.byBaseTypeId[item.BaseType].CategoryFk;
							}
						}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelAnnotationCategoryLookupDataService',
							enableCache: false,
							filter: item => _.get(item, 'BaseType') || 0,
							gridLess: true
						}, {
							gid: 'default',
							rid: 'category',
							label$tr$: 'model.annotation.category',
							model: 'CategoryFk'
						}), basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.priority', 'Description', {
							gid: 'default',
							rid: 'priority',
							label$tr$: 'model.annotation.priority',
							model: 'PriorityFk'
						}), {
							gid: 'default',
							rid: 'dueDate',
							label$tr$: 'model.annotation.dueDate',
							model: 'DueDate',
							type: 'date'
						}, {
							gid: 'default',
							rid: 'color',
							label$tr$: 'model.annotation.color',
							model: 'Color',
							type: 'color',
							options: {
								showClearButton: true
							}
						}, {
							gid: 'default',
							rid: 'saveCamera',
							label$tr$: 'model.annotation.quickCreate.saveCamera',
							model: 'SaveCamera',
							type: 'boolean',
							readonly: !effectiveConfig.hasSuggestedCamera()
						}, {
							gid: 'default',
							rid: 'saveObjectLinks',
							label$tr$: 'model.annotation.quickCreate.saveObjectLinks',
							model: 'SaveObjectLinks',
							type: 'boolean',
							visible: true,
							readonly: !effectiveConfig.hasSuggestedObjectLinks()
						}]
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !newAnnotationSettings.Description || !_.isString(newAnnotationSettings.CategoryFk);
						}
					}
				};

				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dlgConfig).then(function (dlgResult) {
					if (dlgResult.ok) {
						const resultData = {
							Annotation: {
								ModelFk: modelViewerModelSelectionService.getSelectedModelId(),
								DescriptionInfo: {
									Translated: dlgResult.data.Description
								},
								Remark: dlgResult.data.Remark,
								RawType: dlgResult.data.BaseType,
								EffectiveCategoryFk: parseInt(dlgResult.data.CategoryFk.split('/')[1]),
								PriorityFk: dlgResult.data.PriorityFk,
								DueDate: dlgResult.data.DueDate,
								Color: dlgResult.data.Color
							},
							LinkObjectIds: dlgResult.data.SaveObjectLinks ? effectiveConfig.suggestedObjectLinks.useGlobalModelIds().toCompressedString() : undefined
						};

						let resultPromise = $q.when(resultData);

						if (dlgResult.data.SaveCamera) {
							resultPromise = resultPromise.then(function (resultData) {
								resultData.Camera = {};
								return modelAnnotationCameraUtilitiesService.enrichCameraEntityFromView(effectiveConfig.viewerInfo.info, resultData.Camera).then(() => resultData);
							});
						}

						return resultPromise;
					} else {
						return $q.reject('No annotation created.');
					}
				});
			});
		}

		function addAnnotation(viewerInfo) {
			return showAddAnnotationDialog({
				viewerInfo: viewerInfo,
				suggestedObjectLinks: modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds()
			}).then(function (result) {
				return $http.post(globals.webApiBaseUrl + 'model/annotation/quickcreate', result).then(function (response) {
					modelAnnotationDataService.addItem(response.data);

					return response.data.Id;
				}, function (reason) {
					return platformDialogService.showDialog({
						headerText$tr$: 'model.annotation.quickCreate.failureTitle',
						bodyText$tr$: 'model.annotation.quickCreate.failure',
						bodyText$tr$param$: {
							reason: reason
						},
						showOkButton: true,
						iconClass: 'error',
						showDeactivateOption: 'false'
					}).then(() => null);
				});
			});
		}

		function createToolbarButton(getViewerInfo) {
			return {
				id: 'addAnnotation',
				type: 'item',
				caption: 'model.annotation.quickCreate.title',
				iconClass: 'tlb-icons ico-create-model-annotation',
				fn: function () {
					return addAnnotation(getViewerInfo());
				},
				disabled: () => !modelViewerModelSelectionService.getSelectedModelId()
			};
		}

		return {
			addAnnotation: addAnnotation,
			createToolbarButton: createToolbarButton
		};
	}
})(angular);
