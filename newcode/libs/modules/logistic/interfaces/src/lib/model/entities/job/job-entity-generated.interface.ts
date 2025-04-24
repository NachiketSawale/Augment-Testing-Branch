/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';
import { ILogisticJobSundryServicePriceEntity } from './logistic-job-sundry-service-price-entity.interface';
import { IJobTaskEntity } from './job-task-entity.interface';

export interface IJobEntityGenerated extends IEntityBase {

  /**
   * Address
   */
  Address?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * AddressPrj
   */
  AddressPrj?: IAddressEntity | null;

  /**
   * AddressPrjFk
   */
  AddressPrjFk?: number | null;

  /**
   * BillingJobFk
   */
  BillingJobFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * CalEstimateFk
   */
  CalEstimateFk: number;

  /**
   * CalendarFk
   */
  CalendarFk: number;

  /**
   * ClerkOwnerFk
   */
  ClerkOwnerFk?: number | null;

  /**
   * ClerkResponsibleFk
   */
  ClerkResponsibleFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CostCodePriceListFk
   */
  CostCodePriceListFk?: number | null;

  /**
   * CostCodePriceVersionFk
   */
  CostCodePriceVersionFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DeliveryAddressBlobFk
   */
  DeliveryAddressBlobFk?: number | null;

  /**
   * DeliveryAddressContactFk
   */
  DeliveryAddressContactFk?: number | null;

  /**
   * DeliveryAddressRemark
   */
  DeliveryAddressRemark?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DivisionFk
   */
  DivisionFk: number;

  /**
   * EndWarranty
   */
  EndWarranty?: string | null;

  /**
   * EtmPlantComponentFk
   */
  EtmPlantComponentFk?: number | null;

  /**
   * HasLoadingCost
   */
  HasLoadingCost: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IncotermFk
   */
  IncotermFk?: number | null;

  /**
   * IsCenter
   */
  IsCenter: boolean;

  /**
   * IsJointVenture
   */
  IsJointVenture: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsLoadingCostForBillingType
   */
  IsLoadingCostForBillingType: boolean;

  /**
   * IsMaintenance
   */
  IsMaintenance: boolean;

  /**
   * IsNew
   */
  IsNew: boolean;

  /**
   * IsPoolJob
   */
  IsPoolJob: boolean;

  /**
   * IsProjectDefault
   */
  IsProjectDefault: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * IsVersionJob
   */
  IsVersionJob: boolean;

  /**
   * JobGroupFk
   */
  JobGroupFk?: number | null;

  /**
   * JobStatusFk
   */
  JobStatusFk: number;

  /**
   * JobTaskEntities
   */
  JobTaskEntities?: IJobTaskEntity[] | null;

  /**
   * JobTypeFk
   */
  JobTypeFk: number;

  /**
   * LastSettlementDate
   */
  LastSettlementDate?: string | null;

  /**
   * LgmSundryservpriceEntities_LgmJobFk
   */
  LgmSundryservpriceEntities_LgmJobFk?: ILogisticJobSundryServicePriceEntity[] | null;

  /**
   * LgmSundryservpriceEntities_LgmJobperformingFk
   */
  LgmSundryservpriceEntities_LgmJobperformingFk?: ILogisticJobSundryServicePriceEntity[] | null;

  /**
   * LogisticContextFk
   */
  LogisticContextFk: number;

  /**
   * PlantEstimatePriceListFk
   */
  PlantEstimatePriceListFk?: number | null;

  /**
   * PlantFk
   */
  PlantFk?: number | null;

  /**
   * PlantGroupFk
   */
  PlantGroupFk?: number | null;

  /**
   * PriceConditionFk
   */
  PriceConditionFk?: number | null;

  /**
   * PricingGroupFk
   */
  PricingGroupFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SettledByTypeFk
   */
  SettledByTypeFk?: number | null;

  /**
   * SiteFk
   */
  SiteFk?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
