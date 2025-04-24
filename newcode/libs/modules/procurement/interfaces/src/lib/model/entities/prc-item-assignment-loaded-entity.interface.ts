/*
 * Copyright(c) RIB Software GmbH
 */

import {IPrcItemAssignmentEntity} from './prc-item-assignment-entity.interface';
import {IPrcItemLookupVEntity} from './prc-item-lookup-entity.interface';
import {IEstimateMainLineItemLookupDialogEntity } from '@libs/basics/interfaces';

// import {IEstHeaderEntity, IEstResourceEntity} from '@libs/estimate/shared';
// import {IBoqItemEntity} from '@libs/boq/main'; // todo chi: need it in interfaces or shared

export interface IPrcItemAssignmentLoadedEntity {
	Main: IPrcItemAssignmentEntity[];
	// EstimateMainHeader: IEstHeaderEntity[];
	// packageboqitems: IBoqItemEntity[];
	estlineitemlookup: IEstimateMainLineItemLookupDialogEntity[];
	PrcItem: IPrcItemLookupVEntity[];
	// estresource4itemassignment: IEstResourceEntity[];
}