/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IEstCostCodeSimulationCurveEntityGenerated {

/*
 * CalculationField
 */
  CalculationField?: 'Budget' | 'HoursTotal' | 'CostTotal' | null;

/*
 * Code
 */
  Code: string;

/*
 * Color
 */
  Color?: number | null;

/*
 * CostCodeCalculationSettings
 */
  //CostCodeCalculationSettings?: ICostCodeCalculationSettingsRequest[] | null;

/*
 * CurveId
 */
  CurveId?: number | null;

/*
 * CurveName
 */
  CurveName?: string | null;

/*
 * TimelineRequest
 */
  //TimelineRequest?: IITimelineRequestEntity | null;
}
