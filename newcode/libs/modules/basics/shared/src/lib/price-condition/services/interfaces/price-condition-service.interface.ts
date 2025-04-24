/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityList, IEntitySelection} from '@libs/platform/data-access';
import {IMaterialPriceConditionEntity} from '@libs/basics/interfaces';
import {IEntityIdentification} from '@libs/platform/common';
import {IPriceConditionContext} from '../../model/interfaces/price-condition-context.interface';
import { IPriceConditionReloadParam } from '../../model/interfaces/price-condition-param.interface';

/**
 * Interface for price condition services.
 */
export interface IBasicsSharedPriceConditionService<T extends IMaterialPriceConditionEntity,PT extends IEntityIdentification> extends IEntitySelection<T>,IEntityList<T> {
	/**
	 * get parent service
	 */
	getParentService(): IEntitySelection<PT>;

	/**
	 * get context from parent for price condition
	 */
	getContextFromParent(): IPriceConditionContext;

	/**
	 * reload Price Condition
	 */
	reloadPriceConditions(param: IPriceConditionReloadParam): void;

	/**
	 * calculate Done
	 */
	onCalculateDone(total: number, totalOc: number, field: string): void;
}