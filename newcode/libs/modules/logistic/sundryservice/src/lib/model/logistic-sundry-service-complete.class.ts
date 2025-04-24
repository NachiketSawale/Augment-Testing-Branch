import { ILogisticSundryServiceEntity, ILogisticSundryServicePriceListEntity } from '@libs/logistic/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class LogisticSundryServiceComplete implements CompleteIdentification<ILogisticSundryServiceEntity>{

	public SundryServiceId: number = 0;

	public SundryServices: ILogisticSundryServiceEntity[] | null = [];

	public PriceListsToSave: ILogisticSundryServicePriceListEntity[] | null = [];

	public PriceListsToDelete: ILogisticSundryServicePriceListEntity[] | null = [];

}
