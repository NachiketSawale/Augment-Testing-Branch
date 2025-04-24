/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IImportRequestEntityGenerated {

/*
 * Calculate
 */
  Calculate?: boolean | null;

/*
 * OriginalFileName
 */
  OriginalFileName?: string | null;

/*
 * Overwrite
 */
  Overwrite?: boolean | null;

/*
 * OverwriteOnlyQuantity
 */
  OverwriteOnlyQuantity?: boolean | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;

/*
 * ScheduleId
 */
  ScheduleId?: number | null;

/*
 * StartImport
 */
  StartImport?: boolean | null;
}
