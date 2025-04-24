/*
 * Copyright(c) RIB Software GmbH
 */
import { IEstLineitemFormDataEntity } from './est-lineitem-form-data-entity.interface';
import { IEstRuleFormDataEntity } from './est-rule-form-data-entity.interface';
import { IEtmPlantFormDataEntity } from './etm-plant-form-data-entity.interface';
import { IFormEntity } from './form-entity.interface';
import { IPrjEstRuleFormDataEntity } from './prj-est-rule-form-data-entity.interface';
import { IPsdActivityFormDataEntity } from './psd-activity-form-data-entity.interface';
import { IQtnHeaderFormDataEntity } from './qtn-header-form-data-entity.interface';
import { IQtoFormulaFormDataEntity } from './qto-formula-form-data-entity.interface';
import { IQtoHeaderFormDataEntity } from './qto-header-form-data-entity.interface';
import { IReqHeaderFormDataEntity } from './req-header-form-data-entity.interface';
import { IResRequisitionFormdataEntity } from './res-requisition-formdata-entity.interface';
import { IResReservationFormdataEntity } from './res-reservation-formdata-entity.interface';
import { IResResourceFormdataEntity } from './res-resource-formdata-entity.interface';
import { IRfqHeaderFormDataEntity } from './rfq-header-form-data-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IFormDataIntersectionEntity } from './form-data-intersection-entity.interface';
import { IBidHeaderFormDataEntity } from './bid-header-form-data-entity.interface';
import { IConHeaderFormDataEntity } from './con-header-form-data-entity.interface';
import { IContactFormDataEntity } from './contact-form-data-entity.interface';
import { ICosInstanceEntity } from './cos-instance-entity.interface';
import { IEngTaskFormdataEntity } from './eng-task-formdata-entity.interface';
import { IEstimateFormDataEntity } from './estimate-form-data-entity.interface';
import { IBilHeaderFormDataEntity } from './bil-header-form-data-entity.interface';
import { IHsqChecklist2formEntity } from './hsq-checklist-2-form-entity.interface';
import { IInvHeaderFormDataEntity } from './inv-header-form-data-entity.interface';
import { ILgmDispatchHeaderFormDataEntity } from './lgm-dispatch-header-form-data-entity.interface';
import { ILgmJobFormDataEntity } from './lgm-job-form-data-entity.interface';
import { ILgmJobCardFormDataEntity } from './lgm-job-card-form-data-entity.interface';
import { IMntReportFormdataEntity } from './mnt-report-formdata-entity.interface';
import { IMntRequisitionFormdataEntity } from './mnt-requisition-formdata-entity.interface';
import { IOrdHeaderFormDataEntity } from './ord-header-form-data-entity.interface';
import { IPesHeaderFormDataEntity } from './pes-header-form-data-entity.interface';
import { IPpsItemFormdataEntity } from './pps-item-formdata-entity.interface';
import { IPpsProductFormdataEntity } from './pps-product-formdata-entity.interface';
import { IPpsUpstreamItemFormDataEntity } from './pps-upstream-item-form-data-entity.interface';
import { IPrcPackageFormDataEntity } from './prc-package-form-data-entity.interface';
import { ITksAllocationFormdataEntity } from './tks-allocation-formdata-entity.interface';
import { IWipHeaderFormDataEntity } from './wip-header-form-data-entity.interface';

export interface IFormDataEntityGenerated extends IEntityBase {

  /**
   * BidHeaderFormdataEntities
   */
  BidHeaderFormdataEntities?: IBidHeaderFormDataEntity[] | null;

  /**
   * ConHeaderFormdataEntities
   */
  ConHeaderFormdataEntities?: IConHeaderFormDataEntity[] | null;

  /**
   * ContactFormdataEntities
   */
  ContactFormdataEntities?: IContactFormDataEntity[] | null;

  /**
   * CosInstanceEntities
   */
  CosInstanceEntities?: ICosInstanceEntity[] | null;

  /**
   * EngTaskFormdataEntities
   */
  EngTaskFormdataEntities?: IEngTaskFormdataEntity[] | null;

  /**
   * EstLineitemFormdataEntities
   */
  EstLineitemFormdataEntities?: IEstLineitemFormDataEntity[] | null;

  /**
   * EstRuleFormdataEntities
   */
  EstRuleFormdataEntities?: IEstRuleFormDataEntity[] | null;

  /**
   * EstimateFormdataEntities
   */
  EstimateFormdataEntities?: IEstimateFormDataEntity[] | null;

