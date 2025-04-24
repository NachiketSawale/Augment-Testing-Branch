/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IProjectStockEntity } from './project-stock-entity.interface';
import { IProjectStockLocationEntity } from './project-stock-location-entity.interface';
import { IProjectStock2MaterialEntity } from './project-stock-2-material-entity.interface';
import { IProjectStockDownTimeEntity } from './project-stock-down-time-entity.interface';
import { IProjectStock2ClerkEntity } from './project-stock-2-clerk-entity.interface';


export interface IProjectStockComplete extends CompleteIdentification<IProjectStockEntity>{

	ProjectStockId: number;

	ProjectStocks: IProjectStockEntity | null;

	StockLocationsToSave: IProjectStockLocationEntity[] | null;

	StockLocationsToDelete: IProjectStockLocationEntity[] | null;

	StockMaterialsToSave: IProjectStock2MaterialEntity[] | null;

	StockMaterialsToDelete: IProjectStock2MaterialEntity[] | null;

   ProjectStockDownTimeToSave: IProjectStockDownTimeEntity[] | null;

	ProjectStockDownTimeToDelete: IProjectStockDownTimeEntity[] | null;

	ProjectStock2ClerkToSave: IProjectStock2ClerkEntity[] | null;

	ProjectStock2ClerkToDelete: IProjectStock2ClerkEntity[] | null;
}
