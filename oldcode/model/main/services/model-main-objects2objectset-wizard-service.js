/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name modelMainObjects2ObjectSetWizardService
	 * @description
	 *
	 * @example
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	//noinspection JSAnnotator
	angular.module('model.main').factory('modelMainObjects2ObjectSetWizardService',
		['$rootScope', '$timeout', '$translate', '$http', '_', '$injector', 'platformTranslateService', 'platformModalService',
			'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'modelMainObjectSet2ObjectDataService',
			'modelMainObjectSetDataService', 'modelViewerModelIdSetService', 'platformSidebarWizardCommonTasksService',
			function ($rootScope, $timeout, $translate, $http, _, $injector, platformTranslateService, platformModalService,
			          platformModalFormConfigService, basicsLookupdataConfigGenerator, modelMainObjectSet2ObjectDataService,
			          modelMainObjectSetDataService, modelViewerModelIdSetService, platformSidebarWizardCommonTasksService) {

				var serviceContainer = {data: {}, service: {}};

				serviceContainer.service.assignObjects2ObjectSet = function assignObjects2ObjectSet() {
					// if (platformSidebarWizardCommonTasksService.assertSelection(objectSet)) {
					var selected = modelMainObjectSetDataService.getSelected();
					if (selected && selected.Version <= 0) {
						platformModalService.showMsgBox($translate.instant('model.main.errorObjectSetNotSaved'), $translate.instant('model.main.assignObjects2ObjectSet'), 'info');
						return;
					}
					$injector.get('modelMainObjectSetLookupDataService').resetCache({lookupType: 'modelMainObjectSetLookupDataService'});
					var objectService = $injector.get('modelMainObjectDataService');
					var viewerService = $injector.get('modelViewerCompositeModelObjectSelectionService');
					// var viewerSelService = $injector.get('modelViewerModelSelectionService');
					var project = objectService.getSelectedProject();
					var entity = {
						objectSetFk: selected && selected.Id ? selected.Id : null,
						projectFk: selected && selected.ProjectFk ? selected.ProjectFk : project,
						objectsMode: 'm'
					};
					var modalAssignObject2ObjectSetConfig = {
						title: $translate.instant('model.main.assignObjects2ObjectSet'),
						dataItem: entity,
						formConfiguration: {
							fid: 'model.main.ModalAssignObjects2ObjectSet',
							version: '0.2.4',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									header$tr$: 'model.main.propUoMWizard.propKeySourceHeader'
								}
							],
							rows: [
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
										dataServiceName: 'modelMainObjectSetLookupDataService',
										filter: function () {
											return selected && selected.ProjectFk ? selected.ProjectFk : project;
										}
									},
									{
										gid: 'baseGroup',
										rid: 'objectSetFk',
										model: 'objectSetFk',
										sortOrder: 2,
										label$tr$: 'model.main.objectSet.entity',
										type: 'integer'
									}),
								{
									gid: 'baseGroup',
									rid: 'objectsMode',
									model: 'objectsMode',
									label$tr$: 'model.main.objectsMode',
									type: 'radio',
									options: {
										valueMember: 'value',
										labelMember: 'label',
										groupName: 'Objectscollectionfrom',
										items: [{
											value: 'v',
											label$tr$: 'model.main.objectsModeViewer'
										}, {
											value: 'm',
											label$tr$: 'model.main.objectsModeModel'
										}
										]
									},
									sortOrder: 1
								}
							]
						},
						handleOK: function handleOK(result) {
							var items = '';
							var dict = {};
							if (result.data.objectsMode === 'm') {
								// modelObjects = objectService.getFilteredList();
								var selection = objectService.getSelectedEntities();
								if (selection.length > 0) {
									selection.forEach(function (item) {
										if (item && item.Id) {
											// if (!Object.prototype.hasOwnProperty(dict, item.ModelFk)) {
											// 	dict[item.ModelFk] = [];
											// }
											// dict[item.ModelFk].push(item.Id);
											if (!dict[item.ModelFk]) {
												dict[item.ModelFk] = [];
											}
											// Add the ID to the array if it doesn't already exist
											if (!dict[item.ModelFk].includes(item.Id)) {
												dict[item.ModelFk].push(item.Id);
											}

										}
									});
									items = new modelViewerModelIdSetService.ObjectIdSet(dict).toCompressedString();
								}
							} else {
								// items = viewerService.filterById.objectSearchSidebar.getIncludedObjects();
								items = viewerService.getSelectedObjectIds().useGlobalModelIds().toCompressedString();
								// kindOfIds = 'm';
							}

							if (_.isString(items) && (items.length > 0)) {
								var newObject = {
									projectId: selected && selected.ProjectFk ? selected.ProjectFk : project,
									objectSetId: result.data.objectSetFk,
									objectIds: items
								};

								modelMainObjectSet2ObjectDataService.assignObjects(newObject);
							} else {
								platformSidebarWizardCommonTasksService.showErrorNoSelection('model.main.objectSetAssignmentError', $translate.instant('model.main.noObjectsSelected'));
							}
						}
					};

					//Show Dialog
					platformTranslateService.translateFormConfig(modalAssignObject2ObjectSetConfig.formConfiguration);
					platformModalFormConfigService.showDialog(modalAssignObject2ObjectSetConfig);
					// }
				};

				return serviceContainer.service;
			}
		]);
})(angular);
