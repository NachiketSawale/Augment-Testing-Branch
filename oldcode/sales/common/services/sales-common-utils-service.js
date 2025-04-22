/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonUtilsService
	 * @description provides common utils functions for sales modules
	 */
	angular.module(salesCommonModule).service('salesCommonUtilsService', ['_', '$injector',
		function (_, $injector) {

			function createToolbarNavigator(config) {
				var icon = config.type === 'back' ? 'ico-goto-back' : 'ico-goto';
				return {
					id: 't-navigation',
					type: 'item',
					caption: $injector.get('platformModuleInfoService').getNavigatorTitle(config.destModuleName),
					iconClass: 'tlb-icons ' + icon + _.uniqueId(' _navigator'),
					fn: function () {
						var selectedEntity = $injector.get(config.srcDataServiceName).getSelected();
						if (_.has(selectedEntity, 'Id')) {
							var navConfig = {
								moduleName: config.destModuleName,
								registerService: config.destDataServiceName
							};

							if (config.targetIdProperty) {
								navConfig.targetIdProperty = config.targetIdProperty;
							}

							$injector.get('platformModuleNavigationService').navigate(navConfig, selectedEntity);
						}
					},
					disabled: function isBidSelected() {
						var selectedEntity = $injector.get(config.srcDataServiceName).getSelected();
						return !selectedEntity;
					}
				};
			}

			function toggleSideBarWizard() {
				var sideBarService = $injector.get('cloudDesktopSidebarService');
				if (sideBarService.getSidebarIds() && sideBarService.getSidebarIds().newWizards) {
					var sideBarId = sideBarService.getSidebarIds().newWizards;
					var sideBarItem = _.find(sideBarService.commandBarDeclaration.items, {id: '#' + sideBarId});
					if (sideBarItem) {
						sideBarItem.fnWrapper(sideBarId);
					}
				}
			}

			function applyReadOnlyRows(readOnlyRows, rows) {
				// apply field read only extensions, if available
				_.each(readOnlyRows, function (rowName) {
					var row = _.find(rows, {rid: rowName});
					if (row) {
						row.readonly = true;
					}
				});
			}

			/**
			 * Handles enabling and disabling loading indicator
			 * @param scope
			 * @param promise
			 * @remarks
			 * At the moment no support for multiple promises.
			 * Don't call multiple times if you have more than one promise.
			 */
			function addLoadingIndicator(scope, promise, loadingText) {
				var delayInMs = 250; // default delay in ms till loading bar will not be displayed
				$injector.get('$timeout')(function () {
					scope.isLoading = true;
					if (loadingText) {
						scope.loadingText = loadingText;
					}
					promise.finally(function () {
						scope.isLoading = false;
					});
				}, delayInMs);
			}

			function createMarkerColumn(serviceName, serviceMethod, multiSelect, isPinned) {
				var column = {
					id: 'marker',
					formatter: 'marker',
					field: 'IsMarked',
					name: '',
					editor: 'marker',
					editorOptions: {
						serviceName: serviceName,
						serviceMethod: serviceMethod,
						multiSelect: _.isUndefined(multiSelect) || !_.isBoolean(multiSelect) ? true : multiSelect
					}
				};

				if (_.isBoolean(isPinned) && isPinned) {
					column.pinned = true;
				}

				return column;
			}

			function ensureColumnsAreTranslated(columns) {
				if (!columns.isTranslated) {
					$injector.get('platformTranslateService').translateGridConfig(columns);
					columns.isTranslated = true;
				}
			}

			function makeColumnReadonly(item) {
				if (item && item.editor) {
					item.editor = null;
				}
			}

			function clearMarker(item) {
				item.IsMarked = false;
			}

			function setMarker(item) {
				item.IsMarked = true;
			}

			function createGrid(scope, columns, dataItems, treeOptions) {
				var platformCreateUuid = $injector.get('platformCreateUuid');
				var platformGridAPI = $injector.get('platformGridAPI');

				ensureColumnsAreTranslated(columns);

				if(!scope.gridId) {
					scope.gridId = platformCreateUuid ();
				}
				scope.gridData = {
					state: scope.gridId
				};

				if (!platformGridAPI.grids.exist(scope.gridId)) {
					var gridConfig = {
						columns: columns,
						data: dataItems,
						id: scope.gridId,
						lazyInit: false,
						enableConfigSave: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};
					if (_.has(treeOptions, 'parentProp') && _.has(treeOptions, 'childProp')) {
						gridConfig.options.tree = true;
						gridConfig.options.parentProp = _.get(treeOptions, 'parentProp');
						gridConfig.options.childProp = _.get(treeOptions, 'childProp');
					} else {
						gridConfig.options.tree = false;
					}
					platformGridAPI.grids.config(gridConfig);

				} else {
					platformGridAPI.columns.configuration(scope.gridId, columns);
				}

				scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist(scope.gridId)) {
						platformGridAPI.grids.unregister(scope.gridId);
					}
				});

				return scope.gridId;
			}

			function addOnSelectedRowChangedEvent(scope, gridId, handlerFunction) {
				if (_.isFunction(handlerFunction)) {

					var onSelectedRowsChanged = function onSelectedRowsChanged(e, args) {
						var selected = platformGridAPI.rows.selection({gridId: args.grid.id}); // TODO: extract
						handlerFunction(selected);
					};

					// register and unregister onSelectedRowsChanged event
					var platformGridAPI = $injector.get('platformGridAPI');
					platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					scope.$on('$destroy', function () {
						platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					});
				}
			}

			function addOnCellChangeEvent(scope, gridId, column, handlerFunction) {
				if (_.isFunction(handlerFunction)) {
					// marker change event
					var onCellChange = function onCellChange(e, arg) {
						var col = arg.grid.getColumns()[arg.cell].field;
						if (col === column) {
							var value = arg.item[column];
							var selectedItem = arg.item;
							handlerFunction(value, selectedItem);
						}
					};

					// register and unregister onCellChange event
					var platformGridAPI = $injector.get('platformGridAPI');
					platformGridAPI.events.register(scope.gridId, 'onCellChange', onCellChange);
					scope.$on('$destroy', function () {
						platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onCellChange);
					});
				}
			}

			// TODO: check usage of data service factory here and in related functions
			function createGridEx(scope, columns, dataItems, treeOptions) {
				var gridId = createGrid(scope, columns, dataItems, treeOptions);
				var gridObj = {
					gridId: gridId,
					scope: scope,
					addOnSelectedRowChangedEvent: function (handlerFunction) {
						return addOnSelectedRowChangedEvent(scope, gridId, handlerFunction);
					},
					addOnCellChangeEvent: function (column, handlerFunction) {
						return addOnCellChangeEvent(scope, gridId, column, handlerFunction);
					},
					updateData: function (items) {
						var platformGridAPI = $injector.get('platformGridAPI');
						platformGridAPI.items.data(gridId, items);
					}
				};
				return gridObj;
			}

			function getColumnsSubset(columns, columnNames) {
				return _.filter(columns, function (c) {
					return columnNames.indexOf(c.id) >= 0; // only specific columns
				});
			}

			function getReadonlyColumnsSubset(columns, columnNames) {
				// only specific columns and all readonly
				return _.each(angular.copy(getColumnsSubset(columns, columnNames)), makeColumnReadonly);
			}

			function removeNavigators(columns) {
				var columnsWithNavigators = _.filter(columns, 'navigator');
				_.each(columnsWithNavigators, function (col) {
					if (col.navigator) {
						delete col.navigator;
					}
				});
			}

			function flatten(hierarchicalItems, childProp) {
				var flatItems = [];
				$injector.get('cloudCommonGridService').flatten(hierarchicalItems, flatItems, childProp);
				return flatItems;
			}

			// pinning context (project, sales header entity)
			function setRelatedProjectToPinningContext(salesHeaderItem, dataService) {
				if (salesHeaderItem && _.has(salesHeaderItem, 'ProjectFk')) {
					var $q = $injector.get('$q');
					var cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');

					var projectPromise = $q.when(true);
					var pinningContext = [];
					var projectId = salesHeaderItem.ProjectFk;

					if (angular.isNumber(projectId)) {
						projectPromise = cloudDesktopPinningContextService.getProjectContextItem(projectId).then(function (pinningItem) {
							pinningContext.push(pinningItem);
						});
					}
					return $q.all([projectPromise]).then(
						function () {
							if (pinningContext.length > 0) {
								cloudDesktopPinningContextService.setContext(pinningContext, dataService);
							}
						});
				}
			}


			function handleOnCreateSucceededInListSetToTop(newItem, data, service) {
				$injector.get('platformDataServiceDataProcessorExtension').doProcessItem(newItem, data);
				data.itemList.unshift(newItem);
				$injector.get('platformDataServiceActionExtension').fireEntityCreated(data, newItem);

				return $injector.get('platformDataServiceSelectionExtension').doSelect(newItem, data).then(
					function () {
						if (_.get(newItem, 'Version') === 0) {
							if (data.newEntityValidator) {
								data.newEntityValidator.validate(newItem, service);
							}
							data.markItemAsModified(newItem, data);
						}
						return newItem;
					},
					function () {
						if (_.get(newItem, 'Version') === 0) {
							data.markItemAsModified(newItem, data);
						}
						return newItem;
					}
				);
			}

			function getCharacteristicsDefaultListForCreatedPerSection(newEntity, sectionId) {
				var $q = $injector.get('$q');
				var deferred = $q.defer();
				var configurationId = newEntity.ConfigurationFk;
				var configrationSourceSectionId = _.inRange(sectionId, 65, 69) ? 55 : 32; // basics.procurementconfiguration2 / basics.procurementconfiguration2
				var targetSectionId = sectionId;
				$injector.get('procurementCommonCharacteristicDataService').getDefaultListForCreated(targetSectionId, configurationId, configrationSourceSectionId, null, newEntity).then(function (items) {
					if (items) {
						deferred.resolve(items);
					}
				});
				return deferred.promise;
			}

			// TODO: Move to platform validation server?
			function deleteFromErrorList(entity, name) {
				if (_.has(entity, '__rt$data.errors[' + name + ']')) {
					delete entity.__rt$data.errors[name];
				}
			}

			return {
				toggleSideBarWizard: toggleSideBarWizard,
				createToolbarNavigator: createToolbarNavigator,
				applyReadOnlyRows: applyReadOnlyRows,
				addLoadingIndicator: addLoadingIndicator,
				createMarkerColumn: createMarkerColumn,
				ensureColumnsAreTranslated: ensureColumnsAreTranslated,
				makeColumnReadonly: makeColumnReadonly,
				getColumnsSubset: getColumnsSubset,
				getReadonlyColumnsSubset: getReadonlyColumnsSubset,
				removeNavigators: removeNavigators,
				clearMarker: clearMarker,
				setMarker: setMarker,
				createGrid: createGrid,
				createGridEx: createGridEx,
				addOnSelectedRowChangedEvent: addOnSelectedRowChangedEvent,
				addOnCellChangeEvent: addOnCellChangeEvent,
				flatten: flatten,
				setRelatedProjectToPinningContext: setRelatedProjectToPinningContext,
				handleOnCreateSucceededInListSetToTop: handleOnCreateSucceededInListSetToTop,
				getCharacteristicsDefaultListForCreatedPerSection: getCharacteristicsDefaultListForCreatedPerSection, // TODO: move to other service or base service extension
				deleteFromErrorList: deleteFromErrorList
			};
		}

	]);
})();
