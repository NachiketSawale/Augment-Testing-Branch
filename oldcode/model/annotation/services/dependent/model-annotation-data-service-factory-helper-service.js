/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.annotation';

	/**
	 * @ngdoc service
	 * @name modelAnnotationDataServiceFactoryHelperService
	 * @function
	 *
	 * @description
	 * Provides utilities used by all data service factories for reusable model annotation containers.
	 */
	angular.module(moduleName).factory('modelAnnotationDataServiceFactoryHelperService',
		modelAnnotationDataServiceFactoryHelperService);

	modelAnnotationDataServiceFactoryHelperService.$inject = ['_', 'modelAnnotationDataService',
		'modelViewerModelSelectionService'];

	function modelAnnotationDataServiceFactoryHelperService(_, modelAnnotationDataService,
		modelViewerModelSelectionService) {

		const service = {};

		service.normalizeConfig = function (config) {
			const actualConfig = _.assign({
				moduleName: 'model.annotation',
				getProjectIdFromParent: item => item.ProjectFk
			}, _.isObject(config) ? config : {}, {
				getParentIdentificationData(item) {
					const idComponents = this.getParentIdComponents(item);
					return {
						Id: idComponents[0],
						PKey1: idComponents[1],
						PKey2: idComponents[2],
						PKey3: idComponents[3]
					};
				},
				createHttpCrudSettings(entityRouteName, targetObject) {
					const that = this;

					targetObject.httpCreate = {
						route: globals.webApiBaseUrl + `model/annotation/${entityRouteName}/`,
						endCreate: that.linkedToForeignEntity ? 'createforlinked' : 'create'
					};

					targetObject.httpRead = {
						route: globals.webApiBaseUrl + `model/annotation/${entityRouteName}/`,
						endRead: that.linkedToForeignEntity ? 'listbylinked' : 'list',
						initReadData: function initReadData(readData) {
							const selParentItem = that.parentService.getSelected();
							if (that.linkedToForeignEntity) {
								readData.filter = '?typeId=' + that.typeId + '&parentId=' + _.join(that.getParentIdComponents(selParentItem), ':');
							} else {
								readData.filter = '?annotationId=' + (selParentItem ? selParentItem.Id : 0);
							}
						}
					};
				},
				initializeCreationData(creationData, annotationIdFieldName) {
					const that = this;

					const selParent = that.parentService.getSelected();
					if (!selParent) {
						return false;
					}

					if (that.linkedToForeignEntity) {
						creationData.ForeignParentTypeId = that.typeId;
						creationData.ForeignParentId = that.getParentIdentificationData(selParent);
					} else {
						creationData[annotationIdFieldName] = selParent.Id;
					}

					return true;
				},
				getModule() {
					return angular.module(this.moduleName);
				},
				canCreateForCurrentModel() {
					const selModel = modelViewerModelSelectionService.getSelectedModel();
					if (!selModel) {
						return false;
					}

					const that = this;

					if (that.linkedToForeignEntity) {
						return Boolean(that.parentService.getSelected());
					} else {
						const selParentItem = that.parentService.getSelected();
						if (selParentItem) {
							return selModel.isGlobalModelIdIncluded(selParentItem.ModelFk);
						} else {
							return false;
						}
					}
				}
			});
			actualConfig.linkedToForeignEntity = actualConfig.parentService !== modelAnnotationDataService;
			return actualConfig;
		};

		return service;
	}
})(angular);
