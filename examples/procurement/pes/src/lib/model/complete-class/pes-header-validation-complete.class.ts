/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IPesHeaderEntity } from '../entities';

export class PesHeaderValidationComplete implements CompleteIdentification<IPesHeaderEntity>{

  /**
   * HeaderDto
   */
  public HeaderDto?: IPesHeaderEntity | null;

  /**
   * Model
   */
  public Model?: string | null = '';

  /**
   * Value
   */
  public Value?: string | null = '';
}
