(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMaterialController',
		['_', '$scope', '$translate', 'platformMainControllerService', 'basicsMaterialRecordService',
			'basicsMaterialMaterialCatalogService', 'basicsMaterialMaterialGroupsService', 'basicsMaterialTranslationService', 'basicsMaterialWizardService',
			'basicsMaterialDocumentsService','materialImportMappingFieldService','documentsProjectDocumentDataService','basicsLookupdataLookupFilterService',
			'cloudCommonLanguageService','platformRuntimeDataService','platformModalService', 'basicsImportHeaderService','basicsCommonRoundingService',
			function (_, $scope, $translate, platformMainControllerService, mainDataService, materialCatalogService, materialGroupsService, translateService, basicsMaterialWizardService,
				basicsMaterialDocumentsService,materialImportMappingFieldService,documentsProjectDocumentDataService,basicsLookupdataLookupFilterService,
				cloudCommonLanguageService,platformRuntimeDataService,platformModalService, basicsImportHeaderService,basicsCommonRoundingService) {

				var allTrLanguages = [];
				var materialPriceVersion = [];
				var minMaterialPriceVersionId = 0;

				cloudCommonLanguageService.getLanguageItems().then(function (data) {
					allTrLanguages = data.filter(function (item) {
						return !item.IsDefault;
					});
				});

				var opt = {search: true, reports: true, wizards: true, auditTrail: '06d6634bc40e443885991495e60ff5c0'};
				var result = platformMainControllerService.registerCompletely($scope, mainDataService, {},
					translateService, moduleName, opt);


				$scope.canNext=true;
				/* jshint -W098*/
				function groupSettingValidtor(entity, value, model){
					entity.IsNewMaterialGroup=value;
					codeValidtorNumber(entity,entity.GroupLevel,'GroupLevel');
				}

				function codeValidtorNumber(entity, value, model){
					var validateResult = {apply: true, valid: true};
					entity[model]=value;
					if(model==='GroupLevel'){
						if(0===entity.IsNewMaterialGroup) {
							if (isNaN(value) || value <= 0) {
								validateResult.valid = false;
								validateResult.error = $translate.instant('basics.material.import.mustIntegerGreater', {object: model});
								platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
							}
						}
						else{
							platformRuntimeDataService.applyValidationResult(validateResult, entity, 'GroupLevel');
						}
					}
					else {
						if (isNaN(value)) {
							validateResult.valid = false;
							validateResult.error = $translate.instant('basics.material.import.mustInteger', {object: model});
							platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						}
					}

					if(isNaN(entity.Attributes)||isNaN(entity.Documents)||(0===entity.IsNewMaterialGroup&&entity.GroupLevel<=0)) {
						$scope.canNext = false;
					}
					else{
						$scope.canNext=true;
					}
					return validateResult;
				}

				// add export capability

				var exportOptions = {
					ModuleName: moduleName,
					MainContainer: {
						Id: 'basics.material.grid',
						Label: 'basics.material.record.gridViewTitle',
						NoExportFields:['Id'],
							   SelectedColumns:[]
					},
					SubContainers: [
						{
							Id: 'basics.material.characteristic.grid',      // must match an entry in the module-containers.json!
							Qualifier: 'attributes',                         // unique identifier for subcontainers (used on server side!)
							Label: 'basics.material.characteristic.title',  // listbox item text
							Selected: false,
							Visible:true,
							SelectedColumns:['property','characteristic'],
							InternalFieldNames:['PropertyInfo','CharacteristicInfo'],
							ColumnLabels:[],
							CustomVisibleColumn:{
								SpecialVisibleColumn:[
									{
										HeaderFrom: 'property',
										ValueFrom: 'characteristic'
									}
								]
							},
							EverVisible:true
						},
						{
							Id:'basics.material.document.grid',
							Qualifier:'documents',
							Label:'basics.material.documents.title',
							Selected:false,
							SelectedColumns:['OriginFileName'],
							InternalFieldNames:['OriginFileName'],
							ColumnLabels:[],
							CustomVisibleColumn:{
								NormalVisibleColumn:{
									ColumnNames:['OriginFileName'],
									HasMultipleRecord:true
								}
							},
							EverVisible:true
						}
					],
					SpecialSubContainers:[
						{
							Id:'basics.material.specification.title',
							Qualifier:'basSpecification',
							Label:'basics.material.basSpecification',
							Selected:false,
							Visible:true,
							SelectedColumns:['BasBlobsSpecificationFk'],
							InternalFieldNames:['Id'],
							ColumnLabels:[],
							CustomVisibleColumn:{
								NormalVisibleColumn:{
									ColumnNames:['BasBlobsSpecificationFk'],
									HasMultipleRecord:false
								}
							}

						},
						{
							Id:'basics.material.preview.title',
							Qualifier:'preview',
							Label:'basics.material.preview.title',
							Selected:false,
							Visible:true,
							SelectedColumns:['BasBlobsFk'],
							InternalFieldNames:['Id'],
							ColumnLabels:[],
							CustomVisibleColumn:{
								NormalVisibleColumn:{
									ColumnNames:['BasBlobsFk'],
									HasMultipleRecord:false
								}
							}

						}
					],
					SheetNumber:1,
					Service:mainDataService,
					OptionTranslation:function(option){
						if(option.SubContainers){
							_.forEach(option.SubContainers,function(subContain){
								if(subContain.CustomVisibleColumn && subContain.CustomVisibleColumn.SpecialVisibleColumn){
									_.forEach(subContain.CustomVisibleColumn.SpecialVisibleColumn,function(item){
										if(item.HeaderFrom){
											item.HeaderFrom = $translate.instant(item.HeaderFrom);
										}
										if(item.ValueFrom){
											item.ValueFrom = $translate.instant(item.ValueFrom);
										}
									});
								}
								if(subContain.CustomVisibleColumn && subContain.CustomVisibleColumn.NormalVisibleColumn){
									for(var i=0; i<subContain.CustomVisibleColumn.NormalVisibleColumn.ColumnNames.length; i++){
										subContain.CustomVisibleColumn.NormalVisibleColumn.ColumnNames[i] =
                                            $translate.instant(subContain.CustomVisibleColumn.NormalVisibleColumn.ColumnNames[i]);
									}
								}
							});
						}

					},
					HandlerSubContainer:function(subContainers){
						_.forEach(subContainers,function(item){
							item.ColumnLabels = [];
						});
					}
				};

				basicsMaterialWizardService.active();
				var importOptions = {
					wizardParameter:{},
					preprocessor: function () {
						var s = materialCatalogService.getSelected();
						if (s) {
							var description = s.DescriptionInfo && s.DescriptionInfo.Description && s.DescriptionInfo.Description.length > 0 ? '-'+s.DescriptionInfo.Description : '';
							importOptions.ImportDescriptor.CustomSettings.CatalogCodeDes = s.Code + description;
							importOptions.ImportDescriptor.CustomSettings.OptionCode = s.Code;
							importOptions.ImportDescriptor.CustomSettings.OptionCodeId = s.Id;
							return true;
						}
						else {
							return {cancel: true, msg: $translate.instant('basics.material.import.selectOneCatalog')};
						}
					},
					FileSelectionPage:{
						skip: false
					},
					DoubletFindMethodsPage: {
						skip: true
					},
					ModuleName: moduleName,
					permission: '6ew98cfebf2f4540be89a255e6eb8b26#e',
					CustomSettingsPage: {
						skip:false,
						Config: {
							showGrouping: false,
							groups: [
								{
									gid: 'materialImport',
									header: '',
									header$tr$: '',
									isOpen: true,
									visible: true,
									sortOrder: 1
								}
							],
							rows: [
								{
									gid: 'materialImport',
									rid: 'CatalogCodeDes',
									label: 'Material Catalog',
									label$tr$: 'basics.material.import.catalogCode',
									type: 'code',
									model: 'CatalogCodeDes',
									visible: true,
									readonly: true,
									sortOrder: 1
								},
								{
									gid: 'materialImport',
									rid: 'doubletFindMethods',
									label: 'KeepOrNewMaterialGroup',
									label$tr$: 'basics.material.import.keepOrNewMaterialGroup',
									type: 'directive',
									model: 'IsNewMaterialGroup',
									validator:groupSettingValidtor,
									directive: 'basics-import-from-excel-combobox',
									visible: true,
									sortOrder: 1
								},{
									gid: 'materialImport',
									rid: 'groupLevel',
									label: 'Group Level',
									label$tr$: 'basics.material.import.groupLevel',
									sortOrder: 1,
									type:'directive',
									directive: 'platform-composite-input',
									'options': {
										'rows': [{
											label: '',
											type: 'code',
											validator:codeValidtorNumber,
											model: 'GroupLevel',
											'cssLayout': 'xs-4 sm-4 md-4 lg-4',
										},
										{
											//label: 'Structure Assignment to Non Mapping Group ',
											label$tr$: 'basics.material.import.noMappingGroupStructure',
											type: 'directive',
											model: 'NoMappingGroupStructure',
											directive: 'basics-procurementstructure-structure-dialog',
											cssLayout: 'xs-8 sm-8 md-8 lg-8',
											options: {
												showClearButton: true
											}

										}]
									}
								},
								{
									gid: 'materialImport',
									rid: 'attributeNumber',
									label: 'Attribute Count',
									label$tr$: 'basics.material.import.attribute',
									type: 'code',
									model: 'Attributes',
									validator:codeValidtorNumber,
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'materialImport',
									rid: 'characteristicsNumber',
									label: 'Characteristics Count',
									label$tr$: 'basics.material.import.characteristics',
									type: 'code',
									model: 'Characteristics',
									validator:codeValidtorNumber,
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'materialImport',
									rid: 'documentNumber',
									label: 'Document Count',
									label$tr$: 'basics.material.import.documents',
									type: 'code',
									model: 'Documents',
									validator:codeValidtorNumber,
									visible: true,
									sortOrder: 1
								}, {
									gid: 'materialImport',
									rid: 'scopeVariant',
									label: 'Scope Variant',
									label$tr$: 'basics.material.import.scopeVariant',
									type: 'directive',
									directive: 'platform-composite-input',
									visible: true,
									sortOrder: 1,
									'options': {
										'rows': [{
											label: '',
											type: 'code',
											validator: codeValidtorNumber,
											model: 'ScopeVariant',
											'cssLayout': 'xs-5 sm-5 md-5 lg-5',
										},
										{
											label: 'Scope Supply',
											label$tr$: 'basics.material.import.scopeSupply',
											type: 'code',
											validator: codeValidtorNumber,
											model: 'ScopeSupply',
											'cssLayout': 'xs-7 sm-7 md-7 lg-7',
										}]
									}
								},
								{
									gid: 'materialImport',
									rid: 'isPriceAfterTax',
									label: 'Import price after tax',
									label$tr$: 'basics.material.import.PriceTax',
									type: 'boolean',
									model: 'IsPriceAfterTax',
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'materialImport',
									rid: 'isSkipPreviewAndSimulate',
									label: 'Skip Preview & Simulate',
									label$tr$: 'basics.material.import.SkipPreviewAndSimulate',
									type: 'directive',
									directive: 'platform-composite-input',
									visible: true,
									sortOrder: 1,
									'options': {
										'rows': [{
											label: '',
											type: 'boolean',
											model: 'SkipPreviewAndSimulate',
											'cssLayout': 'xs-1 sm-1 md-1  lg-0',
										},
										{
											label: '',
											'type': 'directive',
											'directive': 'material-in-line-input',
											options:{
												label:'basics.material.import.overNumTip',
											},
											'cssLayout': 'xs-11 sm-11 md-11 lg-11'
									}]
									}
								},
								{
									gid: 'materialImport',
									rid: 'importTranslation',
									label: 'Import Translation',
									label$tr$: 'basics.material.import.ImportTranslation',
									type: 'boolean',
									model: 'ImportTranslation',
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'materialImport',
									rid: 'priceListVersion',
									label: 'Specify Price Version',
									label$tr$: 'basics.material.import.specifiedPriceVersion',
									type: 'directive',
									model: 'PriceVersion',
									directive: 'material-import-price-version-composite',
									options:{
										filterKey: 'import-price-list-price-version-filter'
									},
									visible: true,
									readonly:false,
									sortOrder: 1
								}
							]
						}
					},
					FieldMappingsPage:{
						skip:false
					},
					EditImportPage:{
						skip: function(entity) {
							var skipPreview=entity.ImportDescriptor.CustomSettings.SkipPreview;
							var skipPreviewAndSimulate=entity.ImportDescriptor.CustomSettings.SkipPreviewAndSimulate;
							var skip=false;
							if(_.isNil(skipPreview)&&!_.isNil(skipPreviewAndSimulate)){
								skip=skipPreviewAndSimulate;
							}
							return skip&&(1===entity.ImportDescriptor.CustomSettings.ImportType);
						}
					},
					PreviewResultPage:{
						skip: function(entity) {
							var skipPreviewAndSimulate=entity.ImportDescriptor.CustomSettings.SkipPreviewAndSimulate;
							var skip=false;
							if(!_.isNil(skipPreviewAndSimulate)){
								skip=skipPreviewAndSimulate;
							}
							return skip&&(1===entity.ImportDescriptor.CustomSettings.ImportType);
						}
					},
					OnImportCallback:function(parentScope,res){
						if(parentScope.customEntity.SkipPreviewAndSimulate) {
							if (res) {
								var importResult_Message=res.ImportResult_Message;
								var infoList=[];
								if(importResult_Message.length>0){
									infoList.push({Info:importResult_Message,Id:0});
								}
								if (res.ErrorCounter > 0 && res.ImportObjects.length>0){
									var errorObjects=_.filter(res.ImportObjects,function(item){return item.LogErrorMsg&&item.LogErrorMsg.length>0;});
									_.forEach(errorObjects,function(item){
                                   	     var rowNum=item.RowNum;
                                   	     if(item.LogErrorMsg.length>0){
											 var msg = $translate.instant('basics.material.import.importResultMessageDetail', {'Number': rowNum})+' '+item.LogErrorMsg.join(',');
											 infoList.push({Info:msg,Id:rowNum});
										 }
								   });
							   }
								if(infoList.length>0){
									var modalOptions = {
										templateUrl: globals.appBaseUrl + 'basics.material/partials/import-material-records-result-dialog.html',
										backDrop: false,
										windowClass: 'form-modal-dialog',
										resizeable: true,
										headerTextKey: $translate.instant('basics.common.taskBar.info'),
										infoList:infoList
									};
									platformModalService.showDialog(modalOptions);
									parentScope.isImportResultPage=false;
									parentScope.close();
								}
								materialGroupsService.updateMaterialGroup();
							}
						}
					},
					ImportDescriptor: {
						Fields: angular.copy(materialImportMappingFieldService.Fields),
						CustomSettings: {
							CatalogCodeDes: '',
							IsNewMaterialGroup: 0,
							GroupLevel: 3,
							Attributes: 5,
							Characteristics: 5,
							Documents: 5,
							SpecifiedPriceListVersion: true,
							SkipPreviewAndSimulate: false,
							SkipPreview:null,
							ImportTranslation: false,
							PriceVersion: null,
							NoMappingGroupStructure:null,
							ImportType: 1,
							ScopeVariant: 5,
							ScopeSupply: 5,
							IsPriceAfterTax: false,
							Translations: ['Description1', 'Description2', 'Specification']
						},
						FieldProcessor: function (parentScope, oldProfile) {
							var customSettings=parentScope.customEntity;
							var trLanguages=[];
							if(customSettings){
								var ImportTranslation=customSettings.ImportTranslation;
								if(ImportTranslation) {
									trLanguages = allTrLanguages;
								}
							}

							var oldFields=angular.copy(parentScope.entity.ImportDescriptor.Fields);
							var tempProfileMapping={};
							var tempMapping={};

							if(oldProfile&&oldProfile.ImportDescriptor) {
								var oldProfileFields = angular.copy(oldProfile.ImportDescriptor.Fields);
								//solve when old profile no have new column in price list mapping
								if(parentScope.entity.ImportType === 2){
									let priceListFields=angular.copy(materialImportMappingFieldService.PriceList);
									let org = _.keyBy(priceListFields, 'PropertyName');
									_.forEach(oldFields, function (item) {
										let propertyName = item.PropertyName;
										if (org[propertyName] && item.DomainName !== org[propertyName].DomainName) {
											item.DomainName = org[propertyName].DomainName;
										}
									});
									let src = _.keyBy(oldFields, 'PropertyName');
									parentScope.entity.ImportDescriptor.Fields=_.values(_.merge(org, src));
								}
								else {
									let fields = angular.copy(materialImportMappingFieldService.Fields);
									let org = _.keyBy(fields, 'PropertyName');
									_.forEach(oldFields, function (item) {
										let propertyName = item.PropertyName;
										if (org[propertyName] && item.DomainName !== org[propertyName].DomainName) {
											item.DomainName = org[propertyName].DomainName;
										}
									});
									parentScope.entity.ImportDescriptor.Fields = oldFields;
								}

								_.forEach(oldProfileFields, function (copyField) {
									if (copyField.MappingName) {
										tempProfileMapping[copyField.PropertyName] = copyField.MappingName;
									}
								});
							}

							_.forEach(oldFields,function(copyField){
								if(copyField.MappingName) {
									var sourceMappingName = basicsImportHeaderService.getItemByDescription(copyField.MappingName);
									if(!_.isNil(sourceMappingName)){
										tempMapping[copyField.PropertyName] = copyField.MappingName;
									}
									else{
										tempMapping[copyField.PropertyName] ='';
									}
								}
								else{
									tempMapping[copyField.PropertyName] ='';
								}
							});


							if(parentScope.entity.ImportType === 1){

								var isLoadDocumentsColumn = false;
								if(parentScope.entity.File2Import){
									var res = parentScope.entity.File2Import.toLowerCase();
									if(_.includes(res,'zip')){
										isLoadDocumentsColumn = true;
									}
								}

								processTrFields();
								//property
								var dynamicPropertyName=$translate.instant('basics.material.import.dynamicPropertyName');

								//dynamicModifyProperties('Attributes','Property',dynamicPropertyName,'PropertyColName','MaterialChrctrstc',true);
								generateAttribute('Attributes','Property',dynamicPropertyName,'PropertyColName','Property',true);
								//Characteristics
								generateCharacteristic();
								//document
								var dynamicDocumentName=$translate.instant('basics.material.import.dynamicMaterialName');
								dynamicModifyProperties('Documents','MaterialDocument',dynamicDocumentName,'DocumentColName','MaterialDocument',false);

								//group
								if (parentScope.entity.ImportDescriptor && customSettings) {
									var flag = customSettings.IsNewMaterialGroup;
									if (flag === 1) {
										parentScope.entity.ImportDescriptor.Fields = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
											return !_.includes(item.EntityName,'MaterialGroupLevel') && !_.includes(item.EntityName,'GroupStructureLevel')&& !_.includes(item.EntityName,'MaterialGroupDesLevel');
										});
									} else {
										generateMaterialGroup();
									}
								}
								//variant
								generateVariantAndSupply();

								//zip
								var specialFields = _.filter(materialImportMappingFieldService.Fields,{SelectLoad: true});
								if(isLoadDocumentsColumn){
									var find = _.find(parentScope.entity.ImportDescriptor.Fields,{PropertyName:specialFields[0].PropertyName});
									if(!find){
										var lastIndex = _.findLastIndex(parentScope.entity.ImportDescriptor.Fields,{EntityName:'Material'});
										parentScope.entity.ImportDescriptor.Fields.splice(lastIndex+1,0,specialFields[0],specialFields[1]);

									}
								}
								//is price tax
								var fileds = null;
								var showfields=parentScope.entity.ImportDescriptor.Fields;
								if(parentScope.customEntity.IsPriceAfterTax){
									fileds = _.filter(showfields, function(n) {
										return !(n.PropertyName === 'ListPrice'||n.PropertyName === 'Discount'||n.PropertyName === 'Charges'||n.PropertyName === 'PriceCondition'||n.PropertyName === 'PriceConditionType'||n.PropertyName === 'PriceConditionValue');
									});
									parentScope.entity.ImportDescriptor.Fields=fileds;
								}
								else{
									fileds = _.filter(showfields, function(n) {
										return n.PropertyName !== 'CostPriceGross';
									});
									parentScope.entity.ImportDescriptor.Fields=fileds;
								}


							}
							//for all reset fields
							if (!_.isEmpty(tempMapping)) {
								_.forEach(parentScope.entity.ImportDescriptor.Fields, function (item) {
									if(tempMapping[item.PropertyName]) {
										item.MappingName =tempMapping[item.PropertyName];
									}
								});
							}


							for(var i= 0; i< parentScope.entity.ImportDescriptor.Fields.length; i++){
								parentScope.entity.ImportDescriptor.Fields[i].Id = i;
							}


							function setAddFieldMappingByOldProfileField(item){
								if (tempProfileMapping[item.PropertyName]) {
									var sourceMappingName = basicsImportHeaderService.getItemByDescription(tempProfileMapping[item.PropertyName]);
									//check the mapping whether exist in the source fields
									if(!_.isNil(sourceMappingName)){
										item.MappingName = tempProfileMapping[item.PropertyName];
									}else{
										item.MappingName = '';
									}

								}
							}

							function mapTrColumnFn(field) {
								return function (item) {
									var des = '';
									if(!_.isNil(item.DescriptionInfo)){
										des = item.DescriptionInfo.Translated;
									}
									if(des === '' && !_.isNil(item.Description)){
										des = item.Description;
									}
									return {
										PropertyName: field.PropertyName + '_' + item.Culture,
										EntityName: field.EntityName,
										DomainName: field.DomainName,
										Editor: field.Editor,
										DisplayName: $translate.instant(field.DisplayName) + ' - ' + des,
										ValueName: field.ValueName ? field.ValueName + '_' + item.Culture : null,
										__isTrColumn: true
									};
								};
							}

							//inner function
							function processTrFields() {
								// remove all translation columns first.
								parentScope.entity.ImportDescriptor.Fields = parentScope.entity.ImportDescriptor.Fields.filter(function (field) {
									if(_.isNil(field.__isTrColumn)){
										var propertyName=field.PropertyName;
										var entityName=field.EntityName;
										var domainName='description';
										if(entityName==='Material'&&field.DomainName===domainName&&(propertyName.indexOf('_')>-1)&&(propertyName.startsWith('Description')||propertyName.startsWith('Specification'))){
											return  false;
										}
										else{
											return true;
										}
									}
									else{
										return !field.__isTrColumn;
									}
								});
								var fields = parentScope.entity.ImportDescriptor.Fields;
								if(customSettings) {
									var translations = customSettings.Translations;
									if (translations) {
										translations.forEach(function (propertyName) {
											var field = _.find(fields, {PropertyName: propertyName});
											var index = _.findIndex(fields, {PropertyName: propertyName});

											if (index < 0) {
												return;
											}

											var args = [index + 1, 0];
											var trFields = trLanguages.map(mapTrColumnFn(field));
											fields.splice.apply(fields, args.concat(trFields));
										});
									}
								}

							}

							function dynamicModifyProperties(field,columnPrefix,showcolumnPrefix,valueNamePrefix,entityName,isEdit){
								if (parentScope.customEntity) {
									var importTranslation = customSettings.ImportTranslation;
									var newPropertyNum = Number(parentScope.customEntity[field]);
									var oldPropertyNames = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
										return _.startsWith(item.PropertyName, columnPrefix);
									});

									if(columnPrefix !== 'MaterialDocument'){
										//fixed issue:#141817, Material Import Issue
										var lanNames = _.filter(oldPropertyNames, function (item) {
											return item.PropertyName.indexOf('_') > 0;
										});
										_.forEach(lanNames,function(item){
											var index = _.findIndex(parentScope.entity.ImportDescriptor.Fields,{PropertyName:item.PropertyName});
											if(index > 0){
												parentScope.entity.ImportDescriptor.Fields.splice(index,1);
											}
										});
										oldPropertyNames = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
											return _.startsWith(item.PropertyName, columnPrefix);
										});
									}

									var oldPropertyNamesLength = oldPropertyNames.length;
									var i = 0,j=0;
									if (oldPropertyNamesLength !== newPropertyNum) {
										var temp = oldPropertyNamesLength - newPropertyNum;
										if (temp > -1) {
											var firstIndex = _.findIndex(parentScope.entity.ImportDescriptor.Fields,{EntityName:entityName});
											parentScope.entity.ImportDescriptor.Fields.splice(firstIndex+newPropertyNum,temp);
										} else {
											var tempIndex = _.findLastIndex(parentScope.entity.ImportDescriptor.Fields, {EntityName: entityName});
											var lastIndex = tempIndex === -1 ? parentScope.entity.ImportDescriptor.Fields.length : tempIndex + 1;
											var needAddRows = [], index = oldPropertyNamesLength + 1;
											for (i = 0; i < Math.abs(temp); i++) {
												var propertyName = columnPrefix + index;
												var propertyColName = valueNamePrefix + index;
												var displayName = $translate.instant('basics.material.import.dynamicProperty', {
													'name': showcolumnPrefix,
													'prop': index
												}) || columnPrefix + index;
												var property = {
													PropertyName: propertyName,
													EntityName: entityName,
													DomainName: 'description',
													Editor: isEdit ? 'domain' : 'none',
													ValueName: propertyColName,
													DisplayName: displayName
												};
												setAddFieldMappingByOldProfileField(property);

												needAddRows.push(property);
												index += 1;
												var map = mapTrColumnFn(property);
												if(columnPrefix !== 'MaterialDocument' && importTranslation) {
													/* jshint -W083 */
													trLanguages.forEach(function (languageItem) {
														var language=map(languageItem);
														setAddFieldMappingByOldProfileField(language);
														needAddRows.push(language);
													});
												}
											}
											for (i = 0, j = lastIndex; i < needAddRows.length; i++ , j++) {
												parentScope.entity.ImportDescriptor.Fields.splice(j, 0, needAddRows[i]);
											}
										}
									}
									//add translation
									if(importTranslation && columnPrefix !== 'MaterialDocument'){
										//fixed issue:#141817, Material Import Issue
										var lanNames = _.filter(oldPropertyNames, function (item) {
											return item.PropertyName.indexOf('_') > 0;
										});
										if(lanNames.length <= 0){
											var fields = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
												return _.startsWith(item.PropertyName, columnPrefix);
											});
											_.forEach(fields,function(property){
												var tempIndex = _.findLastIndex(parentScope.entity.ImportDescriptor.Fields, {EntityName: entityName});
												var lastIndex = tempIndex === -1 ? parentScope.entity.ImportDescriptor.Fields.length : tempIndex + 1;
												var needAddRows = [];
												var map = mapTrColumnFn(property);
												/* jshint -W083 */
												trLanguages.forEach(function (languageItem) {
													var language=map(languageItem);
													setAddFieldMappingByOldProfileField(language);
													needAddRows.push(language);
												});

												for (i = 0, j = lastIndex; i < needAddRows.length; i++ , j++) {
													parentScope.entity.ImportDescriptor.Fields.splice(j, 0, needAddRows[i]);
												}
											});
										}

									}

								}
							}


							function generateMaterialGroup() {
								parentScope.entity.ImportDescriptor.Fields = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
									return !_.includes(item.EntityName,'MaterialGroupLevel') && !_.includes(item.EntityName,'GroupStructureLevel')&& !_.includes(item.EntityName,'MaterialGroupDesLevel');
								});
								var newGroupNum = Number(parentScope.customEntity.GroupLevel);
								var oldGroups = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
									return _.startsWith(item.EntityName, 'MaterialGroupLevel');
								});
								var oldGroupNum=oldGroups.length;
								if (oldGroupNum!== newGroupNum) {
									var temp =oldGroupNum - newGroupNum;
									if (temp > -1) {
										var firstIndex = _.findIndex(parentScope.entity.ImportDescriptor.Fields,{EntityName:'MaterialGroupLevel'});
										parentScope.entity.ImportDescriptor.Fields.splice(firstIndex+newGroupNum*3,temp*3);
									}
									else{
										var field = {
											PropertyName: 'MaterialGroupLevel1_Code',
											ValueName:'MaterialGroupLevel1_Id',
											EntityName: 'MaterialGroupLevel',
											DomainName: 'lookup',
											DisplayName: 'basics.material.import.group',
											Editor: 'idlookup',
											EditorDirective: 'basics-material-material-group-lookup',
											FormatterOptions: {
												lookupType: 'MaterialGroup',
												displayMember: 'Code'
											},
											asyncValidatorOptions: {
												dataServiceName: 'basicsMaterialRecordValidationService',
												execute: 'asyncValidateMaterialGroupFk'
											}

										};
										var groupDescription = {
											PropertyName: 'MaterialGroupLevel1_Description',
											EntityName: 'MaterialGroupDesLevel',
											DomainName: 'description',
											Editor: 'domain',
											DisplayName: 'basics.material.import.groupDescription'

										};
										var structureField = {
											PropertyName: 'GroupStructureLevel1_Code',
											ValueName:'GroupStructureLevel1_Id',
											EntityName: 'GroupStructureLevel',
											DomainName: 'lookup',
											DisplayName: 'basics.material.import.structure',
											Editor: 'idlookup',
											EditorDirective: 'basics-procurementstructure-structure-dialog',
											editorOptions: {
												lookupOptions: {
													showClearButton: true,
													filterKey: 'basics-materialcatalog-procurement-structure-filter'
												},
												directive: 'basics-procurementstructure-structure-dialog'
											},
											FormatterOptions: {
												lookupType: 'Prcstructure',
												displayMember: 'Code'
											}

										};
										var materialGroups = [],materialGroupStructures = [],materialGroupDeses = [];
										var materialGroupLevel=parentScope.customEntity.GroupLevel*1+1;
										for (var i = 1; i <materialGroupLevel; i++) {
											var f = _.cloneDeep(field),groupDes = _.cloneDeep(groupDescription),structure = _.cloneDeep(structureField);
											f.PropertyName = 'MaterialGroupLevel' + i + '_Code';
											f.ValueName = 'MaterialGroupLevel' + i + '_Id';
											let translateLevelCode = $translate.instant('basics.material.import.group');
											let translateCode = translateLevelCode.replace('{0}',i);
											f.DisplayName = translateCode || 'Group Code of Level ' + i;
											if(i>oldGroupNum) {
												setAddFieldMappingByOldProfileField(f);
											}
											materialGroups.push(f);

											groupDes.PropertyName = 'MaterialGroupLevel' + i +'_Description';
											let translateLevelDes = $translate.instant('basics.material.import.groupDescription');
											let translateDes = translateLevelDes.replace('{0}',i);
											groupDes.DisplayName =  translateDes || 'Group Description of Level ' + i;
											if(i>oldGroupNum) {
												setAddFieldMappingByOldProfileField(groupDes);
											}
											materialGroupDeses.push(groupDes);

											structure.PropertyName = 'GroupStructureLevel' + i + '_Code';
											structure.ValueName = 'GroupStructureLevel' + i + '_Id';
											structure.DisplayName = $translate.instant('basics.material.import.structure',{'grade':i}) || 'Group of Level ' + i + ' Structure';
											if(i>oldGroupNum) {
												setAddFieldMappingByOldProfileField(structure);
											}
											materialGroupStructures.push(structure);
										}
										for(var j=materialGroupStructures.length-1; j>=0; j--){
											parentScope.entity.ImportDescriptor.Fields.splice(0, 0,materialGroups[j],materialGroupDeses[j],materialGroupStructures[j]);
										}
									}
								}
							}

							//generate Characteristic
							function generateCharacteristic(){
								var arrFields=[{PropertyName: 'GroupId',Description:'Group Id'},{PropertyName: 'Code',Description:'Code'},{PropertyName: 'Value',Description:'Value'}];
								var showcolumnPrefix=$translate.instant('basics.material.import.dynamicCharacteristicName');
								var columnPrefix='Characteristic';
								var needAddRows=[];
								parentScope.entity.ImportDescriptor.Fields = parentScope.entity.ImportDescriptor.Fields.filter(function (field) {
									var hasVariant= _.includes(field.EntityName,'Characteristic');
									return !hasVariant;
								});
								//var oldCharacteristics = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
								//	return _.startsWith(item.EntityName, 'Characteristic');
								//});
								//var oldCharacteristicNum = oldCharacteristics.length/arrFields.length;
								for(var m=1; m<=parentScope.customEntity.Characteristics; m++) {
									var propertyName = columnPrefix + m;
									var displayName = $translate.instant('basics.material.import.dynamicProperty', {
										'name': showcolumnPrefix,
										'prop': m
									}) || columnPrefix + m;
									for(var x=0; x<arrFields.length; x++) {
										var item = arrFields[x];
										var characteristic = {
											PropertyName: propertyName + '_' + item.PropertyName,
											EntityName: propertyName,
											DomainName: item.DomainName ? item.DomainName : 'description',
											Editor: item.Editor ? item.Editor : 'domain',
											DisplayName: displayName + ' - ' + item.Description
										};
										setAddFieldMappingByOldProfileField(characteristic);
										needAddRows.push(characteristic);
									}
								}
								var lastIndex =  parentScope.entity.ImportDescriptor.Fields.length;
								for (var i = 0, j = lastIndex; i < needAddRows.length; i++ , j++) {
									parentScope.entity.ImportDescriptor.Fields.splice(j, 0, needAddRows[i]);
								}
							}

							function generateAttribute(field,columnPrefix,showcolumnPrefix,valueNamePrefix,entityName,isEdit){
								if (parentScope.customEntity) {
									var importTranslation = customSettings.ImportTranslation;
									var newPropertyNum = Number(parentScope.customEntity[field]);
									var oldPropertyNames = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
										return _.startsWith(item.PropertyName, columnPrefix);
									});

									if(columnPrefix !== 'MaterialDocument'){
										//fixed issue:#141817, Material Import Issue
										var lanNames = _.filter(oldPropertyNames, function (item) {
											return item.PropertyName.indexOf('_') > 0;
										});
										_.forEach(lanNames,function(item){
											var index = _.findIndex(parentScope.entity.ImportDescriptor.Fields,{PropertyName:item.PropertyName});
											if(index > 0){
												parentScope.entity.ImportDescriptor.Fields.splice(index,1);
											}
										});
										oldPropertyNames = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
											return _.startsWith(item.PropertyName, columnPrefix);
										});
									}
									if(oldPropertyNames.length>=1){
										_.forEach(oldPropertyNames,function(item){
											var index = _.findIndex(parentScope.entity.ImportDescriptor.Fields,{PropertyName:item.PropertyName});
											if(index > 0){
												parentScope.entity.ImportDescriptor.Fields.splice(index,1);
											}
										});
										var needAddRows = [];
										var arrFields=[{PropertyName: 'Name',Description:'Name'},{PropertyName: 'Value',Description:'Value'}];
										var tempIndex = _.findLastIndex(parentScope.entity.ImportDescriptor.Fields, {EntityName: entityName});
										var lastIndex = tempIndex === -1 ? parentScope.entity.ImportDescriptor.Fields.length : tempIndex + 1;
										for (let k = 0; k < oldPropertyNames.length; k++) {
											var item = oldPropertyNames[k];
											if(!_.isNil(item.MappingName)){
												//check the mapping name whether in the excel file
												var sourceMappingName = basicsImportHeaderService.getItemByDescription(item.MappingName);
												if(_.isNil(sourceMappingName)){
													item.MappingName = '';
												}
											}
											for (var x = 0; x < arrFields.length; x++) {
												var fieldItem = arrFields[x];
												var property = {
													PropertyName: item.PropertyName + '_' + fieldItem.PropertyName,
													EntityName: item.PropertyName,
													DomainName: item.DomainName ? item.DomainName : 'description',
													Editor: item.Editor ? item.Editor : 'domain',
													DisplayName: item.DisplayName + ' - ' + fieldItem.Description,
													MappingName: fieldItem.PropertyName==='Name'? null : item.MappingName
												};
												setAddFieldMappingByOldProfileField(property);
												needAddRows.push(property);
												var map = mapTrColumnFn(property);
												if (columnPrefix !== 'MaterialDocument' && importTranslation) {
													/* jshint -W083 */
													trLanguages.forEach(function (languageItem) {
														var language = map(languageItem);
														setAddFieldMappingByOldProfileField(language);
														needAddRows.push(language);
													});
												}
											}
										}
										for (i = 0, j = lastIndex; i < needAddRows.length; i++ , j++) {
											parentScope.entity.ImportDescriptor.Fields.splice(j, 0, needAddRows[i]);
										}
										//add translation
										if(importTranslation && columnPrefix !== 'MaterialDocument'){
											var lanNames = _.filter(oldPropertyNames, function (item) {
												return item.PropertyName.indexOf('_') > 0;
											});
											if(lanNames.length <= 0){
												var fields = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
													return _.startsWith(item.PropertyName, columnPrefix);
												});
												_.forEach(fields,function(property){
													var needAddRows = [];
													var map = mapTrColumnFn(property);
													/* jshint -W083 */
													trLanguages.forEach(function (languageItem) {
														var language=map(languageItem);
														setAddFieldMappingByOldProfileField(language);
														needAddRows.push(language);
													});
												});
											}
										}
									}
									var arrFields=[{PropertyName: 'Name',Description:'Name'},{PropertyName: 'Value',Description:'Value'}];
									var oldPropertyNamesLength = oldPropertyNames.length;
									var i = 0,j=0;
									if (oldPropertyNamesLength !== newPropertyNum) {
										var temp = oldPropertyNamesLength - newPropertyNum;
										if (temp > -1) {
											var firstIndex = _.findIndex(parentScope.entity.ImportDescriptor.Fields,{EntityName:entityName});
											parentScope.entity.ImportDescriptor.Fields.splice(firstIndex+newPropertyNum,temp);
										} else {
											var tempIndex = _.findLastIndex(parentScope.entity.ImportDescriptor.Fields, {EntityName: entityName});
											var lastIndex = tempIndex === -1 ? parentScope.entity.ImportDescriptor.Fields.length : tempIndex + 1;
											var needAddRows = [], index = oldPropertyNamesLength + 1;
											for (i = 0; i < Math.abs(temp); i++) {
												var propertyName = columnPrefix + index;
												var displayName = $translate.instant('basics.material.import.dynamicProperty', {
													'name': showcolumnPrefix,
													'prop': index
												}) || columnPrefix + index;
												for (var x = 0; x < arrFields.length; x++) {
													var item = arrFields[x];
													var property = {
														PropertyName: propertyName + '_' + item.PropertyName,
														EntityName: propertyName,
														DomainName: item.DomainName ? item.DomainName : 'description',
														Editor: item.Editor ? item.Editor : 'domain',
														DisplayName: displayName + ' - ' + item.Description
													};
													setAddFieldMappingByOldProfileField(property);

													needAddRows.push(property);

													var map = mapTrColumnFn(property);
													if (columnPrefix !== 'MaterialDocument' && importTranslation) {
														/* jshint -W083 */
														trLanguages.forEach(function (languageItem) {
															var language = map(languageItem);
															setAddFieldMappingByOldProfileField(language);
															needAddRows.push(language);
														});
													}
												}
												index += 1;
											}
											for (i = 0, j = lastIndex; i < needAddRows.length; i++ , j++) {
												parentScope.entity.ImportDescriptor.Fields.splice(j, 0, needAddRows[i]);
											}
										}
									}
									//add translation
									if(importTranslation && columnPrefix !== 'MaterialDocument'){
										var lanNames = _.filter(oldPropertyNames, function (item) {
											return item.PropertyName.indexOf('_') > 0;
										});
										if(lanNames.length <= 0){
											var fields = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
												return _.startsWith(item.PropertyName, columnPrefix);
											});
											_.forEach(fields,function(property){
												var needAddRows = [];
												var map = mapTrColumnFn(property);
												/* jshint -W083 */
												trLanguages.forEach(function (languageItem) {
													var language=map(languageItem);
													setAddFieldMappingByOldProfileField(language);
													needAddRows.push(language);
												});
											});
										}
									}
								}
							}


							//generate variant  supply
							function generateVariantAndSupply(){
								var arrVariant=[
									{PropertyName: 'IsSelected',Description:'Is Selected',DomainName: 'boolean'},
									{PropertyName: 'MatScope',Description:'Code',Editor: 'none'},
									{PropertyName: 'Description',Description:'Description'},
									{PropertyName: 'BusinessPartner',Description:'Business Partner',DomainName:'integer',Editor: 'simpledescriptionlookup',LookupQualifier:'businesspartner.lookup.businesspartner',DisplayMember: 'BP_NAME1'},
									{PropertyName: 'Subsidiary',Description:'Subsidiary',DomainName: 'integer', Editor: 'simpledescriptionlookup',  LookupQualifier: 'businesspartner.subsidiary', DisplayMember: 'Description'},
									{PropertyName: 'Supplier',Description:'Supplier',DomainName: 'integer', Editor: 'simpledescriptionlookup', LookupQualifier: 'businesspartner.supplier', DisplayMember: 'Code',AlternativeMember:'description'},
									{PropertyName: 'BusinessPartnerProd',Description: 'Business Partner Producer',DomainName: 'integer',Editor: 'simpledescriptionlookup',LookupQualifier: 'businesspartner.lookup.businesspartner',DisplayMember: 'BP_NAME1'},
									{PropertyName: 'SubsidiaryProd',Description: 'Subsidiary Producer',DomainName: 'integer', Editor: 'simpledescriptionlookup', LookupQualifier: 'businesspartner.subsidiary', DisplayMember: 'Description'},
									{PropertyName: 'SupplierProd',Description: 'Supplier Producer',DomainName: 'integer', Editor: 'simpledescriptionlookup',LookupQualifier: 'businesspartner.supplier', DisplayMember: 'Code'},
									{PropertyName: 'Comment',Description: 'Comment'},
									{PropertyName: 'Remark',Description: 'Remark'},
									{PropertyName: 'UserDefined1',Description: 'User Defined 1'},
									{PropertyName: 'UserDefined2',Description: 'User Defined 2'},
									{PropertyName: 'UserDefined3',Description: 'User Defined 3'},
									{PropertyName: 'UserDefined4',Description: 'User Defined 4'},
									{PropertyName: 'UserDefined5',Description: 'User Defined 5'},
									{PropertyName: 'Active',Description: 'Is Live',DomainName: 'boolean'}
								];
								var arrSupply=[
									{PropertyName: 'ScopeType',Description: 'Scope Type',DomainName:'integer',Editor: 'simplelookup',LookupQualifier: 'basics.material.scopeofsupplytype',DisplayMember: 'Description'},
									{PropertyName: 'ItemNo',Description: 'Item No',Editor: 'none'},
									{PropertyName: 'Structure',Description: 'Structure',DomainName: 'integer',Editor: 'simpledescriptionlookup',LookupQualifier: 'prc.structure.withcontext', DisplayMember: 'Code'},
									{PropertyName: 'Description1',Description: 'Description'},
									{PropertyName: 'Description2',Description: 'Further Description'},
									{PropertyName: 'Specification',Description: 'Specification'},
									{PropertyName: 'Quantity',Description: 'Quantity',DomainName: 'quantity'},
									{PropertyName: 'Uom',Description: 'Uom',DomainName: 'integer',Editor: 'simplelookup',LookupQualifier: 'basics.uom', DisplayMember: 'UOM'},
									{PropertyName: 'Price',Description:'Price',DomainName: 'money'},
									{PropertyName: 'PriceCondition',Description: 'Price Condition',DomainName: 'integer', Editor: 'simplelookup', NotUseDefaultValue: true, LookupQualifier: 'prc.pricecondition'},
									{PropertyName: 'PriceUnit',Description: 'Price Unit',DomainName: 'quantity'},
									{PropertyName: 'UomPriceUnit',Description: 'Price Unit Uom',DomainName: 'integer',Editor: 'simplelookup',LookupQualifier: 'basics.uom', DisplayMember: 'UOM'},
									{PropertyName: 'FactorPriceUnit',Description: 'Factor',DomainName: 'quantity'},
									{PropertyName: 'DateRequired',Description: 'Date Required',DomainName:'date'},
									{PropertyName: 'PaymentTermFi',Description: 'Payment Term FI',DomainName:'integer', Editor:'simpledescriptionlookup', NotUseDefaultValue:true, LookupQualifier: 'basics.lookup.paymentterm', DisplayMember: 'Code'},
									{PropertyName: 'PaymentTermPa',Description: 'Payment Term PA',DomainName:'integer', Editor:'simpledescriptionlookup', NotUseDefaultValue:true, LookupQualifier: 'basics.lookup.paymentterm', DisplayMember: 'Code'},
									{PropertyName: 'Incoterm',Description: 'Incoterm',DomainName:'integer', Editor:'simpledescriptionlookup', NotUseDefaultValue:true, LookupQualifier:'basics.customize.incoterm',DisplayMember: 'Description'},
									{PropertyName: 'Address',Description: 'Address'},
									{PropertyName: 'SupplierReference',Description: 'Supplier Reference'},
									{PropertyName: 'Trademark',Description: 'Trademark'},
									{PropertyName: 'Comment',Description: 'Comment'},
									{PropertyName: 'Remark',Description: 'Remark'},
									{PropertyName: 'BatchNo',Description: 'Batch No'},
									{PropertyName: 'UserDefined1',Description: 'User Defined 1'},
									{PropertyName: 'UserDefined2',Description: 'User Defined 2'},
									{PropertyName: 'UserDefined3',Description: 'User Defined 3'},
									{PropertyName: 'UserDefined4',Description: 'User Defined 4'},
									{PropertyName: 'UserDefined5',Description: 'User Defined 5'},
									{PropertyName: 'MaterialFk',Description: 'Material Code',DomainName: 'integer',Editor: 'simpledescriptionlookup',LookupQualifier: 'basics.material.neutralmaterial',DisplayMember: 'Code'}
								];
								var columnPrefix='Variant';

								//var newSupplyNum = Number(parentScope.customEntity.ScopeSupply);
								//var newVariantNum = Number(parentScope.customEntity.ScopeVariant);

								var oldVariantNames = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
									return _.startsWith(item.EntityName, columnPrefix)&&!_.includes(item.EntityName, 'Supply');
								});
								var oldSupplyItemNos = _.filter(parentScope.entity.ImportDescriptor.Fields, function (item) {
									return _.startsWith(item.EntityName, columnPrefix)&&_.includes(item.EntityName, 'Supply');
								});
								var oldVarintNum = oldVariantNames.length/arrVariant.length;
								var oldSupplyNum = oldSupplyItemNos.length/arrSupply.length;

								parentScope.entity.ImportDescriptor.Fields = parentScope.entity.ImportDescriptor.Fields.filter(function (field) {
									var hasVariant= _.includes(field.EntityName,'Variant');
									return !hasVariant;
								});

								var needAddRows=[];
								var showcolumnPrefix=$translate.instant('basics.material.import.dynamicVariant');
								for(var m=1; m<=parentScope.customEntity.ScopeVariant; m++) {
									var propertyName = columnPrefix + m;
									var displayName = $translate.instant('basics.material.import.dynamicProperty', {
										'name': showcolumnPrefix,
										'prop': m
									}) || columnPrefix + m;
									for(var x=0; x<arrVariant.length; x++) {
										var item=arrVariant[x];
										var variant = {
											PropertyName: propertyName + '_' + item.PropertyName,
											EntityName: 'Variant' + m,
											DomainName: item.DomainName ? item.DomainName : 'description',
											Editor: item.Editor ? item.Editor : 'domain',
											DisplayName: displayName + ' - ' + item.Description
										};
										if (item.LookupQualifier) {
											variant.LookupQualifier = item.LookupQualifier;
										}
										if (item.DisplayMember) {
											variant.DisplayMember = item.DisplayMember;
										}

										if(m>oldVarintNum) {
											setAddFieldMappingByOldProfileField(variant);
										}
										needAddRows.push(variant);

										if(item.PropertyName==='Description'){
											let map = mapTrColumnFn(variant);
											trLanguages.forEach(function (languageItem) {
												let trItem=map(languageItem);
												if(m>oldVarintNum) {
													setAddFieldMappingByOldProfileField(trItem);
												}
												needAddRows.push(trItem);
											});
										}
									}

									for (var n = 1; n <=parentScope.customEntity.ScopeSupply; n++) {
										for(var y=0; y<arrSupply.length; y++) {
											var _item=arrSupply[y];
											var displaySupplyName = displayName + ' - ' + _item.Description + ' ' + n;
											if (_item.PropertyName.indexOf('userDefined') > -1) {
												displaySupplyName = displayName + ' - ' + _item.Description + ' - ' + n;
											}
											var supply = {
												PropertyName: propertyName + '_' + _item.PropertyName + '_' + n,
												EntityName: 'Variant' + m+'Supply'+n,
												DomainName: _item.DomainName ? _item.DomainName : 'description',
												Editor: _item.Editor ? _item.Editor : 'domain',
												DisplayName: displaySupplyName
											};
											if (_item.LookupQualifier) {
												supply.LookupQualifier = _item.LookupQualifier;
											}
											if (_item.DisplayMember) {
												supply.DisplayMember = _item.DisplayMember;
											}
											if(n>oldSupplyNum){
												setAddFieldMappingByOldProfileField(supply);
											}
											needAddRows.push(supply);

											if(_item.PropertyName==='Description1'||_item.PropertyName==='Description2'||_item.PropertyName==='Specification'){
												var _map = mapTrColumnFn(supply);
												trLanguages.forEach(function (languageItem) {
													var trItem=_map(languageItem);
													if(n>oldSupplyNum){
														setAddFieldMappingByOldProfileField(trItem);
													}
													needAddRows.push(trItem);
												});
											}

										}
									}
								}
								var lastIndex =  parentScope.entity.ImportDescriptor.Fields.length;
								for (var i = 0, j = lastIndex; i < needAddRows.length; i++ , j++) {
									parentScope.entity.ImportDescriptor.Fields.splice(j, 0, needAddRows[i]);
								}

							}
						}
					},
					GetGridColumn:function(columns){
						var basicsRoundingService=basicsCommonRoundingService.getService('basics.material');
						basicsRoundingService.gridRoundingConfig({columns:columns,extraStr:'_New'});
						let quantityDecimalPlaces = basicsRoundingService.getDecimalPlaces('Quantity');
						let priceDecimalPlaces = basicsRoundingService.getDecimalPlaces('Price');
						_.forEach(columns,function(item){
							if(item.field.startsWith('Variant')&&(item.formatter==='quantity'||item.formatter==='money')){
								if(item.formatter==='quantity'){
									item.formatterOptions= {decimalPlaces: quantityDecimalPlaces};
								}
								else if(item.formatter==='money'){
									item.formatterOptions= {decimalPlaces: priceDecimalPlaces};
								}
							}
						});
					},
					CanSimulateNext:function(previewData){
						if(previewData.length>1000) {
							return true;
						}
						else{
							return _.find(previewData, {Selected: true});
						}
					},
					SkipSimulatePage:function(scope,previewData){
						if(previewData.length>1000) {
							scope.steps[5].skip=true;
							scope.hasPreviewed = true;
							scope.entity.ImportDescriptor.CustomSettings.SkipPreview=false;
							scope.entity.ImportDescriptor.CustomSettings.SkipPreviewAndSimulate = true;
						}
					},
					OnImportTypeChangedCallback: function(id,scope){
						var newFields = [];
						if(1===id){
							scope.customEntity.ImportType=1;
							newFields=angular.copy(materialImportMappingFieldService.Fields);
						}
						else{
							scope.customEntity.ImportType=2;
							newFields=angular.copy(materialImportMappingFieldService.PriceList);
							if (scope.customEntity.SpecifiedPriceListVersion) {
								var index = _.findIndex(newFields, {PropertyName: 'PriceVersion'});
								newFields.splice(index, 1);
							}
						}
						scope.entity.ImportDescriptor.Fields=newFields;
					},
					ModifyCustomSetting:function(scope){
						if(scope.currentStep.number === 2){
							var customSetting=scope.customEntity;
							var s = materialCatalogService.getSelected();
							var description = s.DescriptionInfo && s.DescriptionInfo.Description && s.DescriptionInfo.Description.length > 0 ? '-'+s.DescriptionInfo.Description : '';
							customSetting.CatalogCodeDes = s.Code + description;
							customSetting.OptionCode = s.Code;
							customSetting.OptionCodeId = s.Id;
							if(scope.formOptionsCustomSettings && scope.formOptionsCustomSettings.configure){
								var oldRows = scope.formOptionsCustomSettings.configure.rows;
								var importPrice = ['SpecifiedPriceListVersion','PriceVersion'];
								var importMaterial = ['IsNewMaterialGroup','Attributes','Characteristics','Documents','groupLevel','scopeVariant','IsPriceAfterTax','ImportTranslation','SkipPreviewAndSimulate'];
								_.forEach(oldRows,function(item){
									if(_.includes(importPrice,item.model)||_.includes(importPrice,item.rid)){
										item.visible = scope.entity.ImportType === 2;
									}
									if(_.includes(importMaterial,item.model)||_.includes(importMaterial,item.rid)){
										item.visible = scope.entity.ImportType === 1;
									}
								});
								var priceVersionField = _.find(oldRows,{model:'PriceVersion'});
								if (priceVersionField.readonly) {
									scope.customEntity.PriceVersion = null;
								}
								else {
									if (!scope.customEntity.PriceVersion) {
										scope.customEntity.PriceVersion = minMaterialPriceVersionId;
										platformRuntimeDataService.readonly(scope.customEntity, [{field: 'PriceVersion', readonly: false}]);
									}
								}
							}
						}
					},
					HandleImportSucceed:function(res){
							var ids =[];
							let successMaterial = _.find(res, function (item) {
								return item.MaterialIds && item.MaterialIds.length > 0;
							});
							if (successMaterial) {
								let materialIds=successMaterial.MaterialIds;
								mainDataService.navigateToItem(materialIds);
							}
							else {
								ids = _.map(res, 'Id');
							}
							if(ids.length>0) {
								mainDataService.navigateToItem(ids);
							}
					},

					HandleImportFirstPage:function(formConfig){
						var materialCatalogSelectedItem = materialCatalogService.getSelected();
						basicsMaterialWizardService.getMaterialCatalogPriceVersions(materialCatalogSelectedItem.Id).then(
							function(success) {
								var priceVersions = filterPriceVersionsByTime(success.data);
								basicsMaterialWizardService.materialCatalogPriceVersions = priceVersions;
								materialPriceVersion = priceVersions;
								if (priceVersions.length > 0) {
									minMaterialPriceVersionId = _.min(_.map(priceVersions, function (item) {
										return item.Id;
									}));
								}
							});
						var importTypeRow = _.find(formConfig.rows,{model:'ImportType'});
						importTypeRow.visible = true;
						importTypeRow.options.filterKey = 'import-type-filter';
						var profileRow = _.find(formConfig.rows,{model:'ProfileName'});
						profileRow.options.filterKey = 'import-type-to-profile-filter';
						//default checked Specified Price Version
						this.ImportDescriptor.CustomSettings.PriceVersion = null;
						this.ImportDescriptor.CustomSettings.SpecifiedPriceListVersion = true;
						var priceVersionField = _.find(this.CustomSettingsPage.Config.rows,{model:'PriceVersion'});
						priceVersionField.readonly = false;
					},

					/*ModifyTranslate:function(scope){
                        if(scope.currentStep.name && scope.currentStep.number === 0){
                            scope.currentStep.name = $translate.instant('basics.material.import.headName');
                        }
                    },*/

					ModifyImportDocumentPage:function(scope){
						/*_.forEach(scope.formOptionsImportfile.configure.rows,function(item){
                            if(item.model === 'ImportFormat' || item.model === 'ExcelSheetName'){
                                item.visible = false;
                            }
                        });*/
						scope.entity.fileFilter = '*.xlsx | *.zip';
						scope.entity.placeholder = $translate.instant('basics.material.import.placeholder');
					},

					HandleImportCustomSetting:function(parentScope){
						var priceVersionField = _.find(parentScope.options.importOptions.CustomSettingsPage.Config.rows,{model:'PriceVersion'});
						priceVersionField.readonly = !priceVersionField.readonly;
						if (priceVersionField.readonly) {
							parentScope.customEntity.PriceVersion = null;
						}
						else {
							parentScope.customEntity.PriceVersion = minMaterialPriceVersionId;
						}
						platformRuntimeDataService.readonly(parentScope.customEntity, [{field: 'PriceVersion', readonly: priceVersionField.readonly}]);
					},

					/**
                     * @return {boolean}
                     */
					CanNext:function (parentScope) {
						if(parentScope.entity.ImportType === 1){
							return $scope.canNext;
						}
						else{
							return true;
						}
					},
					FieldsAlwaysUseDefault: ['EditorDirective', 'Editor']
				};
				platformMainControllerService.registerImport(importOptions);
				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					parentService: materialCatalogService,
					columnConfig: []
				});

				var filter = [{
					key: 'import-price-list-price-version-filter',
					serverSide: true,
					serverKey: 'import-price-list-price-version-filter',
					fn: function () {
						var catalog = materialCatalogService.getSelected();
						return {
							MaterialCatalogFk: catalog ? catalog.Id : null
						};
					}
				},{
					key: 'import-type-to-profile-filter',
					fn: function (item,entity) {
						return item.importType === entity.ImportType;
					}
				},{
					key: 'import-type-filter',
					fn: function (item) {
						if (materialPriceVersion.length !== 0) {
							return true;
						}
						else {
							return item.Id === 1;
						}
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(filter);
				// ---

				materialGroupsService.load().then(materialCatalogService.load());

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(mainDataService, result, translateService, opt);
					mainDataService.clearData();
					basicsMaterialWizardService.deactive();
					basicsLookupdataLookupFilterService.unregisterFilter(filter);
				});

				function filterPriceVersionsByTime(priceVersions){
					var data = [];
					var currentDate = new Date();
					var validFromDate;
					var validToDate;
					$.each(priceVersions, function(idx, item) {
						if (item.ValidFrom && item.ValidTo) {
							validFromDate  = new Date(item.ValidFrom);
							validToDate  = new Date(item.ValidTo);
							if (currentDate.getTime() >= validFromDate.getTime() && currentDate.getTime() <= validToDate.getTime()) {
								data.push(item);
							}
						}
						else if (item.ValidFrom) {
							validFromDate  = new Date(item.ValidFrom);
							if (currentDate.getTime() >= validFromDate.getTime()) {
								data.push(item);
							}
						}
						else if (item.ValidTo) {
							validToDate  = new Date(item.ValidTo);
							if (currentDate.getTime() <= validToDate.getTime()) {
								data.push(item);
							}
						}
						else {
							data.push(item);
						}
					});
					return data;
				}

			}]);
})(angular);
