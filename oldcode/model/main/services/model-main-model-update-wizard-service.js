/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainModelUpdateWizardService
	 * @function
	 *
	 * @description Provides a wizard to update model element references.
	 */
	angular.module('model.main').service('modelMainModelUpdateWizardService', ['_', 'platformModalFormConfigService',
		'$http', '$translate', 'platformTranslateService', 'basicsLookupdataConfigGenerator',  'platformDialogService',
		'platformRuntimeDataService', 'platformGridDialogService', '$rootScope', 'projectMainService',
		function (_, platformModalFormConfigService, $http, $translate, platformTranslateService,
		          basicsLookupdataConfigGenerator, platformDialogService, platformRuntimeDataService,
		          platformGridDialogService, $rootScope, projectMainService) {

			var service = {};

			function getActualModelId(treeModelId) {
				if (_.isString(treeModelId)) {
					if (treeModelId.startsWith('R')) {
						return parseInt(treeModelId.substring(1));
					}
				}
				return treeModelId;
			}

			function reloadFromModel(item, scope) {
				var fromModelId = getActualModelId(item.fromModel);
				if (_.isInteger(fromModelId)) {
					$http.get(globals.webApiBaseUrl + 'model/main/refupdate/getreftypes', {
						params: {
							modelId: fromModelId
						}
					}).then(function (response) {
						var items = response.data;

						angular.forEach(items, function (item) {
							if (item.PermissionsSufficeForChanging) {
								item.CreateNewReferences = true;
							} else {
								item.Remarks = $translate.instant('model.main.modelUpdateWizard.insufficientPermissions');
								platformRuntimeDataService.readonly(item, [{
									field: 'CreateNewReferences',
									readonly: true
								}, {
									field: 'KeepExistingReferences',
									readonly: true
								}, {
									field: 'DeleteOrphanedItems',
									readonly: true
								}]);
							}
							if (!item.CanKeepExistingReferences) {
								platformRuntimeDataService.readonly(item, [{
									field: 'KeepExistingReferences',
									readonly: true
								}]);
							}
							if (!item.CanDeleteOrphanedItems) {
								platformRuntimeDataService.readonly(item, [{
									field: 'DeleteOrphanedItems',
									readonly: true
								}]);
							}
						});

						var prevItems = {};
						if (_.isArray(item.referenceTypes)) {
							item.referenceTypes.forEach(function (rt) {
								prevItems[rt.ReferenceTypeId] = rt;
							});
						}
						items.forEach(function (item) {
							if (item.PermissionsSufficeForChanging) {
								var prevItem = prevItems[item.ReferenceTypeId];
								if (prevItem) {
									item.CreateNewReferences = Boolean(prevItem.CreateNewReferences);
									item.KeepExistingReferences = Boolean(prevItem.KeepExistingReferences);
									item.DeleteOrphanedItems = Boolean(prevItem.DeleteOrphanedItems);
								}
							}
						});

						scope.$evalAsync(function () {
							item.referenceTypes = items;
						});
					});
				}
			}

			function provideModelFilter() {
				return projectMainService.getSelected().Id + '&includeComposite=false';
			}

			service.showDialog = function () {
				var dataItem = {};

				var wzConfig = {
					id: 'modelUpdateWizard',
					title: $translate.instant('model.main.modelUpdateWizard.modelUpdateReference'),
					dataItem: dataItem,
					width: '800px',
					scope: $rootScope.$new(true),
					formConfiguration: {
						id: 'modelUpdate',
						showGrouping: true,
						groups: [
							{
								gid: 'modelsTree',
								header$tr$: 'model.main.modelUpdateWizard.modelsSelection',
								isOpen: true
							},
							{
								gid: 'refTypes',
								header$tr$: 'model.main.modelUpdateWizard.modelReferencesElements',
								isOpen: true
							}
						],
						rows: [
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelProjectModelTreeLookupDataService',
								filter: provideModelFilter,
								gridLess: false
							}, {
								gid: 'modelsTree',
								rid: 'fromModel',
								label$tr$: 'model.main.modelUpdateWizard.fromModel',
								model: 'fromModel',
								change: function (item) {

									reloadFromModel(item, wzConfig.scope);
								}
							}),
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelProjectModelTreeLookupDataService',
								filter: provideModelFilter,
								gridLess: false
							}, {
								gid: 'modelsTree',
								rid: 'toModel',
								label$tr$: 'model.main.modelUpdateWizard.toModel',
								model: 'toModel'
							}),
							{
								gid: 'refTypes',
								rid: 'refTypes',
								type: 'directive',
								directive: 'model-main-update-wizard-grid',
								model: 'referenceTypes',
								visible: true,
								sortOrder: 100
							}
						]
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return _.isNil(dataItem.fromModel) || _.isNil(dataItem.toModel) || (dataItem.fromModel === dataItem.toModel) ||
								!_.some(dataItem.referenceTypes, {CreateNewReferences: true});
						}
					}
				};
				platformTranslateService.translateFormConfig(wzConfig.formConfiguration);
				reloadFromModel(wzConfig.dataItem, wzConfig.scope);
				if (projectMainService.getSelected()) {
					return platformModalFormConfigService.showDialog(wzConfig).then(function (result) {
						if (result.ok) {
							if (result.data.fromModel && result.data.toModel) {
								var requestBody = {
									FromModelId: getActualModelId(result.data.fromModel),
									ToModelId: getActualModelId(result.data.toModel),
									ReferenceTypes: _.map(_.filter(result.data.referenceTypes, {CreateNewReferences: true}), function (item) {
										return {
											ReferenceTypeId: item.ReferenceTypeId,
											CreateNewReferences: Boolean(item.CreateNewReferences),
											KeepExistingReferences: Boolean(item.KeepExistingReferences),
											DeleteOrphanedItems: Boolean(item.DeleteOrphanedItems)
										};
									})
								};
								$http.post(globals.webApiBaseUrl + 'model/main/refupdate/updaterefs', requestBody).then(function (response) {
									var cols = [{
										id: 'type',
										name$tr$: 'model.main.modelUpdateWizard.type',
										formatter: 'description',
										field: 'Description',
										width: 200
									}, {
										id: 'existingRefs',
										name$tr$: 'model.main.modelUpdateWizard.existingReferencesCount',
										formatter: 'integer',
										field: 'ExistingReferenceCount',
										width: 100
									}, {
										id: 'newRefs',
										name$tr$: 'model.main.modelUpdateWizard.newReferencesCount',
										formatter: 'integer',
										field: 'NewReferenceCount',
										width: 100
									}, {
										id: 'delItems',
										name$tr$: 'model.main.modelUpdateWizard.delItemsCount',
										formatter: 'integer',
										field: 'DeletedItemsCount',
										width: 100
									}, {
										id: 'info',
										name$tr$: 'model.main.modelUpdateWizard.remarks',
										formatter: 'remark',
										field: 'Info',
										width: 700
									}];

									return platformGridDialogService.showDialog({
										columns: cols,
										headerText$tr$: 'model.main.modelUpdateWizard.modelUpdateReferenceResults',
										items: response.data,
										idProperty: 'ReferenceTypeId',
										tree: false,
										isReadOnly: true
									});

								});
							}
							else {
								return platformDialogService.showDialog({
									headerText$tr$: 'cloud.common.errorDialogTitle',
									bodyText$tr$: 'model.main.modelUpdateWizard.modelsNotSelected',
									showOkButton: true,
									iconClass: 'error'
								});
							}
						}
					});
				} else {
					return platformDialogService.showDialog({
						headerText$tr$: 'cloud.common.errorDialogTitle',
						bodyText$tr$: 'model.main.modelUpdateWizard.noProjectSelected',
						showOkButton: true,
						iconClass: 'error'
					});
				}
			};
			return service;
		}]);
})(angular);
