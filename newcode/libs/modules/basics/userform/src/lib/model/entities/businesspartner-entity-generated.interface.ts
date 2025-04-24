/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IBusinesspartnerFormDataEntity } from './businesspartner-form-data-entity.interface';
import { IConHeaderEntity } from './con-header-entity.interface';
import { IContactEntity } from './contact-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';
import { ILgmJobEntity } from './lgm-job-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IPesHeaderEntity } from './pes-header-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IQtnHeaderEntity } from './qtn-header-entity.interface';
import { IReqHeaderEntity } from './req-header-entity.interface';
import { IResResourceEntity } from './res-resource-entity.interface';
import { IWipHeaderEntity } from './wip-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBusinesspartnerEntityGenerated extends IEntityBase {

  /**
   * Avaid
   */
  Avaid?: number | null;

  /**
   * Bedirektno
   */
  Bedirektno?: string | null;

  /**
   * BidHeaderEntities
   */
  BidHeaderEntities?: IBidHeaderEntity[] | null;

  /**
   * BidHeaderEntities_BusinesspartnerBilltoFk
   */
  BidHeaderEntities_BusinesspartnerBilltoFk?: IBidHeaderEntity[] | null;

  /**
   * BilHeaderEntities_BusinesspartnerBilltoFk
   */
  BilHeaderEntities_BusinesspartnerBilltoFk?: IBilHeaderEntity[] | null;

  /**
   * BpName1
   */
  BpName1: string;

  /**
   * BpName2
   */
  BpName2?: string | null;

  /**
   * BpName3
   */
  BpName3?: string | null;

  /**
   * BpName4
   */
  BpName4?: string | null;

  /**
   * BusinesspartnerFormEntities
   */
  BusinesspartnerFormEntities?: IBusinesspartnerFormDataEntity[] | null;

  /**
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ConHeaderEntities
   */
  ConHeaderEntities?: IConHeaderEntity[] | null;

  /**
   * ConHeaderEntities_Businesspartner2Fk
   */
  ConHeaderEntities_Businesspartner2Fk?: IConHeaderEntity[] | null;

  /**
   * ConHeaderEntities_BusinesspartnerAgentFk
   */
  ConHeaderEntities_BusinesspartnerAgentFk?: IConHeaderEntity[] | null;

  /**
   * ContactEntities
   */
  ContactEntities?: IContactEntity[] | null;

  /**
   * Craftcooperative
   */
  Craftcooperative?: string | null;

  /**
   * CraftcooperativeDate
   */
  CraftcooperativeDate?: Date | string | null;

  /**
   * CraftcooperativeType
   */
  CraftcooperativeType?: string | null;

  /**
   * Crefono
   */
  Crefono?: string | null;

  /**
   * CustomerAbcFk
   */
  CustomerAbcFk?: number | null;

  /**
   * CustomerBranchFk
   */
  CustomerBranchFk?: number | null;

  /**
   * CustomerGroupFk
   */
  CustomerGroupFk?: number | null;

  /**
   * CustomerSectorFk
   */
  CustomerSectorFk?: number | null;

  /**
   * CustomerStatusFk
   */
  CustomerStatusFk?: number | null;

  /**
   * Dunsno
   */
  Dunsno?: string | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * Hasframeworkagreement
   */
  Hasframeworkagreement: boolean;

  /**
   * HeaderEntities
   */
  HeaderEntities?: IBilHeaderEntity[] | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Internet
   */
  Internet?: string | null;

  /**
   * InvHeaderEntities
   */
  InvHeaderEntities?: IInvHeaderEntity[] | null;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Isnationwide
   */
  Isnationwide?: boolean | null;

  /**
   * LegalformFk
   */
  LegalformFk?: number | null;

  /**
   * LgmJobEntities
   */
  LgmJobEntities?: ILgmJobEntity[] | null;

  /**
   * LocalBpName1
   */
  LocalBpName1?: string | null;

  /**
   * LocalBpName1Tr
   */
  LocalBpName1Tr?: number | null;

  /**
   * LocalBpName2
   */
  LocalBpName2?: string | null;

  /**
   * LocalBpName2Tr
   */
  LocalBpName2Tr?: number | null;

  /**
   * LocalBpName3
   */
  LocalBpName3?: string | null;

  /**
   * LocalBpName3Tr
   */
  LocalBpName3Tr?: number | null;

  /**
   * LocalBpName4
   */
  LocalBpName4?: string | null;

  /**
   * LocalBpName4Tr
   */
  LocalBpName4Tr?: number | null;

  /**
   * Matchcode
   */
  Matchcode?: string | null;

  /**
   * OrdHeaderEntities
   */
  OrdHeaderEntities?: IOrdHeaderEntity[] | null;

  /**
   * OrdHeaderEntities_BusinesspartnerBilltoFk
   */
  OrdHeaderEntities_BusinesspartnerBilltoFk?: IOrdHeaderEntity[] | null;

  /**
   * PesHeaderEntities
   */
  PesHeaderEntities?: IPesHeaderEntity[] | null;

  /**
   * PrcPackageEntities
   */
  PrcPackageEntities?: IPrcPackageEntity[] | null;

  /**
   * ProjectEntities
   */
  ProjectEntities?: IProjectEntity[] | null;

  /**
   * QtnHeaderEntities
   */
  QtnHeaderEntities?: IQtnHeaderEntity[] | null;

  /**
   * Refvalue1
   */
  Refvalue1?: string | null;

  /**
   * Refvalue2
   */
  Refvalue2?: string | null;

  /**
   * Remark1
   */
  Remark1?: string | null;

  /**
   * Remark2
   */
  Remark2?: string | null;

  /**
   * RemarkMarketing
   */
  RemarkMarketing?: string | null;

  /**
   * ReqHeaderEntities
   */
  ReqHeaderEntities?: IReqHeaderEntity[] | null;

  /**
   * ResResourceEntities
   */
  ResResourceEntities?: IResResourceEntity[] | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * Status2Fk
   */
  Status2Fk?: number | null;

  /**
   * StatusFk
   */
  StatusFk: number;

  /**
   * Taxno
   */
  Taxno?: string | null;

  /**
   * TitleFk
   */
  TitleFk?: number | null;

  /**
   * TradeRegister
   */
  TradeRegister?: string | null;

  /**
   * TradeRegisterdate
   */
  TradeRegisterdate?: Date | string | null;

  /**
   * TradeRegisterno
   */
  TradeRegisterno?: string | null;

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
   * Vatno
   */
  Vatno?: string | null;

  /**
   * WipHeaderEntities
   */
  WipHeaderEntities?: IWipHeaderEntity[] | null;
}
