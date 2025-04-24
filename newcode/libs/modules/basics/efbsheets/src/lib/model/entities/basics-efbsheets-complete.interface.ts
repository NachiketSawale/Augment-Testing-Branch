/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICostCodeEntity } from '@libs/basics/costcodes';
import { IBasicsEfbsheetsAverageWageEntity, IBasicsEfbsheetsCrewMixCostCodeEntity, IBasicsEfbsheetsEntity, IEstCrewMixAfEntity, IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';


export interface IBasicsEfbsheetsComplete extends CompleteIdentification<IBasicsEfbsheetsEntity> {
	/*
	 * Id
	 */
	Id: number | null;

	/*
	 * EstCrewMix
	 */
	EstCrewMix: IBasicsEfbsheetsEntity | null;

	/*
	 * EstCrewMix
	 */
	EstCrewMixes: IBasicsEfbsheetsEntity[] | null;

	/*
	 * EstCrewMixAfToSave
	 */
	EstCrewMixAfToSave: IEstCrewMixAfEntity[] | null;

	/*
	 * EstCrewMixAfToDelete
	 */
	EstCrewMixAfToDelete: IEstCrewMixAfEntity[] | null;

	/*
	 * CostcodePriceList
	 */
	CostcodePriceList: ICostCodeEntity | null;

	/*
	 * MainItemId
	 */
	MainItemId: number | null;

	/*
	 * EstCrewMixAfsnToSave
	 */
	EstCrewMixAfsnToSave: IEstCrewMixAfsnEntity[] | null;

	/*
	 * EstCrewMixAfsnToDelete
	 */
	EstCrewMixAfsnToDelete: IEstCrewMixAfsnEntity[] | null;

	/**
	 * EstAverageWageToSave
	 */
	EstAverageWageToSave: IBasicsEfbsheetsAverageWageEntity[] | null;

	/**
	 * EstAverageWageToDelete
	 */
	EstAverageWageToDelete: IBasicsEfbsheetsAverageWageEntity[] | null;

	/**
	 * EstCrewMix2CostCodeToSave
	 */
	EstCrewMix2CostCodeToSave : IBasicsEfbsheetsCrewMixCostCodeEntity[] | null;

	/**
	 * EstCrewMix2CostCodeToDelete
	 */
	EstCrewMix2CostCodeToDelete : IBasicsEfbsheetsCrewMixCostCodeEntity[] | null;

	/**
	 * EstCrewMix2CostCode
	 */
	EstCrewMix2CostCode : IBasicsEfbsheetsCrewMixCostCodeEntity[] | null;

}
