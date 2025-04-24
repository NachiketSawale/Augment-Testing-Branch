import { IEntityBase } from '@libs/platform/common';

/**
 * Estimate Entity Generated Interface
 */
export interface IEstimateEntity extends IEntityBase {
	/*
 * EstHeaderFk
 */
	EstHeaderFk: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PrjProjectFk
	 */
	PrjProjectFk: number;
}