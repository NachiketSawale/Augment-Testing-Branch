/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceConfiguredReadonlyExtension
	 * @function
	 * @requires platform:platformModuleEntityCreationConfigurationService
	 * @description
	 * platformDataServiceConfiguredCreateExtension adds possibility of configured create dialog to data services
	 */
	angular.module('platform').service('platformDataServiceConfiguredReadonlyExtension', PlatformDataServiceConfiguredReadonlyExtension);

	PlatformDataServiceConfiguredReadonlyExtension.$inject = ['_', 'platformModuleEntityCreationConfigurationService'];

	function PlatformDataServiceConfiguredReadonlyExtension(_, platformModuleEntityCreationConfigurationService) {
		var self = this;

		/**
		 * @ngdoc function
		 * @name overrideReadOnlyProperty
		 * @function
		 * @methodOf platform.platformDataServiceConfiguredReadonlyExtension
		 * @description adds possibility of configured readonly properties to a data service and its readonly processor
		 * @param propName {string} property whioch should be readonly according the configuration
		 * @param properties {array} contains all properties already handled by standard
		 * @returns void
		 */
		this.overrideReadOnlyProperty = function overrideReadOnlyProperty(propName, properties) {
			let colProperty = _.find(properties, function(property) {
				return property.field === propName;
			});

			if(_.isNil(colProperty)) {
				properties.push({field: propName, readonly: true });
			}
			else {
				colProperty.readonly = true;
			}
		};

		/**
		 * @ngdoc function
		 * @name overrideReadOnlyProperties
		 * @function
		 * @methodOf platform.platformDataServiceConfiguredReadonlyExtension
		 * @description adds possibility of configured readonly properties to a data service and its readonly processor
		 * @param module {string} name of the module, the dataservice and its procesor belongs to
		 * @param entity {string} name of the entity, the dataservice and its procesor handle
		 * @param properties {array} contains all properties already handled by standard
		 * @returns void
		 */
		this.overrideReadOnlyProperties = function overrideReadOnlyProperties(module, entity, properties) {
			var conf = platformModuleEntityCreationConfigurationService.getEntity(module.toLowerCase(), entity);
			if (!_.isNil(conf) && conf.IsReadonlyActive && conf.ColumnsForCreateDialog.length > 0) {
				_.forEach(conf.ColumnsForCreateDialog, function(column) {
					if(column.IsReadonly === 'true') {
						self.overrideReadOnlyProperty(column.PropertyName, properties);
					}
				});
			}
		};
	}
})();
