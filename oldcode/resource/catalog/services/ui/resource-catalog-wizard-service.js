/**
 * Created by nitsche on 2019-06-21
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name scheduling.main.services:schedulingMainSidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all scheduling wizards
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('resource.catalog').factory('resourceCatalogWizardService',[
		'_','$http', '$translate', '$q', '$injector', 'platformModalFormConfigService',
		'platformTranslateService', 'platformContextService', 'platformLanguageService',
		'platformModalService', 'resourceCatalogDataService','resourceCatalogTranslationService',
		'platformRuntimeDataService',

		function (
			_, $http, $translate, $q, $injector, platformModalFormConfigService,
			platformTranslateService, platformContextService, platformLanguageService,
			platformModalService, resourceCatalogDataService, resourceCatalogTranslationService,
			platformRuntimeDataService
		) {

			var service = {};
			let defaultMappings = [];
			let defaultSeperator = '.';

			var getUiColumnName = function getUiColumnName(dTOPropertyName) {
				var transInfo = resourceCatalogTranslationService.getTranslationInformation(dTOPropertyName);
				return $translate.instant(transInfo.location + '.' + transInfo.identifier);
			};
			service.asyncLoadDefaultMappings = function asyncLoadDefaultMappings() {
				if(!_.some(defaultMappings)){
					return $http.post(globals.webApiBaseUrl + 'resource/catalog/import/getdefaultmappings').then(function (response) {
						var culture = platformContextService.culture();
						var cultureInfo = platformLanguageService.getLanguageInfo(culture);
						defaultSeperator = cultureInfo.numeric.decimal;
						defaultMappings = response.data;
						let userDefinedMappingName = $translate.instant('resource.catalog.import.userDefinedMappingName');
						defaultMappings.push({Name: userDefinedMappingName, Id: 0, DecimalSeperator: defaultSeperator});
					});
				}
				else {
					return $q.resolve();
				}
			};

			let showImportStatus = function (length,CatalogId) {
				var resourceCatalogDataService = $injector.get('resourceCatalogDataService');
				var importMessage = $translate.instant('resource.catalog.import.successfullyImported').replace('{0}',length).replace('{1}',_.filter(resourceCatalogDataService.getList(),function (catalog) {
					return catalog.Id === CatalogId;
				})[0].Code);
				platformModalService.showMsgBox(importMessage,'resource.catalog.import.importEquipmentCatalog', 'info');
			};
			let sendImportRequest = function sendImportRequest(
				blobs,
				catalog,
				decimalSeperator,
				defaultMappingId,
				defaultMapping
			) {
				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + 'resource/catalog/import/equipmentcatalog',
					headers: {'Content-Type': undefined},
					transformRequest: function (data) {
						var fd = new FormData();
						var i = 0;
						fd.append('catalog', angular.toJson(data.catalog));
						fd.append('decimalSeperator', angular.toJson(data.decimalSeperator));
						fd.append('defaulMappingId', angular.toJson(data.defaultMappingId));
						fd.append('name', angular.toJson(data.name));
						_.forEach(data.blobs, function (blob) {
							if(blob.type === 'ImportData'){
								fd.append(blob.type + i, blob.blob, blob.name);
								i++;
							}
							else if(blob.type === 'MappingData' && !defaultMapping){
								fd.append(blob.type, blob.blob, blob.name);
							}
						});
						return fd;
					},
					data: {
						blobs: blobs,
						catalog: catalog,
						decimalSeperator: decimalSeperator,
						defaultMappingId : defaultMappingId
					}
				});
			};

			let sendCheckOnAbsentUnitRequest = function sendCheckOnAbsentUnitRequest(blobs, defaultMapping) {
				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + 'resource/catalog/import/checkOnAbsentUnits',
					headers: {'Content-Type': undefined},
					transformRequest: function (data) {
						var fd = new FormData();
						var i = 0;
						_.forEach(data.blobs, function (blob) {
							if(blob.type === 'ImportData'){
								fd.append(blob.type + i, blob.blob, blob.name);
								i++;
							}
							else if(blob.type === 'MappingData' && !defaultMapping){
								fd.append(blob.type, blob.blob, blob.name);
							}
						});
						return fd;
					},
					data: {
						blobs: blobs
					}
				});
			};

			let sendImportUnitRequest = function sendImportUnitRequest(units) {
				return $http.post(globals.webApiBaseUrl + 'resource/catalog/import/importAbsentUom', units);
			};

			service.importEquipmentCatalog = function importEquipmentCatalog() {

				var entity = {
					DecimalSeperator: defaultSeperator,
					CatalogId: null,
					DefaultMappingId: 0,
					ImportFiles: [],
					CustomMappingFile: null,
					Settings:{
						CheckOnAbsentUnits: false
					}
				};

				let absentUnitEntity = {
					missingUnits: [{
						Id: 0,
						Unit: 'test',
						RelatedUnit: null,
						Factor: 1,
						ImportTo: 1
					}]
				};

				var fileFilter = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|.*csv|application/vnd.ms-excel';
				var mappingFileFilter = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|.*csv|application/vnd.ms-excel';

				var handleOkFileSelect = function handleOK(fileData) {
					var blobPromises = [];
					_.forEach(fileData.data.ImportFiles, function (file) {
						blobPromises.push(fetch(file.data).then(function (res) {
							return res.blob().then(function (blob) {
								return {
									blob: blob,
									name: file.name,
									type: 'ImportData'
								};
							});
						}));
					});
					if(fileData.data.CustomMappingFile && fileData.data.CustomMappingFile.data && fileData.data.CustomMappingFile.data !== ''){
						blobPromises.push(fetch(fileData.data.CustomMappingFile.data).then(function (res) {
							return res.blob().then(function (blob) {
								return {
									blob: blob,
									name: fileData.data.CustomMappingFile.name,
									type: 'MappingData'
								};
							});
						}));
					}
					$q.all(blobPromises).then(function (blobs) {
						if (fileData.data.Settings.CheckOnAbsentUnits){
							sendCheckOnAbsentUnitRequest(blobs,fileData.data.Settings.UseDefaultMapping).then(
								function (success) {
									var missingUnits = _.filter(success.data,function(unitInfo){return unitInfo.AbsentOnBoth;});

									var i = 0;
									absentUnitEntity = {
										missingUnits: _.map(missingUnits,function (unit) {
											i++;
											return {
												Id: i,
												Unit: unit.UnitString,
												RelatedUnit: null,
												Factor: 1,
												ImportTo: 1
											};
										}),
										infoField: $translate.instant('resource.catalog.import.missingUnitsLabel')
									};
									if (absentUnitEntity.missingUnits.length > 0){
										var importFileAbsentUnitsConfig = {
											title: $translate.instant('resource.catalog.import.importEquipmentCatalog'),
											bodyTextKey: 'resource.catalog.import.decimalSeperator',
											headerTextKey: 'resource.catalog.import.decimalSeperator',
											// resizeable: true,
											dataItem: absentUnitEntity,
											formConfiguration: {
												fid: 'resource.catalog.importAbsentUnitsModal',

												version: '1.0.0',
												showGrouping: false,
												groups: [
													{
														gid: 'baseGroup',
														attributes: ['missingUnits']
													}
												],
												rows: [
													{
														gid: 'baseGroup',
														rid: '',
														model: 'infoField',
														sortOrder: 1,
														type: 'description',
														readonly: true,
														visible : true
													},
													{
														gid: 'baseGroup',
														rid: 'missingUnits',
														model: 'missingUnits',
														type: 'directive',
														directive: 'resource-catalog-import-response-grid',
														readonly: false,
														visible : true,
														sortOrder: 2
													}
												]
											},
											handleOK: function handelOk(unitsToUpload) {
												sendImportUnitRequest(unitsToUpload.data.missingUnits).then(function () {
													sendImportRequest(
														blobs,
														fileData.data.CatalogId,
														fileData.data.DecimalSeperator,
														fileData.data.DefaultMappingId,
														fileData.data.Settings.UseDefaultMapping).
														then(function (success) {
															showImportStatus(success.data.recordIds.length,fileData.data.CatalogId);
															resourceCatalogDataService.refresh();
														});
												});
											},
											handleCancel: function handleCancel() {// result not used
											}
										};
										platformTranslateService.translateFormConfig(importFileAbsentUnitsConfig.formConfiguration);
										platformModalFormConfigService.showDialog(importFileAbsentUnitsConfig);

									}
									else{
										sendImportRequest(
											blobs,
											fileData.data.CatalogId,
											fileData.data.DecimalSeperator,
											fileData.data.DefaultMappingId,
											fileData.data.Settings.UseDefaultMapping
										).then(
											function (success) {
												showImportStatus(success.data.recordIds.length,fileData.data.CatalogId);
												resourceCatalogDataService.refresh();
											});
									}


								}
							);
						}
						else{
							sendImportRequest(
								blobs,
								fileData.data.CatalogId,
								fileData.data.DecimalSeperator,
								fileData.data.DefaultMappingId,
								fileData.data.Settings.UseDefaultMapping
							).then(
								function (success) {
									showImportStatus(success.data.recordIds.length,fileData.data.CatalogId);
									resourceCatalogDataService.refresh();
								});
						}
					});
				};
				service.asyncLoadDefaultMappings().then(function () {
					let importFileConfig = {
						title: $translate.instant('resource.catalog.import.importEquipmentCatalog'),
						// resizeable: true,
						dataItem: entity,
						dialogOptions: {
							disableOkButton: function () {
								if(
									(entity.DefaultMappingId > 0 ||
									(entity.DefaultMappingId === 0 && _.isObject(entity.CustomMappingFile))) &&
									entity.ImportFiles.length > 0 &&
									entity.DecimalSeperator.length === 1 &&
									entity.CatalogId > 0
								){
									return false;
								}
								else{
									return true;
								}
							}
						},
						formConfiguration: {
							fid: 'resource.catalog.importCatalogModal',
							version: '1.0.0',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['calculateschedule', 'overwriteschedule']
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: '',
									label$tr$: 'resource.catalog.import.importCatalog',
									model: 'CatalogId',
									type: 'select',
									options: {
										displayMember: 'Code',
										valueMember: 'Id',
										inputDomain: 'code',
										select: 1,
										items: resourceCatalogDataService.getList()
									},
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: '',
									label$tr$: 'resource.catalog.import.importDataSource',
									model: 'ImportFiles',
									sortOrder: 2,
									type: 'fileselect',
									'options': {
										multiSelect: true,
										fileFilter: fileFilter,
										maxSize: '10MB',
										retrieveDataUrl: true
									}
								},
								{
									gid: 'baseGroup',
									rid: '',
									label$tr$: 'resource.catalog.import.mappingLabel',
									label: 'Mapping:',
									model: 'DefaultMappingId',
									type: 'select',
									options: {
										displayMember: 'Name',
										valueMember: 'Id',
										inputDomain: 'code',
										select: 3,
										items: defaultMappings
									},
									validator: function (item, value, model) {
										if(value === 0){
											platformRuntimeDataService.readonly(item, [
												{ field: 'CustomMappingFile', readonly: false }
											]);
										}
										else {
											platformRuntimeDataService.readonly(item, [
												{ field: 'CustomMappingFile', readonly: true }
											]);
											item.CustomMappingFile = null;
										}
										item.DecimalSeperator = _.first(_.filter(defaultMappings, dM => dM.Id === value)).DecimalSeperator;
									},
									visible: true,
									sortOrder: 3
								},
								{
									gid: 'baseGroup',
									rid: '',
									model: 'CustomMappingFile',
									label$tr$: 'resource.catalog.import.importCustomMappingLabel',
									sortOrder: 4,
									type: 'fileselect',
									'options': {
										multiSelect: false,
										fileFilter: mappingFileFilter,
										maxSize: '10MB',
										retrieveDataUrl: true
									}
								},
								{
									gid: 'baseGroup',
									rid: '',
									label$tr$: 'resource.catalog.import.decimalSeperator',
									model: 'DecimalSeperator',
									sortOrder: 5,
									type: 'description',
									maxLength: 5,
									options: {

									}
								},
								{
									gid: 'baseGroup',
									model: 'Settings',
									sortOrder: 6,
									label: ' ',
									type: 'composite',
									composite :[
										{
											gid: 'baseGroup',
											rid: '',
											label$tr$: 'resource.catalog.import.checkOnAbsenUnitsLabel',
											model: 'CheckOnAbsentUnits',
											sortOrder: 1,
											type: 'boolean',
											visible : true
										}
									]
								}
							]
						},
						handleOK: handleOkFileSelect,
						handleCancel: function handleCancel() {// result not used
						},
						customBtn1: {
							label:'Get mapping Template',
							label$tr$: 'resource.catalog.import.getMappingTemplateLabel',
							action: function () {
								let defaultMappingId = entity.DefaultMappingId > 0 ? entity.DefaultMappingId : 3;
								$http.post(globals.webApiBaseUrl + 'resource/catalog/import/getmappingtemplate', {MappingId : defaultMappingId}).then(function (response) {
									var insert = function (array, arrayIndex, insertElement){
										var left = array.slice(0,arrayIndex);
										left.push(insertElement);
										return left.concat(array.slice(arrayIndex));
									};
									var finalMappingStringLine = [];
									var header = [
										$translate.instant('resource.catalog.import.customMappingTemplateDtoPropertyName'),
										$translate.instant('resource.catalog.import.customMappingTemplateImportSourceColumnName'),
										$translate.instant('resource.catalog.import.customMappingTemplateUiColumnName'),
										$translate.instant('resource.catalog.import.customMappingTemplateExcelColumnName')
									];
									finalMappingStringLine.push(header.join(';'));
									_.forEach(response.data,function (mappingColumn) {
										finalMappingStringLine.push(insert(mappingColumn,2,getUiColumnName(mappingColumn[0])).join(';'));
									});
									var blob = new Blob(['\uFEFF' + finalMappingStringLine.join('\n')], {type: 'text/csv;charset=utf-8'});
									let defaultMappingName = _.first(_.filter(defaultMappings, dM => defaultMappingId === dM.Id)).Name.replace(/\s/g, '');
									saveAs(blob, defaultMappingName + 'ImportMapping.csv');
								});

							}
						}
					};

					platformTranslateService.translateFormConfig(importFileConfig.formConfiguration);
					platformTranslateService.translateObject(importFileConfig.customBtn1);
					return platformModalFormConfigService.showDialog(importFileConfig);
				});
			};

			return service;
		}
	]);
})(angular);
