import {CompleteIdentification} from '@libs/platform/common';
import { IEstimateMainPrcItemAssignmentEntity } from './estimate-main-prc-item-assignment-entitiy.interface';

export class EstimateMainPrcItemAssignmentComplete implements CompleteIdentification<IEstimateMainPrcItemAssignmentEntity>{

    public EstPrcItemAssignment?: IEstimateMainPrcItemAssignmentEntity | null;

    public EstResourceFk?: number | null;
    public EstHeaderFk?: number | null;
    public EstLineItemFk?: number | null;
    public PrcPackageFk? :number;
    public Id? :number;

}