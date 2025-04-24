/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceConfiguredCreateExtension
	 * @function
	 * @requires platform:platformModuleEntityCreationConfigurationService
	 * @description
	 * platformDataServiceConfiguredCreateExtension adds possibility of configured create dialog to data services
	 */
	angular.module('platform').service('platformDataServiceConfiguredCreateExtension', PlatformDataServiceConfiguredCreateExtension);

	PlatformDataServiceConfiguredCreateExtension.$inject = ['_', '$q', '$http', 'platformModuleEntityCreationConfigurationService', 'platformProvideReducedLayoutService',
		'platformModalFormConfigService', 'platformRuntimeDataService', 'platformDataValidationService'];

	function PlatformDataServiceConfiguredCreateExtension(_, $q, $http, platformModuleEntityCreationConfigurationService, platformProvideReducedLayoutService,
		platformModalFormConfigService, platformRuntimeDataService, platformDataValidationService) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceConfiguredCreateExtension
		 * @description adds possibility of configured create dialog to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */

		var self = this;

		this.addConfiguredCreationToService = function addConfiguredCreationToService(container, options) {
			container.data.entityConfiguredCreateInformation = options.entityInformation;
		};

		this.getServiceConfiguredCreateSettings = function getServiceConfiguredCreateSettings(data) {
			var conf = null;
			if (!_.isNil(data.entityConfiguredCreateInformation)) {
				conf = platformModuleEntityCreationConfigurationService.getEntity(data.getModuleOfService().name, data.entityConfiguredCreateInformation.entity);
			}

			return conf;
		};

		this.hasToUseConfiguredCreate = function hasToUseConfiguredCreate(data) {
			var hasTo = false;
			var conf = self.getServiceConfiguredCreateSettings(data);
			if (!_.isNil(conf) && conf.IsNewWizardActive && conf.ColumnsForCreateDialog.length > 0) {
				hasTo = _.find(conf.ColumnsForCreateDialog, function(prop) {
					return prop.ShowInWizard;
				});
			}

			return hasTo;
		};

		this.createByConfiguredDialog = function createByConfiguredDialog(createService, data, creationOptions, dataService) {
			var conf = self.getServiceConfiguredCreateSettings(data);

			return self.createDialogConfigFromConf(data, conf, creationOptions).then(function (config) {
				if (config) {
					return platformModalFormConfigService.showDialog(config, false).then(function (result) {
						if (result) {
							delete result.data.Id;
							return createService.createConfiguredItem(result.data, data, creationOptions);
						} else {
							platformDataValidationService.removeDeletedEntityFromErrorList(config.dataItem, dataService);
							return $q.reject('Cancelled by User');
						}
					});
				} else {
					return createService.createItemDirectly(creationOptions, data, false);
				}
			});
		};

		this.isOKDisabled = function isOKDisabled(dlgLayout) {
			let obj = dlgLayout.dataItem;
			let allCheckedValid = true;

			self.validateDataEntity(dlgLayout);

			_.forEach(dlgLayout.formConfiguration.rows, function(row) {
				if(allCheckedValid && row && row.required) {
					allCheckedValid = allCheckedValid && platformDataValidationService.isMandatory(_.get(obj, row.model), row.model).valid;
				}
			});

			return !allCheckedValid;
		};

		this.validateDataEntity = function validateDataEntity(dlgLayout) {
			let obj = dlgLayout.dataItem;

			_.forEach(dlgLayout.formConfiguration.rows, function(row) {
				if(row && row.required) {
					let validation =  platformDataValidationService.isMandatory(_.get(obj, row.model), row.model);
					platformRuntimeDataService.applyValidationResult(validation, obj, row.model);
				}
			});
		};

		this.createDialogConfigFromConf = function createDialogConfigFromConf(data, conf, creationOptions) {
			var columns = conf.ColumnsForCreateDialog;

			if (columns.length > 0) {
				return self.getEntityDefaultValues(data, conf, creationOptions).then(function (defValues) {
					var dlgLayout = platformProvideReducedLayoutService.provideReducedFormLayoutFor({
						dataService: data.getImplementedService(),
						layoutFid: 'data.service.create.' + data.getImplementedService().getTranslatedEntityName(),
						isRequiredField: function isRequiredField(field) {
							return self.isRequiredProperty(field, columns);
						},
						dataEntity: defValues
					});

					dlgLayout.dialogOptions = {
						disableOkButton: function disableOkButton() {
							return self.isOKDisabled(dlgLayout);
						}
					};

					if (!_.isNil(dlgLayout.formConfiguration.rows) && dlgLayout.formConfiguration.rows.length > 0) {
						self.orderProperties(dlgLayout.formConfiguration, columns);

						if (data.entityConfiguredCreateInformation.specialTreatmentService) {
							return data.entityConfiguredCreateInformation.specialTreatmentService.adjustCreateConfiguration(dlgLayout, conf, data).then(function (layout) {
								self.validateDataEntity(layout);

								return $q.when(layout);
							});
						}

						self.validateDataEntity(dlgLayout);

						return $q.when(dlgLayout);
					}
				});
			}

			return $q.when(null);
		};

		this.orderProperties = function orderProperties(dlgLayout, columns) {
			_.forEach(columns, function (col) {
				var row = _.find(dlgLayout.rows, function(rw) {
					return rw.model === col.PropertyName || col.PropertyName === rw.options?.foreignKey;
				});
				if (!_.isNil(row)) {
					row.sortOrder = parseInt(col.Sorting);
				}
			});

			dlgLayout.rows = _.sortBy(dlgLayout.rows, ['sortOrder','model']);

			_.forEach(dlgLayout.rows, function (row, index) {
				row.sortOrder = index + 1;
			});
		};

		this.isRequiredProperty = function isRequiredProperty(property, columns) {
			return _.find(columns, function(col) {
				return col.ShowInWizard === 'true' && (col.PropertyName === property.model || col.PropertyName === property?.options?.foreignKey);
			});
		};

		this.getEntityDefaultValues = function getEntityDefaultValues(data) {
			if(!data.supportsDefaultingForConfiguredCreate) {
				return $q.when({
					Id: -1,
					Version: 0
				});
			}

			return $http.get(data.httpCreateRoute + 'entitydefaultvalues').then(function (response) {
				response.data.Version = 0;
				response.data.Id = -1;

				return response.data;
			});
		};
	}
})();
