/**
 * Created by baedeker on 2015-01-22
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:formContainerStandardConfigService
	 * @description
	 * Creates a form container standard config from dto and high level description
	 *
	 * @example
	 * <div platform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('basics.lookupdata').factory('basicsLookupdataConfigGenerator', ['$injector', 'BasicsLookupdataLookupDictionary', 'platformCreateUuid',

		function ($injector, LookupDictionary, platformCreateUuid) {

			var lookupToolData = {
				service: {},
				config: new LookupDictionary(false)
			};

			var service = lookupToolData.service;

			service.provideGenericLookupConfigLookupOptions = function provideGenericLookupConfigLookupOptions(moduleQualifier, att2BDisplayed, options) {
				return {
					lookupType: moduleQualifier,
					eagerLoad: true,
					valueMember: 'Id',
					displayMember: att2BDisplayed || 'Description',
					lookupModuleQualifier: moduleQualifier,
					filterKey: options ? options.filterKey : null,
					filter: options,
					showClearButton: (options && !options.required) ? true : false,
					imageSelector: (options && options.showIcon) ? options.imageSelectorService || 'platformStatusIconService' : null,
					events: (options && options.events) ? options.events : null,
					uuid: platformCreateUuid(),
					isFastDataRecording: options ? options.isFastDataRecording : false,
					showCustomInputContent: !(options && options.isFastDataRecording),
				};
			};

			service.getImageSelector = function getImageSelector(options) {
				var sel = '';
				if (options && options.showIcon) {
					sel = options.imageSelectorService || 'platformStatusIconService';
				}

				return sel;
			};

			service.getSvgBackgroundColor = (options) => {
				return options && options.showIcon ? options.svgBackgroundColor || '' : '';
			};

			service.getBackgroundColorType = (options) => {
				return options && options.showIcon ? options.backgroundColorType || '' : '';
			};

			service.getBackgroundColorLayer = (options) => {
				return options && options.showIcon ? options.backgroundColorLayer || '' : '';
			};

			service.provideGenericLookupConfigForForm = function provideGenericLookupConfigForForm(moduleQualifier, att2BDisplayed, confObj, readOnly, options) {
				var addTo = confObj || {};

				addTo.type = 'directive';
				addTo.directive = 'basics-lookupdata-simple';
				addTo.options = service.provideGenericLookupConfigLookupOptions(moduleQualifier, att2BDisplayed, options);
				return addTo;
			};

			service.provideGenericLookupConfigForGrid = function provideGenericLookupConfigForGrid(gridLookupConf) {
				//gridLookupConf has to provide lookupName, att2BDisplayed, confObj, readOnly, options;
				var addTo = gridLookupConf.confObj || {};

				if (!gridLookupConf.readOnly) {
					addTo.editor = 'lookup';
					addTo.editorOptions = {
						lookupDirective: 'basics-lookupdata-simple',
						lookupOptions: service.provideGenericLookupConfigLookupOptions(gridLookupConf.lookupName, gridLookupConf.att2BDisplayed, gridLookupConf.options)
					};
				}
				addTo.formatter = addTo.formatter || 'lookup';
				addTo.formatterOptions = {
					lookupSimpleLookup: true,
					lookupModuleQualifier: gridLookupConf.lookupName,
					displayMember: gridLookupConf.att2BDisplayed || 'Description',
					valueMember: 'Id',
					imageSelector: service.getImageSelector(gridLookupConf.options),
					svgBackgroundColor: service.getSvgBackgroundColor(gridLookupConf.options),
					backgroundColorType: service.getBackgroundColorType(gridLookupConf.options),
					backgroundColorLayer: service.getBackgroundColorLayer(gridLookupConf.options)
				};

				if (gridLookupConf.options && (gridLookupConf.options.customIntegerProperty || gridLookupConf.options.customIntegerProperty1 || gridLookupConf.options.customBoolProperty || gridLookupConf.options.customBoolProperty1)) {
					addTo.formatterOptions.filter = {
						field: gridLookupConf.options.field,
						customIntegerProperty: gridLookupConf.options.customIntegerProperty,
						customIntegerProperty1: gridLookupConf.options.customIntegerProperty1,
						customBoolProperty: gridLookupConf.options.customBoolProperty,
						customBoolProperty1: gridLookupConf.options.customBoolProperty1
					};
				}

				return addTo;
			};

			service.provideGenericLookupConfig = function provideGenericLookupConfig(moduleQualifier, att2BDisplayed, options) {
				return {
					detail: service.provideGenericLookupConfigForForm(moduleQualifier, att2BDisplayed, null, false, options),
					grid: service.provideGenericLookupConfigForGrid({
						lookupName: moduleQualifier,
						att2BDisplayed: att2BDisplayed,
						readOnly: false,
						options: options
					})
				};
			};

			service.provideReadOnlyConfig = function provideReadOnlyConfig(moduleQualifier, att2BDisplayed, options) {
				return {
					detail: service.provideGenericLookupConfigForForm(moduleQualifier, att2BDisplayed, null, true, options),
					grid: service.provideGenericLookupConfigForGrid({
						lookupName: moduleQualifier,
						att2BDisplayed: att2BDisplayed,
						readOnly: true,
						options: options
					}),
					readonly: true
				};
			};

			service.getStatusLookupConfig = function getStatusLookupConfig(moduleQualifier, att2BDisplayed, options) {
				if(!att2BDisplayed){
					att2BDisplayed = null;
				}
				if(!options){
					options = {showIcon: true,
						imageSelectorService: 'platformStatusSvgIconService',
						svgBackgroundColor: 'BackgroundColor',
						backgroundColorType: 'dec',
						backgroundColorLayer: [1, 2, 3, 4, 5, 6]};
				}
				return service.provideReadOnlyConfig(moduleQualifier,att2BDisplayed, options);
			};

			function getTreeDataServiceLookupConfig(configObj) {
				var lookupDataService = $injector.get(configObj.dataServiceName);
				var treeGridOptions = {};
				var serviceTreeOptions = {};
				if (lookupDataService.getTreeInfo) {
					serviceTreeOptions = lookupDataService.getTreeInfo();
				}
				var configTreeOptions = {};
				if (configObj.tree) {
					configTreeOptions = configObj.tree;
				}
				angular.extend(treeGridOptions, serviceTreeOptions, configTreeOptions);

				return treeGridOptions;
			}

			function getDirective(confObj) {
				// Determine the directive to be used according to the given configuration object.
				var directive = 'basics-lookup-data-by-custom-data-service';

				if (angular.isDefined(confObj) && (confObj !== null) && angular.isDefined(confObj.gridLess) && (confObj.gridLess !== null) && confObj.gridLess) {
					directive = 'basics-lookup-data-by-custom-data-service-grid-less'; // Use the grid less version triggered by an according configuration option
				}
				return directive;
			}

			service.provideDataServiceCompositeLookupConfigForForm = function provideDataServiceCompositeLookupConfigForForm(confObj, addTo) {
				addTo = addTo || {};

				if (!confObj.moduleQualifier) {
					confObj.moduleQualifier = confObj.dataServiceName;
				}
				var configObj = service.getDataServiceDefaultSpec(confObj);
				angular.extend(configObj, confObj);

				addTo.type = 'directive';
				addTo.directive = 'basics-lookupdata-lookup-composite';
				addTo.options = {
					lookupDirective: getDirective(confObj),
					descriptionMember: configObj.desMember,
					lookupOptions: {
						displayMember: configObj.dispMember,
						valueMember: configObj.valMember,
						showClearButton: configObj.showClearButton,
						lookupType: configObj.moduleQualifier,
						dataServiceName: configObj.dataServiceName,
						lookupModuleQualifier: configObj.moduleQualifier,
						filter: configObj.filter,
						filterKey: configObj.filterKey,
						disableDataCaching: true, //always disable cache in lookup directive, because the lookup-data-service-factory already caches
						navigator: confObj.navigator || false,
						enableCache: confObj.enableCache || false,
						columns: configObj.columns,
						isClientSearch: true,
						isTextEditable: configObj.isTextEditable || false,
						events: configObj.events, // add by wui on 2016-5-12, enable events option to simple lookup
						uuid: configObj.uuid,
						highlightOnInit: configObj.highlightOnInit
					}
				};
				var treeGridOptions = getTreeDataServiceLookupConfig(confObj);
				if (treeGridOptions && treeGridOptions.childProp) {
					addTo.options.treeOptions = treeGridOptions;
					// lookupOptions are binded in the inner directive of the composite
					addTo.options.lookupOptions.treeOptions = treeGridOptions;
					if (treeGridOptions.columns) {
						addTo.options.columns = treeGridOptions.columns;
					}
				}
				return addTo;
			};

			service.provideDataServiceLookupConfigForForm = function provideDataServiceLookupConfigForForm(confObj, addTo) {
				addTo = addTo || {};

				if (!confObj.moduleQualifier) {
					confObj.moduleQualifier = confObj.dataServiceName;
				}

				var configObj = service.getDataServiceDefaultSpec(confObj);
				angular.extend(configObj, confObj);
				createCompositeWhenPossible(configObj);
				if (configObj.isComposite) {
					return service.provideDataServiceCompositeLookupConfigForForm(configObj, addTo);
				}

				addTo.type = 'directive';
				addTo.directive = getDirective(confObj);
				addTo.navigator = (confObj && confObj.navigator) ? confObj.navigator : false;
				addTo.options = {
					filterKey: configObj.filterKey,
					lookupType: configObj.moduleQualifier,
					dataServiceName: configObj.dataServiceName,
					filter: configObj.filter,
					valueMember: configObj.valMember,
					displayMember: configObj.dispMember,
					lookupModuleQualifier: configObj.moduleQualifier,
					enableCache: false || confObj.enableCache, //enable cache in lookup-data-service-factory
					disableDataCaching: true, //always disable cache in lookup directive, because the lookup-data-service-factory has cache itself
					showClearButton: configObj.showClearButton,
					columns: configObj.columns,
					isClientSearch: true,
					isTextEditable: configObj.isTextEditable || false,
					events: configObj.events, // add by wui on 2016-5-12, enable events option to simple lookup
					uuid: configObj.uuid,
					highlightOnInit: configObj.highlightOnInit
				};

				var treeGridOptions = getTreeDataServiceLookupConfig(confObj);
				if (treeGridOptions && treeGridOptions.childProp) {
					addTo.options.treeOptions = treeGridOptions;
					if (treeGridOptions.columns) {
						addTo.options.columns = treeGridOptions.columns;
					}
				}
				return addTo;
			};

			service.provideDataServiceLookupConfigForGrid = function provideDataServiceLookupConfigForGrid(confObj, addTo) {
				addTo = addTo || {};

				if (!confObj.moduleQualifier) {
					confObj.moduleQualifier = confObj.dataServiceName;
				}
				var finalConfig = service.getDataServiceDefaultSpec(confObj);
				angular.extend(finalConfig, confObj);

				const lookupDataService = $injector.get(finalConfig.dataServiceName);

				addTo.editor = 'lookup';
				if (finalConfig.hasOwnProperty('bulkSupport')) {
					addTo.bulkSupport = finalConfig.bulkSupport;
				}
				addTo.editorOptions = {
					lookupDirective: getDirective(confObj),
					lookupType: finalConfig.moduleQualifier,
					lookupOptions: {
						filterKey: finalConfig.filterKey ? finalConfig.filterKey : null,
						lookupType: finalConfig.moduleQualifier,
						dataServiceName: finalConfig.dataServiceName,
						filter: finalConfig.filter,
						valueMember: finalConfig.valMember || 'Id',
						displayMember: finalConfig.dispMember || 'Code',
						additionalColumns: angular.isDefined(finalConfig.additionalColumns) ? finalConfig.additionalColumns : true,
						lookupModuleQualifier: finalConfig.moduleQualifier,
						showClearButton: (!addTo.required) ? true : false,
						disableDataCaching: true, //always disable cache in lookup directive, because the lookup-data-service-factory already caches
						columns: finalConfig.columns,
						isClientSearch: true,
						events: finalConfig.events, // add by wui on 2016-5-12, enable events option to simple lookup
						uuid: finalConfig.uuid,
						highlightOnInit: finalConfig.highlightOnInit || (lookupDataService.resolveStringValue ? true : false),
						isFastDataRecording: lookupDataService.resolveStringValue ? true : false
					}
				};
				addTo.formatter = addTo.formatter || 'lookup';
				addTo.formatterOptions = {
					lookupType: finalConfig.moduleQualifier,
					dataServiceName: finalConfig.dataServiceName,
					displayMember: finalConfig.dispMember,
					valueMember: finalConfig.valMember,
					filter: finalConfig.filter,
					isClientSearch: true,
					translate: finalConfig.translate || false,
					imageSelector: service.getImageSelector(finalConfig)
				};

				if (finalConfig.navigator) {
					addTo.formatterOptions.navigator = finalConfig.navigator;
					// new structure, the navigator is located at the root of a row/column definition
					addTo.navigator = finalConfig.navigator;
				}
				var treeGridOptions = getTreeDataServiceLookupConfig(confObj);
				if (treeGridOptions && treeGridOptions.childProp) {
					addTo.editorOptions.lookupOptions.treeOptions = treeGridOptions;
					if (treeGridOptions.columns) {
						addTo.editorOptions.lookupOptions.columns = treeGridOptions.columns;
					}
				}
				return addTo;
			};

			service.provideDataServiceLookupConfig = function provideDataServiceLookupConfig(confObj, addTo) {
				// moduleQualifier is need for caching purpose
				if (!confObj.moduleQualifier) {
					confObj.moduleQualifier = confObj.dataServiceName;
				}
				var configObj = service.getDataServiceDefaultSpec(confObj);
				angular.extend(configObj, confObj);

				var detailConfig = configObj.isComposite ? service.provideDataServiceCompositeLookupConfigForForm(confObj, addTo) :
					service.provideDataServiceLookupConfigForForm(confObj, addTo);

				return {
					detail: detailConfig,
					grid: service.provideDataServiceLookupConfigForGrid(confObj, addTo),
					readonly: confObj.readonly ? true : false,
					navigator: (confObj && confObj.navigator) ? confObj.navigator : false
				};
			};

			service.provideTreeDataServiceLookupConfig = function provideTreeDataServiceLookupConfig(configObj) {
				return service.provideDataServiceLookupConfig(configObj);
			};

			service.provideElaboratedLookupConfigForForm = function provideElaboratedLookupConfigForForm(lookUpDirective, lookUpType, dispField, showClear, confObj, filterKey) {
				var addTo = confObj || {};
				if (!addTo.options) {
					addTo.options = {};
				}

				addTo.type = 'directive';
				addTo.directive = lookUpDirective;
				angular.extend(addTo.options, {
					lookupType: lookUpType,
					displayMember: dispField,
					showClearButton: showClear,
					filterKey: filterKey
				});

				return addTo;
			};

			service.provideElaboratedLookupConfigForGrid = function provideElaboratedLookupConfigForGrid(lookUpDirective, lookUpType, dispField, showClear, confObj, dataServiceName, filterKey) {
				var addTo = confObj || {};

				addTo.editor = 'lookup';
				addTo.editorOptions = {
					lookupType: lookUpType,
					lookupDirective: lookUpDirective,
					displayMember: dispField,
					lookupOptions: {showClearButton: showClear, filterKey: filterKey}
				};
				addTo.formatter = addTo.formatter || 'lookup';
				addTo.formatterOptions = {
					lookupType: lookUpType,
					displayMember: dispField,
					dataServiceName: dataServiceName
				};

				return addTo;
			};

			service.provideElaboratedLookupConfig = function provideProgrammedLookupOverload(lookUpDirective, lookUpType, dispField, showClear, dataServiceName, confObj, filterKey) {
				return {
					detail: service.provideElaboratedLookupConfigForForm(lookUpDirective, lookUpType, dispField, showClear, confObj, filterKey),
					grid: service.provideElaboratedLookupConfigForGrid(lookUpDirective, lookUpType, dispField, showClear, confObj, dataServiceName, filterKey)
				};
			};

			service.storeDataServiceDefaultSpec = function storeDataServiceDefaultSpec(dataSrvName, serviceConfig) {
				lookupToolData.config.add(dataSrvName, serviceConfig);
			};

			service.getDataServiceDefaultSpec = function getDataServiceDefaultSpec(paramObjects) {
				var dataSrvName = paramObjects.dataServiceName;
				if (_.isUndefined(dataSrvName) || _.isNull(dataSrvName) || !_.isString(dataSrvName) || _.isEmpty(dataSrvName)) {
					return null;
				}

				var lookupDataService = null;
				try {
					lookupDataService = $injector.get(dataSrvName);//Create, to force the service to store conf, if necessary
				} catch (e) {
					console.error('getDataServiceDefaultSpec injection of ' + dataSrvName + ' failed');
				}

				var storedConfig = lookupToolData.config.get(dataSrvName) || {};
				var defaultConfig = _.cloneDeep(storedConfig); // to prevent make dirty
				if (!paramObjects.navigator && !paramObjects.hideNavigator && lookupDataService && lookupDataService.getNavigatorConfig) {
					defaultConfig.navigator = lookupDataService.getNavigatorConfig();
				}
				if (angular.isDefined(paramObjects.additionalColumns)) {
					defaultConfig.additionalColumns = paramObjects.additionalColumns;
				}

				if (!defaultConfig.dispMember) {
					angular.extend(defaultConfig, {
						valMember: 'Id',
						dispMember: 'Code',
						desMember: 'DescriptionInfo.Translated',
						moduleQualifier: dataSrvName,
						dataServiceName: dataSrvName,
						columns: [
							{
								id: 'Code',
								field: 'Code',
								name: 'Code',
								formatter: 'code',
								name$tr$: 'cloud.common.entityCode'
							},
							{
								id: 'Description',
								field: 'DescriptionInfo',
								name: 'Description',
								formatter: 'translation',
								name$tr$: 'cloud.common.entityDescription'
							}
						],
						uuid: '70b9f81e1a534dbd9d3e440f0c08f1e3'
					});
				}

				return defaultConfig;
			};

			function createCompositeWhenPossible(defaultConfig) {
				if (_.isArray(defaultConfig.columns) && defaultConfig.columns.length > 1 && (defaultConfig.additionalColumns !== false)) {
					var displayColumnForComposite = _.find(defaultConfig.columns, function (column) {
						var displayMemberLower = defaultConfig.dispMember.toLowerCase();
						var columnFieldLower = column.field.toLowerCase();
						return (columnFieldLower !== displayMemberLower) && (columnFieldLower + '.translated') !== displayMemberLower && column.formatter !== 'lookup' && !_.isFunction(column.formatter) && column.formatter !== 'imageselect';
					});

					if (displayColumnForComposite) {
						// Composite Form Fields do not use a domainFormatter that's why we need the full path to model for translated fields
						if (displayColumnForComposite.formatter === 'translation') {
							displayColumnForComposite = displayColumnForComposite.field + '.Translated';
						} else {
							displayColumnForComposite = displayColumnForComposite.field;
						}
						defaultConfig.desMember = displayColumnForComposite;
						defaultConfig.isComposite = true;
					}
				}
			}

			return service;
		}
	]);
})(angular);
