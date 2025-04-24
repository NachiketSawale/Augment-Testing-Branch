import { CompleteIdentification } from '@libs/platform/common';
import {BasicsIndexHeaderEntity} from './basics-index-header-entity.class';
import {BasicsIndexDetailEntity} from './basics-index-detail-entity.class';

export class BasicsIndexHeaderComplete implements CompleteIdentification<BasicsIndexHeaderEntity> {
    public Id: number = 0;
    public IndexHeader: BasicsIndexHeaderEntity | null = null;
    public MainItemId: number = 0;
    public EntitiesCoun: number = 0;
    public IndexDetailToSave: BasicsIndexDetailEntity[] | [] = [];
    public IndexDetailToDelete: BasicsIndexDetailEntity[] | [] = [];
}
