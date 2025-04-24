/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IEstResource2AssemblyEntityGenerated {

/*
 * AssemblyFk
 */
  AssemblyFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * EstResourceFk
 */
  EstResourceFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * JobCode
 */
  JobCode?: string | null;

/*
 * JobDescription
 */
  JobDescription?: string | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;
}
