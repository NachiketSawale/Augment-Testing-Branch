import {IBasicsCustomizeTypeEntity} from './basics-customize-type-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';

export class BasicsCustomizeComplete implements CompleteIdentification<IBasicsCustomizeTypeEntity> {
    public Id: number = 0;
}
