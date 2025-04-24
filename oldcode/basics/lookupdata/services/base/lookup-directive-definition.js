/**
 * Created by wui on 7/16/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	/*jshint -W072*/ //too much parameters
	angular.module(moduleName).factory('BasicsLookupdataLookupDirectiveDefinition', [
		'_',
		'$compile',
		'$templateCache',
		'$injector',
		'basicsLookupdataLookupDataService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupViewService',
		'basicsLookupdataLookupDefinitionService',
		'basicsLookupdataLookupOptionService',
		function(_,
		         $compile,
		         $templateCache,
		         $injector,
		         lookupDataService,
		         lookupDescriptorService,
		         lookupViewService,
		         lookupDefinitionService,
		         basicsLookupdataLookupOptionService) {

			const defaults = {
				// controller function after finishing basic configuration.
				controller: null,

				// an object has following format to be used to handle data like getting list, getting seachList... actually.
				// eg. { getList:null, getDefault:null, getItemByKey:null, getSearchList:null }
				// it will be an instance of class 'LookupDataProvider' for each lookup type by default, programers can define their own data handler
				// for special command like cache and so on.
				dataProvider: null,

				// an object to get url for current specific lookup, the object should have following property,
				// eg. { getList:'', getDefault:'', getItemByKey:'', getSearchList:'' }
				url: null,

				// process data after data loaded and before they are transferred to lookup ui.
				processData: null
			};

			function getCustomConfiguration(customConfigurationFn) {
				var config = {};

				if (angular.isArray(customConfigurationFn) || angular.isFunction(customConfigurationFn)) {
					config = $injector.invoke(customConfigurationFn);
				}
				else if (angular.isObject(customConfigurationFn)) {
					config = customConfigurationFn;
				}

				return _.mergeWith({}, defaults, config, basicsLookupdataLookupOptionService.customizer);
			}

			/**
			 * @description: register a LookupDataProvider for each lookup type.
			 */
			function handleDataProvider(lookupOptions, customConfiguration) {
				if (lookupOptions.lookupType) {
					if (customConfiguration.dataProvider) {
						customConfiguration.dataProvider = lookupDataService.registerDataProvider(lookupOptions.lookupType, customConfiguration.dataProvider, true);
					} else {
						customConfiguration.dataProvider = lookupDataService.registerDataProviderByType(lookupOptions.lookupType, customConfiguration.url, true);
					}
				}
				lookupOptions.dataProvider = customConfiguration.dataProvider;

				if (!lookupOptions.isTextEditable) {
					lookupOptions.isFastDataRecording = customConfiguration.dataProvider.isFastDataRecording ?? false;
				}
			}

			return function BasicsLookupdataLookupDirectiveDefinition(lookupViewType, lookupOptions, customConfigurationFn) {
				var self = this, customConfiguration = getCustomConfiguration(customConfigurationFn);

				// if dataProvider option is string value, then think it as angular service.
				if (angular.isString(customConfiguration.dataProvider)) {
					customConfiguration.dataProvider = $injector.get(customConfiguration.dataProvider);
				}

				lookupOptions = lookupOptions || {};

				handleDataProvider(lookupOptions, customConfiguration);

				lookupDefinitionService.set(lookupOptions);

				self.restrict= 'A';

				self.scope = {};

				self.controller = ['$scope', '$element', '$attrs', controller];

				self.link = linker;

				function controller(scope, element, attrs) {
					// Get entity, read only.
					Object.defineProperty(scope, 'entity', {
						get: function () {
							return scope.$parent.$eval(attrs.entity);
						},
						set: angular.noop
					});

					// Get options, read only.
					Object.defineProperty(scope, 'options', {
						get: function () {
							return scope.$parent.$eval(attrs.options);
						},
						set: angular.noop
					});

					// Get result, read only.
					Object.defineProperty(scope, 'result', {
						get: function () {
							return scope.$parent.$eval(attrs.result);
						},
						set: angular.noop
					});

					// merge defaults,scope options and lookupOptions argument.
					scope.lookupOptions = _.mergeWith({disabled: scope.$parent.$eval(attrs.disabled)}, lookupOptions, scope.options, basicsLookupdataLookupOptionService.customizer);

					lookupViewService.config(lookupViewType, scope.lookupOptions);

					if (angular.isFunction(customConfiguration.processData)) {
						scope.lookupOptions.dataProcessor = {
							execute: customConfiguration.processData
						};
					}

					// outer controller.
					if (customConfiguration.controller) {
						$injector.invoke(customConfiguration.controller, scope, {
							'$scope': scope,
							'$element': element
						});
					}
				}

				function linker(scope, element, attrs) {
					let template = $templateCache.get('lookup.html');

					template = template.replace(/\$\$entityHolder\$\$/gm, attrs.entity ? ('data-entity="$parent.' + attrs.entity + '"') : '')
						.replace(/\$\$disabledHolder\$\$/gm, attrs.disabled ? ('data-disabled="$parent.' + attrs.disabled + '"') : '')
						.replace(/\$\$configHolder\$\$/gm, attrs.config ? ('data-config="$parent.' + attrs.config + '"') : '')
						.replace(/\$\$resultHolder\$\$/gm, attrs.result ? ('data-result="$parent.' + attrs.result + '"') : '')
						.replace(/\$\$readonlyHolder\$\$/gm, attrs.config ? ('data-ng-readonly="' + attrs.readonly + ' || $parent.' + attrs.config + '.rt$readonly()"') : '');

					$compile(angular.element(template).appendTo(element))(scope);
				}

			};
		}

	]);

})(angular);