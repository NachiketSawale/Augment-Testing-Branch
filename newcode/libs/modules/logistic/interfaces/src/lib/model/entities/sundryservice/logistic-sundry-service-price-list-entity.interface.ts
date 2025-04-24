import { IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface ILogisticSundryServicePriceListEntity extends IEntityIdentification, IEntityBase {

	SundryServiceFk: number;
	CurrencyFk: number;
	PricePortion1: number;
	PricePortion2: number;
	PricePortion3: number;
	PricePortion4: number;
	PricePortion5: number;
	PricePortion6: number;
	PricePortionSum: number;
	ValidFrom: Date;
	ValidTo: Date;
	CommentText: string;
	IsManual: boolean;
}
