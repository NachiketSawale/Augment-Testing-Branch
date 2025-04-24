/*
 * Copyright(c) RIB Software GmbH
 */

import {  IDescriptionInfo } from '@libs/platform/common';
import { IRubricEntity } from './rubric-entity.interface';

export interface IRubricIndexEntityGenerated {
  BasRubricFk?: number;
  DescriptionInfo?: IDescriptionInfo;
  Id?: number;
  RubricEntity?: IRubricEntity;
}
