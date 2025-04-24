/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeSetStatusEntityGenerated } from './change-set-status-entity-generated.interface';

export interface IChangeSetStatusEntity extends IChangeSetStatusEntityGenerated {
    
    unfinishedComparisons: UnfinishedComparison[];
    activeConsumerCount: number;
    updateRequest: null;  //TODO Replace with appropriate type when known
    waitingRequests: undefined[];  //RODO  Replace with appropriate type when known
    
}
interface UnfinishedComparison {
    modelId: number;
    id: number;
}
  
  
