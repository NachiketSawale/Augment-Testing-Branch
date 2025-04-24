/**
 * Created by chi on 5/21/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainEvaluationModificationService', businessPartnerMainEvaluationModificationService);

	businessPartnerMainEvaluationModificationService.$inject = ['_'];

	function businessPartnerMainEvaluationModificationService(_) {
		var service = {};
		service.initialize = initialize;
		return service;

		// /////////////////
		function initialize(service, data, options) {

			var parentService = options.parentService;
			var getSelectedItemsToMarkAsModified = options.getSelectedItemsToMarkAsModified || function () {
				return [];
			};
			var getRootModifiedDataCache = options.getRootModifiedDataCache || function () {
				return {};
			};
			var orgAddEntitiesToDeleted = null;

			data.getModifiedDataByItemName = getModifiedDataByItemName;

			if (options.markSelectedAsModified) {
				service.markSelectedAsModified = markSelectedAsModified;
			}

			if (options.markItemAsModified) {
				data.markItemAsModified = markItemAsModified;
				service.markItemAsModified = markItemAsModified;
			}

			if (options.addEntitiesToDeleted) {
				orgAddEntitiesToDeleted = service.addEntitiesToDeleted;
				service.addEntitiesToDeleted = addEntitiesToDeleted;
			}

			if (options.doClearModifications) {
				data.doClearModifications = doClearModifications;
			}

			function markItemAsModified(item) {
				var rootModifiedDataCache = getRootModifiedDataCache();
				var elemModifiedDataCache = assertPath(rootModifiedDataCache, service, false, item);

				service.addEntityToModified(elemModifiedDataCache, item, rootModifiedDataCache);

				if (angular.isFunction(options.canMarkParentAsModified) && options.canMarkParentAsModified(item)) {
					if (parentService && angular.isFunction(parentService.markSelectedAsModified)) {
						parentService.markSelectedAsModified();
					}
				}
			}

			function doClearModifications(entity, data) {
				var entities = modificationsAsArray(entity);

				var rootModifiedDataCache = getRootModifiedDataCache();
				var elemModifiedDataCache = assertPath(rootModifiedDataCache, service, false, entity);
				// var parentModifiedDataCache = assertPath(rootModifiedDataCache, service.parentService(), false);
				var propName = data.itemName + 'ToSave';

				_.forEach(entities, function (entity) {
					if (elemModifiedDataCache && entity && elemModifiedDataCache[propName]) {
						if (_.find(elemModifiedDataCache[propName], {Id: entity.Id})) {
							elemModifiedDataCache[propName] = _.filter(elemModifiedDataCache[propName], function (item) {
								return item.Id !== entity.Id;
							});

							rootModifiedDataCache.EntitiesCount -= 1;
						}
					}

					if (entity && entity.Version === 0 && rootModifiedDataCache[propName]) {// TODO chi: why version === 0
						if (_.find(rootModifiedDataCache[propName], {Id: entity.Id})) {
							rootModifiedDataCache[propName] = _.filter(rootModifiedDataCache[propName], function (item) {
								return item.Id !== entity.Id;
							});
							rootModifiedDataCache.EntitiesCount -= 1;
						}
					}
				});

				if (elemModifiedDataCache) {
					_.forEach(entities, function (entity) {
						if (entity.Version === 0) {
							orgAddEntitiesToDeleted(elemModifiedDataCache, [entity], data, rootModifiedDataCache);
							rootModifiedDataCache.EntitiesCount -= 1;
						}
					});
				}
			}

			function addEntitiesToDeleted(elemState, entities, data) {
				if (!angular.isArray(entities) || entities.length === 0) {
					return;
				}
				var rootModifiedDataCache = getRootModifiedDataCache();
				var elemModifiedDataCache = assertPath(rootModifiedDataCache, service, false, entities[0]);
				orgAddEntitiesToDeleted(elemModifiedDataCache, entities, data, rootModifiedDataCache);
			}

			function markSelectedAsModified() {
				var itemsToMark = getSelectedItemsToMarkAsModified();
				var rootModifiedDataCache = getRootModifiedDataCache();
				_.forEach(itemsToMark, function (item) {
					var elemModifiedDataCache = assertPath(rootModifiedDataCache, service, false, item);
					service.addEntityToModified(elemModifiedDataCache, item, rootModifiedDataCache);
				});

				if (parentService && angular.isFunction(parentService.markSelectedAsModified)) {
					parentService.markSelectedAsModified();
				}
			}
		}

		function modificationsAsArray(input) {
			var entities;
			if (_.isArray(input)) {
				entities = input;
			} else {
				entities = [input];
			}

			return entities;
		}

		function assertPath(root, service, addSel, entity) {
			var parentSrv = service.parentService();
			var elem = root;

			if (parentSrv) {
				elem = assertPath(root, parentSrv, true);

				if (!elem[service.getItemName() + 'ToSave']) {
					elem[service.getItemName() + 'ToSave'] = [];
				}

				if (addSel) {
					var toInsert = null;
					var selected = service.getSelected();
					if (selected && selected.Id) {
						toInsert = {
							MainItemId: selected.Id,
							IsEvaluationSubGroupData: selected.IsEvaluationSubGroupData
						};
						var entry = _.find(elem[service.getItemName() + 'ToSave'], toInsert);
						if (!entry) {
							elem[service.getItemName() + 'ToSave'].push(toInsert);
						} else {
							toInsert = entry;
						}
					}
					elem = toInsert;
				}
			} else { // TODO chi: can remove later
				if (entity && entity.Id) {
					elem.MainItemId = entity.Id;
					elem.IsEvaluationSubGroupData = entity.IsEvaluationSubGroupData;
				}
			}
			return elem;
		}

		function getModifiedDataByItemName(root, service, finalItemName, type) {
			var parentSrv = service.parentService();
			var parentItem = null;
			var elem = root;
			var currentItemName = service.getItemName() + type;
			if (parentSrv) {
				var temp = null;
				elem = getModifiedDataByItemName(root, parentSrv, finalItemName, type);
				if (!elem) {
					return elem;
				}

				if (currentItemName === finalItemName) {
					return elem[currentItemName];
				} else {
					if (parentItem) {
						temp = _.find(elem, {MainItemId: parentItem.Id});
					}

					return temp;
				}
			} else {
				return elem;
			}
		}
	}
})(angular);