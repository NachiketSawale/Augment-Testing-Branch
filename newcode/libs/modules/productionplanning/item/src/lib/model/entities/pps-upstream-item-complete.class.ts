import {CompleteIdentification} from '@libs/platform/common';
import {IPpsUpstreamItemEntity} from './pps-upstream-item-entity.interface';

export class PpsUpstreamItemComplete implements CompleteIdentification<IPpsUpstreamItemEntity>{
    public MainItemId!: number;
    public PpsUpstreamItem!: IPpsUpstreamItemEntity;
}
