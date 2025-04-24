/*
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCostCodeRateEntity } from '@libs/logistic/interfaces';
import { ILogisticEquipCatalogPriceEntity } from '@libs/logistic/interfaces';
import { ILogisticMaterialCatalogPriceEntity } from '@libs/logistic/interfaces';
import { ILogisticMaterialPriceEntity } from '@libs/logistic/interfaces';
import { IPlantCostCodeEntity } from '@libs/logistic/interfaces';
import { ILogisticPlantPriceEntity } from '@libs/logistic/interfaces';
import { IPriceConditionItemEntity } from '@libs/logistic/interfaces';
import { IPriceConditionEntity } from '@libs/logistic/interfaces';
import { ILogisticSundryServicePriceEntity } from '@libs/logistic/interfaces';
import { CompleteIdentification } from '@libs/platform/common';


export class PriceConditionUpdateEntity  implements CompleteIdentification<IPriceConditionEntity> {

	public CostCodeRatesToDelete: ILogisticCostCodeRateEntity[] | null = [];


	public CostCodeRatesToSave: ILogisticCostCodeRateEntity[] | null = [];


	public EquipmentCatalogPricesToDelete: ILogisticEquipCatalogPriceEntity[] | null = [];

	public EquipmentCatalogPricesToSave: ILogisticEquipCatalogPriceEntity[] | null = [];

	public MaterialCatalogPricesToDelete: ILogisticMaterialCatalogPriceEntity[] | null = [];

	public MaterialCatalogPricesToSave: ILogisticMaterialCatalogPriceEntity[] | null = [];


	public MaterialPricesToDelete: ILogisticMaterialPriceEntity[] | null = [];

	public MaterialPricesToSave: ILogisticMaterialPriceEntity[] | null = [];

	public PlantCostCodeToDelete: IPlantCostCodeEntity[] | null = [];


	public PlantCostCodeToSave: IPlantCostCodeEntity[] | null = [];

	public PlantPricesToDelete: ILogisticPlantPriceEntity[] | null = [];


	public PlantPricesToSave: ILogisticPlantPriceEntity[] | null = [];

	public PriceConditionId: number =0;

	public MainItemId: number =0;


	public PriceConditionItemsToDelete: IPriceConditionItemEntity[] | null = [];

	public PriceConditionItemsToSave: IPriceConditionItemEntity[] | null = [];


	public PriceConditions: IPriceConditionEntity[] | null = [];


	public SundryServicePricesToDelete: ILogisticSundryServicePriceEntity[] | null = [];


	public SundryServicePricesToSave: ILogisticSundryServicePriceEntity[] | null = [];
}
