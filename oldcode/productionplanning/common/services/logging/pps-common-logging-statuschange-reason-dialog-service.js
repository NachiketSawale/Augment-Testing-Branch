(function () {
	'use strict';
	/* global  _ */

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonLoggingStatusChangeReasonsDialogService', [
		'$compile',
		'$translate',
		'ppsCommonLoggingConstant',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'ppsCommonLoggingHelper',
		'platformCreateUuid',
		'platformDialogService',
		'$q',
		'paginationService',
		'basicsLookupdataLookupFilterService',
		function ($compile,
			$translate,
			ppsCommonLoggingConstant,
			platformTranslateService,
			basicsLookupdataConfigGenerator,
			ppsCommonLoggingHelper,
			platformCreateUuid,
			platformDialogService,
			$q,
			paginationService,
			basicsLookupdataLookupFilterService) {

			let logReasonPropName = ppsCommonLoggingConstant.ReasonPropName,
				logRemarkPropName = ppsCommonLoggingConstant.RemarkPropName,
				logCustomGroupName = ppsCommonLoggingConstant.CustomGroupName,
				logRequiredPropName = ppsCommonLoggingConstant.LogRequiredPropName,
				logReasonGroupPropName = ppsCommonLoggingConstant.LogReasonGroupPropName;

			let dto2DbMappingCache = ppsCommonLoggingHelper.dto2DbMappingCache,
				logConfigCache = ppsCommonLoggingHelper.logConfigCache;

			var self = this;
			let usedDialogConfig = null;

			self.initController = function ($scope, params) {
				// for pagination problem.
				if(_.some(params.entities, function (ent) {
					return !!ent.formContainerOptions;
				})) {
					return;
				}
				$scope.$on('$destroy', () => {
					usedDialogConfig = null;
					// _.forEach(params.entities, function (dataItem) {
					// 	delete dataItem.formContainerOptions;
					// });
				});

				let entitiesNotSilent = _.filter(params.entities, function (ent) {
					return !!ent.logCfg && !ent.isSilent;
				});

				var entitiesWithConfig = createFormConfig($scope, entitiesNotSilent, params.schemaOption, params.translationSrv);
				entitiesWithConfig.forEach(function (ent) {
					platformTranslateService.translateFormConfig(ent.formContainerOptions.formOptions);
				});
				$scope.dialog.modalOptions.value = entitiesNotSilent;
			};

			self.getDialogConfig = function() {
				return usedDialogConfig;
			};

			self.setDialogConfig = function(dialogConfig) {
				usedDialogConfig = dialogConfig;
			};

			self.showDialog = function (options, dataItems, schemaOption, translationSrv){
				var defer = $q.defer();
				var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
				var mapper = _.find(dto2DbMappingCache, {DtoFullName: dtoName});
				if (!mapper) {
					throw 'there is no dto mapping for ' + dtoName;
				}
				var dbColumnInfo = mapper.DtoProp2TblColumn[options.statusField];

				let entities = dataItems ||
					[{EntityId: options.entity.Id,
						EntityTypeName: options.statusName,
						FromStatusId: options.fromStatusId,
						Remark: options.Remark,
						StatusField: options.statusField,
						ToStatusId: options.toStatusId,
						projectId: options.entity.ProjectFk,
						CustomGroupName: options.entity.Code}];
				if(entities){
					_.forEach(entities, function (entity) {
						let origin = null;
						if(options.dataService && _.isFunction(options.dataService.getItemById)){
							origin = options.dataService.getItemById(entity.EntityId);
						}else{
							origin = options.mainService.getItemById(entity.EntityId);
						}
						let entityType = null;
						if (_.isFunction(origin.getType)) {
							entityType = origin.getType(options.statusField);
						} else if (!_.isUndefined(origin.EventTypeFk)) {
							entityType = origin.EventTypeFk;
						}
						entity.EntityType = entityType;
						entity.logCfg = _.find(logConfigCache, { // try to find log config without entity type
							EntityId: dbColumnInfo.TableId,
							PropertyId: dbColumnInfo.ColumnId,
							EntityType: entityType || null
						}) || _.find(logConfigCache, { // try to find log config without entity type if no proper config found
							EntityId: dbColumnInfo.TableId,
							PropertyId: dbColumnInfo.ColumnId,
							EntityType: null
						});
						if(!entity.logCfg)
							return;
						entity.isSilent = entity.logCfg.LogConfigType === 2;
						if(entity.isSilent){
							entity.HookExtensionOptions = {
								ExtensionKey: entity.logCfg.PpsLogReasonGroupFk
							};
						}
						entity[logReasonGroupPropName] = entity.logCfg.PpsLogReasonGroupFk;
						entity[logRequiredPropName] = entity.logCfg.LogConfigType === 0; // 1 for optional, 0 for required
						entity.CustomGroupName = entity.CustomGroupName || options.mainService.getItemById(entity.EntityId).Code;
					});
				}

				let logCfgs = _.filter(_.map(entities, 'logCfg'), function (logCfg) {
					return !!logCfg;
				});
				if(logCfgs.length === 0){
					return $q.when(true);
				}

				// all log configs are silent
				if(_.filter(logCfgs, function (logCfg) {
					return logCfg.LogConfigType === 2;
				}).length === logCfgs.length){ // silent
					if(entities.length > 1){
						_.forEach(entities, function (dataItem) {
							if(dataItem.logCfg){
								dataItem.HookExtensionOptions = {
									ExtensionKey: dataItem.logCfg.PpsLogReasonGroupFk
								};
							}
						});
						defer.resolve(entities);
					}else{
						if(entities[0].logCfg){
							options.HookExtensionOptions = {
								ExtensionKey: entities[0].logCfg.PpsLogReasonGroupFk
							};
						}
						defer.resolve(options.HookExtensionOptions);
					}

					return defer.promise;
				}

				platformDialogService.showDialog(
					{
						width: '600px',
						resizeable: true,
						headerTextKey: 'productionplanning.common.editUpdateReasons',
						bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.common/partials/pps-common-form-detail-for-dialog-service.html',
						backdrop: false,
						customButtons: [{
							id: 'applyAll',
							caption$tr$: 'productionplanning.common.logLayout.applyAll',
							caption: '*Apply All',
							fn: function (event, info) {
								let currentPage = paginationService.getCurrentPage(paginationService.getLastInstanceId());
								let currentItem = info.value[currentPage-1][logReasonPropName] ? info.value[currentPage-1] : _.find(info.value, function (item) {
									return !!item[logReasonPropName] || !!item[logRemarkPropName];
								});
								_.forEach(info.value, function (item) {
									item[logReasonPropName] = currentItem[logReasonPropName];
									item[logRemarkPropName] = currentItem[logRemarkPropName];
								});
							}
						}],
						buttons: [{
							id: 'ok',
							disabled: function (info) {
								return !!_.some(info.value, function (entity) {
									if(entity[logRequiredPropName]){
										if(entity[logReasonGroupPropName]){
											return !entity[logReasonPropName];
										}
										return !entity[logRemarkPropName];
									}
									return false;
								});
							}
						},{
							id: 'no',
						}],
						showCloseButton: false,
						dataItem: {
							entities: entities,
							mainService: options.mainService,
							schemaOption: schemaOption,
							translationSrv: translationSrv,
						}
					}
				).then(function (result) {
					if(result.no){
						defer.resolve();
					}
					if(result.ok){
						if(entities.length > 1){
							_.forEach(entities, function (dataItem) {
								let itemResult = _.find(result.value, entity => entity.EntityId === dataItem.EntityId);
								if(itemResult){
									dataItem.HookExtensionOptions = {
										ExtensionKey: itemResult[logReasonPropName],
										ExtensionString: itemResult[logRemarkPropName]
									};
								}
							});
							defer.resolve(entities);
						}
						else{// Only one entity inside results.
							options.HookExtensionOptions = {
								ExtensionKey: result.value[0][logReasonPropName],
								ExtensionString: result.value[0][logRemarkPropName]
							};
							defer.resolve(options.HookExtensionOptions);
						}
					}
				});
				return defer.promise;
			};

			function createFormConfig($scope, entities, schemaOption, translationSrv) {
				if (!Array.isArray(entities)) {
					throw 'modifiedEntities should be an array!';
				}

				let filters = [];

				let groupIdx = 0;
				entities.forEach(function (entity) {
					let config = {
						fid: 'pps.commmon.updatereasons',
						showGrouping: true,
						groups: [],
						rows: []
					};
					let propName = entity.StatusField;
					let groupName = entity[logCustomGroupName] + entity.EntityId;
					config.groups.push(createGroup(groupName, propName, translationSrv, ++groupIdx, entity[logCustomGroupName]));
					config.rows = config.rows.concat([
						_.merge({
							gid: groupName,
							rid: logReasonPropName,
							model: logReasonPropName,
							label: $translate.instant(getTranslateId(translationSrv, logReasonPropName)),
							label$tr$: getTranslateId(translationSrv, logReasonPropName),
							required: entity[logRequiredPropName] && entity[logReasonGroupPropName],
							visible: !!entity[logReasonGroupPropName],
							sortOrder: 1
						}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.ppslogreason', null, null, false, {
							filterKey: (function () {
								let filter = {
									key: 'pps-common-log-reason-filter-' + platformCreateUuid(),
									fn: function (lookupItem) {
										if (dto2DbMappingCache && logConfigCache) { // only do filter after mapping loaded
											return lookupItem.PpsLogreasonGroupFk === entity[logReasonGroupPropName];
										}
										return true;
									}
								};
								filters.push(filter);
								return filter.key;
							})(),
							customIntegerProperty: 'PPS_LOGREASON_GROUP_FK'
						})),
						{
							gid: groupName,
							rid: logRemarkPropName,
							model: logRemarkPropName,
							label: $translate.instant(getTranslateId(translationSrv, logRemarkPropName)),
							label$tr$: getTranslateId(translationSrv, logRemarkPropName),
							type: 'remark',
							sortOrder: 2,
							required: entity[logRequiredPropName] && !entity[logReasonGroupPropName]
						}
					]);
					entity.formContainerOptions = {
						formOptions: {
							configure:config
						}
					};
				});

				basicsLookupdataLookupFilterService.registerFilter(filters);
				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});

				return entities;
			}

			function createGroup(groupName, propName, translationSrv, sortOrder, customGroupName) {
				var translate = translationSrv.getTranslationInformation(propName);
				var headerStr = $translate.instant(translate.location + '.' + translate.identifier) + ' - ' + customGroupName;
				return {
					gid: groupName||propName,
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
		}
	]);
})();
