/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name platform:basicsCustomizeInstanceTranslateService
	 * @function
	 * @requires _, platformDataServiceTranslationExtension, basicCustomizeTranslationService
	 * @description
	 * basicsCustomizeInstanceTranslateService adds data processor(s behaviour to data services created from the data service factory
	 */
	basicsCustomizeModule.service('basicsCustomizeInstanceTranslateService', BasicsCustomizeInstanceTranslateService);

	BasicsCustomizeInstanceTranslateService.$inject = ['_', 'platformDataServiceTranslationExtension','basicCustomizeTranslationService'];

	function BasicsCustomizeInstanceTranslateService(_, platformDataServiceTranslationExtension, basicCustomizeTranslationService) {
		/**
		 * @ngdoc function
		 * @name addItemFilter
		 * @function
		 * @methodOf platform.PlatformDataServiceDataProcessorExtension
		 * @description adds data processor(s) to data services
		 * @param container {object} contains entire service and its data to be created
		 * @param options {object} contains options about item filter
		 */
		var self = this;
		var noTranslationOptions = { usesTranslation: false, columns: [], uid: 'basicsCustomizeInstanceNotTranslated', title: '' };
		var currentOptions = { usesTranslation: false, columns: [] };
		var instanceDataService = null;

		// options can be passed additionally
		this.initService = function initService(instService) {
			if(!instanceDataService) {
				instanceDataService = instService;
			}
		};

		this.onTypeSelectionChanging = function onTypeSelectionChanging () {
			if(currentOptions.usesTranslation) {
				instanceDataService.unregisterSelectionChanged(self.onInstanceSelectionChanged);
			}
		};

		this.onTypeSelectionChanged = function onTypeSelectionChanged (type) {
			self.onTypeSelectionChanging();

			if(type && type.ToTranslate && type.ToTranslate.length > 0) {
				self.prepareTranslateContainerForType(type);
			}
			else {
				self.disableTranslateContainer();
			}
		};

		this.clearTranslationChanges = function clearTranslationChanges(typeData) {
			if (currentOptions.usesTranslation && typeData && _.isArray(typeData.ToSave)) {
				let instData = instanceDataService.getData();
				_.forEach(typeData.ToSave, function (instance) {
					let orig = instanceDataService.getItemById(instance.Id);
					platformDataServiceTranslationExtension.clearTranslationChanges(orig, instData, currentOptions);
				});
			}
		};

		this.checkTranslationForChanges = function checkTranslationForChanges (instance) {
			return platformDataServiceTranslationExtension.checkInstanceTranslationForChanges(instance, currentOptions);
		};

		this.onInstanceSelectionChanged = function onInstanceSelectionChanged (unused, instance) {
			if(instance && instance.Id) {
				platformDataServiceTranslationExtension.translateInstance(instance, currentOptions, instanceDataService.getData(), instanceDataService);
			}
			else {
				platformDataServiceTranslationExtension.translateInstance(instance, noTranslationOptions, instanceDataService.getData(), instanceDataService);
			}
		};

		this.prepareTranslateContainerForType = function prepareTranslateContainerForType(type) {
			//Translation configuration creation
			currentOptions.usesTranslation = true;
			currentOptions.uid = 'basicsCustomizeInstanceOfType' + type.ClassName;
			currentOptions.title = type.Name;
			currentOptions.columns.length = 0;
			currentOptions.dtoScheme = {
				typeName: type.DtoClassName,
				moduleSubModule: 'Basics.Customize'
			};

			_.forEach(type.ToTranslate, function(propName) {
				var prop = _.find(type.Properties, { Name: propName });
				if(prop) {
					currentOptions.columns.push( {
						header: self.getTranslationColumnHeaderForProperty(prop),
						maxLength: prop.MaxLength || 42,
						field: prop.Name
					});
				}
			});

			instanceDataService.registerSelectionChanged(self.onInstanceSelectionChanged);
		};

		this.disableTranslateContainer = function disableTranslateContainer() {
			currentOptions.usesTranslation = false;
			currentOptions.columns.length = 0;

			currentOptions.uid = 'basicsCustomizeInstanceNotTranslated';
			currentOptions.title = '';

			platformDataServiceTranslationExtension.translateInstance(null, currentOptions);
		};

		this.getTranslationColumnHeaderForProperty = function getTranslationColumnHeaderForProperty(prop) {
			var hdr = basicCustomizeTranslationService.getTranslationInformation(prop.Name);
			if(hdr) {
				hdr = '' + hdr.location + '.' + hdr.identifier;
			}
			else {
				hdr = prop.Name;
			}

			return hdr;
		};

		this.updateTranslationAfterUpdate = function updateTranslationAfterUpdate(item, data) {
			if(currentOptions.columns.length > 0) {
				platformDataServiceTranslationExtension.updateTranslationAfterUpdate(item, data, currentOptions);
			}
		};
	}
})(angular);
