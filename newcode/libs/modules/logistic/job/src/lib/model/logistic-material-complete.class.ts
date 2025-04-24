/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ILogisticJobMaterialCatalogPriceEntity, ILogisticMaterialRateEntity } from '@libs/logistic/interfaces';



export class LogisticMaterialComplete extends CompleteIdentification<ILogisticJobMaterialCatalogPriceEntity>{

	public MainItemId: number = 0;

	public MaterialCatPrices: ILogisticJobMaterialCatalogPriceEntity[] | null = [];

	public MaterialRatesToSave?: ILogisticMaterialRateEntity[] | null = [];

	public MaterialRatesToDelete?: ILogisticMaterialRateEntity[] | null = [];






}
