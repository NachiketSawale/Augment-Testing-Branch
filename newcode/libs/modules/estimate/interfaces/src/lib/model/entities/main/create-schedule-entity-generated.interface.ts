/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface ICreateScheduleEntityGenerated {

/*
 * Code
 */
  Code: string;

/*
 * EstimateHeaderId
 */
  EstimateHeaderId?: number | null;

/*
 * StartDate
 */
  StartDate?: string | null;

/*
 * TemplateProject
 */
  TemplateProject?: number | null;

/*
 * TemplateSchedule
 */
  TemplateSchedule?: number | null;

/*
 * UseLineItemQuantity
 */
  UseLineItemQuantity?: boolean | null;

/*
 * UseLineItemTime
 */
  UseLineItemTime?: boolean | null;

/*
 * UseTargetProjectCalendar
 */
  UseTargetProjectCalendar?: boolean | null;
}
