/**
 * Created by baf on 11.09.2014.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc self
	 * @name platformDataServiceTranslationExtension
	 * @function
	 *
	 * @description
	 * The platformDataServiceTranslationExtension provides translation functionality for data services
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').service('platformDataServiceTranslationExtension', PlatformDataServiceTranslationExtension);

	PlatformDataServiceTranslationExtension.$inject = ['$log', 'cloudCommonLanguageService', 'platformDataServiceSelectionExtension',
		'platformObjectHelper', 'platformSchemaService'];

	function PlatformDataServiceTranslationExtension($log, cloudCommonLanguageService, platformDataServiceSelectionExtension,
		platformObjectHelper, platformSchemaService) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSelectionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.addEntityTranslation = function addEntityTranslation(container, options) {
			if (options.translation) {
				var opt = options.translation;

				container.data.clearTranslationChanges = function clearTranslationChanges(instance, data) {
					self.clearTranslationChanges(instance, data, opt);
				};
				container.data.checkTranslationForChanges = function checkTranslationForChanges(data) {
					self.checkTranslationForChanges(data, opt);
				};
				container.data.updateTranslationAfterUpdate = function updateTranslationAfterUpdate(item, data) {
					self.updateTranslationAfterUpdate(item, data, opt);
				};
				container.data.translateEntity = function translateEntity(data) {
					self.translateEntity(data, opt);
				};
			}
		};

		this.checkTranslationForChanges = function checkTranslationForChanges(data, opt) {
			var instance = platformDataServiceSelectionExtension.getSelected(data);

			if (self.checkInstanceTranslationForChanges(instance, opt)) {
				data.markItemAsModified(instance, data);
			}
		};

		this.checkInstanceTranslationForChanges = function checkInstanceTranslationForChanges(instance, opt) {
			if (instance && Object.getOwnPropertyNames(instance).length > 0) {
				var descriptors = [];
				angular.forEach(opt.columns, function (col) {
					descriptors.push(platformObjectHelper.getValue(instance, col.field));
				});

				cloudCommonLanguageService.saveCurrentData({
					viewIdentifier: opt.uid,
					languageDescriptors: descriptors,
					autoSave: false
				});

				var modified = false;

				if (descriptors.length) {
					angular.forEach(descriptors, function (desc) {
						if (desc && desc.Modified) {
							modified = true;
						}
					});
				}

				return modified;
			}
		};

		this.clearTranslationChanges = function clearTranslationChanges(instance, data, opt) {
			if (instance && Object.getOwnPropertyNames(instance).length > 0) {
				var descriptors = [];
				angular.forEach(opt.columns, function (col) {
					descriptors.push(platformObjectHelper.getValue(instance, col.field));
				});

				if (descriptors.length) {
					angular.forEach(descriptors, function (desc) {
						if (desc && desc.Modified) {
							desc.Modified = false;
						}
					});
				}
			}
		};

		this.updateTranslationAfterUpdate = function updateTranslationAfterUpdate(item, data, opt) {
			var descriptors = [];
			angular.forEach(opt.columns, function (col) {
				descriptors.push(platformObjectHelper.getValue(item, col.field));
			});

			cloudCommonLanguageService.updateCurrentDataAfterSave({
				viewIdentifier: opt.uid,
				languageDescriptors: descriptors
			});
		};

		this.translateEntity = function translateEntity(data, opt) {
			var instance = platformDataServiceSelectionExtension.getSelected(data);

			self.translateInstance(instance, opt, data);
		};

		/**
		 * function will be call as soon as an language descriptor item is changed.
		 * @param descriptorItem
		 */

		this.translateInstance = function translateInstance(instance, opt, data, instanceService) {
			function onchangedTranslationItem() {
				var selected = data.selectedItem;
				if (selected) {
					data.markItemAsModified(selected, data);
					// $log.debug('Item marked as modified', selected);
				}
			}

			var colHeader = [];
			var colLength = [];
			var colDescriptor = [];
			var colField = [];
			let schemeProperties = null;
			if(opt.dtoScheme) {
				const dtoScheme = platformSchemaService.getSchemaFromCache(opt.dtoScheme);
				if(dtoScheme) {
					schemeProperties= dtoScheme.properties;
				}
			}

			if (instance && instance.Id && instance.Id !== 0) {
				angular.forEach(opt.columns, function (col) {
					colHeader.push(col.header);
					colLength.push(self.determineColumnWidth(schemeProperties, col));
					colDescriptor.push(platformObjectHelper.getValue(instance, col.field));
					colField.push(col.field);
				});

				cloudCommonLanguageService.setLanguageItem({
					viewIdentifier: opt.uid,
					containerInfoText: opt.title,
					columnHeaderNames: colHeader,
					columnFields: colField,
					languageDescriptorsMaxLen: colLength,
					languageDescriptors: colDescriptor,
					autoSave: true,
					onChanged: onchangedTranslationItem,
					containerService: instanceService,
					containerData: data
				});
			}
		};

		this.determineColumnWidth = function determineColumnWidth(scheme, column) {
			if(scheme) {
				const dom = scheme[column.field];
				if (dom && dom.domainmaxlen) {
					return dom.domainmaxlen;
				}
			}

			return column.maxLength || 42;
		};
	}
})(angular);