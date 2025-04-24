
import {CompleteIdentification} from '@libs/platform/common';
import {IControllingCommonProjectEntity} from './entities/controlling-common-project-entity.interface';

export class ControllingCommonProjectComplete extends CompleteIdentification<IControllingCommonProjectEntity> {
    public MainItemId?: number;
}