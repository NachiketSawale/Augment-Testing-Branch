/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IProject2MaterialEntity, IProject2MaterialPriceConditionEntity } from '@libs/logistic/interfaces';



export class Project2MaterialComplete extends CompleteIdentification<IProject2MaterialEntity> {

	public IProject2MaterialEntity: IProject2MaterialEntity[] | null = [];

	public MainItemId: number = 0;

	public MaterialPriceConditionsToSave: IProject2MaterialPriceConditionEntity[] | null = [];

	public MaterialPriceConditionsToDelete: IProject2MaterialPriceConditionEntity[] | null = [];


}