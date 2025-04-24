/*
 * Copyright(c) RIB Software GmbH
 */

import { IQuoteOptions } from './quote-options.interface';

export interface IUpdatePackageBoqEntityGenerated {

  /**
   * HeaderId
   */
  HeaderId: number;

  /**
   * Options
   */
  // Options?: ISyncBoqItemOptions | null;

  /**
   * QtoOptions
   */
  QtoOptions?: IQuoteOptions | null;

  /**
   * SourceType
   */
  SourceType?: string | null;
}
