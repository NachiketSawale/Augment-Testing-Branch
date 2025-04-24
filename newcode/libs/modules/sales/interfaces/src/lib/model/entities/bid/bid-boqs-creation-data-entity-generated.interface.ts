/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemExtendEntity } from './boq-item-extend-entity.interface';
import { IBidHeaderEntity } from './bid-header-entity.interface';

export interface IBidBoqsCreationDataEntityGenerated {

  /**
   * BidId
   */
  BidId: number;

  /**
   * BoqItemQuantityFromType
   */
  BoqItemQuantityFromType: number;

  /**
   * CalculateHours
   */
  CalculateHours: boolean;

  /**
   * ContainDifferentChange
   */
  ContainDifferentChange: boolean;

  /**
   * CopyPriceIndex
   */
  CopyPriceIndex?: number[] | null;

  /**
   * CreateTempBoq
   */
  CreateTempBoq: boolean;

  /**
   * DeleteOriginalBidBoq
   */
  DeleteOriginalBidBoq: boolean;

  /**
   * EstUppUsingURP
   */
  EstUppUsingURP: boolean;

  /**
   * EstimateHeaderId
   */
  EstimateHeaderId: number;

  /**
   * EstimateScope
   */
  EstimateScope: number;

  /**
   * FilterLineItemNoBoq
   */
  FilterLineItemNoBoq: boolean;

  /**
   * FilterRequest
   */
  //FilterRequest?: IInt32 | null;

  /**
   * FlagTreeItems
   */
  //FlagTreeItems?: IFlagTreeItem[] | null;

  /**
   * GroupingColumns
   */
  //GroupingColumns?: IGroupColumn[] | null;

  /**
   * MajorLineItems
   */
  MajorLineItems: boolean;

  /**
   * Module
   */
  Module?: string | null;

  /**
   * OutputColumns
   */
  //OutputColumns?: IGroupAggregateColumn[] | null;

  /**
   * Prj2CompanyExchangeRate
   */
  Prj2CompanyExchangeRate?: number | null;

  /**
   * ProjectChangeDetails
   */
  ProjectChangeDetails?: number[] | null;

  /**
   * ProjectChangeLineItems
   */
  ProjectChangeLineItems: boolean;

  /**
   * ProjectChangeOrders
   */
  ProjectChangeOrders?: number[] | null;

  /**
   * ProjectChangeStatus
   */
  ProjectChangeStatus?: number[] | null;

  /**
   * ProjectId
   */
  ProjectId: number;

  /**
   * SplitPerStructure
   */
  SplitPerStructure: boolean;

  /**
   * StructureAssignments
   */
  //StructureAssignments?: IAssignedStructureCopyData[] | null;

  /**
   * StructureMainId
   */
  StructureMainId: number;

  /**
   * StructureType
   */
  StructureType: number;

  /**
   * StructureURPAssignments
   */
  //StructureURPAssignments?: IAssignedStructureURPCopyData[] | null;

  /**
   * SurchargeTextNoteBoqItems
   */
  SurchargeTextNoteBoqItems?: IBoqItemExtendEntity[] | null;

  /**
   * UpdateBidHeader
   */
  UpdateBidHeader?: IBidHeaderEntity | null;

  /**
   * UpdateFpBoqUnitRate
   */
  UpdateFpBoqUnitRate: boolean;
}
