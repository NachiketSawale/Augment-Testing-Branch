(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'basics.common';

	/**
     * @ngdoc service
     * @name basicsCommonDynamicConfigurationServiceFactory
     * @function
     *
     * @description
     * service factory for all module specific dynamic column layout service
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCommonDynamicConfigurationServiceFactory', [
		'$injector', 'PlatformMessenger', 'mainViewService', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCostGroupAssignmentService', 'basicsCommonDynamicStandardConfigMergeViewService', 'basicsCommonDynamicColumnCollector',
		function($injector, PlatformMessenger, mainViewService, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCostGroupAssignmentService, basicsCommonDynamicStandardConfigMergeViewService, basicsCommonDynamicColumnCollector) {

			function DynamicConfigurationService(options) {
				basicsCommonDynamicColumnCollector.call(this);
				this.isExtendService = true;
				this.isCostGroupLoaded = false;
				this.isDynamicColumnConfigChanged = true;
				this.parentScope = {};
				this.isInitialized = null;
				this.uuid = null;
				this.onConfigLayoutChange = new PlatformMessenger();
				this.baseConfigurationService = null;
				this.baseValidationService = null;

				let self = this;
				if (options) {
					angular.extend(self, options);
				}
			}

			DynamicConfigurationService.prototype = Object.create(basicsCommonDynamicColumnCollector.prototype);
			DynamicConfigurationService.prototype.constructor = DynamicConfigurationService;

			DynamicConfigurationService.prototype.setConfigurationServiceAndValidationService = function(standardConfigurationService, validationService) {
				this.baseConfigurationService = angular.isString(standardConfigurationService) ? $injector.get(standardConfigurationService) : standardConfigurationService;
				this.baseValidationService = angular.isString(validationService) ? $injector.get(validationService) : validationService;
			};

			DynamicConfigurationService.prototype.isValid = function() {
				return this.baseConfigurationService && this.baseValidationService;
			};

			DynamicConfigurationService.prototype.showLoadingOverlay = function() {
				this.parentScope.isLoading = true;
			};

			DynamicConfigurationService.prototype.hideLoadingOverlay = function() {
				this.parentScope.isLoading = false;
			};


			DynamicConfigurationService.prototype.setIsDynamicColumnConfigChanged = function(value) {
				this.isDynamicColumnConfigChanged = value;
			};

			DynamicConfigurationService.prototype.setIsCostGroupLoaded = function(value) {
				this.isCostGroupLoaded = value;
			};

			DynamicConfigurationService.prototype.autoValidation = function(formConfig, validationService) {
				if (formConfig.addValidationAutomatically && !!validationService) {
					_.forEach(formConfig.rows, function(row) {
						const rowModel = row.model.replace(/\./g, '$');
						const syncName = 'validate' + rowModel;
						const asyncName = 'asyncValidate' + rowModel;
						if (validationService[syncName]) {
							row.validator = validationService[syncName];
						}
						if (validationService[asyncName]) {
							row.asyncValidator = validationService[asyncName];
						}
					});
				}
			};

			DynamicConfigurationService.prototype.getDtoScheme = function() {
				let baseDtoScheme = this.baseConfigurationService.getDtoScheme();
				let extendColumns = this.getExtendColumnsForList();
				_.forEach(extendColumns, function(column) {
					if (column.costGroupCatId) {
						baseDtoScheme[column.field] = {
							domain: 'integer',
							groupings: [{ groupcolid: 'Basics.CostGroups.CostGroup:' + column.costGroupCatCode + ':' + column.costGroupCatId }]
						};
					}
				});
				return baseDtoScheme;
			};

			DynamicConfigurationService.prototype.mergeDynamicCol = function(cols, dyCols) {
				if (dyCols && angular.isArray(dyCols)) {
					let copyCols = angular.copy(cols);
					// remove the old Dynamic column
					_.remove(copyCols, function(e) {
						return e.isCustomDynamicCol;
					});
					cols = copyCols.concat(dyCols);
				}
				return cols;
			};

			DynamicConfigurationService.prototype.getStandardConfigForListView = function(gridId) {
				// add the extent columns to config for list
				let columnsToAttachForList = this.getExtendColumnsForList();

				let configForListCopy = {};
				if (gridId) {
					configForListCopy.columns = angular.copy(platformGridAPI.columns.configuration(gridId).current);
				} else {
					configForListCopy = angular.copy(this.baseConfigurationService.getStandardConfigForListView());
				}

				// fixed #130161,#132534: It shows PROJECT CG CLASS column in boq/qto container which project do not exist this cost group catalog.
				configForListCopy.columns = this.mergeDynamicCol(configForListCopy.columns, columnsToAttachForList);

				if (configForListCopy.addValidationAutomatically && this.baseValidationService) {
					platformGridControllerService.addValidationAutomatically(configForListCopy.columns, this.baseValidationService);
				}

				if (!configForListCopy.isTranslated) {
					platformTranslateService.translateGridConfig(configForListCopy.columns);
					configForListCopy.isTranslated = true;
				}

				return configForListCopy;
			};

			DynamicConfigurationService.prototype.getStandardConfigForLineItemStructure = function() {
				let costGroupColumns = this.getCostGroupColumns();

				if (!costGroupColumns) {
					return this.baseConfigurationService.getStandardConfigForListView();
				}

				// UDP columns
				let updColumns = this.dynamicColDictionaryForList.userDefinedConfig || [];

				let configForListCopy = angular.copy(this.baseConfigurationService.getStandardConfigForListView());

				configForListCopy.columns = configForListCopy.columns.concat(costGroupColumns).concat(updColumns);

				if (configForListCopy.addValidationAutomatically && this.baseValidationService) {
					platformGridControllerService.addValidationAutomatically(configForListCopy.columns, this.baseValidationService);
				}

				if (!configForListCopy.isTranslated) {
					platformTranslateService.translateGridConfig(configForListCopy.columns);
					configForListCopy.isTranslated = true;
				}

				return configForListCopy;
			};

			DynamicConfigurationService.prototype.getStandardConfigForDetailView = function() {
				// add the extent columns to config for detail
				let configForDetailCopy = angular.copy(this.baseConfigurationService.getStandardConfigForDetailView());
				this.processConfigForDetail(configForDetailCopy);
				this.autoValidation(configForDetailCopy, this.baseValidationService);
				return configForDetailCopy;
			};

			// Refresh Detail Grid with loaded dynamic columns config
			DynamicConfigurationService.prototype.refreshDetailGridLayout = function(scope, configOption) {
				if (scope && scope.formOptions && scope.formOptions.configure && this.dynamicColDictionaryForDetail && this.isValid()) {
					this.processConfigForDetail(scope.formOptions.configure, configOption);
					this.autoValidation(scope.formOptions.configure, this.baseValidationService);
					scope.$broadcast('form-config-updated');
				}
			};

			DynamicConfigurationService.prototype.registerSetConfigLayout = function(callBackFn) {
				this.onConfigLayoutChange.register(callBackFn);
			};

			DynamicConfigurationService.prototype.unregisterSetConfigLayout = function(callBackFn) {
				this.onConfigLayoutChange.unregister(callBackFn);
			};

			DynamicConfigurationService.prototype.fireRefreshConfigLayout = function() {
				this.onConfigLayoutChange.fire(arguments);
				this.refreshGridLayout();
			};

			DynamicConfigurationService.prototype.fireRefreshConfigData = function() {
				this.onConfigLayoutChange.fire(arguments);
			};

			DynamicConfigurationService.prototype.applyToScope = function(scope) {
				this.parentScope = scope;
				this.uuid = scope.gridId;
			};

			DynamicConfigurationService.prototype.refreshGridLayout = function() {
				if (this.uuid && this.isCostGroupLoaded && this.isValid()) {
					let grid = platformGridAPI.grids.element('id', this.uuid);
					if (grid && grid.instance) {
						let allColumns = this.resolveColumns(this.uuid);

						if (this.isInitialized) {
							// Columns from server
							let requestCols = this.getStandardConfigForListView().columns;
							let requestColDyn = _.filter(requestCols, { isCustomDynamicCol: true });

							// Columns from current grid
							let gridColConfig = platformGridAPI.columns.configuration(this.uuid);
							let gridColDyn = _.filter(gridColConfig.current, { isCustomDynamicCol: true });

							// Flag to change grid columns or not
							let isDynamicColumnConfigChanged = false;
							if (requestColDyn.length !== gridColDyn.length) {
								isDynamicColumnConfigChanged = true;
							}

							if (isDynamicColumnConfigChanged) {
								isDynamicColumnConfigChanged = true;
							}

							// if resource container view config using old short key field ('estresourcetypefkextend','estresourcetypefkextendbrief'), refresh the container.
							if (this.uuid === 'bedd392f0e2a44c8a294df34b1f9ce44' && _.findIndex(allColumns, function(column) {
								return column.isOldResourceShortKeyField;
							}) > -1) {
								isDynamicColumnConfigChanged = true;
							}

							if (!isDynamicColumnConfigChanged) {
								for (let requestColDynIdx = 0; requestColDynIdx < requestColDyn.length - 1; requestColDynIdx++) {
									let requestColDynamic = requestColDyn[requestColDynIdx];

									// Check in current grid columns
									let gridColumnIdx = _.findIndex(gridColDyn, { id: requestColDynamic.id });
									if (gridColumnIdx === -1) {
										isDynamicColumnConfigChanged = true;
										break;
									}
									let gridColDynamic = gridColDyn[gridColumnIdx];

									// Check fields changes
									if ((requestColDynamic.name !== gridColDynamic.name) ||
										(requestColDynamic.userLabelName !== gridColDynamic.userLabelName)) {
										isDynamicColumnConfigChanged = true;
										break;
									}
								}
							}

							if (isDynamicColumnConfigChanged) {
								platformGridAPI.columns.configuration(this.uuid, angular.copy(allColumns));
							}
						} else {
							this.isInitialized = true;

							// Set dynamic columns first time load
							platformGridAPI.columns.configuration(this.uuid, angular.copy(allColumns));
						}

						platformGridAPI.grids.refresh(this.uuid);
						platformGridAPI.grids.invalidate(this.uuid);
					}
				}
			};

			// Resolve column order, visible, hidden status
			DynamicConfigurationService.prototype.resolveColumns = function(gridId, dynamicColumns) {
				// Take all columns again and map it with the cached grid's column configuration for sorting and hide/show status
				let columns = dynamicColumns ? dynamicColumns : this.getStandardConfigForListView(gridId).columns; // grid.columns.current;

				let cols = basicsCommonDynamicStandardConfigMergeViewService.mergeWithViewConfig(gridId, columns);

				// bre:
				// The tree column (among others in BOQ tree) is a fix column which cannot be configured.
				// But in context with the "dynamic columns" the property 'treeColumn.hidden' sometimes is set to true,
				// then in the later call of function 'platformGridAPI.columns.configuration' the tree column disappears.
				// The following code repairs this defect.
				let treeColumn = _.find(cols, { id: 'tree' });
				if (treeColumn && treeColumn.hidden) {
					treeColumn.hidden = false;
				}

				return _.filter(cols, function(col) {
					return !_.isNil(col);
				});
			};


			return {
				createService: function(options) {
					return new DynamicConfigurationService(options);
				}
			};

		}]);
})(angular);
