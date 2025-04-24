/**
 * Created by lvy on 8/1/2018.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('materialImportPriceVersionComposite', ['BasicsLookupdataLookupDirectiveDefinitionForMaterical','basicsMaterialMaterialCatalogService', '$q', '$http', 'basicsMaterialWizardService',
		function (BasicsLookupdataLookupDirectiveDefinitionForMaterical, materialCatalogService, $q, $http, basicsMaterialWizardService) {
			var defaults = {
				version: 2,
				lookupType: 'MaterialPriceVersion',
				valueMember: 'Id',
				displayMember: 'MaterialPriceVersionDescriptionInfo.Translated',
				checkboxMember: 'SpecifiedPriceListVersion',
				uuid: '27bc714194cb463c8e10bff7493e9d0b',
				columns: [
					{ id: 'priceverdesc', field: 'MaterialPriceVersionDescriptionInfo.Translated', name: 'Price Version Description', name$tr$: 'basics.materialcatalog.priceVersionDescription', width: 100 },
					{ id: 'pricelistdesc', field: 'PriceListDescriptionInfo.Translated', name: 'Price List Description', name$tr$: 'basics.materialcatalog.priceListDescription', width: 100 }
				],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinitionForMaterical('lookup-edit', defaults, {
				dataProvider: {
					getList: getList,
					getItemByKey: function (id) {
						var deferred = $q.defer();

						this.getList().then(function (data) {
							var e = _.find(data, {Id: id});
							if (_.isNil(e)) {
								e = _.minBy(data, 'Id');
							}
							deferred.resolve(e);
						});

						return deferred.promise;
					},
					getSearchList: getList
				}
			});

			function getList() {
				var catalog = materialCatalogService.getSelected();
				var deferred = $q.defer();
				var param = {
					SearchFields: [],
					SearchText: '',
					AdditionalParameters: { MaterialCatalogFk: catalog.Id }
				};
				param = encodeURIComponent(JSON.stringify(param));
				$http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=materialpriceversion&filtervalue=' + param
				}).then(
					function (response) {
						var data = [];
						$.each(basicsMaterialWizardService.materialCatalogPriceVersions, function(idx, item) {
							var e = _.find(response.data, {Id: item.Id});
							if(e) {
								data.push(e);
							}
						});
						deferred.resolve(data);
					}
				);
				return deferred.promise;
			}
		}
	]);

	angular.module(moduleName).factory('BasicsLookupdataLookupDirectiveDefinitionForMaterical', [
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

			var defaults = {
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
					}
					else {
						customConfiguration.dataProvider = lookupDataService.registerDataProviderByType(lookupOptions.lookupType, customConfiguration.url, true);
					}
				}
				lookupOptions.dataProvider = customConfiguration.dataProvider;
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

				self.template = '<input class="materialImportPVCheckboxFrontOfPV" type="checkbox" data-ng-model="entity.' + lookupOptions.checkboxMember + '" ng-checked="entity.' + lookupOptions.checkboxMember + '"  data-ng-click="onChange()" style="vertical-align:bottom;margin: 0 5px 2px 0px;">';

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
					var template = $templateCache.get('lookup.html');

					template = template.replace(/\$\$entityHolder\$\$/gm, attrs.entity ? ('data-entity="$parent.' + attrs.entity + '"') : '')
						.replace(/\$\$disabledHolder\$\$/gm, attrs.disabled ? ('data-disabled="$parent.' + attrs.disabled + '"') : '')
						.replace(/\$\$configHolder\$\$/gm, attrs.config ? ('data-config="$parent.' + attrs.config + '"') : '')
						.replace(/\$\$resultHolder\$\$/gm, attrs.result ? ('data-result="$parent.' + attrs.result + '"') : '')
						.replace(/\$\$readonlyHolder\$\$/gm, attrs.config ? ('data-ng-readonly="$parent.' + attrs.config + '.rt$readonly()"') : '');

					scope.onChange = function(){
						scope.$emit('customSettingChanged','IsSpecifiedPriceVersion');
					};

					element.parent().siblings('label').prepend(element.find('.materialImportPVCheckboxFrontOfPV'));
					$compile(angular.element(template).appendTo(element))(scope);
				}

			};
		}
	]);
})(angular);