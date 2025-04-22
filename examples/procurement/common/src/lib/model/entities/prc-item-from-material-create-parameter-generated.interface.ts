/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemCreateParameter } from './prc-item-create-parameter.interface';

export interface IPrcItemFromMaterialCreateParameterGenerated {

  /**
   * materialIds
   */
  materialIds?: number[] | null;

  /**
   * maxNo
   */
  maxNo: number;

  /**
   * prcItemCreateParameter
   */
  prcItemCreateParameter?: IPrcItemCreateParameter | null;
}
