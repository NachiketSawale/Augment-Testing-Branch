/*
 * Copyright(c) RIB Software GmbH
 */

export interface IBisTransferDataRequestGenerated {

/*
 * LogOptions
 */
  LogOptions?: 'None' | 'Info' | 'Error' | 'Warning' | 'Debug' | 'DetectionOnly' | 'Default' | null;

/*
 * costGroupCats
 */
  costGroupCats?: string[] | null;

/*
 * debugMode
 */
  debugMode?: boolean | null;

/*
 * estHeaderIds
 */
  estHeaderIds?: number[] | null;

/*
 * historyDescription
 */
  historyDescription?: string | null;

/*
 * histroyRemark
 */
  histroyRemark?: string | null;

/*
 * insQtyUpdateFrom
 */
  insQtyUpdateFrom?: number | null;

/*
 * projectId
 */
  projectId?: number | null;

/*
 * projectIsCompletePerformance
 */
  projectIsCompletePerformance?: boolean | null;

/*
 * revenueUpdateFrom
 */
  revenueUpdateFrom?: number | null;

/*
 * ribHistoryId
 */
  ribHistoryId?: number | null;

/*
 * updateBillingQty
 */
  updateBillingQty?: boolean | null;

/*
 * updateForecastingPlannedQty
 */
  updateForecastingPlannedQty?: boolean | null;

/*
 * updateInstalledQty
 */
  updateInstalledQty?: boolean | null;

/*
 * updatePlannedQty
 */
  updatePlannedQty?: boolean | null;

/*
 * updateRevenue
 */
  updateRevenue?: boolean | null;

/*
 * versionType
 */
  versionType?: string | null;
}
