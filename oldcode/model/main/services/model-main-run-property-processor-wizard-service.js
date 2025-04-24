/*
 * $Id:
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainRunPropertyProcessorWizardService
	 * @function
	 *
	 * @description Provides a wizard to invoke object property processors.
	 */
	angular.module('model.main').factory('modelMainRunPropertyProcessorWizardService', ['_', 'platformTranslateService',
		'platformModalFormConfigService', '$translate', 'basicsLookupdataConfigGenerator', 'platformGridAPI', 'modelViewerModelSelectionService',
		'$http', 'platformWizardDialogService', '$timeout',

		function (_, platformTranslateService, platformModalFormConfigService, $translate, basicsLookupdataConfigGenerator, platformGridAPI, modelViewerModelSelectionService,
			$http, platformWizardDialogService, $timeout) {

			const service = {};

			/**
			 * @ngdoc method
			 * @name prepareEntity
			 * @function
			 * @methodOf modelMainRunPropertyProcessorWizardService
			 * @description Prepares an object with the read-only default values to show in the wizard dialog.
			 * @returns {Object} The object.
			 */
			function prepareEntity() {
				return {
					model: modelViewerModelSelectionService.getSelectedModelId(),
					useInheritance: true,
					cleanUp: false,
					overwriteData: false,
					summary: {
						items: null,
						selectionListConfig: {
							columns: [{
								id: 'name',
								field: 'Name',
								name$tr$: 'model.main.propertyProcessorWz.name',
								width: 180,
								formatter: 'description'
							}, {
								id: 'value',
								field: 'Value',
								name$tr$: 'model.main.propertyProcessorWz.value',
								width: 100,
								formatter: 'integer'
							}]
						}
					}
				};
			}

			function watchfn(changeInfo) {
				if (changeInfo.model.model && changeInfo.model.processor && changeInfo.model.propertyKeyId) {
					_.find(changeInfo.wizard.steps, {id: 'attributes'}).disallowNext = false;
				}
			}

			service.runWizard = function () {
				const entity = prepareEntity();

				const wzConfig = {
					title$tr$: 'model.main.propertyProcessorWz.title',
					steps: [{
						id: 'attributes',
						title$tr$: 'model.main.propertyProcessorWz.attributes',
						dataItem: entity,
						disallowNext: true,
						form: {
							fid: 'model.main.runPropertyProcessorWizard.config',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'baseGroup',
							}],
							rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelProjectModelTreeLookupDataService',
								filter: function () {
									return modelViewerModelSelectionService.getSelectedModel().info.projectId;
								},
								enableCache: true,
							}, {
								gid: 'baseGroup',
								rid: 'model',
								label$tr$: 'model.main.propertyProcessorWz.model',
								model: 'model',
								visible: true
							}), {
								gid: 'baseGroup',
								label$tr$: 'model.main.propertyProcessorWz.propertyKey',
								model: 'propertyKeyId',
								type: 'directive',
								directive: 'model-main-property-key-dialog',
								options: {
									descriptionMember: 'PropertyName'
								}
							}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelMainPropertyProcessorLookupDataService',
								enableCache: true,
								additionalColumns: false
							}, {
								gid: 'baseGroup',
								model: 'processor',
								label$tr$: 'model.main.propertyProcessorWz.processor',
								visible: true
							}), {
								gid: 'baseGroup',
								rid: 'useInheritance',
								type: 'boolean',
								label$tr$: 'model.main.propertyProcessorWz.useInheritance',
								model: 'useInheritance',
								visible: true
							}, {
								gid: 'baseGroup',
								rid: 'cleanUp',
								type: 'boolean',
								label$tr$: 'model.main.propertyProcessorWz.cleanUp',
								model: 'CleanUp',
								visible: true
							}, {
								gid: 'baseGroup',
								rid: 'overwriteData',
								type: 'boolean',
								label$tr$: 'model.main.propertyProcessorWz.overwriteData',
								model: 'overwriteData',
								visible: true
							}]
						}, watches: [{
							expression: 'propertyKeyId',
							fn: watchfn
						}, {
							expression: 'processor',
							fn: watchfn
						} ],
					}, {
						id: 'dataProcessing',
						title$tr$: 'model.main.propertyProcessorWz.dataProcessing',
						message$tr$:'model.main.propertyProcessorWz.dataProcessingMessage',
						disallowBack: true,
						disallowNext: true
					}, {}
					],
					onChangeStep: function (info) {
						info.disallowBack = true;
						const prms = {
							ModelId: info.model.model,
							ProcessorKey: info.model.processor,
							PropertyKeyId : info.model.propertyKeyId,
							UseInheritance: info.model.useInheritance,
							CleanUp: info.model.cleanUp,
							Overwrite: info.model.overwriteData
						};
						switch (info.step.id) {
							case 'dataProcessing':
								$http.post(globals.webApiBaseUrl + 'model/main/propprocessing/invokeProcessors', prms).then(function (response) {

									wzConfig.steps[2] = platformWizardDialogService.createListStep({
										title: $translate.instant('model.main.propertyProcessorWz.summary'),
										topDescription: $translate.instant('model.main.propertyProcessorWz.summaryMessage'),
										model: 'summary',
										stepId: 'summary',
										suppressFilter: true
									});

									wzConfig.steps[2].disallowBack = true;
									wzConfig.steps[2].canFinish = true;

									info.model.summary.items = [{
										id: 1,
										Name: $translate.instant('model.main.propertyProcessorWz.processedObjects'),
										Value: response.data.ProcessedObjectCount
									}];

									return $timeout(function () {
										info.step.disallowNext = false;
										info.commands.goToNext();
									});
								});
								break;
						}
					}
				};
				platformWizardDialogService.translateWizardConfig(wzConfig);
				platformWizardDialogService.showDialog(wzConfig, entity);
			};
			return service;
		}]);
})(angular);
