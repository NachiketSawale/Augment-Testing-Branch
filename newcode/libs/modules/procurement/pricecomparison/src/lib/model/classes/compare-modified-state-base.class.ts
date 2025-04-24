/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonModifiedData, ICommonModifiedData, IModifiedData } from '../entities/compare-data-state.interface';

export abstract class CompareModifiedStateBase {
	public localEntity: IModifiedData = {};
	public localIdealQuoteCopiedEntity: IModifiedData = {};
	public modifiedData: IModifiedData = {};
	public commonData: ICommonModifiedData = CommonModifiedData;
	public idealQuoteCopiedData: Array<object> = [];
	public originalQuoteItems: Array<object> = [];

	public clear() {
		this.localEntity = {};
		this.localIdealQuoteCopiedEntity = {};
		this.modifiedData = {};
		this.commonData.PrcGeneralsToSave = [];
		this.idealQuoteCopiedData = [];
		this.originalQuoteItems = [];
	}
}