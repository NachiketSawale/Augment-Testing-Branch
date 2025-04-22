import { DataServiceFlatLeaf, DataServiceFlatNode, DataServiceFlatRoot } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';

export interface ICreateBusinessPartnerWizardOptions<T extends IPrcSuggestedBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>, RT extends IEntityIdentification, RU extends CompleteIdentification<RT>> {
	moduleName: string;
	rootService: DataServiceFlatRoot<RT, RU>;
	parentService?: DataServiceFlatRoot<RT, RU> | DataServiceFlatNode<PT, PU, RT, RU>;
	suggestedBidderService: DataServiceFlatLeaf<T, PT, PU>;
}