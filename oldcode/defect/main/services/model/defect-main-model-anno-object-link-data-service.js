/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const defectMainModule = angular.module('defect.main');

	const svcName = 'defectMainModelAnnoObjectLinkDataService';

	/**
	 * @ngdoc service
	 * @name defectMainModelAnnoObjectLinkDataService
	 * @function
	 *
	 * @description
	 */
	defectMainModule.factory(svcName,
		defectMainModelAnnoObjectLinkDataService);

	defectMainModelAnnoObjectLinkDataService.$inject = ['defectMainHeaderDataService', '_', '$injector', 'platformDialogService', '$translate',
		'modelAnnotationObjectLinkDataServiceFactory', 'modelProjectPinnableEntityService', 'platformRuntimeDataService'];

	function defectMainModelAnnoObjectLinkDataService(defectMainHeaderDataService, _, $injector, platformDialogService, $translate,
		modelAnnotationObjectLinkDataServiceFactory, modelProjectPinnableEntityService, platformRuntimeDataService) {

		let service = modelAnnotationObjectLinkDataServiceFactory.createService({
			moduleName: 'defect.main',
			serviceName: svcName,
			parentService: defectMainHeaderDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'defect.main',
			getProjectIdFromParent: item => item.PrjProjectFk
		});

		let addCustomCreatedItem = service.addCustomCreatedItem;
		service.addCustomCreatedItem = function (item) {
			let selParent = defectMainHeaderDataService.getSelected();
			let modelId = modelProjectPinnableEntityService.getPinned();
			if (modelId) {
				item.ModelFk = modelId;
			}
			if (selParent) {
				if (item.LinkKind === 's') {
					item.ProjectFk = selParent.PrjProjectFk;
				}
				if (!item.ModelFk && selParent.MdlModelFk) {
					if (item.LinkKind === 'o') {
						item.ModelFk = selParent.MdlModelFk;
					} else {
						item.tempModelFk = selParent.MdlModelFk;
					}
				}
			}
			if (item.LinkKind === 's' && !(item.ModelFk || item.tempModelFk)) {
				platformDialogService.showMsgBox('basics.common.assignedObjectCreateMsg', 'model.annotation.createObjectLinkTitle', 'ico-error', 'assignedObjectCreateMsg', true);
			}
			checkValidation(item);
			return addCustomCreatedItem(item);
		};

		function checkValidation(entity) {
			if (entity.LinkKind === 'o') {
				checkValidationResult(entity, 'ModelFk');
				checkValidationResult(entity, 'ObjectFk');
			} else if (entity.LinkKind === 's') {
				checkValidationResult(entity, 'ProjectFk');
				checkValidationResult(entity, 'ObjectSetFk');
			}
		}

		service.registerItemModified(function (e, item) {
			checkValidation(item);
		});

		function checkValidationResult(entity, field) {
			let result = {apply: true, valid: true};
			if (entity[field] && entity[field] > 0) {
				platformRuntimeDataService.applyValidationResult(result, entity, field);
			} else {
				result.valid = false;
				result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: field});
				platformRuntimeDataService.applyValidationResult(result, entity, field);
			}
		}

		defectMainHeaderDataService.doPrepareUpdateCall = function (updateData) {
			if (updateData && updateData.ModelAnnotationObjectLinksToSave) {
				_.forEach(updateData.ModelAnnotationObjectLinksToSave, function (item) {
					if (item.ModelFk) {
						item.ContextModelId = item.ModelFk;
					} else if (item.tempModelFk && !item.ContextModelId) {
						item.ContextModelId = item.tempModelFk;
					}
				});
			}
			if (updateData && updateData.ModelAnnotationObjectLinksToDelete) {
				let selParent = defectMainHeaderDataService.getSelected();
				_.forEach(updateData.ModelAnnotationObjectLinksToDelete, function (item) {
					if (!item.LegacyId && selParent) {
						item.ForeignParentId = {Id: selParent.Id};
						item.LegacyId = {Id: item.Id};
					}
				});
			}
		};

		let canCreateItem = service.canCreate;
		service.canCreate = function () {
			let grid = $injector.get('platformGridAPI').grids.element('id', '26110cbc14374f7895d1d7934efd0a63');
			if (grid && grid.scope && grid.scope.$parent) {
				let createBtn = _.find(grid.scope.$parent.tools.items, {id: 'create'});
				createBtn.disabled = function () {
					let mainItem = defectMainHeaderDataService.getSelected();
					if (parentReadOnly()) {
						return true;
					}
					return !mainItem;
				};
				grid.scope.$parent.tools.update();
			}
			if (parentReadOnly()) {
				return false;
			}
			return canCreateItem();
		};

		function parentReadOnly() {
			let mainItem = defectMainHeaderDataService.getSelected();
			if (mainItem) {
				let readonlyStatus = defectMainHeaderDataService.getModuleState(mainItem);
				return !!readonlyStatus;
			}
			return false;
		}

		service.canDelete = function () {
			if (parentReadOnly()) {
				return false;
			}
			let entity = service.getSelected();
			return entity && entity.Id > 0;
		};

		let createDefectItem = service.createItem;
		service.createItem = function createItem() {
			let selParent = defectMainHeaderDataService.getSelected();
			if (selParent && selParent.Version === 0) {
				defectMainHeaderDataService.updateAndExecute();
			}
			createDefectItem();
		};

		service.registerListLoaded(function () {
			let isReadonly = parentReadOnly();
			let items = service.getList();
			if (items && items.length > 0 && service.setReadOnlyRow) {
				items.forEach(item => {
					platformRuntimeDataService.readonly(item, isReadonly);
				});
			}
		});
		return service;
	}
})(angular);
