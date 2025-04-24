/*
 * Copyright(c) RIB Software GmbH
 */

import { ICharacteristicDataEntity } from '@libs/basics/interfaces';

export interface ICharacteristicBulkEditorParamsGenerated {

  /**
   * filter
   */
  //filter?: IInt32 | null;

  /**
   * moduleName
   */
  moduleName?: string | null;

  /**
   * objectFks
   */
  objectFks?: number[] | null;

  /**
   * objectsCount
   */
  objectsCount: number;

  /**
   * sectionId
   */
  sectionId: number;

  /**
   * values
   */
  values?: ICharacteristicDataEntity[] | null;
}
