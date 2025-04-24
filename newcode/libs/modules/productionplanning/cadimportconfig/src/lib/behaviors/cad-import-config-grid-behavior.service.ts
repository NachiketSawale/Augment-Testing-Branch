/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEngCadImportConfigEntity } from '../model/entities/cad-import-config-entity.interface';

export class CadImportConfigGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngCadImportConfigEntity>, IEngCadImportConfigEntity> {

}
