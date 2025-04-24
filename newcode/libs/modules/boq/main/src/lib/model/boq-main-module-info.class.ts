/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { BasicsSharedTaxCodeLookupService, BasicsSharedPhotoEntityViewerComponent, BasicsSharedSystemOptionLookupService, IBlobStringEntity, IPhotoEntityViewerContext, PHOTO_ENTITY_VIEWER_OPTION_TOKEN } from '@libs/basics/shared';
import { OptionallyAsyncResource, PlatformHttpService, ServiceLocator, prefixAllTranslationKeys } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { BusinessModuleInfoBase, EntityContainerInjectionTokens, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { FieldType, LookupSimpleEntity, createLookup } from '@libs/ui/common';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { BoqMainSubpriceConfigService, BoqSubpriceBehaviorService, BoqSubpriceDataService } from '../services/boq-main-subprice.service';
import { BoqBlobSpecificationComponent } from '../components/boq-main-blob-specification.component';
import { ISourceBoqEntity, SourceBoqComponent } from '../components/source-boq/source-boq.component';
import { BoqMainOenAkzDataService, boqMainOenAkzValidationService } from '../services/5oenorm/boq-main-oen-akz-data.service';
import { BoqMainOenLbmetadataDataService } from '../services/5oenorm/boq-main-oen-lbmetadata-data.service';
import { BoqMainOenLbMetadataTypeLookupDataService, BoqMainOenPricingMethodLookupService, BoqMainOenReleaseStatusLookupService, BoqMainOenServicePartLookupService, BoqMainOenStatusLookupService, BoqMainOenZzLookupService, BoqMainOenZzVariantLookupService } from '../services/5oenorm/boq-main-oen-lookup.service';
import { BoqMainOenLvheaderDataService } from '../services/5oenorm/boq-main-oen-lvheader-data.service';
import { BoqMainOenPictureDataService } from '../services/5oenorm/boq-main-oen-picture-data.service';
import { BoqMainOenServicePartDataService } from '../services/5oenorm/boq-main-oen-service-part-data.service';
import { BoqMainOenZzDataService, BoqMainOenZzValidationService } from '../services/5oenorm/boq-main-oen-zz-data.service';
import { BoqMainOenZzVariantDataService, BoqMainOenZzVariantValidationService } from '../services/5oenorm/boq-main-oen-zz-variant-data.service';
import { BoqBlobSpecificationDataService } from '../services/boq-main-blob-specification-data.service';
import { BoqItemBehavior, BoqItemConfigService, BoqItemDataService, BoqItemDataServiceBase } from '../services/boq-main-boq-item-data.service';
import { BoqDummyRootDataService } from '../services/boq-main-dummy-root-data.service';
import { BoqItemCalculateLogic } from './boq-main-boq-item-calculate-logic.class';
import { BoqMainBoqUpdateWizardService } from '../services/wizards/boq-main-update-boq-wizard.service';
import { BoqMainAddIndexToBoqStructureWizardService } from '../services/wizards/boq-main-add-index-to-boq-structure-wizard.service';
import { BoqMainExportGaebWizardService, BoqMainImportGaebWizardService, BoqMainScanBoqGaebWizardService } from '../services/wizards/boq-main-wizard-gaeb.service';
import { BoqMainBoqExcelExportWizardService, BoqMainBoqExcelImportWizardService } from '../services/wizards/boq-main-excel-wizard.service';
import { BoqMainCrbSiaImportWizardService } from '../services/wizards/boq-main-crb-sia-import-wizard.service';
import { BoqMainSplitBoqDiscountWizardService } from '../services/wizards/boq-main-split-boq-discount-wizard.service';
import { BoqMainEraseEmptyDivisionsServiceWizardService } from '../services/wizards/boq-main-erase-empty-divisions.service';
import { BoqMainExportOenOnlbWizardService, BoqMainExportOenOnlvWizardService, BoqMainImportOenOnlvWizardService } from '../services/wizards/boq-main-wizard-oen.service';
import { BoqMainGenerateWicNumberWizardService, BoqMainUpdateDataFromWicWizardService } from '../services/wizards/boq-main-wic-wizard.service';
import { BoqMainRenumberBoqWizardService } from '../services/wizards/boq-main-renumber-boq-wizard.service';
import { BoqMainRenumberFreeBoqWizardService } from '../services/wizards/boq-main-renumber-free-boq-wizard.service';
import { BoqMainResetServiceCatalogNoWizardService } from '../services/wizards/boq-main-reset-service-catalog-no-wizard.service';
import { BoqMainCrbSiaExportWizardService } from '../services/wizards/boq-main-crb-sia-export-wizard.service';
import { BoqCopyUnitRateToBudgetUnitWizardService } from '../services/wizards/boq-main-copy-unit-rate-to-budget-unit-wizard.service';
import { BoqMainSplitUrbWizardService } from '../services/wizards/boq-main-split-urb-wizard.service';
import { BoqMainFormatBoqSpecificationWizardService } from '../services/wizards/boq-main-format-boq-specification-wizard.service';
import { IOenBoqItemEntity } from './entities/oen-boq-item-entity.interface';
import { IOenServicePartEntity } from './entities/oen-service-part-entity.interface';
import { IOenZzVariantEntity } from './entities/oen-zz-variant-entity.interface';
import { IOenLbMetadataEntity } from './entities/oen-lb-metadata-entity.interface';
import { IOenAkzEntity } from './entities/oen-akz-entity.interface';
import { IOenZzEntity } from './entities/oen-zz-entity.interface';
import { IOenLvHeaderEntity } from './entities/oen-lv-header-entity.interface';
import { BoqWizardRegisterService, IBoqItemEntity, IBoqItemSubPriceEntity, IBoqSplitQuantityEntity, IOenGraphicEntity } from '@libs/boq/interfaces';
import { BoqSplitQuantityDataService, BoqSplitQuantityBehaviorService, BoqSplitQuantityConfigService } from '../services/boq-main-split-quantity-data.service';

export class BoqMainModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new BoqMainModuleInfo();

	/**
	 * Returns the unique internal module name.
	 */
	public override get internalModuleName(): string {
		return 'boq.main';
	}

	public override get entities(): EntityInfo[] {
		return [
			this.dummyRootEntityInfo,
			this.boqItemEntityInfo,
			this.boqMainSubpriceEntityInfo,
			this.boqMainSplitQuantityEntityInfo,
			this.boqOenItemEntityInfo,
			this.boqMainSubpriceEntityInfo,
			this.boqOenLvHeaderEntityInfo,
			this.boqOenLbMetadataEntityInfo,
			this.boqOenAkzEntityInfo,
			this.boqOenZzEntityInfo,
			this.boqOenZzVariantEntityInfo,
			this.boqOenServicePartEntityInfo
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			new ContainerDefinition({
				containerType: BoqBlobSpecificationComponent,
				title: 'boq.main.boqSpecification',
				uuid:       '43107E9C90944E7BADC9239DEF245820',
				permission: '342bf3af97964f5ba24d3e3acc2242dd',
				providers:[
					{
						provide: new EntityContainerInjectionTokens<IBlobStringEntity>().dataServiceToken,
						useExisting: BoqBlobSpecificationDataService
					}
				]
			}),
			new ContainerDefinition({
				uuid: '2B07723E45A34BBC93355F38B47DE10C',
				id: 'boq.main.oen.graphic',
				title: 'boq.main.oen.graphicContainerTitle',
				containerType: BasicsSharedPhotoEntityViewerComponent,
				permission: '342bf3af97964f5ba24d3e3acc2242dd',
				providers: [
					{
						provide: new EntityContainerInjectionTokens<IOenGraphicEntity>().dataServiceToken,
						useExisting: BoqMainOenPictureDataService
					},
					{
						provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
						useValue: {
							isSingle: true,
							hideChangeItem: true,
							create: (context: IPhotoEntityViewerContext) => {
								const boqMainOenPictureDataService = ServiceLocator.injector.get(BoqMainOenPictureDataService);
								boqMainOenPictureDataService.createItemExtended();
							},
							delete:(context?: IPhotoEntityViewerContext ) => {
								const boqMainOenPictureDataService = ServiceLocator.injector.get(BoqMainOenPictureDataService);
								boqMainOenPictureDataService.deleteItemExtended();
							}
						}
					}
				]
			}),
			new ContainerDefinition({
				containerType: SourceBoqComponent,
				title: 'boq.main.boqLookup',
				uuid:       '50455BCE7DAB48CE97D1D6B9BC67CFE5',
				permission: '342bf3af97964f5ba24d3e3acc2242dd', // Todo-BoQ: Is this the correct permission?? With afore given container uuid it didn't work
				providers:[
					{
						provide: new EntityContainerInjectionTokens<ISourceBoqEntity>().dataServiceToken,
						useExisting: BoqBlobSpecificationDataService // Todo-BoQ: As there is currently no data service available, but it seems to be mandatory here, simple use the already existing service for specification
					}
				]
			})
		]);
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'cloud.common'];
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);

		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainBoqUpdateWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainBoqExcelImportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainBoqExcelExportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainRenumberBoqWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainRenumberFreeBoqWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainResetServiceCatalogNoWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainGenerateWicNumberWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainUpdateDataFromWicWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainCrbSiaExportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainCrbSiaImportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainAddIndexToBoqStructureWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqCopyUnitRateToBudgetUnitWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainExportOenOnlvWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainImportOenOnlvWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainExportOenOnlbWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainSplitBoqDiscountWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainSplitUrbWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainImportGaebWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainExportGaebWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainScanBoqGaebWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainEraseEmptyDivisionsServiceWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, BoqMainFormatBoqSpecificationWizardService);

		// Preload data, also lookup data
		const http = injector.get(PlatformHttpService);
		BoqItemCalculateLogic.loadBoqRoundedColumns2DetailTypes( http );
		const basicsSharedMdcTaxCodeLookupService = injector.get(BasicsSharedTaxCodeLookupService);
		basicsSharedMdcTaxCodeLookupService.getList().subscribe((taxCodes) => console.log('Tax codes loaded !!')); // Todo-Boq: not sure if preloading here in constructor is early enough to allow synchronous access later on ?!
		const basicsSharedSystemOptionLookupService = injector.get(BasicsSharedSystemOptionLookupService);
		basicsSharedSystemOptionLookupService.getList().subscribe((options) => console.log('System options loaded !!')); // Todo-Boq: not sure if preloading here in constructor is early enough to allow synchronous access later on ?!
	}

	private readonly dummyRootEntityInfo = EntityInfo.create({
		entitySchema: { schema: 'IBoqDummyRootEntity', properties: {}, },
		permissionUuid: 'daa1dfac385011ef9d6e325096b39f47',
		grid: false,
		dataService: ctx => ctx.injector.get(BoqDummyRootDataService)
	});

	public static createBoqItemEntityInfo(dataService: OptionallyAsyncResource<IEntitySelection<IBoqItemEntity>>, permissionUuid:string): EntityInfo {
		return EntityInfo.create({
			grid: { title: 'boq.main.boqStructure.incomplete', treeConfiguration: true, containerUuid: permissionUuid},
			permissionUuid: permissionUuid,
			dtoSchemeId: { moduleSubModule: 'Boq.Main', typeName: 'BoqItemDto' },
			dataService: dataService,
			containerBehavior: ctx => {
				const resolvedDataService = typeof dataService==='function' ? dataService(ctx) : dataService;
				return new BoqItemBehavior(resolvedDataService as BoqItemDataServiceBase, ctx.injector);
			},
			layoutConfiguration: ctx => ctx.injector.get(BoqItemConfigService).getLayoutConfiguration()
		} as IEntityInfo<IBoqItemEntity>);
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo(ctx=>ctx.injector.get(BoqItemDataService), '342bf3af97964f5ba24d3e3acc2242dd');

	private readonly boqOenItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqOenItemEntityInfo(ctx => ctx.injector.get(BoqItemDataService), '95dc49fc17594890b33e094fe444c7ae', '40239db4f9d94e4b87afa66224d5767c');

	private get boqMainSubpriceEntityInfo(): EntityInfo {
		const boqMainSubpriceEntityInfo: IEntityInfo<IBoqItemSubPriceEntity> = {
			grid: {
				title: 'boq.main.priceSideComputation.incomplete',
				behavior: ctx => ctx.injector.get(BoqSubpriceBehaviorService), // lagacyId is missing
				containerUuid:'9c4e32e8e42f4b1084a91d78b7b412c5'
			},
			//form:'9c4e32e8e42f4b1084a91d78b7b412c5', // lagacyId is missing
			dataService: ctx => ctx.injector.get(BoqSubpriceDataService),
			//validationService : ctx => ctx.injector.get(BoqMainSubpriceValidationService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'BoqItemSubPriceDto' },
			permissionUuid: '342bf3af97964f5ba24d3e3acc2242dd',
			layoutConfiguration: (ctx) => {
				return ctx.injector.get(BoqMainSubpriceConfigService).getLayoutConfiguration();
			},
		};

		return EntityInfo.create(boqMainSubpriceEntityInfo);
	}

	public static createBoqSplitQuantityEntityInfo(dataService: OptionallyAsyncResource<IEntitySelection<IBoqSplitQuantityEntity>>, containerUuid: string, permissionUuid:string): EntityInfo {
		const boqMainSplitQuantityEntityInfo: IEntityInfo<IBoqSplitQuantityEntity> = {
			grid: {
				title: 'boq.main.splitQuantity',
				containerUuid: containerUuid
			},
			dataService: dataService,
			containerBehavior: ctx => {
				const resolvedDataService = typeof dataService === 'function' ? dataService(ctx) : dataService;
				return new BoqSplitQuantityBehaviorService(resolvedDataService as BoqSplitQuantityDataService, ctx.injector);
			},
			dtoSchemeId: { moduleSubModule: 'Boq.Main' /*this.internalPascalCasedModuleName*/, typeName: 'BoqSplitQuantityDto' },
			permissionUuid: permissionUuid,
			layoutConfiguration: (ctx) => {
				const resolvedDataService = typeof dataService === 'function' ? dataService(ctx) : dataService;
				return new BoqSplitQuantityConfigService(resolvedDataService as BoqSplitQuantityDataService, ctx.injector).getLayoutConfiguration();
			},
		} as IEntityInfo<IBoqSplitQuantityEntity>;

		return EntityInfo.create(boqMainSplitQuantityEntityInfo);
	}

	private readonly boqMainSplitQuantityEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqSplitQuantityEntityInfo(ctx => ctx.injector.get(BoqSplitQuantityDataService), 'fda1ee3a56614031903ab8d711680a2f', '342bf3af97964f5ba24d3e3acc2242dd');

	public static createBoqOenItemEntityInfo(dataService: OptionallyAsyncResource<IEntitySelection<IOenBoqItemEntity>>, containerUuid: string, permissionUuid: string) {
		return EntityInfo.create({
			form: {
				title: 'boq.main.oenExtension.detailContainerTitle',
				containerUuid: containerUuid,
			},
			grid: false,
			dataService: dataService,
			dtoSchemeId: {moduleSubModule: 'Boq.Main', typeName: 'OenBoqItemDto'},
			permissionUuid: permissionUuid,
			layoutConfiguration: ctx => {

				const resolvedDataService = typeof dataService === 'function' ? dataService(ctx) : dataService;
				const boqOenZzLookupService = ctx.injector.get(BoqMainOenZzLookupService);
				boqOenZzLookupService.setBoqItemDataService(resolvedDataService as BoqItemDataServiceBase);

				return {
					groups: [
						{
							gid: 'Basic Data',
							attributes: ['OenStatusFk', 'OriginMark', 'OenZzFk', 'OenZzVariantFk', 'PreliminaryMark', 'IsEssentialPosition',
								'GuaranteedOfferSumGroup', 'PartOfferMark', 'OenServicePartFk', 'PartSumMark', 'IsNotOffered', 'ItemTotalUrb1',
								'ItemTotalUrb1Oc', 'ItemTotalUrb2', 'ItemTotalUrb2Oc', 'DiscountPercentItUrb1', 'DiscountPercentItUrb2', 'DiscountUrb1',
								'DiscountUrb1Oc', 'DiscountUrb2', 'DiscountUrb2Oc', 'FinalpriceUrb1', 'FinalpriceUrb1Oc', 'FinalpriceUrb2', 'FinalpriceUrb2Oc', 'OenPricingMethodFk',
								'LbChangeVersionNumber', 'OenLbChangeTypeFk', 'BlobsLbChangeFk', 'BlobsCommentFk', 'LbReferencePrev', 'LbNotInPartialEdition']
						},
					],
					overloads: {
						Id: {readonly: true},
						OenStatusFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup<IOenBoqItemEntity, LookupSimpleEntity>({
								dataServiceToken: BoqMainOenStatusLookupService
							})
						},
						OenZzFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup<IOenBoqItemEntity, IOenZzEntity>({
								dataService: boqOenZzLookupService,
								descriptionMember: 'Description',
							})
						},
						OenServicePartFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup<IOenBoqItemEntity, IOenServicePartEntity>({
								dataServiceToken: BoqMainOenServicePartLookupService,
								descriptionMember: 'Description'
							})
						},
						OenZzVariantFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup<IOenBoqItemEntity, IOenZzVariantEntity>({
								dataServiceToken: BoqMainOenZzVariantLookupService,
								descriptionMember: 'Description',
							})
						},
						OenPricingMethodFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup<IOenBoqItemEntity, LookupSimpleEntity>({
								dataServiceToken: BoqMainOenPricingMethodLookupService
							})
						},
					},
					labels: {
						...prefixAllTranslationKeys('boq.main.oen.dto.OenBoqItemDto.', {
							OenStatusFk: 'OenStatusFk',
							OriginMark: 'OriginMark',
							OenZzFk: 'OenZzFk',
							OenZzVariantFk: 'OenZzVariantFk',
							PreliminaryMark: 'PreliminaryMark',
							IsEssentialPosition: 'IsEssentialPosition',
							GuaranteedOfferSumGroup: 'GuaranteedOfferSumGroup',
							PartOfferMark: 'PartOfferMark',
							OenServicePartFk: 'OenServicePartFk',
							PartSumMark: 'PartSumMark',
							IsNotOffered: 'IsNotOffered',
							ItemTotalUrb1: 'ItemTotalUrb1',
							ItemTotalUrb1Oc: 'ItemTotalUrb1Oc',
							ItemTotalUrb2: 'ItemTotalUrb2',
							ItemTotalUrb2Oc: 'ItemTotalUrb2Oc',
							DiscountPercentItUrb1: 'DiscountPercentItUrb1',
							DiscountPercentItUrb2: 'DiscountPercentItUrb2',
							DiscountUrb1: 'DiscountUrb1',
							DiscountUrb1Oc: 'DiscountUrb1Oc',
							DiscountUrb2: 'DiscountUrb2',
							DiscountUrb2Oc: 'DiscountUrb2Oc',
							FinalpriceUrb1: 'FinalpriceUrb1',
							FinalpriceUrb1Oc: 'FinalpriceUrb1Oc',
							FinalpriceUrb2: 'FinalpriceUrb2',
							FinalpriceUrb2Oc: 'FinalpriceUrb2Oc',
							OenPricingMethodFk: 'OenPricingMethodFk',
							LbChangeVersionNumber: 'LbChangeVersionNumber',
							OenLbChangeTypeFk: 'OenLbChangeTypeFk',
							BlobsLbChangeFk: 'BlobsLbChangeFk',
							BlobsCommentFk: 'BlobsCommentFk',
							LbReferencePrev: 'LbReferencePrev',
							LbNotInPartialEdition: 'LbNotInPartialEdition'
						})
					}
				};
			}
		} as IEntityInfo<IOenBoqItemEntity>);
	}

	private get boqOenLvHeaderEntityInfo(): EntityInfo {
		const boqOenLvHeaderEntityInfo: IEntityInfo<IOenLvHeaderEntity> = {
			form: {
				title: 'boq.main.oen.uicontainer.lvHeader.title',
				containerUuid: 'bfa158d5b45a4bf8bdfbe6008503c4e5',
			},
			dataService: ctx => ctx.injector.get(BoqMainOenLvheaderDataService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'OenLvHeaderDto' },
			//TODO-BOQ: reusing UUID from desktopTiles.
			permissionUuid: '40239db4f9d94e4b87afa66224d5767c',
			layoutConfiguration: {
			groups: [
				{
					gid: 'Basic Data',
					attributes: [
					'OenLvTypeFk','ProcessingStatusDate','PriceBaseDate','OfferDeadline','BidderNr','AlternativOfferNr',
					'ChangeOfferNr','OrderCode','AdditionalOfferNr','ContractAdjustmentNr','IsWithPriceShares','NamePriceShare1',
					'NamePriceShare2'
					]
				},
				{
					//TODO-BOQ: In old client attributes are empty , have different adjustments.
					gid: 'groupDiscount',
					attributes: [
						'IsSumDiscount', 'IsAllowedBoqDiscount', 'IsAllowedHgDiscount', 'IsAllowedOgDiscount', 'IsAllowedLgDiscount', 'IsAllowedUlgDiscount'
					]
				},
			],
			labels: {
				...prefixAllTranslationKeys('boq.main.oen.dto.OenLvHeaderDto.', {
					OenLvTypeFk: 'OenLvTypeFk',
					ProcessingStatusDate: 'ProcessingStatusDate',
					PriceBaseDate: 'PriceBaseDate',
					OfferDeadline: 'OfferDeadline',
					BidderNr: 'BidderNr',
					AlternativOfferNr: 'AlternativOfferNr',
					ChangeOfferNr: 'ChangeOfferNr',
					OrderCode: 'OrderCode',
					AdditionalOfferNr: 'AdditionalOfferNr',
					ContractAdjustmentNr: 'ContractAdjustmentNr',
					IsWithPriceShares: 'IsWithPriceShares',
					NamePriceShare1: 'NamePriceShare1',
					NamePriceShare2: 'NamePriceShare2',
					IsSumDiscount: 'IsSumDiscount',
					IsAllowedBoqDiscount: 'IsAllowedBoqDiscount',
					IsAllowedHgDiscount: 'IsAllowedHgDiscount',
					IsAllowedOgDiscount: 'IsAllowedOgDiscount',
					IsAllowedLgDiscount: 'IsAllowedLgDiscount',
					IsAllowedUlgDiscount: 'IsAllowedUlgDiscount'
				}),
				...prefixAllTranslationKeys('boq.main.oen.uicontainer.lvHeader.', {
					groupDiscount: 'groupDiscount'
				})
			}
			}
		};
		return EntityInfo.create(boqOenLvHeaderEntityInfo);
	}

	private get boqOenLbMetadataEntityInfo(): EntityInfo {
		const boqOenLbMetadataEntityInfo: IEntityInfo<IOenLbMetadataEntity> = {
			grid: {
				title: 'boq.main.oen.LbMetadata',
				containerUuid:'4e0435cecb1c47d4b5a1f5197c7ad925'
			},
			dataService: ctx => ctx.injector.get(BoqMainOenLbmetadataDataService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'OenLbMetadataDto' },
				permissionUuid: '342bf3af97964f5ba24d3e3acc2242dd',
				layoutConfiguration: {
					groups: [
						{
							gid: 'Basic Data',
							attributes: ['Type','Code', 'OenReleaseStatusFk', 'Description', 'VersionNumber','VersionDate','DownloadUrl','DescriptionPartialEdition']
						},
					],
					overloads: {
						OenReleaseStatusFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup<IOenLbMetadataEntity, LookupSimpleEntity>({
								dataServiceToken: BoqMainOenReleaseStatusLookupService
							})
						},
						Type:{
							type: FieldType.Lookup,
							lookupOptions: createLookup<IOenLbMetadataEntity, LookupSimpleEntity>({
								dataServiceToken: BoqMainOenLbMetadataTypeLookupDataService
							})
						}
					},
					labels: {
						...prefixAllTranslationKeys('boq.main.oen.dto.OenLbMetadataDto.', {
							Type: 'Type',
							VersionNumber: 'VersionNumber',
							VersionDate: 'VersionDate',
							DownloadUrl: 'DownloadUrl',
							DescriptionPartialEdition: 'DescriptionPartialEdition',
							OenReleaseStatusFk: 'OenReleaseStatusFk'
						}),
					}
				}
		};
		return EntityInfo.create(boqOenLbMetadataEntityInfo);
	}

	private get boqOenAkzEntityInfo(): EntityInfo {
		const boqOenAkzEntityInfo: IEntityInfo<IOenAkzEntity>  = {
			grid: {
				title: 'boq.main.oen.uicontainer.akz.title',
				containerUuid:'f7b7d6b4dfb745be924c759bb8b57435'
			},
			dataService: ctx => ctx.injector.get(BoqMainOenAkzDataService),
			validationService: ctx => ctx.injector.get(boqMainOenAkzValidationService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'OenAkzDto' },
			permissionUuid: '342bf3af97964f5ba24d3e3acc2242dd',
			layoutConfiguration: {
				groups: [
					{
						gid: 'Basic Data',
						attributes: ['Nr','Description']
					},
				],
				overloads: {},
				labels: {
					...prefixAllTranslationKeys('boq.main.oen.dto.OenAkzDto.', {
						Nr: 'Nr',
						Description: 'Description'
					}),
				}
			}
		};
		return EntityInfo.create(boqOenAkzEntityInfo);
	}

	private get boqOenZzEntityInfo(): EntityInfo {
		const boqOenZzEntityInfo: IEntityInfo<IOenZzEntity>  = {
			grid: {
				title: 'boq.main.oen.uicontainer.zz.title',
				containerUuid:'a3b6037eb9d444b5849426b345f08f2e'
			},
			dataService: ctx => ctx.injector.get(BoqMainOenZzDataService),
			validationService: ctx => ctx.injector.get(BoqMainOenZzValidationService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'OenZzDto' },
			permissionUuid: '342bf3af97964f5ba24d3e3acc2242dd',
			layoutConfiguration: {
				groups: [
					{
						gid: 'Basic Data',
						attributes: ['Nr','Description']
					},
				],
				overloads: {},
				labels: {
					...prefixAllTranslationKeys('boq.main.oen.dto.OenZzDto.', {
						Nr: 'Nr',
						Description: 'Description'
					}),
				}
			}
		};
		return EntityInfo.create(boqOenZzEntityInfo);
	}

	private get boqOenZzVariantEntityInfo(): EntityInfo {
		const boqOenZzVariantEntityInfo: IEntityInfo<IOenZzVariantEntity>  = {
			grid: {
				title: 'boq.main.oen.uicontainer.zzVariant.title',
				containerUuid:'6dcfd92700734139a7dc62db1187f179'
			},
			dataService: ctx => ctx.injector.get(BoqMainOenZzVariantDataService),
			validationService: ctx => ctx.injector.get(BoqMainOenZzVariantValidationService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'OenZzVariantDto' },
			permissionUuid: '342bf3af97964f5ba24d3e3acc2242dd',
			layoutConfiguration: {
				groups: [
					{
						gid: 'Basic Data',
						attributes: ['Nr','Description']
					},
				],
				overloads: {},
				labels: {
					...prefixAllTranslationKeys('boq.main.oen.dto.OenZzVariantDto.', {
						Nr: 'Nr',
						Description: 'Description'
					}),
				}
			}
		};
		return EntityInfo.create(boqOenZzVariantEntityInfo);
	}

	private get boqOenServicePartEntityInfo(): EntityInfo {
		const boqOenServicePartEntityInfo: IEntityInfo<IOenServicePartEntity>  = {
			grid: {
				title: 'boq.main.oen.uicontainer.servicePart.title',
				containerUuid:'645c198984724d009859425728277871'
			},
			dataService: ctx => ctx.injector.get(BoqMainOenServicePartDataService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'OenServicePartDto' },
			permissionUuid: '342bf3af97964f5ba24d3e3acc2242dd',
			layoutConfiguration: {
				groups: [
					{
						gid: 'Basic Data',
						attributes: ['Nr','Description']
					},
				],
				overloads: {}, //TODO-BOQ-Add overloads
				labels: {
					...prefixAllTranslationKeys('boq.main.oen.dto.OenServicePartDto.', {
						Nr: 'Nr',
						Description: 'Description'
					}),
				}
			}
		};
		return EntityInfo.create(boqOenServicePartEntityInfo);
	}

}
