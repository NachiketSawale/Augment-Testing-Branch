(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerCompareService', ['$translate', '$http', 'platformModalService', 'platformModalFormConfigService', '$injector',
		'platformTranslateService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
		function ($translate, $http, platformModalService, platformModalFormConfigService, $injector,
			platformTranslateService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService) {
			var service = {};
			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'model-project-model-compare-filter',
				fn: function (modelEntity) {
					var modelType = basicsLookupdataLookupDescriptorService.getLookupItem('MdlType', modelEntity.TypeFk);
					return !modelEntity.IsComposite && !modelType.Is3d;
				}
			}]);
			service.getViewCompareConfig = function (options) {
				return {
					fid: 'model.wdeviewer.config',
					version: '0.2.4',
					showGrouping: true,
					groups: [
						{
							gid: 'firstDraw',
							header$tr$: 'model.wdeviewer.compare.firstDraw',
							isOpen: true,
							sortOrder: 100,
							attributes: ['firstdrawversion', 'firstdrawlayout']
						},
						{
							gid: 'secondDraw',
							header$tr$: 'model.wdeviewer.compare.secondDraw',
							isOpen: true,
							sortOrder: 100,
							attributes: ['seconddrawversion', 'seconddrawlayout']
						},
						{
							gid: 'drawSetting',
							header$tr$: 'model.wdeviewer.compare.compareMode',
							isOpen: false,
							visible: false,
							sortOrder: 100
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelProjectModelLookupDataService',
							valMember: 'Uuid',
							filter: function () {
								return options.projectId;
							},
							enableCache: true,
							filterKey: 'model-project-model-compare-filter'
						},
						{
							gid: 'firstDraw',
							rid: 'firstdrawversion',
							label$tr$: 'model.wdeviewer.compare.model',
							model: 'FirstDrawVersion',
							change: function (entity, field) {
								onDrawVersionChange(options, entity, field, 'firstDrawLayout');
							},
							validator: function (entity) {
								window.console.log(entity);
								return true;
							},
							sortOrder: 1
						}),
						{
							gid: 'firstDraw',
							rid: 'firstdrawlayout',
							label$tr$: 'model.wdeviewer.compare.layout',
							type: 'select',
							options: {
								items: options.modelLayout,
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							},
							model: 'FirstDrawLayout',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelProjectModelLookupDataService',
							valMember: 'Uuid',
							filter: function () {
								return options.projectId;
							},
							filterKey: 'model-project-model-compare-filter'
						},
						{
							gid: 'secondDraw',
							rid: 'seconddrawversion',
							label$tr$: 'model.wdeviewer.compare.model',
							model: 'SecondDrawVersion',
							change: function (entity, field) {
								onDrawVersionChange(options, entity, field, 'secondDrawLayout');
							},
							sortOrder: 1
						}),
						{
							gid: 'secondDraw',
							rid: 'seconddrawlayout',
							label$tr$: 'model.wdeviewer.compare.layout',
							type: 'select',
							options: {
								items: [],
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							},
							model: 'SecondDrawLayout',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'drawSetting',
							rid: 'drawsettingtype',
							label$tr$: 'model.wdeviewer.compare.type',
							type: 'select',
							options: {
								items: [{value: 1, text: 'compare Drawings BY OBJECT'},
									{value: 2, text: 'compare Drawings BY GEOMETRY'},
									{value: 3, text: 'compare Drawings OVERLAY'},
									{value: 4, text: 'append Drawing'},
									{value: 5, text: 'load First Drawing'}],
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							},
							model: 'DrawSettingType',
							visible: true,
							sortOrder: 100,
							readonly: false
						}
					]
				};
			};

			function setItemsInConfig(options, entity, field, property, data) {
				entity[property] = null;
				if (data && data.length > 0) {
					var modelConfig = platformModalFormConfigService.getFormConfiguration();
					if (modelConfig) {
						_.forEach(modelConfig.rows, function (config) {
							if (config.model === property) {
								config.options.items = data;
							}
						});
						entity[property] = data[0].value;

						if (field === 'FirstDrawModel') {
							onDrawVersionChange(options, entity, 'FirstDrawVersion', 'FirstDrawLayout');
						} else if (field === 'SecondDrawModel') {
							onDrawVersionChange(options, entity, 'SecondDrawVersion', 'SecondDrawLayout');
						}
						return entity[property];
					}
				}
				return null;
			}

			/* function onDrawItemChange(options, entity, field, property) {
				if (service.drawVersions && service.drawVersions.length > 0 && _.find(service.drawVersions, {modelId: entity[field]})) {
					var drawVersions = _.filter(service.drawVersions, {modelId: entity[field]});
					setItemsInConfig(options, entity, field, property, drawVersions);
				} else {
					$http.get(globals.webApiBaseUrl + 'model/project/model/version/list?modelId=' + entity[field])
						.then(function (response) {
							if (!service.drawVersions) {
								service.drawVersions = [];
							}
							if (response.data && response.data.length > 0) {
								var versions = _.map(response.data, function (versionItem) {
									var item = {
										value: versionItem.Uuid,
										text: versionItem.Code,
										modelId: entity[field]
									};
									service.drawVersions.push(item);
									return item;
								});
								setItemsInConfig(options, entity, field, property, versions);
							} else {
								var modelItem = _.find(options.modelItems, {value: entity[field]});
								if (modelItem) {
									var item = {value: modelItem.uuid, text: modelItem.text, modelId: modelItem.value};
									service.drawVersions.push(item);
									setItemsInConfig(options, entity, field, property, [item]);
								}
							}
						});
				}
			} */

			function onDrawVersionChange(options, entity, field, property) {
				if (service.drawLayouts && service.drawLayouts.length > 0 && _.find(service.drawLayouts, {versionId: entity[field]})) {
					var drawLayouts = _.filter(service.drawLayouts, {versionId: entity[field]});
					setItemsInConfig(options, entity, field, property, drawLayouts);
				} else if (entity[field]) {
					$http.get(globals.webApiBaseUrl + 'model/wdeviewer/drawing/' + entity[field] + '/layout')
						.then(function (response) {
							if (!service.drawLayouts) {
								service.drawLayouts = [];
							}
							if (response.data && response.data.layoutDetails) {
								var layouts = _.map(response.data.layoutDetails.layouts, function (layout) {
									var item = {value: layout.id, text: layout.name, versionId: entity[field]};
									service.drawLayouts.push(item);
									return item;
								});
								setItemsInConfig(options, entity, field, property, layouts);
							}
						});
				}
			}

			service.showCompareDialog = function showCompareDialog(options) {
				$injector.get('modelProjectModelLookupDataService').resetCache({lookupType: 'model'});
				var config = {
					title: $translate.instant('model.wdeviewer.compare.title'),
					formConfiguration: service.getViewCompareConfig(options),
					dataItem: {
						Id: 0,
						FirstDrawVersion: options.modelId,
						FirstDrawLayout: options.layoutId
					}
				};
				platformTranslateService.translateFormConfig(config.formConfiguration);
				return platformModalFormConfigService.showDialog(config).then(function (result) {
					return result;
				});
			};

			service.showViewCompareDialog = function showViewCompareDialog(wdeCtrl, option, WDE, WDE_CONSTANTS, WDESingleInstance) {
				_.map(option.modelVersion, function (item) {
					$http.get(globals.webApiBaseUrl + 'model/wdeviewer/drawing/' + item.value + '/layout')
						.then(function (response) {
							if (response.data && response.data.layoutDetails) {
								var layouts = _.map(response.data.layoutDetails.layouts, function (layout) {
									return {value: layout.id, text: layout.name};
								});
								option.modelLayout.push({uuid: item.value, data: layouts});
							}
						});
				});
				service.showCompareDialog(option).then(function (result) {
					if (result.ok) {
						var data = result.data;
						var units = new WDE.Units(WDE_CONSTANTS.UNITS.AUTODETECT);
						var loadConfiguration = {
							units: units,
							calibrationFactors: [1.0, 1.0, 1.0, 0.0],
							scaleFactors: [1.0, 1.0, 1.0],
							forComparison: true
						};
						data.drawSettingType = 3;
						switch (data.drawSettingType) {
							case 1:
								WDESingleInstance.loadDrawing('Loading initial drawing task name', data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration, false, false);
								var draw11 = new WDE.DrawingComparisonDetails(data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration);
								var draw12 = new WDE.DrawingComparisonDetails(data.SecondDrawVersion, data.SecondDrawLayout, loadConfiguration);
								var comparisonConfguration = new WDE.ComparisonConfiguration(WDE_CONSTANTS.COMPARISON_BY_OBJECT, draw11, draw12, WDE_CONSTANTS.EPSILON);
								WDESingleInstance.setViewUnits(new WDE.Units(WDE_CONSTANTS.UNITS.METRIC.MILLIMETRES));
								WDESingleInstance.compareDrawings(comparisonConfguration);
								break;
							case 2:
								var draw21 = new WDE.DrawingComparisonDetails(data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration);
								var draw22 = new WDE.DrawingComparisonDetails(data.SecondDrawVersion, data.SecondDrawLayout, loadConfiguration);
								var comparisonConfguration2 = new WDE.ComparisonConfiguration(WDE_CONSTANTS.COMPARISON_BY_GEOMETRY, draw21, draw22);
								WDESingleInstance.loadDrawing('Loading initial drawing task name', data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration, false, false);
								WDESingleInstance.setViewUnits(new WDE.Units(WDE_CONSTANTS.UNITS.METRIC.MILLIMETRES));
								WDESingleInstance.compareDrawings(comparisonConfguration2);
								break;
							case 3:
								WDESingleInstance.loadDrawing('Loading initial drawing task name', data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration, false, false);
								var draw31 = new WDE.DrawingComparisonDetails(data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration);
								var draw32 = new WDE.DrawingComparisonDetails(data.SecondDrawVersion, data.SecondDrawLayout, loadConfiguration);
								var comparisonConfguration3 = new WDE.ComparisonConfiguration(WDE_CONSTANTS.COMPARISON_OVERLAY, draw31, draw32);
								WDESingleInstance.setViewUnits(new WDE.Units(WDE_CONSTANTS.UNITS.METRIC.MILLIMETRES));
								WDESingleInstance.compareDrawings(comparisonConfguration3);
								break;
							case 4:
								// WDESingleInstance.clearDrawings();
								WDESingleInstance.setViewUnits(new WDE.Units(WDE_CONSTANTS.UNITS.METRIC.MILLIMETRES));// .METRES));
								// WDESingleInstance.loadDrawing('Loading initial drawing task name', data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration, false, false);
								if (data.FirstDrawVersion && data.FirstDrawLayout) {
									WDESingleInstance.loadDrawing('Loading subsequent drawing task name', data.FirstDrawVersion, data.FirstDrawLayout, loadConfiguration, false, false);
									WDESingleInstance.appendDrawing('Adding drawing 1 for comparison', data.FirstDrawVersion, data.FirstDrawLayout);
								}
								if (data.SecondDrawVersion && data.SecondDrawLayout) {
									WDESingleInstance.appendDrawing('Adding drawing 2 for comparison', data.SecondDrawVersion, data.SecondDrawLayout);
								}
								break;
							case 5:
								// WDESingleInstance.clearDrawings();
								var viewStructure = new WDE.ViewStructure();
								viewStructure.addDrawing(data.FirstDrawVersion, data.FirstDrawLayout, null);
								WDESingleInstance.loadViewStructure(viewStructure);
								break;
						}
					}

					return result;
				});
			};

			return service;
		}
	]);

})(angular);