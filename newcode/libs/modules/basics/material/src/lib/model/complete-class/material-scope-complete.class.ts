/*
 * Copyright(c) RIB Software GmbH
 */


import { IMaterialScopeDetailEntity, IMaterialScopeEntity } from '@libs/basics/interfaces';
import { MaterialScopeDetailComplete } from './material-scope-detail-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class MaterialScopeComplete implements CompleteIdentification<IMaterialScopeEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MaterialScope
   */
  public MaterialScope?: IMaterialScopeEntity | null;

  /**
   * MaterialScopeDetailToDelete
   */
  public MaterialScopeDetailToDelete?: IMaterialScopeDetailEntity[] | null = [];

  /**
   * MaterialScopeDetailToSave
   */
  public MaterialScopeDetailToSave?: MaterialScopeDetailComplete[] | null = [];

  public constructor(e: IMaterialScopeEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.MaterialScope = e;
		}
	}
}
