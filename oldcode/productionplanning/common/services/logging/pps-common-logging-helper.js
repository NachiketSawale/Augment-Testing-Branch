/**
 * Created by zov on 9/27/2019.
 */
(function () {
    'use strict';
    /*global angular, _, globals*/

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).service('ppsCommonLoggingHelper', ppsCommonLoggingHelper);
    ppsCommonLoggingHelper.$inject = ['basicsLookupdataConfigGenerator', '$http', '$q',
        'platformSchemaService', 'platformTranslationUtilitiesService', 'platformCreateUuid',
        'basicsLookupdataLookupFilterService', 'ppsCommonLoggingValidationExtension', 'ppsCommonLoggingConstant',
        'basicsLookupdataLookupDescriptorService', '$translate', 'platformTranslateService',
        '$injector', 'basicsCommonToolbarExtensionService', 'ppsCommonManualLoggingHelper'];
    function ppsCommonLoggingHelper(basicsLookupdataConfigGenerator, $http, $q,
                                    platformSchemaService, platformTranslationUtilitiesService, platformCreateUuid,
                                    basicsLookupdataLookupFilterService, ppsCommonLoggingValidationExtension, ppsCommonLoggingConstant,
                                    basicsLookupdataLookupDescriptorService, $translate, platformTranslateService,
                                    $injector, basicsCommonToolbarExtensionService, ppsCommonManualLoggingHelper) {

        var loggingNecessityCache = [],
            logConfigCache,
            dto2DbMappingCache,
            logReasonPropName = ppsCommonLoggingConstant.ReasonPropName,
            logRemarkPropName = ppsCommonLoggingConstant.RemarkPropName,
            logModInfoPropName = ppsCommonLoggingConstant.ModificationInfoPropName,
            // logModPropsPropName = ppsCommonLoggingConstant.ModificationPropsPropName,
            // logPropPropName = ppsCommonLoggingConstant.ModifiedPropPropName,
            dataSrvHandlerCache = [],
            module2TranslationSrvCache = {};

        function extendUIConfig(layout, schemaOption, translateService) {
            layout.groups.push({
                gid: 'LoggingGroup',
                attributes: [logModInfoPropName.toLowerCase()]//, logRemarkPropName.toLowerCase()]
            });

            // when showing the reason tree, we use below code, so keep it incase
            // layout.overloads[logReasonPropName.toLowerCase()] = {
            //     grid: {
            //         editor: 'lookup',
            //         editorOptions: {
            //             lookupDirective: 'pps-common-log-reason-lookup',
            //             lookupOptions: {
            //                 filterKey: logReasonFilterKey,
            //                 displayMember: 'DescriptionInfo.Translated'
            //             }
            //         },
            //         formatter: 'lookup',
            //         formatterOptions: {
            //             lookupType: 'PpsLogReason',
            //             displayMember: 'DescriptionInfo.Translated'
            //         }
            //     },
            //     detail: {
            //         type: 'directive',
            //         directive: 'pps-common-log-reason-lookup',
            //         requiredInErrorHandling: true,
            //         options: {
            //             filterKey: logReasonFilterKey,
            //             displayMember: 'DescriptionInfo.Translated'
            //         }
            //     }
            // };
            // layout.overloads[logReasonPropName.toLowerCase()] = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppslogreason', null, {
            //     filterKey: logReasonFilterKey,
            //     customIntegerProperty: 'PPS_LOGREASON_GROUP_FK'
            // });

            layout.overloads[logModInfoPropName.toLowerCase()] = {
                grid: {
                    editor: 'lookup',
                    editorOptions: {
                        lookupDirective: 'pps-common-log-multi-reasons-directive',
                        lookupOptions: {
                            schemaOption: schemaOption,
                            translationSrv: translateService
                        }
                    },
                    formatter: function(row, cell, value, column, item){
                        return getDisplayedUpdateReason(item, translateService);
                    }
                },
                detail: {
                    type: 'directive',
                    directive: 'pps-common-log-multi-reasons-directive',
                    options: {
                        schemaOption: schemaOption,
                        translationSrv: translateService
                    }
                }
            };

            return layout;
        }

        function extendValidationIfNeeded(dataSrv, validationSrv, schemaOption) {
            var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
            if (_.find(loggingNecessityCache, {dtoName: dtoName, needLogging: true})) {
                ppsCommonLoggingValidationExtension.extendValidation(dataSrv, validationSrv, getTranslationService(schemaOption), schemaOption, isLogEnableOnProperty);

                if (dataSrvHandlerCache.indexOf(dataSrv) < 0) {
                    dataSrvHandlerCache.push(dataSrv);
                    dataSrv.getContainerData().mergeItemAfterSuccessfullUpdate = createMergeItemAfterSuccessHandler(dataSrv);
                }
            }
        }

        function createMergeItemAfterSuccessHandler(dataSrv) {
            var data = dataSrv.getContainerData();
            var orgFn = data.mergeItemAfterSuccessfullUpdate;
            return function (oldItem, newItem, handleItem, data) {
                if (oldItem) {
                    ppsCommonLoggingValidationExtension.clearModificationInfo(oldItem);
                    delete oldItem[logReasonPropName];
                    delete oldItem[logRemarkPropName];
                }

                return orgFn.apply(data, arguments); // return original value
            };
        }

        function isLogEnableOnProperty(schemaOption, modPropName, entityType) {
            var logConfig = null;
            var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
            var mapping = _.find(dto2DbMappingCache, {DtoFullName: dtoName}).DtoProp2TblColumn;
            if (mapping[modPropName]) {
                var tableId = mapping[modPropName].TableId;
                var columnId = mapping[modPropName].ColumnId;
	            logConfig = _.find(logConfigCache, {
		            EntityId: tableId,
		            PropertyId: columnId,
		            EntityType: entityType
	            });

	            if (!logConfig && !_.isNil(entityType)) {
		            logConfig = _.find(logConfigCache, {
			            EntityId: tableId,
			            PropertyId: columnId,
			            EntityType: null
		            });
	            }
            }

            return {
                logEnable: !!logConfig,
	            logConfigType: logConfig ? logConfig.LogConfigType : undefined,
                logRequired: logConfig ? logConfig.LogConfigType === 0 : false,
                logReasonGroupId: logConfig ? logConfig.PpsLogReasonGroupFk : null,
                logReasonDescription: logConfig ? logConfig.Description : ''
            };
        }

        function isLogEnableOnPropertyWithValidEntityType(schemaOption, modPropName, entityType) {
            var logConfig = null;
            var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
            var mapping = _.find(dto2DbMappingCache, {DtoFullName: dtoName}).DtoProp2TblColumn;
            if (mapping[modPropName]) {
                var tableId = mapping[modPropName].TableId;
                var columnId = mapping[modPropName].ColumnId;
                logConfig = _.find(logConfigCache, {EntityId: tableId, PropertyId: columnId, EntityType: entityType});
                if (!logConfig && !_.isNil(entityType)) {
                    logConfig = _.find(logConfigCache, {
                        EntityId: tableId,
                        PropertyId: columnId,
                        EntityType: entityType
                    }); // try to find with specific EntityType
                }
            }

            return {
                logEnable: !!logConfig,
                logConfigType: logConfig ? logConfig.LogConfigType : undefined,
                logRequired: logConfig ? logConfig.LogConfigType === 0 : false,
                logReasonGroupId: logConfig ? logConfig.PpsLogReasonGroupFk : null,
                logReasonDescription: logConfig ? logConfig.Description : ''
            };
        }

	    function isPropertyMappedToDbColumn(schemaOption, modPropName) {
		    var logConfig = null;
		    var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
		    var mapping = _.find(dto2DbMappingCache, {DtoFullName: dtoName}).DtoProp2TblColumn;
		    return !!mapping[modPropName];
	    }

        function extendDomainProperties(domainProperties) {
            if (domainProperties) {
                domainProperties[logReasonPropName] = {domain: 'integer'};
                domainProperties[logRemarkPropName] = {domain: 'remark'};
                domainProperties[logModInfoPropName] = {domain: 'lookup'};
            }

            return domainProperties;
        }

        function extendTranslations(words, allUsedModules) {
            words.LoggingGroup = {location: moduleName, identifier: 'loggingGroup', initial: '*Logging Group'};
            words[logReasonPropName] = {location: moduleName, identifier: 'updateReason', initial: '*UpdateReason'};
            words[logRemarkPropName] = {location: moduleName, identifier: 'updateRemark', initial: '*UpdateRemark'};
            words[logModInfoPropName] = {location: moduleName, identifier: 'updateReason', initial: '*UpdateReason'};

            if (allUsedModules.indexOf(moduleName) < 0) {
                allUsedModules.push(moduleName);
            }
        }

        function extendLayoutIfNeeded(layout, schemaOption, translateService) {
            var finalLayout = layout,
                dtoAttrs = platformSchemaService.getSchemaFromCache(schemaOption).properties;
            rememberTranslationService(schemaOption, translateService);
            var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
            var item = _.find(loggingNecessityCache, {dtoName: dtoName});
            if (item && item.needLogging) {

                // extend translation service
                var data = translateService.data;
                extendTranslations(data.words, data.allUsedModules);
                data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
                platformTranslationUtilitiesService.registerModules(data);

                finalLayout = extendUIConfig(_.cloneDeep(layout), schemaOption, translateService);
                dtoAttrs = extendDomainProperties(_.clone(dtoAttrs));
            }

            return {
                layout: finalLayout,
                dtoSchema: dtoAttrs,
                translateService: translateService
            };
        }

        function rememberTranslationService(schemaOption, translateService) {
            if(!module2TranslationSrvCache[schemaOption.moduleSubModule]){
                module2TranslationSrvCache[schemaOption.moduleSubModule] = translateService;
            }
        }

        function getTranslationService(schemaOption) {
            return module2TranslationSrvCache[schemaOption.moduleSubModule];
        }

        function initLoggingNecessity(schemaOptions) {
            var toCheck = [];
            schemaOptions.forEach(function (schemaOption) {
                var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
                if (toCheck.indexOf(dtoName) < 0) {
                    var item = _.find(loggingNecessityCache, {dtoName: dtoName});
                    if (!item) {
                        toCheck.push(dtoName);
                    }
                }
            });

            if (toCheck.length > 0) {
                return $http.post(globals.webApiBaseUrl + 'productionplanning/configuration/logconfig/isneedlogging', {dtonames: toCheck}).then(function (response) {
                    Object.getOwnPropertyNames(response.data).forEach(function (dtoName) {
                        loggingNecessityCache.push({
                            dtoName: dtoName,
                            needLogging: response.data[dtoName]
                        });
                        return 0;
                    });
                });
            }

            return $q.when(0);
        }

        function asyncLoad(url, cacheGetter, cacheSetter) {
            var defer = $q.defer();
            var cache = cacheGetter();
            if (!cache) {
                $http.get(url).then(function (response) {
                    cacheSetter(response.data);
                    defer.resolve(response.data);
                });
            } else {
                defer.resolve(cache);
            }

            return defer.promise;
        }

        function asyncLoadLogConfig() {
            return asyncLoad(
                globals.webApiBaseUrl + 'productionplanning/configuration/logconfig/list',
                function () {
                    return logConfigCache;
                },
                function (value) {
                    logConfigCache = value;
                }
            );
        }

        function asyncLoadDto2DbMapping() {
            return asyncLoad(
                globals.webApiBaseUrl + 'productionplanning/configuration/logconfig/dto2dbmappings',
                function () {
                    return dto2DbMappingCache;
                },
                function (value) {
                    dto2DbMappingCache = value;
                }
            );
        }

        asyncLoadLogConfig();
        var loadMappingPromise = asyncLoadDto2DbMapping();

        function asynCreateColumnId2DtoPropNameMapping(logs, translationSrv) {
            return loadMappingPromise.then(function (mapping) {
                var result = {};
                logs.forEach(function (log) {
                    if (!result[log.PpsEntityFk]) {
                        result[log.PpsEntityFk] = {};
                    }
                    if (result[log.PpsEntityFk][log.ColumnId] === undefined) {
                        result[log.PpsEntityFk][log.ColumnId] = '';
                        var m = _.find(mapping, {PpsEntityFk: log.PpsEntityFk});
                        if (m) {
                            var dtoPropName = _.findKey(m.DtoProp2TblColumn, {ColumnId: log.ColumnId});
                            if (dtoPropName === 'DescriptionInfo.Translated') {
                                dtoPropName = 'DescriptionInfo';
                            }
                            var word = _.get(translationSrv, 'data.words.' + dtoPropName, undefined);
                            if (word) {
                                var id = word.location + '.' + word.identifier;
                                result[log.PpsEntityFk][log.ColumnId] = $translate.instant(id, word.param) !== id ? $translate.instant(id, word.param) : word.initial;
                            }
                        }
                    }
                });

                return result;
            });
        }

        function doTranslateLogColumnName(logs, columnId2DtoPropNameMapping) {
            logs.forEach(function (log) {
                var translation = _.get(columnId2DtoPropNameMapping, log.PpsEntityFk + '.' + log.ColumnId, undefined);
                if (translation !== undefined && translation !== '') {
                    log.ColumnName = translation;
                }
            });
        }

        function translateLogColumnName(logs, translationService, dataService) {
            var promises = [
                asynCreateColumnId2DtoPropNameMapping(logs, translationService),
                platformTranslateService.registerModule(translationService.data.allUsedModules, true)
            ];
            return $q.all(promises).then(function (responses) {
                doTranslateLogColumnName(logs, responses[0]);
                if(dataService && angular.isFunction(dataService.gridRefresh)) {
	                dataService.gridRefresh();
                }
            });
        }

        function getDisplayedUpdateReason(entity, translationSrv) {
            return $injector.invoke(['$translate', 'ppsCommonLoggingConstant', 'basicsLookupdataLookupDescriptorService',
                function ($translate, ppsCommonLoggingConstant, basicsLookupdataLookupDescriptorService) {
                    var txt = [];
                    var props = _.get(entity, ppsCommonLoggingConstant.ModificationInfoPropName + '.' + ppsCommonLoggingConstant.ModificationPropsPropName);
                    if (props) {
                        props.forEach(function (modPropObj) {
                            var reasonFk = modPropObj[ppsCommonLoggingConstant.ReasonPropName];
                            if (reasonFk) {
                                var pName = ppsCommonLoggingConstant.ConvertPropName(modPropObj[ppsCommonLoggingConstant.ModifiedPropPropName]);
                                var translate = translationSrv.getTranslationInformation(pName);
                                var translateId = translate.location + '.' + translate.identifier;
                                var pNameTr = $translate.instant(translateId);
                                if(pNameTr === translateId){
                                    pNameTr = translate.initial;
                                }
                                var reasonTr = basicsLookupdataLookupDescriptorService.getLookupItem('basics.customize.ppslogreason', reasonFk).Description;
                                txt.push(pNameTr + ': ' + reasonTr);
                            }
                        });
                    }

                    return txt.length > 0 ? txt.join(',  ') : $translate.instant('productionplanning.common.phEditUpdateReasons');
                }]);
        }

        function addManualLoggingBtn($scope, ppsEntityId, uiService, dataService, schemaOption, translationService, logSucceedCallback) {
	        basicsCommonToolbarExtensionService.insertBefore($scope,
		        ppsCommonManualLoggingHelper.createLoggingToolBtn(ppsEntityId, uiService, dataService, schemaOption, isPropertyMappedToDbColumn, translationService, logSucceedCallback));
        }

        var helper = {
            extendLayoutIfNeeded: extendLayoutIfNeeded,
            initLoggingNecessity: initLoggingNecessity,
            extendValidationIfNeeded: extendValidationIfNeeded,
            translateLogColumnName: translateLogColumnName,
            getDisplayedUpdateReason: getDisplayedUpdateReason,
			addManualLoggingBtn: addManualLoggingBtn,
            isLogEnableOnPropertyWithValidEntityType: isLogEnableOnPropertyWithValidEntityType, // extend this method, it is referenced by ppsItemDetailersDataService for checking logging.(by zwz on 2022/4/25)
			isPropertyMappedToDbColumn: isPropertyMappedToDbColumn // extend this method, it is referenced by ppsCommonLogSourceFilterService.(by zwz on 2020/8/7)
        };
        Object.defineProperties(helper, {
            'logConfigCache': {
                get: function () {
                    return logConfigCache;
                },
                set: angular.noop
            },
            'dto2DbMappingCache': {
                get: function () {
                    return dto2DbMappingCache;
                },
                set: angular.noop
            }
        });

        return helper;
    }
})();