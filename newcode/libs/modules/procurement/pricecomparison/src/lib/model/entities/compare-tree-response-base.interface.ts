/*
 * Copyright(c) RIB Software GmbH
 */

import { ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { IQuoteHeaderEntity } from '@libs/procurement/quote';
import { IMaterialEntity, IBasicsUomEntity, IPrcGeneralsTypeEntity, IQuoteStatusEntity } from '@libs/basics/interfaces';
import { ICustomCharacteristicGroup } from './custom-characteristic-group.interface';
import { ICustomCharacteristicData } from './custom-characteristic-data.interface';
import { ICompositeBaseEntity } from './composite-base-entity.interface';

export interface ICompareTreeResponseBase<T extends ICompositeBaseEntity<T>> {
	RfqCharacteristicGroup: ICustomCharacteristicGroup[];
	RfqCharacteristic: ICustomCharacteristicData[];
	QuoteCharacteristic: ICustomCharacteristicData[];
	Main: T[];
	MaterialRecord: IMaterialEntity[];
	PCUom: IBasicsUomEntity[];
	PrcGeneralsType: IPrcGeneralsTypeEntity[];
	QuoteStatus: IQuoteStatusEntity[];
	reqStatus: object[];
	RfqHeader: IRfqHeaderEntity[];
	PrcItemEvaluation: object[];
	Quote: IQuoteHeaderEntity[];
	Currency: object[];
	FinalBillingSchemas: ICommonBillingSchemaEntity[];
	TaxCodeMatrix: object[];
	Turnover: object[];
	BusinessPartnerAvgEvaluationValue: object[];
	ProjectChange: object[];
	PrcIncoterm: object[];
}