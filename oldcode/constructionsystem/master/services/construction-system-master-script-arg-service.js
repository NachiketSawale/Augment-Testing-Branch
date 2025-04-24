/**
 * Created by wui on 4/18/2017.
 */

(function (angular, global) {
	'use strict';
	/* global globals,_ */

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters
	angular.module(moduleName).factory('constructionSystemMasterScriptArgService', ['$http', '$q', '$translate',
		'constructionSystemMasterTestDataService',
		'constructionSystemMasterHeaderService',
		'constructionSystemMasterAssemblyService',
		'constructionSystemMasterActivityTemplateService',
		'constructionSystemMasterWicService',
		'basicsEstimateQuantityRelationIconService',
		function ($http, $q, $translate,
			constructionSystemMasterTestDataService,
			constructionSystemMasterHeaderService,
			constructionSystemMasterAssemblyService,
			constructionSystemMasterActivityTemplateService,
			constructionSystemMasterWicService,
			basicsEstimateQuantityRelationIconService) {
			var cache = {
				get: {},
				post: {}
			};
			var cssClass = {
				str: 'CodeMirror-Tern-completion CodeMirror-Tern-completion-string'
			};
			var flag = {
				isCosAssemblyLoaded: false,
				isCosActivityTemplateLoaded: false,
				isCosWicLoaded: false
			};
			var kindItems = null;

			constructionSystemMasterAssemblyService.registerListLoadStarted(onCosAssemblyListLoadStarted);
			constructionSystemMasterActivityTemplateService.registerListLoadStarted(onCosActivityTemplateListLoadStarted);
			constructionSystemMasterWicService.registerListLoadStarted(onCosWicListLoadStarted);

			return {
				getContext: function () {
					return constructionSystemMasterTestDataService.getCurrentEntity();
				},
				getPropertyArgsAsync: function (type, index) {
					if (index > 0) {
						return;
					}
					return getPropertyArgsAsync(type, index);
				},
				createLineItemByCodeArgsAsync: createLineItemByCodeArgsAsync,
				createLineItemByRefArgsAsync: createLineItemByRefArgsAsync,
				createPredecessorByIdArgsAsync: createRelationshipByIdArgsAsync,
				createPredecessorByCodeArgsAsync: createRelationshipByCodeArgsAsync,
				createSuccessorByIdArgsAsync: createRelationshipByIdArgsAsync,
				createSuccessorByCodeArgsAsync: createRelationshipByCodeArgsAsync,
				setIsCriticalArgsAsync: setBoolPropertyArgsAsync,
				setUseCalendar: setBoolPropertyArgsAsync,
				createActivityByCodeArgsAsync: createActivityByCodeArgsAsync,
				createActivityByRefArgsAsync: createActivityByRefArgsAsync,
				setUomByCodeArgsAsync: setUomByCodeArgsAsync,
				assignBoQArgsAsync: assignBoQArgsAsync,
				callCSArgsAsync: callCSArgsAsync,
				createMaterialArgsAsync: createMaterialArgsAsync,
				createAssemblyArgsAsync: createLineItemByRefArgsAsync,
				groupByArgsAsync: getPropertyArgsAsync,
				sumArgsAsync: getPropertyArgsAsync,
				maxArgsAsync: getPropertyArgsAsync,
				minArgsAsync: getPropertyArgsAsync,
				averageArgsAsync: getPropertyArgsAsync,
				convertArgsAsync: convertArgsAsync,
				setQtyRelActByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				setQtyRelBoqByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				setQtyRelCtuByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				setQtyRelAotByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				createBoqByCodeArgsAsync: assignBoQArgsAsync,
				createBoqByRefArgsAsync: createBoqByRefArgsAsync('Reference'),
				createBoqByRef2ArgsAsync: createBoqByRefArgsAsync('Reference2'),
				setKeyFigureArgsAsync: getKeyFigureArgsAsync,
				getKeyFigureArgsAsync: getKeyFigureArgsAsync,
				licCostGroupArgsAsync: licCostGroupArgsAsync,
				prjCostGroupArgsAsync: prjCostGroupArgsAsync,
				setLicCostGroupArgsAsync: setLicCostGroupArgsAsync,
				setPrjCostGroupArgsAsync: setPrjCostGroupArgsAsync,
				setLicCostGroup1ByCodeArgsAsync: getLicCostGroupAsync('LICCG1'),
				setLicCostGroup2ByCodeArgsAsync: getLicCostGroupAsync('LICCG2'),
				setLicCostGroup3ByCodeArgsAsync: getLicCostGroupAsync('LICCG3'),
				setLicCostGroup4ByCodeArgsAsync: getLicCostGroupAsync('LICCG4'),
				setLicCostGroup5ByCodeArgsAsync: getLicCostGroupAsync('LICCG5'),
				setPrjCostGroup1ByCodeArgsAsync: getPrjCostGroupAsync('PRJCG1'),
				setPrjCostGroup2ByCodeArgsAsync: getPrjCostGroupAsync('PRJCG2'),
				setPrjCostGroup3ByCodeArgsAsync: getPrjCostGroupAsync('PRJCG3'),
				setPrjCostGroup4ByCodeArgsAsync: getPrjCostGroupAsync('PRJCG4'),
				setPrjCostGroup5ByCodeArgsAsync: getPrjCostGroupAsync('PRJCG5')
			};

			function onCosAssemblyListLoadStarted() {
				flag.isCosAssemblyLoaded = true;
				constructionSystemMasterAssemblyService.unregisterListLoadStarted(onCosAssemblyListLoadStarted);
			}

			function onCosActivityTemplateListLoadStarted() {
				flag.isCosActivityTemplateLoaded = true;
				constructionSystemMasterActivityTemplateService.unregisterListLoadStarted(onCosActivityTemplateListLoadStarted);
			}

			function onCosWicListLoadStarted() {
				flag.isCosWicLoaded = true;
				constructionSystemMasterWicService.unregisterListLoadStarted(onCosWicListLoadStarted);
			}

			function doGetArgsAsync(url, options) {
				var deferred = $q.defer();
				var mapFunc = options.map;
				var transferFunc = options.transfer;

				if (!cache.get[url]) {
					cache.get[url] = $http.get(url);
				}

				$q.when(cache.get[url]).then(httpSuccessCallback(deferred, url, transferFunc, mapFunc, cache.get));

				return deferred.promise;
			}

			function doPostArgsAsync(url, options) {
				var deferred = $q.defer();
				var mapFunc = options.map;
				var transferFunc = options.transfer;
				var key = url;

				if (options.data) {
					key += '?args=' + JSON.stringify(options.data);
				}

				if (!cache.post[key]) {
					cache.post[key] = $http.post(url, options.data);
				}

				$q.when(cache.post[key]).then(httpSuccessCallback(deferred, key, transferFunc, mapFunc, cache.post));

				return deferred.promise;
			}

			function httpSuccessCallback(deferred, key, transferFunc, mapFunc, cacheCatalog) {
				return function (response) {
					var data = [];

					if (cacheCatalog[key] !== response) {
						cacheCatalog[key] = response;
					}

					if (transferFunc) {
						data = transferFunc(response);
					}
					else {
						data = response.data || response;
					}

					if (angular.isArray(data)) {
						deferred.resolve(data.map(mapFunc));
					}
					else {
						deferred.resolve([]);
					}
				};
			}

			function getPropertyArgsAsync() {
				var context = constructionSystemMasterTestDataService.getCurrentEntity();

				function map(entity) {
					return {
						text: entity.PropertyName,
						displayText: entity.PropertyName,
						className: cssClass.str
					};
				}

				if (context && context.ModelFk !== null && context.ModekFk !== undefined) {
					return doPostArgsAsync(globals.webApiBaseUrl + 'model/main/object2property/modelpropertykeys', {
						map: map,
						data: {
							SelectionMode: 'Model',
							ModelId: context.ModelFk
						}
					});
				}
				else {
					return doGetArgsAsync(globals.webApiBaseUrl + 'model/administration/propertykey/listall', {
						map: map
					});
				}
			}

			function createLineItemByCodeArgsAsync(type, index) {
				var header = constructionSystemMasterHeaderService.getSelected();

				if (!header || index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.CommentText
					};
				}

				if (flag.isCosAssemblyLoaded) {
					return constructionSystemMasterAssemblyService.getList().map(map);
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'constructionsystem/master/assembly/list?mainItemId=' + header.Id, {
					map: map,
					transfer: function (response) {
						return response.data.dtos;
					}
				});
			}

			function createLineItemByRefArgsAsync(type, index) {
				if (index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.DescriptionInfo.Translated
					};
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'estimate/assemblies/list', {
					map: map
				});
			}

			function createRelationshipByIdArgsAsync(type, index) {
				return createRelationshipArgsAsync(type, index, false);
			}
			function createRelationshipByCodeArgsAsync(type, index) {
				return createRelationshipArgsAsync(type, index, true);
			}
			function createRelationshipArgsAsync(type, index, isCode) {
				function activityMap(entity) {
					var value = isCode ? entity.Code : entity.Id;
					var codeText = value;
					if(isCode && _.includes(codeText,'\\')){
						codeText = codeText.replace('\\','\\\\');
					}
					return {
						text: $translate.instant(codeText) || '',
						displayText: $translate.instant(value) || '',
						className: cssClass.str,
						tooltip: (isCode ? entity.Id : entity.Code) + ' - ' + entity.Description
					};
				}
				if (index === 0) {
					getRelationKindList();

					var context = constructionSystemMasterTestDataService.getCurrentEntity();
					if(context.ProjectFk) {
						return doGetArgsAsync(globals.webApiBaseUrl + 'scheduling/main/activity/project?projectId=' + context.ProjectFk, {
							map: activityMap,
							transfer: function (response) {
								var result = response.data;
								if (context.PsdScheduleFk) {
									result = _.filter(result, {'ScheduleFk': context.PsdScheduleFk});
								}
								return result;
							}
						});
					}
				}
				if (index === 1) {
					var kindList = getRelationKindList();
					if(kindList.$$state && kindList.$$state.value && kindList.$$state.value.data) {
						var kinds = _.map(kindList.$$state.value.data, function (item) {
							return {Id: item.Id, Code: item.Id, tooltip: item.Description};
						});
						return $q.when(kinds.map(map));
					}
				}

				function map(entity) {
					return {
						text: $translate.instant(entity.Code) || '',
						displayText: $translate.instant(entity.Code) || '',
						className: cssClass.str,
						tooltip: entity.tooltip
					};
				}
			}

			function getRelationKindList(){
				var defer = $q.defer();
				if(_.isNil(kindItems)) {
					return $http.get(globals.webApiBaseUrl + 'scheduling/lookup/relationkinds').then(function(data){
						kindItems = data.data;
						defer.resolve({data: kindItems});
					});
				}
				else {
					defer.resolve({data: kindItems});
				}
				return defer.promise;
			}

			function setBoolPropertyArgsAsync(type, index) {
				if (index === 0) {
					var boolProperty = [{text: 'true'}, {text: 'false'}];
					return $q.when(boolProperty.map(map));
				}

				function map(entity) {
					return {
						text: entity.text,
						displayText: entity.text,
						className: cssClass.str
					};
				}
			}

			function createActivityByCodeArgsAsync(type, index) {
				var header = constructionSystemMasterHeaderService.getSelected();

				if (!header || index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.CommentText
					};
				}

				if (flag.isCosActivityTemplateLoaded) {
					return constructionSystemMasterActivityTemplateService.getList().map(map);
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'constructionsystem/master/activitytemplate/list?mainItemId=' + header.Id, {
					map: map,
					transfer: function (response) {
						return response.data.dtos;
					}
				});
			}

			function createActivityByRefArgsAsync(type, index) {
				if (index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.DescriptionInfo.Translated
					};
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'scheduling/template/activitytemplate/listall', {
					map: map
				});
			}

			function setUomByCodeArgsAsync(type, index) {
				if (index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.UnitInfo.Translated,
						displayText: entity.UnitInfo.Translated,
						className: cssClass.str
					};
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'basics/unit/list', {
					map: map
				});
			}

			function assignBoQArgsAsync(type, index) {
				var header = constructionSystemMasterHeaderService.getSelected();

				if (!header || index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.CommentText
					};
				}

				if (flag.isCosWicLoaded) {
					return constructionSystemMasterWicService.getList().map(map);
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'constructionsystem/master/wic/list?mainItemId=' + header.Id, {
					map: map,
					transfer: function (response) {
						return response.data.dtos;
					}
				});
			}

			function callCSArgsAsync(type, index) {
				if (index > 0) {
					return;
				}

				return constructionSystemMasterHeaderService.getList().map(function (entity) {
					return {
						text: entity.Code,
						displayText: entity.Code
					};
				});
			}

			function createMaterialArgsAsync(type, index) {
				if (index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.DescriptionInfo1.Translated + ' ' + entity.DescriptionInfo2.Translated
					};
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'basics/material/lookuplist', {
					map: map
				});
			}

			function convertArgsAsync(type, index) {
				if (index === 1 || index === 2) {
					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/unit/list', {
						map: map
					});
				}

				function map(entity) {
					return {
						text: entity.UnitInfo.Translated,
						displayText: entity.UnitInfo.Translated,
						className: cssClass.str
					};
				}
			}

			function setQtyRelXXXByCodeArgsAsync(type, index) {
				if (index === 0) {
					var items = basicsEstimateQuantityRelationIconService.getItems();
					return $q.when(items.map(map));
				}

				function map(entity) {
					return {
						text: $translate.instant(entity.text) || '',
						displayText: $translate.instant(entity.text) || '',
						className: cssClass.str
					};
				}
			}

			function createBoqByRefArgsAsync(property) {
				return function (type, index, args) {
					var groupUrl = globals.webApiBaseUrl + 'boq/wic/group/tree';

					if (index === 0) {
						return doGetArgsAsync(groupUrl, {
							map: map
						});
					}

					var group;

					if (args.items.length) {
						var res = cache.get[groupUrl];
						var token = args.items.shift();

						if (res && angular.isArray(res.data) && token.type === 'string') {
							/* jshint -W061 */ // eval would be harmful
							group = _.find(res.data, {Code: global.eval(token.string)});
						}
					}

					if (index === 1 && group) {
						return doGetArgsAsync(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + group.Id, {
							map: mapBoqHeader
						});
					}

					var header;

					if (group && args.items.length) {
						var headerUrl = globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + group.Id;
						var headerCache = cache.get[headerUrl];
						var headerToken = args.items.shift();

						if (headerCache && angular.isArray(headerCache.data) && headerToken.type === 'string') {
							header = _.find(headerCache.data, {BoqRootItem: {Reference: global.eval(headerToken.string)}});
						}
					}

					if (index === 2 && header) {
						return doGetArgsAsync(globals.webApiBaseUrl + 'boq/main/simpleBoqItems?headerId=' + header.BoqHeader.Id, {
							map: mapBoqItem
						});
					}

					function map(entity) {
						return {
							text: entity.Code,
							displayText: entity.Code,
							className: cssClass.str
						};
					}

					function mapBoqHeader(entity) {
						return {
							text: entity.BoqRootItem.Reference,
							displayText: entity.BoqRootItem.Reference,
							className: cssClass.str
						};
					}

					function mapBoqItem(entity) {
						return {
							text: entity[property],
							displayText: entity[property],
							className: cssClass.str
						};
					}
				};
			}

			function getKeyFigureArgsAsync(type, index) {
				if (index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.displayValue,
						displayText: entity.displayValue,
						className: cssClass.str,
						tooltip: entity.displayValue
					};
				}

				return doPostArgsAsync(globals.webApiBaseUrl + 'basics/lookupData/getData', {
					data: {
						CustomIntegerProperty: null,
						displayProperty: 'Code',
						lookupModuleQualifier: 'prj.common.keyfigure',
						valueProperty: 'Id'
					},
					map: map,
					transfer: function (response) {
						return response.data.items;
					}
				});
			}

			function licCostGroupArgsAsync(type, index) {
				if (index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.DescriptionInfo.Translated
					};
				}

				return doGetArgsAsync(globals.webApiBaseUrl + 'basics/costgroupcat/licList', {
					map: map
				});
			}

			function prjCostGroupArgsAsync() {
				// eslint-disable-next-line no-undef
				if (index > 0) {
					return;
				}

				function map(entity) {
					return {
						text: entity.Code,
						displayText: entity.Code,
						className: cssClass.str,
						tooltip: entity.DescriptionInfo.Translated
					};
				}

				var context = constructionSystemMasterTestDataService.getCurrentEntity();

				return doGetArgsAsync(globals.webApiBaseUrl + 'basics/costgroupcat/prjList?projectId=' + context.ProjectFk, {
					map: map
				});
			}

			function mapCostGroup(entity) {
				return {
					text: entity.Code,
					displayText: entity.Code,
					className: cssClass.str,
					tooltip: entity.DescriptionInfo.Translated
				};
			}

			function setLicCostGroupArgsAsync(type, index, args) {
				if (index > 1) {
					return;
				}

				if (index === 0) {
					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/costgroupcat/licList', {
						map: mapCostGroup
					});
				}

				if (index === 1) {
					var catCode, token = args.items[0];

					if (token.type === 'string') {
						/* jshint -W061 */ // eval would be harmful
						catCode = global.eval(token.string);
					}

					return getLicCostGroupAsync(catCode)();
				}
			}

			function setPrjCostGroupArgsAsync(type, index, args) {
				if (index > 1) {
					return;
				}

				var context = constructionSystemMasterTestDataService.getCurrentEntity();

				if(index === 0){
					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/costgroupcat/prjList?projectId=' + context.ProjectFk, {
						map: mapCostGroup
					});
				}

				if(index === 1){
					var catCode, token = args.items[0];

					if (token.type === 'string') {
						/* jshint -W061 */ // eval would be harmful
						catCode = global.eval(token.string);
					}

					return getPrjCostGroupAsync(catCode)();
				}
			}

			function getLicCostGroupAsync(catCode) {
				return function () {
					if (!catCode) {
						return;
					}

					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/CostGroups/costgroup/licList?catCode=' + catCode, {
						map: mapCostGroup
					});
				};
			}

			function getPrjCostGroupAsync(catCode) {
				return function () {
					if (!catCode) {
						return;
					}

					var context = constructionSystemMasterTestDataService.getCurrentEntity();

					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/CostGroups/costgroup/prjList?catCode=' + catCode + '&projectFk=' + context.ProjectFk, {
						map: mapCostGroup
					});
				};
			}
		}
	]);

})(angular, window);