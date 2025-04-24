/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosScriptEntityGenerated extends IEntityBase {

  /**
   * CosHeaderFk
   */
  CosHeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * ScriptData
   */
  ScriptData?: string | null;

  /**
   * TestInput
   */
  TestInput?: string | null;

  /**
   * ValidateScriptData
   */
  ValidateScriptData?: string | null;
}
