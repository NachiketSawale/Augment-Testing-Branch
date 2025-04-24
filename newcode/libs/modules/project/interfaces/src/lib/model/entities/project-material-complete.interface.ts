/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPrjMaterialEntity } from './material/prj-material-entity.interface';

export interface IProjectMaterialComplate extends CompleteIdentification<IPrjMaterialEntity>{
    Id: number | null;

    PrjMaterial: IPrjMaterialEntity | null;
}