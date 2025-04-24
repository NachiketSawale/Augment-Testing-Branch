/*
 * Copyright(c) RIB Software GmbH
 */

import { IAssetMasterEntity } from './asset-master-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';

export class AssetMasterComplete implements CompleteIdentification<IAssetMasterEntity>{
  public Id: number = 0;
}
