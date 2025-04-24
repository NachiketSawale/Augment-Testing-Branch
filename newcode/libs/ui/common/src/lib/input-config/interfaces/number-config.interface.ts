/*
 * Copyright(c) RIB Software GmbH
 */

import { IInputConfig } from './input-config.interface';

/**
 * Extends the IInputConfig interface to include additional properties for number input configuration.
 */
export interface INumberInputConfig extends IInputConfig {
  /**
   * The step value for the number input.
   */
  step?: number;

  /**
   * The minimum value for the number input.
   */
  min?: number;

  /**
   * The maximum value for the number input.
   */
  max?: number;
}
