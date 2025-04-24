/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsActualTimeReportVEntity } from './pps-actual-time-report-ventity.interface';
import {IEntityBase} from '@libs/platform/common';

export interface IPpsActualTimeRecordingProductAssignmentRequestGenerated {

/*
 * AreaActionActualTimeAssignments
 */
  AreaActionActualTimeAssignments?: IEntityBase[] | null;

/*
 * DueDate
 */
  DueDate?: string | null;

/*
 * Reports
 */
  Reports?: IPpsActualTimeReportVEntity[] | null;
}