  /**
   * EtmPlantFormdataEntities
   */
  EtmPlantFormdataEntities?: IEtmPlantFormDataEntity[] | null;

  /**
   * FormDataIntersection
   */
  FormDataIntersection?: IFormDataIntersectionEntity | null;

  /**
   * FormDataStatusFk
   */
  FormDataStatusFk?: number | null;

  /**
   * FormEntity
   */
  FormEntity?: IFormEntity | null;

  /**
   * FormFk
   */
  FormFk: number;

  /**
   * HeaderFormdataEntities
   */
  HeaderFormdataEntities?: IBilHeaderFormDataEntity[] | null;

  /**
   * HsqChecklist2formEntities
   */
  HsqChecklist2formEntities?: IHsqChecklist2formEntity[] | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvHeaderFormdataEntities
   */
  InvHeaderFormdataEntities?: IInvHeaderFormDataEntity[] | null;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * LgmDispatchHeaderFormdataEntities
   */
  LgmDispatchHeaderFormdataEntities?: ILgmDispatchHeaderFormDataEntity[] | null;

  /**
   * LgmJobFormdataEntities
   */
  LgmJobFormdataEntities?: ILgmJobFormDataEntity[] | null;

  /**
   * LgmJobcardFormdataEntities
   */
  LgmJobcardFormdataEntities?: ILgmJobCardFormDataEntity[] | null;

  /**
   * MntReportFormdataEntities
   */
  MntReportFormdataEntities?: IMntReportFormdataEntity[] | null;

  /**
   * MntRequisitionFormdataEntities
   */
  MntRequisitionFormdataEntities?: IMntRequisitionFormdataEntity[] | null;

  /**
   * OrdHeaderFormdataEntities
   */
  OrdHeaderFormdataEntities?: IOrdHeaderFormDataEntity[] | null;

  /**
   * PesHeaderFormdataEntities
   */
  PesHeaderFormdataEntities?: IPesHeaderFormDataEntity[] | null;

  /**
   * PpsItemFormdataEntities
   */
  PpsItemFormdataEntities?: IPpsItemFormdataEntity[] | null;

  /**
   * PpsProductFormdataEntities
   */
  PpsProductFormdataEntities?: IPpsProductFormdataEntity[] | null;

  /**
   * PpsUpstreamItemFormdataEntities
   */
  PpsUpstreamItemFormdataEntities?: IPpsUpstreamItemFormDataEntity[] | null;

  /**
   * PrcPackageFormdataEntities
   */
  PrcPackageFormdataEntities?: IPrcPackageFormDataEntity[] | null;

  /**
   * PrjEstRuleFormdataEntities
   */
  PrjEstRuleFormdataEntities?: IPrjEstRuleFormDataEntity[] | null;

  /**
   * PsdActivityFormdataEntities
   */
  PsdActivityFormdataEntities?: IPsdActivityFormDataEntity[] | null;

  /**
   * QtnHeaderFormdataEntities
   */
  QtnHeaderFormdataEntities?: IQtnHeaderFormDataEntity[] | null;

  /**
   * QtoFormulaFormdataEntities
   */
  QtoFormulaFormdataEntities?: IQtoFormulaFormDataEntity[] | null;

  /**
   * QtoHeaderFormdataEntities
   */
  QtoHeaderFormdataEntities?: IQtoHeaderFormDataEntity[] | null;

  /**
   * ReqHeaderFormdataEntities
   */
  ReqHeaderFormdataEntities?: IReqHeaderFormDataEntity[] | null;

  /**
   * ResRequisitionFormdataEntities
   */
  ResRequisitionFormdataEntities?: IResRequisitionFormdataEntity[] | null;

  /**
   * ResReservationFormdataEntities
   */
  ResReservationFormdataEntities?: IResReservationFormdataEntity[] | null;

  /**
   * ResResourceFormdataEntities
   */
  ResResourceFormdataEntities?: IResResourceFormdataEntity[] | null;

  /**
   * RfqHeaderFormdataEntities
   */
  RfqHeaderFormdataEntities?: IRfqHeaderFormDataEntity[] | null;

  /**
   * RubricEntity
   */
  RubricEntity?: IRubricEntity | null;

  /**
   * RubricFk
   */
  RubricFk: number;

  /**
   * TksAllocationFormdataEntities
   */
  TksAllocationFormdataEntities?: ITksAllocationFormdataEntity[] | null;

  /**
   * WipHeaderFormdataEntities
   */
  WipHeaderFormdataEntities?: IWipHeaderFormDataEntity[] | null;
}
