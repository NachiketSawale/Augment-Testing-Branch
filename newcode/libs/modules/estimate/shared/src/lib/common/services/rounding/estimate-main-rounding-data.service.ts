/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRoundingConfigDetailBaseEntity } from '../../model/est-rounding-config-detail-entity.base.interface';
import { IEstRoundingColumnConfig } from '../../model/est-rounding-column-config.interface';
import { extend, find, forEach, isArray } from 'lodash';
import { Injectable } from '@angular/core';
import { IEstRoundingConfigComplete } from '../../model/est-rounding-config-complete.interface';

/**
 * estimateMainRoundingDataService is the data service for estimate related common functionality.
 */
@Injectable({ providedIn: 'root' })
export class EstimateMainRoundingDataService {
	private estRoundingConfig: IEstRoundingConfigDetailBaseEntity[] = [];
	private estLineItemRoundingColumnIds: IEstRoundingColumnConfig[] = [];

	/**
	 * configure the rounding details
	 * @param estRoundingConfigDetailsComplete
	 */
	public setEstRoundingConfigData(estRoundingConfigDetailsComplete: IEstRoundingConfigComplete|null){
		if(estRoundingConfigDetailsComplete){
			this.estRoundingConfig = estRoundingConfigDetailsComplete.RoundingConfigDetails || [];
			this.estLineItemRoundingColumnIds = estRoundingConfigDetailsComplete.EstRoundingColumnIds || [];
		}
	}

	/**
	 * Set the estimate rounding configuration.
	 * @param {IEstRoundingConfigDetailBaseEntity[]} roundingConfigData - The estimate rounding configuration data.
	 */
	public setEstRoundingConfig(roundingConfigData: IEstRoundingConfigDetailBaseEntity[]) {
		this.estRoundingConfig = roundingConfigData.length > 0 ? roundingConfigData : [];
	}

	/**
	 * get the rounding configuration details
	 */
	public getEstRoundingConfig(): IEstRoundingConfigDetailBaseEntity[] {
		return this.estRoundingConfig;
	}

	/**
	 * get the rounding column IDs
	 */
	public getRoundingColumnIds(): IEstRoundingColumnConfig[] {
		return this.estLineItemRoundingColumnIds;
	}

	/**
	 * Set the rounding column IDs.
	 * @param {IEstRoundingColumnConfig[]} roundingColumnIds - The rounding column IDs to be set.
	 * @returns {IEstRoundingColumnConfig[]} - The updated rounding column IDs.
	 */
	public setRoundingColumnIds(roundingColumnIds: IEstRoundingColumnConfig[]) {
		return (this.estLineItemRoundingColumnIds = roundingColumnIds);
	}

	/**
	 * merge new rounding configuration details with the existing ones
	 * @param roundingConfigDetails
	 */
	public mergeEstRoundingConfig(roundingConfigDetails: IEstRoundingConfigDetailBaseEntity[]) {
		if (roundingConfigDetails && roundingConfigDetails.length) {
			if (isArray(this.estRoundingConfig) && this.estRoundingConfig.length) {
				const estRoundingConfig = this.estRoundingConfig;
				forEach(roundingConfigDetails, function (detailItem) {
					const oldItem = find(estRoundingConfig, { ColumnId: detailItem.ColumnId });
					if (oldItem) {
						extend(oldItem, detailItem);
					} else {
						estRoundingConfig.push(detailItem);
					}
				});
			} else {
				this.estRoundingConfig = roundingConfigDetails;
			}
		}
	}
}
