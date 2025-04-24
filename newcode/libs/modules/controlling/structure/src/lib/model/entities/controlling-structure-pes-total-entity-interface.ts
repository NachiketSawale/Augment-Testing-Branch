import {IControllingCommonPesEntity} from '@libs/controlling/common';

export interface ControllingStructurePesTotalEntity extends IControllingCommonPesEntity{
    PesHeaderFk?: number | null;

    DocumentDate?: Date | null;

    DateDelivered?: Date | null;

    DateDeliveredFrom?: Date | null;

    DateEffective?: Date | null;
}