/**
 * Created by zov on 4/1/2020.
 */
(function () {
	'use strict';
	/* global angular, _, globals */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonLoggingUpdateReasonsConfigService', [
		'$translate',
		'ppsCommonLoggingConstant',
		'basicsLookupdataConfigGenerator',
		'ppsCommonLoggingHelper',
		'basicsLookupdataLookupFilterService',
		'platformCreateUuid',
		function ($translate,
			ppsCommonLoggingConstant,
			basicsLookupdataConfigGenerator,
			ppsCommonLoggingHelper,
			basicsLookupdataLookupFilterService,
			platformCreateUuid) {
			var logReasonPropName = ppsCommonLoggingConstant.ReasonPropName,
				logRemarkPropName = ppsCommonLoggingConstant.RemarkPropName,
				logModifiedPropName = ppsCommonLoggingConstant.ModifiedPropPropName,
				logRequiredPropName = ppsCommonLoggingConstant.LogRequiredPropName,
				logReasonGroupPropName = ppsCommonLoggingConstant.LogReasonGroupPropName,
				logReasonDescription = ppsCommonLoggingConstant.LogReasonDescription;

			var dto2DbMappingCache = ppsCommonLoggingHelper.dto2DbMappingCache,
				logConfigCache = ppsCommonLoggingHelper.logConfigCache;

			function createReasonFilter(entity, propObj, schemaOption) {
				return {
					key: 'pps-common-log-reason-filter-' + platformCreateUuid(),
					fn: function (lookupItem) {
						if (dto2DbMappingCache && logConfigCache) { // only do filter after mapping loaded
							return doFilterLogReasons(lookupItem, [propObj], schemaOption, entity);
						}
						return true;
					}
				};
			}

			function doFilterLogReasons(lookupItem, modifiedProps, schemaOption, entity) {
				var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
				var mapper = _.find(dto2DbMappingCache, {DtoFullName: dtoName});
				if (!mapper) {
					throw 'there is no dto mapping for ' + dtoName;
				}

				// find reason groups according to modified properties
				var reasonGroups = [];
				modifiedProps.forEach(function (propObj) {
					var propName = propObj[ppsCommonLoggingConstant.ModifiedPropPropName];
					var dbColumnInfo = mapper.DtoProp2TblColumn[propName];
					var logCfg = _.find(logConfigCache, { // try to find log config without entity type
						EntityId: dbColumnInfo.TableId,
						PropertyId: dbColumnInfo.ColumnId,
					});
					if (!logCfg) {
						var entityType = null;
						if (_.isFunction(entity.getType)) {
							entityType = entity.getType(propName);
						} else if(schemaOption.typeName === 'EngTask2ClerkDto' || schemaOption.typeName === 'PPSItem2ClerkDto'){
							reasonGroups.push(-propObj.LogReasonGroupId); // Hack: for supporting dynamic clerk slot field on PU/EngTask container
						} else if (!_.isUndefined(entity.EventTypeFk)) {
							entityType = entity.EventTypeFk;
						}
						logCfg = _.find(logConfigCache, { // try to find log config with entity type
							EntityId: dbColumnInfo.TableId,
							PropertyId: dbColumnInfo.ColumnId,
							EntityType: entityType
						});
					}

					if (logCfg) {
						var reasonGrpId = logCfg.PpsLogReasonGroupFk;
						if (reasonGrpId && reasonGroups.indexOf(reasonGrpId) < 0) {
							reasonGroups.push(reasonGrpId * (-1)); // because in 'pps-common-log-reason-lookup', PpsLogReasonGroupFk is negative value
						}
					}
				});

				// when showing the reason tree, we use below code, so keep it incase
				// if (reasonGroups.length === 0) {
				//     return true;
				// } else {
				//     return (reasonGroups.indexOf(lookupItem.ID) > -1) || // lookupItem is log reason group
				//         (reasonGroups.indexOf(lookupItem.PpsLogReasonGroupFk) > -1); // lookupItem is log reason belong to specific group
				// }

				if (reasonGroups.length > 0) {
					return reasonGroups.indexOf(lookupItem.PpsLogreasonGroupFk * (-1)) > -1;
				} else { // there is no specified reason group
					return true;
				}
			}

			function createGroup(description, propName, translationSrv, sortOrder) {
				var translate = translationSrv.getTranslationInformation(propName);
				var headerStr = $translate.instant(translate.location + '.' + translate.identifier) + ' - ' + description;
				return {
					gid: propName,
					header: headerStr,// translate.initial + ' - ' + description,
					// header$tr$: translate.location + '.' + translate.identifier,
					sortOrder: sortOrder,
					isOpen: true,
					visible: true
				};
			}

			function getTranslateId(translationSrv, propName) {
				var translate = translationSrv.getTranslationInformation(propName);
				return translate.location + '.' + translate.identifier;
			}

			function createFormConfig($scope, entity, modifiedProperties, schemaOption, translationSrv) {
				if (!Array.isArray(modifiedProperties)) {
					throw 'modifiedProperties should be an array!';
				}

				var filters = [];
				var config = {
					fid: 'pps.commmon.updatereasons',
					showGrouping: true,
					groups: [],
					rows: []
				};

				var groupIdx = 0;
				modifiedProperties.forEach(function (modPropObj) {
					var propName = ppsCommonLoggingConstant.ConvertPropName(modPropObj[logModifiedPropName]);
					config.groups.push(createGroup(modPropObj[logReasonDescription], propName, translationSrv, ++groupIdx));
					config.rows = config.rows.concat([
						_.merge({
							gid: propName,
							rid: propName + '.' + logReasonPropName,
							model: propName + '.' + logReasonPropName,
							label: translationSrv.getTranslationInformation(logReasonPropName).initial,
							label$tr$: getTranslateId(translationSrv, logReasonPropName),
							required: modPropObj[logRequiredPropName] && modPropObj[logReasonGroupPropName],
							visible: !!modPropObj[logReasonGroupPropName],
							sortOrder: 1
						}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.ppslogreason', null, null, false, {
							filterKey: (function () {
								var filter = createReasonFilter(entity, modPropObj, schemaOption);
								filters.push(filter);
								return filter.key;
							})(),
							customIntegerProperty: 'PPS_LOGREASON_GROUP_FK'
						})),
						{
							gid: propName,
							rid: propName + '.' + logRemarkPropName,
							model: propName + '.' + logRemarkPropName,
							label: translationSrv.getTranslationInformation(logRemarkPropName).initial,
							label$tr$: getTranslateId(translationSrv, logRemarkPropName),
							type: 'remark',
							sortOrder: 2,
							required: modPropObj[logRequiredPropName] && !modPropObj[logReasonGroupPropName]
						}
					]);
				});

				basicsLookupdataLookupFilterService.registerFilter(filters);
				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});

				return config;
			}

			function setUpdateInfo(result, propName, setReasonFn, setRemarkFn) {
				var pName = ppsCommonLoggingConstant.ConvertPropName(propName);
				if (setReasonFn && result[pName]) {
					setReasonFn(result[pName][logReasonPropName]);
				}
				if (setRemarkFn && result[pName]) {
					setRemarkFn(result[pName][logRemarkPropName]);
				}
			}

			function setUpdateInfoForCompatibleCols(result, compatibleCols, setReasonFn, setRemarkFn) {
				var propName = compatibleCols.filter(function (p) {
					return p in result && (!_.isNil(result[p][logReasonPropName]) || !_.isNil(result[p][logRemarkPropName]));
				});

				if (propName.length > 0) {
					setUpdateInfo(result, propName[0], setReasonFn, setRemarkFn);
				}
			}

			return {
				createFormConfig: createFormConfig,
				setUpdateInfo: setUpdateInfo,
				setUpdateInfoForCompatibleCols: setUpdateInfoForCompatibleCols
			};
		}
	]);
})();
