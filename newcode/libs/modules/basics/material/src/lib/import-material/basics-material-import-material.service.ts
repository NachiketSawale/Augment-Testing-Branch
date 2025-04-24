/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector } from '@angular/core';
import { createLookup, FieldType, FormStep, IMenuItemEventInfo, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { ModuleNavBarService, NavBarIdentifier } from '@libs/ui/container-system';
import { BasicsSharedImportEditorType, BasicsSharedImportExcelService, BasicsSharedImportField, BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { IDataLanguage, PlatformTranslateService } from '@libs/platform/common';
import { BasicsMaterialMaterialCatalogDataService } from '../material-catalog/basics-material-material-catalog-data.service';
import { IMPORT_MAPPING_FIELDS, SUPPLY_FIELDS, VARIANT_FIELDS } from './basics-material-import-mapping-field.service';
import { BasicsMaterialGroupSetting, BasicsMaterialImportType } from '../model/enums/basics-material-import-material.enum';
import { IBasicsMaterialCustomEntity } from '../model/entities/basics-material-custom-entity.interface';
import { EntityDataTranslationService } from '@libs/platform/data-access';
import { firstValueFrom } from 'rxjs';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class IBasicsMaterialImportMaterialService {
	private lookupFactory = inject(UiCommonLookupDataFactoryService);
	private readonly basicsShareImportExcelService = inject(BasicsSharedImportExcelService);
	private readonly moduleNavBarService = inject(ModuleNavBarService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly catalogService = inject(BasicsMaterialMaterialCatalogDataService);
	private readonly dataTranslationService = inject(EntityDataTranslationService);

	public initImport(injector: Injector) {
		const importBtn = this.moduleNavBarService.getById(NavBarIdentifier.id.import);
		if (importBtn) {
			importBtn.fn = async (info: IMenuItemEventInfo<void>) => {
				const allTrLanguages = await firstValueFrom(this.dataTranslationService.getAllLanguages());
				const catalog = this.catalogService.getSelectedEntity()!;
				this.basicsShareImportExcelService.showImportDialog({
					moduleName: 'basics.material',
					checkDuplicationPage: {skip: true},
					ImportDescriptor: {
						DoubletFindMethods: [],
						Fields: IMPORT_MAPPING_FIELDS,
						CustomSettings: {
							CatalogCodeDes: this.GetCatalogCodeAndDescription(),
							OptionCode: catalog.Code,
							OptionCodeId: catalog.Id,
							ImportType: BasicsMaterialImportType.importMaterial,
							IsNewMaterialGroup: 0,
							GroupLevel: 3,
							Attributes: 5,
							Characteristics: 5,
							Documents: 5,
							ScopeVariant: 5,
							ScopeSupply: 5,
							SpecifiedPriceListVersion: true,
							SkipPreviewAndSimulate: false,
							ImportTranslation: false,
							IsPriceAfterTax: false,
							Translations: ['Description1', 'Description2', 'Specification'],
						},
						FieldProcessor: (model, oldProfile) => {
							const customSettings = model.ImportDescriptor.CustomSettings as IBasicsMaterialCustomEntity;
							let fields = model.ImportDescriptor.Fields;
							if (customSettings.ImportType === BasicsMaterialImportType.importMaterial) {
								if (customSettings.ImportTranslation) {
									this.generateTrFields(allTrLanguages, fields, customSettings.Translations);
								}
								const columnPrefixs = ['MaterialGroup', 'Property', 'Characteristic', 'MaterialDocument', 'Variant', 'Supply'];
								fields = fields.filter((item) => !columnPrefixs.find((columnPrefix) => item.EntityName.startsWith(columnPrefix)));

								if (customSettings.IsNewMaterialGroup === BasicsMaterialGroupSetting.createNewGroup) {
									fields = fields.filter((field) => !field.EntityName.includes('Level'));
								} else if (customSettings.IsNewMaterialGroup === BasicsMaterialGroupSetting.followGroupSetting) {
									this.generateMaterialGroup(fields, customSettings.GroupLevel);
								}
								this.generateAttribute(fields, customSettings.Attributes);
								this.generateCharacteristic(fields, customSettings.Characteristics);
								this.generateDocument(fields, customSettings.Documents);
								this.generateVariantAndSupply(fields, customSettings.ScopeVariant, customSettings.ScopeSupply);
							}
							if (oldProfile) {
								this.setFieldMappingByOldProfileField(fields, oldProfile.ImportDescriptor.Fields);
							}
						},
					},
					nextStepPreprocessFn: (dialog) => {
						//todo Visible cannot affect the form interface, this is something that the framework needs to solve
						const customStep = dialog.wizardSteps.find((item) => item.id === 'customSettingsPage') as FormStep<object>;
						const importType = dialog.dataItem.ImportType;
						customStep.formConfiguration.rows.forEach((item) => {
							item.visible = (item.model !== 'IsPriceListVersion' && importType == BasicsMaterialImportType.importMaterial) || (item.model === 'IsPriceListVersion' && importType == BasicsMaterialImportType.importPriceList);
						});

						return Promise.resolve(true);
					},
					fileSelectionPage: {
						customFormRows: [
							{
								id: 'importType',
								label: this.translateService.instant('basics.material.import.importType'),
								type: FieldType.Lookup,
								lookupOptions: createLookup({
									dataService: this.lookupFactory.fromSimpleItemClass(
										[
											{
												id: BasicsMaterialImportType.importMaterial,
												desc: {
													text: 'Import Material',
													key: 'basics.material.import.importMaterial',
												},
											},
											{
												id: BasicsMaterialImportType.importPriceList,
												desc: {
													text: 'Import Price List',
													key: 'basics.material.import.importPriceList',
												},
											},
										],
										{
											uuid: 'fb3aa11ba3a54609a096c82390175042',
											valueMember: 'id',
											displayMember: 'desc',
											translateDisplayMember: true,
										},
									),
								}),
								model: 'ImportType',
								visible: true,
								sortOrder: 1,
							},
						],
					},
					customSettingsPage: {
						config: {
							showGrouping: false,
							rows: [
								{
									groupId: 'materialImport',
									id: 'catalogCodeDes',
									label: {
										text: 'Catalog Code',
										key: 'basics.material.import.catalogCode',
									},
									type: FieldType.Code,
									model: 'CatalogCodeDes',
									visible: true,
									readonly: true,
									sortOrder: 1,
								},
								{
									groupId: 'materialImport',
									id: 'IsNewMaterialGroup',
									label: {
										text: 'KeepOrNewMaterialGroup',
										key: 'basics.material.import.keepOrNewMaterialGroup',
									},
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										dataService: this.lookupFactory.fromSimpleItemClass(
											[
												{
													id: BasicsMaterialGroupSetting.followGroupSetting,
													desc: {
														text: 'Follow Group Setting in File',
														key: 'basics.material.import.keepExistMaterialGroup',
													},
												},
												{
													id: BasicsMaterialGroupSetting.createNewGroup,
													desc: {
														text: 'Create New Group by System',
														key: 'basics.material.import.newMaterialGroup',
													},
												},
											],
											{
												uuid: '3948d7483c69414f9d450b68790f06c4',
												valueMember: 'id',
												displayMember: 'desc',
												translateDisplayMember: true,
											},
										),
									}),
									model: 'IsNewMaterialGroup',
									visible: true,
									sortOrder: 2,
								},
								{
									groupId: 'materialImport',
									id: 'composite',
									label: {
										text: 'Group Level',
										key: 'basics.material.import.groupLevel',
									},
									type: FieldType.Composite,
									visible: true,
									sortOrder: 3,
									composite: [{
										id: 'groupLevel',
										model: 'GroupLevel',
										type: FieldType.Code,
									}, {
										id: 'noMappingGroupStructure',
										label: {
											text: 'No Mapping Group Structure',
											key: 'basics.material.import.noMappingGroupStructure',
										},
										type: FieldType.Lookup,
										lookupOptions: createLookup({
											dataServiceToken: BasicsSharedProcurementStructureLookupService,
										}),
										model: 'NoMappingGroupStructure',
									}
									]
								},
								{
									groupId: 'materialImport',
									id: 'attributeNumber',
									label: {
										text: 'Attribute Count',
										key: 'basics.material.import.attribute',
									},
									type: FieldType.Code,
									model: 'Attributes',
									visible: true,
									sortOrder: 5,
								},
								{
									groupId: 'materialImport',
									id: 'characteristicsNumber',
									label: {
										text: 'Characteristics Count',
										key: 'basics.material.import.characteristics',
									},
									type: FieldType.Code,
									model: 'Characteristics',
									visible: true,
									sortOrder: 6,
								},
								{
									groupId: 'materialImport',
									id: 'documentNumber',
									label: {
										text: 'Document Count',
										key: 'basics.material.import.documents',
									},
									type: FieldType.Code,
									model: 'Documents',
									visible: true,
									sortOrder: 7,
								},
								{
									groupId: 'materialImport',
									id: 'scope',
									type: FieldType.Composite,
									visible: true,
									sortOrder: 8,
									label: {
										text: 'Scope Variant',
										key: 'basics.material.import.scopeVariant',
									},
									composite: [{
										id: 'scopeVariant',
										type: FieldType.Code,
										model: 'ScopeVariant',
									}, {
										id: 'scopeSupply',
										label: {
											text: 'Scope Supply',
											key: 'basics.material.import.scopeSupply',
										},
										type: FieldType.Code,
										model: 'ScopeSupply',
									}]
								},
								{
									groupId: 'materialImport',
									id: 'isPriceAfterTax',
									label: {
										text: 'Import price after tax',
										key: 'basics.material.import.PriceTax',
									},
									type: FieldType.Boolean,
									model: 'IsPriceAfterTax',
									visible: true,
									sortOrder: 10,
								},
								{
									groupId: 'materialImport',
									id: 'SkipPreviewAndSimulate',
									label: {
										text: 'Skip Preview & Simulate',
										key: 'basics.material.import.SkipPreviewAndSimulate',
									},
									type: FieldType.Boolean,
									model: 'SkipPreviewAndSimulate',
									visible: true,
									sortOrder: 11,
								},
								{
									groupId: 'materialImport',
									id: 'importTranslation',
									label: {
										text: 'Import Translation',
										key: 'basics.material.import.ImportTranslation',
									},
									type: FieldType.Boolean,
									model: 'ImportTranslation',
									visible: true,
									sortOrder: 12,
								},
								{
									groupId: 'materialImport',
									id: 'priceListVersion',
									label: {
										text: 'Specify Price Version',
										key: 'basics.material.import.specifiedPriceVersion',
									},
									type: FieldType.Boolean,
									model: 'IsPriceListVersion',
									visible: false,
									sortOrder: 13,
								},
							],
						},
					},
				});
			};
		}
	}

	private GetCatalogCodeAndDescription() {
		const catalog = this.catalogService.getSelectedEntity()!;
		const description = catalog.DescriptionInfo?.Description ? `-${catalog.DescriptionInfo.Description}` : '';
		return `${catalog.Code}${description}`;
	}

	private mapTrColumnFn(field: BasicsSharedImportField) {
		return (item: IDataLanguage) => {
			let displayName = this.translateService.instant(field.DisplayName).text;
			if (item.DescriptionInfo) {
				displayName = ' - ' + item.DescriptionInfo.Translated;
			}
			return {
				PropertyName: field.PropertyName + '_' + item.Culture,
				EntityName: field.EntityName,
				DomainName: field.DomainName,
				Editor: field.Editor,
				DisplayName: displayName,
				ValueName: field.ValueName ? field.ValueName + '_' + item.Culture : undefined,
				//__isTrColumn: true
			};
		};
	}

	private generateTrFields(trLanguages: IDataLanguage[], fields: BasicsSharedImportField[], translations: string[]) {
		translations.forEach((translation) => {
			const field = fields.find((item) => item.PropertyName == translation);
			if (field) {
				const trFields = trLanguages.map(this.mapTrColumnFn(field));
				// Insert the translation fields after the original field
				fields.splice(fields.indexOf(field) + 1, 0, ...trFields);
			}
		});
	}

	private generateItems(fields: BasicsSharedImportField[], count: number, itemBuilder: (index: number) => BasicsSharedImportField[], startIndex?: number, subItemBuilder?: (fields: BasicsSharedImportField[], index: number) => void) {
		const newItems: BasicsSharedImportField[] = [];
		for (let i = 1; i <= count; i++) {
			const items = itemBuilder(i);
			newItems.push(...items);
			if (subItemBuilder) {
				subItemBuilder(newItems, i);
			}
		}
		!isNil(startIndex) ? fields.splice(startIndex, 0, ...newItems) : fields.push(...newItems);
	}

	private generateMaterialGroup(fields: BasicsSharedImportField[], groupLevel: number) {
		const attributeBuilder: (index: number) => BasicsSharedImportField[] = (i) => {
			return [
				{
					EntityName: 'MaterialGroupLevel',
					DomainName: 'lookup',
					DisplayName: this.translateService.instant('basics.material.import.group', {grade: i}).text,
					Editor: BasicsSharedImportEditorType.idLookup,
					PropertyName: `MaterialGroupLevel${i}_Code`,
					ValueName: `MaterialGroupLevel${i}_Id`,
				},
				{
					EntityName: 'MaterialGroupDesLevel',
					DomainName: 'description',
					DisplayName: this.translateService.instant('basics.material.import.groupDescription', {grade: i}).text,
					Editor: BasicsSharedImportEditorType.domain,
					PropertyName: `MaterialGroupLevel${i}_Description`,
				},
				{
					EntityName: 'MaterialGroupStructureLevel',
					DomainName: 'lookup',
					DisplayName: this.translateService.instant('basics.material.import.structure', {grade: i}).text,
					Editor: BasicsSharedImportEditorType.idLookup,
					PropertyName: `GroupStructureLevel${i}_Code`,
					ValueName: `GroupStructureLevel${i}_Id`,
				},
			];
		};
		//in angular.js Material Group at top of the grid.
		this.generateItems(fields, groupLevel, attributeBuilder, 0);
	}

	private generateAttribute(fields: BasicsSharedImportField[], attributeNumber: number) {
		const attributeBuilder: (index: number) => BasicsSharedImportField[] = (i) => {
			return [
				{
					DomainName: 'description',
					PropertyName: `Property${i}Name`,
					EntityName: `Property${i}`,
					Editor: BasicsSharedImportEditorType.domain,
					DisplayName: this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicPropertyName', prop: i}).text,
				},
				{
					DomainName: 'description',
					PropertyName: `Property${i}Value`,
					EntityName: `Property${i}`,
					Editor: BasicsSharedImportEditorType.domain,
					DisplayName: this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicPropertyName', prop: i}).text,
				},
			];
		};
		this.generateItems(fields, attributeNumber, attributeBuilder);
	}

	private generateCharacteristic(fields: BasicsSharedImportField[], characteristicNumber: number) {
		const columnPrefix = 'Characteristic';
		const attributeBuilder: (index: number) => BasicsSharedImportField[] = (i) => {
			return [
				{
					DomainName: 'description',
					PropertyName: `${columnPrefix}${i}_GroupId`,
					EntityName: `${columnPrefix}${i}`,
					Editor: BasicsSharedImportEditorType.domain,
					DisplayName: this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicCharacteristicName', prop: i}).text,
				},
				{
					DomainName: 'description',
					PropertyName: `${columnPrefix}${i}_Code`,
					EntityName: `${columnPrefix}${i}`,
					Editor: BasicsSharedImportEditorType.domain,
					DisplayName: this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicCharacteristicName', prop: i}).text,
				},
				{
					DomainName: 'description',
					PropertyName: `${columnPrefix}${i}_Value`,
					EntityName: `${columnPrefix}${i}`,
					Editor: BasicsSharedImportEditorType.domain,
					DisplayName: this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicCharacteristicName', prop: i}).text,
				},
			];
		};
		this.generateItems(fields, characteristicNumber, attributeBuilder);
	}

	private generateDocument(fields: BasicsSharedImportField[], documentNumber: number) {
		const columnPrefix = 'MaterialDocument';
		const attributeBuilder: (index: number) => BasicsSharedImportField[] = (i) => {
			return [
				{
					DomainName: 'description',
					PropertyName: `${columnPrefix}${i}`,
					EntityName: `${columnPrefix}`,
					ValueName: `DocumentColName${i}`,
					Editor: BasicsSharedImportEditorType.none,
					DisplayName: this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicMaterialName', prop: i}).text,
				},
			];
		};
		this.generateItems(fields, documentNumber, attributeBuilder);
	}

	private generateVariantAndSupply(fields: BasicsSharedImportField[], variantNumber: number, supplyNumber: number) {
		const variantColumnPrefix = 'Variant';
		const attributeBuilder: (index: number) => BasicsSharedImportField[] = (m) => {
			const variantRows: BasicsSharedImportField[] = [];
			const variantPropertyName = `${variantColumnPrefix}${m}`;
			const displayName = this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicVariant', prop: m}).text;
			VARIANT_FIELDS.forEach((variantField) => {
				const variant: BasicsSharedImportField = {
					PropertyName: `${variantPropertyName}_${variantField.PropertyName}`,
					EntityName: `${variantColumnPrefix}${m}`,
					DomainName: variantField.DomainName ? variantField.DomainName : 'description',
					Editor: variantField.Editor ? variantField.Editor : BasicsSharedImportEditorType.domain,
					DisplayName: `${displayName}-${variantField.Description}`,
				};
				variantRows.push(variant);
			});
			return variantRows;
		};
		//Combining the variant and supply attributes in the attributeBuilder can lead to order issues.Handle sub-items separately
		const subAttributeBuilder: (newFields: BasicsSharedImportField[], index: number) => void = (newFields, m) => {
			this.generateSupply(newFields, supplyNumber, m);
		};
		this.generateItems(fields, variantNumber, attributeBuilder, undefined, subAttributeBuilder);
	}

	private generateSupply(fields: BasicsSharedImportField[], supplyNumber: number, variantIndex: number) {
		const attributeBuilder: (supplyIndex: number) => BasicsSharedImportField[] = (n) => {
			const needAddRows: BasicsSharedImportField[] = [];
			const displayName = this.translateService.instant('basics.material.import.dynamicProperty', {name: 'basics.material.import.dynamicVariant', prop: variantIndex}).text;
			SUPPLY_FIELDS.forEach((supplyField) => {
				const supply: BasicsSharedImportField = {
					PropertyName: `Variant${variantIndex}_${supplyField.PropertyName}_${n}`,
					EntityName: `Variant${variantIndex}Supply${n}`,
					DomainName: supplyField.DomainName ? supplyField.DomainName : 'description',
					Editor: supplyField.Editor ? supplyField.Editor : 'domain',
					DisplayName: `${displayName}-${supplyField.Description} ${n}`,
				};
				needAddRows.push(supply);
			});
			return needAddRows;
		};
		this.generateItems(fields, supplyNumber, attributeBuilder);
	}

	private setFieldMappingByOldProfileField(fields: BasicsSharedImportField[], profileFields: BasicsSharedImportField[]) {
		const profileFieldMap = new Map<string, string>();
		profileFields.forEach((profileField) => {
			const mappingName = profileField.MappingName ? profileField.MappingName : '';
			profileFieldMap.set(profileField.PropertyName, mappingName);
		});
		fields.forEach((field) => {
			if (profileFieldMap.has(field.PropertyName)) {
				field.MappingName = profileFieldMap.get(field.PropertyName);
			}
		});
	}
}
