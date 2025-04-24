/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentPlantComponentUpdate } from './resource-equipment-plant-component-update.class';
import { CompleteIdentification } from '@libs/platform/common';
import {
	IResourceEquipmentBulkPlantOwnerEntity,
	IResourceEquipmentBusinessPartnerEntity,
	IResourceEquipmentCertificatedPlantEntity,
	IResourceEquipmentPlant2ClerkEntity,
	IResourceEquipmentPlant2ControllingUnitEntity,
	IResourceEquipmentPlant2EstimatePriceListEntity,
	IResourceEquipmentPlantAccessoryEntity,
	IResourceEquipmentPlantAllocVEntity,
	IResourceEquipmentPlantAssignmentEntity,
	IResourceEquipmentPlantCompatibleMaterialEntity,
	IResourceEquipmentPlantComponentEntity,
	IResourceEquipmentPlantCostVEntity,
	IResourceEquipmentPlantDocumentEntity,
	IResourceEquipmentPlantEntity,
	IResourceEquipmentPlantEurolistEntity,
	IResourceEquipmentPlantFixedAssetEntity,
	IResourceEquipmentPlantPictureEntity,
	IResourceEquipmentPlantPricelistEntity,
	IResourceEquipmentPlantProcurementContractVEntity,
	IResourceEquipmentPlantSpecificValueEntity
} from '@libs/resource/interfaces';

export class ResourceEquipmentPlantUpdate implements CompleteIdentification<IResourceEquipmentPlantEntity> {
	public MainItemId: number = 0;
	public Plants: IResourceEquipmentPlantEntity[] | null = [];
	public PlantDocumentToSave: IResourceEquipmentPlantDocumentEntity[] | null = [];
	public PlantDocumentToDelete: IResourceEquipmentPlantDocumentEntity[] | null = [];
	public BusinessPartnerToSave: IResourceEquipmentBusinessPartnerEntity[] | null = [];
	public BusinessPartnerToDelete: IResourceEquipmentBusinessPartnerEntity[] | null = [];
	public PlantFixedAssetToSave: IResourceEquipmentPlantFixedAssetEntity[] | null = [];
	public PlantFixedAssetToDelete: IResourceEquipmentPlantFixedAssetEntity[] | null = [];
	public PlantAccessoryToSave: IResourceEquipmentPlantAccessoryEntity[] | null = [];
	public PlantAccessoryToDelete: IResourceEquipmentPlantAccessoryEntity[] | null = [];
	public DependingDtoToSave: IResourceEquipmentPlantPictureEntity[] | null = [];
	public DependingDtoToDelete: IResourceEquipmentPlantPictureEntity[] | null = [];
	public PlantAssignmentToSave: IResourceEquipmentPlantAssignmentEntity[] | null = [];
	public PlantAssignmentToDelete: IResourceEquipmentPlantAssignmentEntity[] | null = [];
	public PlantComponentToSave: ResourceEquipmentPlantComponentUpdate[] | null = [];
	public PlantComponentToDelete: IResourceEquipmentPlantComponentEntity[] | null = [];
	public PlantEurolistToSave: IResourceEquipmentPlantEurolistEntity[] | null = [];
	public PlantEurolistToDelete: IResourceEquipmentPlantEurolistEntity[] | null = [];
	public PlantPricelistToSave: IResourceEquipmentPlantPricelistEntity[] | null = [];
	public PlantPricelistToDelete: IResourceEquipmentPlantPricelistEntity[] | null = [];
	public PlantAllocVToSave: IResourceEquipmentPlantAllocVEntity[] | null = [];
	public PlantAllocVToDelete: IResourceEquipmentPlantAllocVEntity[] | null = [];
	public ControllingUnitsToSave: IResourceEquipmentPlant2ControllingUnitEntity[] | null = [];
	public ControllingUnitsToDelete: IResourceEquipmentPlant2ControllingUnitEntity[] | null = [];
	public CertificatesToSave: IResourceEquipmentCertificatedPlantEntity[] | null = [];
	public CertificatesToDelete: IResourceEquipmentCertificatedPlantEntity[] | null = [];
	public PlantCostVToSave: IResourceEquipmentPlantCostVEntity[] | null = [];
	public PlantCostVToDelete: IResourceEquipmentPlantCostVEntity[] | null = [];
	public Plant2ClerkToSave: IResourceEquipmentPlant2ClerkEntity[] | null = [];
	public Plant2ClerkToDelete: IResourceEquipmentPlant2ClerkEntity[] | null = [];
	public Plant2EstimatePriceListToSave: IResourceEquipmentPlant2EstimatePriceListEntity[] | null = [];
	public Plant2EstimatePriceListToDelete: IResourceEquipmentPlant2EstimatePriceListEntity[] | null = [];
	public CompatibleMaterialToSave: IResourceEquipmentPlantCompatibleMaterialEntity[] | null = [];
	public CompatibleMaterialToDelete: IResourceEquipmentPlantCompatibleMaterialEntity[] | null = [];
	public PlantProcurementContractVToSave: IResourceEquipmentPlantProcurementContractVEntity[] | null = [];
	public PlantProcurementContractVToDelete: IResourceEquipmentPlantProcurementContractVEntity[] | null = [];
	public SpecificValuesToSave: IResourceEquipmentPlantSpecificValueEntity[] | null = [];
	public SpecificValuesToDelete: IResourceEquipmentPlantSpecificValueEntity[] | null = [];
	public BulkPlantOwnersToSave: IResourceEquipmentBulkPlantOwnerEntity[] | null = [];
	public BulkPlantOwnersToDelete: IResourceEquipmentBulkPlantOwnerEntity[] | null = [];
}