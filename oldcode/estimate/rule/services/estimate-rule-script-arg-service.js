(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.rule';

	/* jshint -W072 */ // many parameters
	angular.module(moduleName).factory('estimateRuleScriptArgService', ['$http', '$q', '$translate', '$injector', 'basicsEstimateQuantityRelationIconService', 'projectMainService',
		function ($http, $q, $translate, $injector, basicsEstimateQuantityRelationIconService, projectMainService) {
			let cache = {
				get: {},
				post: {}
			};
			let cssClass = {
				str: 'CodeMirror-Tern-completion CodeMirror-Tern-completion-string'
			};

			let scriptId = '';

			return {
				setScriptId:setScriptId,
				createLineItemByRefArgsAsync: getAssemblyCodeArgsAsync,
				setAssemblyByCodeArgsAsync : getAssemblyCodeArgsAsync,
				cloneAssemblyArgsAsync : getAssemblyCodeArgsAsync,
				createAssemblyArgsAsync : getAssemblyCodeArgsAsync,
				setUomByCodeArgsAsync: setUomByCodeArgsAsync,
				createMaterialArgsAsync: createMaterialArgsAsync,
				setQtyRelActByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				setQtyRelBoqByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				setQtyRelCtuByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				setQtyRelAotByCodeArgsAsync: setQtyRelXXXByCodeArgsAsync,
				getCharacteristicArgsAsync: getCharacteristicArgsAsync
			};

			function getProjectId(){
				if(scriptId === 'project.main.script'){
					return projectMainService.getSelected();
				}
				if(scriptId === 'estimate.main.rule.script'){
					return $injector.get('estimateMainService').getSelectedProjectId();
				}
			}
			function setScriptId(value) {
				scriptId = value;
			}

			function doGetArgsAsync(url, options) {
				let deferred = $q.defer();
				let mapFunc = options.map;
				let transferFunc = options.transfer;

				if (!cache.get[url]) {
					cache.get[url] = $http.get(url);
				}

				$q.when(cache.get[url]).then(httpSuccessCallback(deferred, url, transferFunc, mapFunc, cache.get));

				return deferred.promise;
			}

			/* function doPostArgsAsync(url, options) {
                let deferred = $q.defer();
                let mapFunc = options.map;
                let transferFunc = options.transfer;
                let key = url;

                if (options.data) {
                    key += '?args=' + JSON.stringify(options.data);
                }

                if (!cache.post[key]) {
                    cache.post[key] = $http.post(url, options.data);
                }

                $q.when(cache.post[key]).then(httpSuccessCallback(deferred, key, transferFunc, mapFunc, cache.post));

                return deferred.promise;
            } */

			function httpSuccessCallback(deferred, key, transferFunc, mapFunc, cacheCatalog) {
				return function (response) {
					let data = [];

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

			function getAssemblyCodeArgsAsync(type, index) {
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

				let SelectedprojectId = getProjectId();

				if(SelectedprojectId && (scriptId === 'project.main.script' || scriptId === 'estimate.main.rule.script'))
				{
					return doGetArgsAsync(globals.webApiBaseUrl + 'estimate/assemblies/masterfilterlist?projectId=' + SelectedprojectId, {
						map: map,
						transfer: function (response) {
							return response.data;
						}
					});
				}else{
					return doGetArgsAsync(globals.webApiBaseUrl + 'estimate/assemblies/list', {
						map: map,
						transfer: function (response) {
							return response.data;
						}
					});
				}
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

				let SelectedprojectId = getProjectId();

				if(SelectedprojectId && (scriptId === 'project.main.script' || scriptId === 'estimate.main.rule.script'))
				{
					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/material/masterfilterlist?projectId=' + SelectedprojectId, {
						map: map
					});
				}else{
					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/material/lookuplist', {
						map: map
					});
				}
			}

			/* function convertArgsAsync(type, index) {
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
            } */

			function setQtyRelXXXByCodeArgsAsync(type, index) {
				if (index === 0) {
					let items = basicsEstimateQuantityRelationIconService.getItems();
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

			function getCharacteristicArgsAsync(type, index){
				if (index !== 0) {
					return;
				}

				let SelectedprojectId = getProjectId();

				if(SelectedprojectId && (scriptId === 'project.main.script' || scriptId === 'estimate.main.rule.script'))
				{
					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/characteristic/data/list?sectionId=1&mainItemId=' + SelectedprojectId, {
						map: map1,
						transfer: function (response) {
							return response.data;
						}
					});
				}else{
					return doGetArgsAsync(globals.webApiBaseUrl + 'basics/characteristic/characteristic/getcharacteristicbysectionfk?sectionFk=1', {
						map: map2,
						transfer: function (response) {
							return response.data;
						}
					});
				}

				function map1(entity) {
					return {
						text: $translate.instant(entity.CharacteristicEntity.Code) || '',
						displayText: $translate.instant(entity.CharacteristicEntity.Code) || '',
						className: cssClass.str
					};
				}

				function map2(entity) {
					return {
						text: $translate.instant(entity.Code) || '',
						displayText: $translate.instant(entity.Code) || '',
						className: cssClass.str
					};
				}
			}

			/* function createBoqByRefArgsAsync(property) {
                return function (type, index, args) {
                    let groupUrl = globals.webApiBaseUrl + 'boq/wic/group/tree';

                    if (index === 0) {
                        return doGetArgsAsync(groupUrl, {
                            map: map
                        });
                    }

                    let group;

                    if (args.items.length) {
                        let res = cache.get[groupUrl];
                        let token = args.items.shift();

                        if (res && angular.isArray(res.data) && token.type === 'string') {
                            /!*jshint -W061*!/ // eval would be harmful
                            group = _.find(res.data, {Code: global.eval(token.string)});
                        }
                    }

                    if (index === 1 && group) {
                        return doGetArgsAsync(globals.webApiBaseUrl + 'boq/wic/cat/list?wicCatGroupId=' + group.Id, {
                            map: mapBoqHeader
                        });
                    }

                    let header;

                    if (group && args.items.length) {
                        let headerUrl = globals.webApiBaseUrl + 'boq/wic/cat/list?wicCatGroupId=' + group.Id;
                        let headerCache = cache.get[headerUrl];
                        let headerToken = args.items.shift();

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
            } */
		}
	]);

})(angular, window);
