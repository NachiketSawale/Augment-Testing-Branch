import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';


export interface IEstimateMainRelLineItem {
	EstBaseItem:IEstLineItemEntity|null;
	EstBaseResources: IEstResourceEntity[]|null;
	EstBaseItemUserDefinedColVal?:object|null;
	ResourceUserDefinedColVal?:object[]|null;
	EstLineItem2EstRule?:object[]|null;
}