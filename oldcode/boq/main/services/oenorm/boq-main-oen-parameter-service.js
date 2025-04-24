(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'boq.main';
	let boqMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqMainOenParameterTreeControllerService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenParameterTreeControllerService', ['boqMainOenService', 'boqMainOenParameterDataService', 'boqMainOenParameterTreeUiService', 'platformGridControllerService',
		function(boqMainOenService, boqMainOenParameterDataService, boqMainOenParameterTreeUiService, platformGridControllerService) {
			return {
				getInstance: function(scope, boqMainService) {
					let myGridConfig = {
						columns: [],
						parentProp: 'ParamTreeItemParentId',
						childProp: 'ParamTreeItemChildren',
					};
					var dataService = boqMainOenParameterDataService.getInstance(boqMainService);
					platformGridControllerService.initListController(scope, boqMainOenParameterTreeUiService, dataService, null, myGridConfig);

					boqMainOenService.tryDisableContainer(scope, boqMainService, false);
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenParameterDataService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenParameterDataService', ['platformDataServiceFactory', 'ServiceDataProcessDatesExtension',
		function (platformDataServiceFactory, ServiceDataProcessDatesExtension) {
			return {
				getInstance: function(boqMainService) {
					let service;
					service = _.find(boqMainService.getChildServices(), function(childService) { return 'boqMainOenParameterDataService'===childService.getServiceName(); });
					if (service) {
						return service;
					}

					let serviceOption = {
						hierarchicalNodeItem: {
							module: boqMainModule,
							serviceName: 'boqMainOenParameterDataService',
							entityRole: {
								node: {
									itemName: 'ParamList',
									parentService: boqMainService
								}
							},
							httpRead: { route: globals.webApiBaseUrl + 'boq/main/oen/param/', endRead: 'tree',
								initReadData: function (readData) {
									let currentBoqItem = boqMainService.getSelected();
									readData.filter = '?boqHeaderId=' + currentBoqItem.BoqHeaderFk;
								}
							},
							dataProcessor: [
								new ServiceDataProcessDatesExtension(['VersionDate'])
							],
							actions: {delete: false, create: false}
						}
					};

					let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;

					return service;
				}
			};
		}]);

	/**
	 * @ngdoc service
	 * @name boqMainOenParameterTreeUiService
	 * @function
	 *
	 * @description
	 *
	 */
	boqMainModule.factory('boqMainOenParameterTreeUiService',['platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService',
		function (platformUIStandardConfigService, boqMainTranslationService, platformSchemaService) {
			const layout = {
				fid: 'boq.main.oen.paramTree',
				showGrouping: false,
				groups: [{gid: 'basicData', attributes: ['description'] }],
				overloads: { description: {readonly: true} }
			};

			const paramListSchema = platformSchemaService.getSchemaFromCache({typeName:'OenParamListDto', moduleSubModule:'Boq.Main'});

			return new platformUIStandardConfigService(layout, paramListSchema.properties, boqMainTranslationService);
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenParameterDetailControllerService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenParameterDetailControllerService', ['boqMainOenService', 'boqMainOenParameterDataService', 'boqMainOenParameterDetailUiService', 'boqMainTranslationService','platformDetailControllerService',
		function(boqMainOenService, boqMainOenParameterDataService, boqMainOenParameterDetailUiService, boqMainTranslationService,platformDetailControllerService) {
			return {
				getInstance: function(scope, boqMainService) {
					const oenParameterType = {OenParamList: 'OenParamList', OenParamSets: 'OenParamSets',OenParamHeadlines:'OenParamHeadlines',OenParam:'OenParam',OenParamValueList:'OenParamValueList',OenParamValue:'OenParamValue'};
					scope.onSelectedParameterChanged = function onSelectedParameterChanged(entity) {
						if (entity!==undefined && entity!==null) {
							if(entity.ParamTreeType==='OenParamListDto') {
								showUi(oenParameterType.OenParamList);
							}
							else if(entity.ParamTreeType==='OenParamSetDto'){
								showUi(oenParameterType.OenParamSets);
							}
							else if(entity.ParamTreeType==='OenParamHeadlinesDto'){
								showUi(oenParameterType.OenParamHeadlines);
							}
							else if(entity.ParamTreeType==='OenParamDto'){
								showUi(oenParameterType.OenParam);
							}
							else if(entity.ParamTreeType==='OenParamValueListDto'){
								showUi(oenParameterType.OenParamValueList);
							}
							else if(entity.ParamTreeType==='OenParamValueDto'){
								showUi(oenParameterType.OenParamValue);
							}
						}
					};

					var changeHandler = function (e,entity) {
						scope.onSelectedParameterChanged(entity);
					};

					let dataService   = boqMainOenParameterDataService.getInstance(boqMainService);
					platformDetailControllerService.initDetailController(scope, dataService, null, boqMainOenParameterDetailUiService, boqMainTranslationService);
					dataService.registerSelectionChanged(changeHandler);
					boqMainOenService.tryDisableContainer(scope, boqMainService, false);

					function showUi(type) {
						var uiGroups = scope.group;
						if(uiGroups !== undefined && uiGroups !==null){
							var groupOenParamListIndex       = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.parameter.groupOenParamList');
							var groupOenParamSetIndex        = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.parameter.groupOenParamSet');
							var groupOenParamHeadlineIndex   = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.parameter.groupOenParamHeadlines');
							var groupOenParamIndex           = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.parameter.groupOenParam');
							var groupOenParamValueListIndex  = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.parameter.groupOenParamValueList');
							var groupOenParamValueIndex      = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.parameter.groupOenParamValue');

							if (type === oenParameterType.OenParamList) {
								uiGroups[groupOenParamListIndex].           visible = true;
								uiGroups[groupOenParamSetIndex].            visible = false;
								uiGroups[groupOenParamHeadlineIndex].       visible = false;
								uiGroups[groupOenParamIndex].               visible = false;
								uiGroups[groupOenParamValueListIndex].      visible = false;
								uiGroups[groupOenParamValueIndex].          visible = false;
							}
							else if (type === oenParameterType.OenParamSets) {
								uiGroups[groupOenParamListIndex].           visible = false;
								uiGroups[groupOenParamSetIndex].            visible = true;
								uiGroups[groupOenParamHeadlineIndex].       visible = false;
								uiGroups[groupOenParamIndex].               visible = false;
								uiGroups[groupOenParamValueListIndex].      visible = false;
								uiGroups[groupOenParamValueIndex].          visible = false;
							}
							else if (type === oenParameterType.OenParamHeadlines) {
								uiGroups[groupOenParamListIndex].           visible = false;
								uiGroups[groupOenParamSetIndex].            visible = false;
								uiGroups[groupOenParamHeadlineIndex].       visible = true;
								uiGroups[groupOenParamIndex].               visible = false;
								uiGroups[groupOenParamValueListIndex].      visible = false;
								uiGroups[groupOenParamValueIndex].          visible = false;
							}
							else if (type === oenParameterType.OenParam) {
								uiGroups[groupOenParamListIndex].           visible = false;
								uiGroups[groupOenParamSetIndex].            visible = false;
								uiGroups[groupOenParamHeadlineIndex].       visible = false;
								uiGroups[groupOenParamIndex].               visible = true;
								uiGroups[groupOenParamValueListIndex].      visible = false;
								uiGroups[groupOenParamValueIndex].          visible = false;
							}
							else if (type === oenParameterType.OenParamValueList) {
								uiGroups[groupOenParamListIndex].           visible = false;
								uiGroups[groupOenParamSetIndex].            visible = false;
								uiGroups[groupOenParamHeadlineIndex].       visible = false;
								uiGroups[groupOenParamIndex].               visible = false;
								uiGroups[groupOenParamValueListIndex].      visible = true;
								uiGroups[groupOenParamValueIndex].          visible = false;
							}
							else if (type === oenParameterType.OenParamValue) {
								uiGroups[groupOenParamListIndex].           visible = false;
								uiGroups[groupOenParamSetIndex].            visible = false;
								uiGroups[groupOenParamHeadlineIndex].       visible = false;
								uiGroups[groupOenParamIndex].               visible = false;
								uiGroups[groupOenParamValueListIndex].      visible = false;
								uiGroups[groupOenParamValueIndex].          visible = true;
							}
							scope.$broadcast('form-config-updated');
						}

					}
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenParameterDetailUiService
	 * @function
	 *
	 * @description
	 *
	 */
	boqMainModule.factory('boqMainOenParameterDetailUiService',['$translate','platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService','platformUIStandardExtentService','boqMainOenTranslationService',
		function ($translate,platformUIStandardConfigService, boqMainTranslationService, platformSchemaService,platformUIStandardExtentService,boqMainOenTranslationService) {
			const gidPrefix = 'oen.uicontainer.parameter.';
			const gids = [gidPrefix + 'groupOenParamList',gidPrefix + 'groupOenParamSet',gidPrefix + 'groupOenParam',gidPrefix + 'groupOenParamHeadlines',gidPrefix + 'groupOenParamValueList', gidPrefix + 'groupOenParamValue'];
			const layout = {
				fid: 'boq.main.oen.parameter',
				showGrouping: true,
				groups: [],
				addition: {detail: []},
			};
			function addRow(gid,dto, property,type) {
				let detail = {
					'gid': gidPrefix + gid,
					'rid': dto + property,
					'model': property,
					'label': $translate.instant('boq.main.oen.dto.'+ dto +'.' + property),
					'type':type,
					'readonly':true
				};
				layout.addition.detail.push(detail);
			}

			addRow('groupOenParamList','OenParamListDto','Description', 'description');
			addRow('groupOenParamList','OenParamListDto','Code','code');
			addRow('groupOenParamList','OenParamListDto','VersionDate','date');
			addRow('groupOenParamList','OenParamListDto','VersionNumber','integer');
			addRow('groupOenParamList','OenParamListDto','DownloadUrl','url');
			addRow('groupOenParamList','OenParamListDto','CodeFunctionCat','description');
			addRow('groupOenParamList','OenParamListDto','CodeProductCat','description');

			addRow('groupOenParamSet','OenParamSetDto','Description','description');

			addRow('groupOenParam','OenParamDto','Description','description');
			addRow('groupOenParam','OenParamDto','Code','code');
			addRow('groupOenParam','OenParamDto','Type','integer');
			addRow('groupOenParam','OenParamDto','NumberUnit','description');
			addRow('groupOenParam','OenParamDto','NumberDecimalPlaces','integer');
			addRow('groupOenParam','OenParamDto','NumberMinValue','decimal');
			addRow('groupOenParam','OenParamDto','NumberMaxValue','decimal');
			addRow('groupOenParam','OenParamDto','NumberBuildSum','boolean');
			addRow('groupOenParam','OenParamDto','NumberQuantityDependent','boolean');

			addRow('groupOenParamHeadlines','OenParamHeadlineDto','Description','description');

			addRow('groupOenParamValueList','OenParamValueListDto','IsCustomValueAllowed','boolean');

			addRow('groupOenParamValue','OenParamValueDto','ValueText','description');
			addRow('groupOenParamValue','OenParamValueDto','Description','description');
			addRow('groupOenParamValue','OenParamValueDto','ValueNumber','decimal');

			_.forEach(gids, function (gid) {
				layout.groups.push({'gid': gid});
			});

			var schema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'OenParamListDto'});
			boqMainOenTranslationService.register(schema, gids);

			var service = new platformUIStandardConfigService(layout, schema.properties, boqMainTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, schema.properties);

			return service;
		}
	]);
})();

