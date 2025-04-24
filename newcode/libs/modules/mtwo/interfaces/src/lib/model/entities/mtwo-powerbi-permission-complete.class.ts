/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IPermissionsEntity } from './permissions-entity.interface';

export class MtwoPowerbiPermissionComplete implements CompleteIdentification<IPermissionsEntity>{
	
  public Data: IPermissionsEntity[] =[];
  
	public Id: number |null = 0;
}
