/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosMainObjectSetEntityGenerated extends IEntityBase {

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * DueDate
 */
  DueDate?: string | null;

/*
 * FormDataFk
 */
  FormDataFk?: number | null;

/*
 * FormFk
 */
  FormFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * Name
 */
  Name?: string | null;

/*
 * ObjectSetKey
 */
  ObjectSetKey?: string | null;

/*
 * ObjectSetStatusFk
 */
  ObjectSetStatusFk: number;

/*
 * ObjectSetTypeFk
 */
  ObjectSetTypeFk: number;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * ReportFk
 */
  ReportFk?: number | null;

/*
 * WorkflowTemplateFk
 */
  WorkflowTemplateFk?: number | null;
}
