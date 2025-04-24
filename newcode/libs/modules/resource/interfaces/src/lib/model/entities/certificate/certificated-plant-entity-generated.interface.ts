/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICertificatedPlantEntityGenerated extends IEntityBase {

/*
 * CertificateFk
 */
  CertificateFk?: number | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * PlantFk
 */
  PlantFk?: number | null;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;

/*
 * ValidTo
 */
  ValidTo?: string | null;
}
