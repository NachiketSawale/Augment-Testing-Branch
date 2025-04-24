/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICostCode2ResTypeEntity } from './models';

export interface IBasicsCostCodesResTypeComplete extends CompleteIdentification<ICostCode2ResTypeEntity> {
      /*
      * Id
      */
      Id: number;

      /*
       * CostCodes2ResType
       */
      CostCodes2ResType: ICostCode2ResTypeEntity[] | null;
}
