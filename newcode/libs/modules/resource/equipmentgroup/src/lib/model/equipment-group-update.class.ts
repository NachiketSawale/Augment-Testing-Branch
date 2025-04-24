/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEquipmentGroupEntity, IPlantGroupWoTypeEntity, IEquipmentGroupEurolistEntity, IEquipmentGroupPricelistEntity, IPlantGroupAccountEntity, IPlantGroup2ControllingUnitEntity, IPlantGroup2CostCodeEntity, IPlantGroupTaxCodeEntity, IPlantGroupSpecificValueEntity } from '@libs/resource/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class EquipmentGroupUpdate implements CompleteIdentification<IEquipmentGroupEntity> {
	public MainItemId: number = 0;
	public EquipmentGroups: IEquipmentGroupEntity[] | null = [];
	public PlantGroupWoTypesToSave: IPlantGroupWoTypeEntity[] | null = [];
	public PlantGroupWoTypesToDelete: IPlantGroupWoTypeEntity[] | null = [];
	public EquipmentGroupEurolistsToSave: IEquipmentGroupEurolistEntity[] | null = [];
	public EquipmentGroupEurolistsToDelete: IEquipmentGroupEurolistEntity[] | null = [];
	public EquipmentGroupPricelistsToSave: IEquipmentGroupPricelistEntity[] | null = [];
	public EquipmentGroupPricelistsToDelete: IEquipmentGroupPricelistEntity[] | null = [];
	public PlantGroupAccountsToSave: IPlantGroupAccountEntity[] | null = [];
	public PlantGroupAccountsToDelete: IPlantGroupAccountEntity[] | null = [];
	public PlantGroup2ControllingUnitsToSave: IPlantGroup2ControllingUnitEntity[] | null = [];
	public PlantGroup2ControllingUnitsToDelete: IPlantGroup2ControllingUnitEntity[] | null = [];
	public PlantGroup2CostCodesToSave: IPlantGroup2CostCodeEntity[] | null = [];
	public PlantGroup2CostCodesToDelete: IPlantGroup2CostCodeEntity[] | null = [];
	public PlantGroupTaxCodesToSave: IPlantGroupTaxCodeEntity[] | null = [];
	public PlantGroupTaxCodesToDelete: IPlantGroupTaxCodeEntity[] | null = [];
	public PlantGroupSpecificValuesToSave: IPlantGroupSpecificValueEntity[] | null = [];
	public PlantGroupSpecificValuesToDelete: IPlantGroupSpecificValueEntity[] | null = [];
}