/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialEntity, IBasicsUomEntity, IPrcGeneralsTypeEntity, IMdcTaxCodeMatrixEntity, IQuoteStatusEntity } from '@libs/basics/interfaces';
import { ICommonBillingSchemaEntity, ITaxCodeEntity } from '@libs/basics/shared';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ICompareRowEntity } from '../entities/compare-row-entity.interface';
import { IQuoteHeaderEntity } from '@libs/procurement/quote';
import { ICustomCharacteristicData } from '../entities/custom-characteristic-data.interface';
import { ICustomCharacteristicGroup } from '../entities/custom-characteristic-group.interface';
import { IOriginalField } from '../entities/original-field.interface';
import { ICustomCompareColumnEntity } from '../entities/custom-compare-column-entity.interface';
import { ICustomGeneralItem } from '../entities/custom-general-item.interface';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';
import { ICompareExchangeRate } from '../entities/compare-exchange-rate.interface';

export class CompareDataBaseCache<T extends ICompositeBaseEntity<T>> {
	public columns: ICustomCompareColumnEntity[] = [];
	public visibleColumns: ICustomCompareColumnEntity[] = [];
	public summaryRows: ICompareRowEntity[] = [];
	public visibleCompareRows: ICompareRowEntity[] = [];
	public visibleQuoteRows: ICompareRowEntity[] = [];
	public visibleBillingSchemaRows: ICompareRowEntity[] = [];
	public rfqCharacteristicGroup: ICustomCharacteristicGroup[] = [];
	public rfqCharacteristic: ICustomCharacteristicData[] = [];
	public quoteCharacteristic: ICustomCharacteristicData[] = [];
	public allRfqCharacteristic: ICustomCharacteristicData[] = [];
	public allQuoteCharacteristic: ICustomCharacteristicData[] = [];
	public originalFields: IOriginalField[] = [];
	public finalBillingSchema: ICommonBillingSchemaEntity[] = [];
	public leadingRow: ICompareRowEntity = {} as ICompareRowEntity;
	public rfqHeaders: IRfqHeaderEntity[] = [];
	public quotes: IQuoteHeaderEntity[] = [];
	public generalTypes: IPrcGeneralsTypeEntity[] = [];
	public materialRecords: IMaterialEntity[] = [];
	public uoms: IBasicsUomEntity[] = [];
	public quoteStatus: IQuoteStatusEntity[] = [];
	public reqStatus: object[] = [];
	public prcItemEvaluations: object[] = [];
	public currencies: object[] = [];
	public taxCodes: ITaxCodeEntity[] = [];
	public taxCodeMatrixes: IMdcTaxCodeMatrixEntity[] = [];
	public turnovers: Array<{
		Id: number,
		Turnover: number
	}> = [];
	public businessPartnerAvgEvaluationValues: Array<{
		Id: number,
		AvgEvaluationA: number | null,
		AvgEvaluationB: number | null,
		AvgEvaluationC: number | null
	}> = [];
	public projectChanges: object[] = [];
	public prcIncoterms: object[] = [];
	public generalItems: Map<number, ICustomGeneralItem[]> = new Map<number, ICustomGeneralItem[]>();
	public childrenCharacter: ICompositeBaseEntity<T>[] = [];
	public exchangeRates: ICompareExchangeRate[] = [];

	public clear() {
		this.columns = [];
		this.visibleColumns = [];
		this.summaryRows = [];
		this.visibleCompareRows = [];
		this.visibleQuoteRows = [];
		this.visibleBillingSchemaRows = [];
		this.rfqCharacteristicGroup = [];
		this.rfqCharacteristic = [];
		this.quoteCharacteristic = [];
		this.allRfqCharacteristic = [];
		this.allQuoteCharacteristic = [];
		this.originalFields = [];
		this.finalBillingSchema = [];
		this.leadingRow = {} as ICompareRowEntity;
		this.rfqHeaders = [];
		this.quotes = [];
		this.generalTypes = [];
		this.materialRecords = [];
		this.uoms = [];
		this.quoteStatus = [];
		this.reqStatus = [];
		this.prcItemEvaluations = [];
		this.currencies = [];
		this.taxCodes = [];
		this.taxCodeMatrixes = [];
		this.turnovers = [];
		this.businessPartnerAvgEvaluationValues = [];
		this.projectChanges = [];
		this.prcIncoterms = [];
		this.generalItems = new Map<number, ICustomGeneralItem[]>();
		this.childrenCharacter = [];
		this.exchangeRates = [];
	}
}