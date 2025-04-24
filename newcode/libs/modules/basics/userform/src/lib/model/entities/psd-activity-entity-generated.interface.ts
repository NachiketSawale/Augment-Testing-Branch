/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from './project-entity.interface';
import { IPsdActivityEntity } from './psd-activity-entity.interface';
import { IPsdActivityFormDataEntity } from './psd-activity-form-data-entity.interface';
import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPsdActivityEntityGenerated extends IEntityBase {

  /**
   * Actualduration
   */
  Actualduration?: number | null;

  /**
   * Actualfinish
   */
  Actualfinish?: Date | string | null;

  /**
   * Actualstart
   */
  Actualstart?: Date | string | null;

  /**
   * Allowmodify
   */
  Allowmodify: boolean;

  /**
   * CalCalendarFk
   */
  CalCalendarFk: number;

  /**
   * ChartpresentationFk
   */
  ChartpresentationFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * Constraintdate
   */
  Constraintdate?: Date | string | null;

  /**
   * CosMatchtext
   */
  CosMatchtext?: string | null;

  /**
   * Currentduration
   */
  Currentduration?: number | null;

  /**
   * Currentfinish
   */
  Currentfinish?: Date | string | null;

  /**
   * Currentstart
   */
  Currentstart: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DvisualizationtypeFk
   */
  DvisualizationtypeFk?: number | null;

  /**
   * Earliestfinish
   */
  Earliestfinish?: Date | string | null;

  /**
   * Earlieststart
   */
  Earlieststart?: Date | string | null;

  /**
   * Executionfinished
   */
  Executionfinished: boolean;

  /**
   * Executionstarted
   */
  Executionstarted: boolean;

  /**
   * Freefloattime
   */
  Freefloattime?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Iscritical
   */
  Iscritical: boolean;

  /**
   * Isdirty
   */
  Isdirty: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Isonlongestpath
   */
  Isonlongestpath: boolean;

  /**
   * Latestfinish
   */
  Latestfinish?: Date | string | null;

  /**
   * Lateststart
   */
  Lateststart?: Date | string | null;

  /**
   * LocationFk
   */
  LocationFk?: number | null;

  /**
   * Locationspec
   */
  Locationspec?: string | null;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * Note
   */
  Note?: string | null;

  /**
   * Perf1uomFk
   */
  Perf1uomFk?: number | null;

  /**
   * Perf2uomFk
   */
  Perf2uomFk?: number | null;

  /**
   * Performancefactor
   */
  Performancefactor?: number | null;

  /**
   * Plannedduration
   */
  Plannedduration?: number | null;

  /**
   * Plannedfinish
   */
  Plannedfinish?: Date | string | null;

  /**
   * Plannedstart
   */
  Plannedstart: Date | string;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ProjectreleaseFk
   */
  ProjectreleaseFk?: number | null;

  /**
   * PsdActivityEntities_PsdActivityLevel1Fk
   */
  PsdActivityEntities_PsdActivityLevel1Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdActivityLevel2Fk
   */
  PsdActivityEntities_PsdActivityLevel2Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdActivityLevel3Fk
   */
  PsdActivityEntities_PsdActivityLevel3Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdActivityLevel4Fk
   */
  PsdActivityEntities_PsdActivityLevel4Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdActivityLevel5Fk
   */
  PsdActivityEntities_PsdActivityLevel5Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdActivityLevel6Fk
   */
  PsdActivityEntities_PsdActivityLevel6Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdActivityLevel7Fk
   */
  PsdActivityEntities_PsdActivityLevel7Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdActivityLevel8Fk
   */
  PsdActivityEntities_PsdActivityLevel8Fk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdBaseactivityFk
   */
  PsdActivityEntities_PsdBaseactivityFk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntities_PsdParentactivityFk
   */
  PsdActivityEntities_PsdParentactivityFk?: IPsdActivityEntity[] | null;

  /**
   * PsdActivityEntity_PsdActivityLevel1Fk
   */
  PsdActivityEntity_PsdActivityLevel1Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdActivityLevel2Fk
   */
  PsdActivityEntity_PsdActivityLevel2Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdActivityLevel3Fk
   */
  PsdActivityEntity_PsdActivityLevel3Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdActivityLevel4Fk
   */
  PsdActivityEntity_PsdActivityLevel4Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdActivityLevel5Fk
   */
  PsdActivityEntity_PsdActivityLevel5Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdActivityLevel6Fk
   */
  PsdActivityEntity_PsdActivityLevel6Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdActivityLevel7Fk
   */
  PsdActivityEntity_PsdActivityLevel7Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdActivityLevel8Fk
   */
  PsdActivityEntity_PsdActivityLevel8Fk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdBaseactivityFk
   */
  PsdActivityEntity_PsdBaseactivityFk?: IPsdActivityEntity | null;

  /**
   * PsdActivityEntity_PsdParentactivityFk
   */
  PsdActivityEntity_PsdParentactivityFk?: IPsdActivityEntity | null;

  /**
   * PsdActivityFormDataEntities
   */
  PsdActivityFormDataEntities?: IPsdActivityFormDataEntity[] | null;

  /**
   * PsdActivityLevel1Fk
   */
  PsdActivityLevel1Fk?: number | null;

  /**
   * PsdActivityLevel2Fk
   */
  PsdActivityLevel2Fk?: number | null;

  /**
   * PsdActivityLevel3Fk
   */
  PsdActivityLevel3Fk?: number | null;

  /**
   * PsdActivityLevel4Fk
   */
  PsdActivityLevel4Fk?: number | null;

  /**
   * PsdActivityLevel5Fk
   */
  PsdActivityLevel5Fk?: number | null;

  /**
   * PsdActivityLevel6Fk
   */
  PsdActivityLevel6Fk?: number | null;

  /**
   * PsdActivityLevel7Fk
   */
  PsdActivityLevel7Fk?: number | null;

  /**
   * PsdActivityLevel8Fk
   */
  PsdActivityLevel8Fk?: number | null;

  /**
   * PsdActivitystateFk
   */
  PsdActivitystateFk: number;

  /**
   * PsdActivitytemplateFk
   */
  PsdActivitytemplateFk?: number | null;

  /**
   * PsdActivitytypeFk
   */
  PsdActivitytypeFk?: number | null;

  /**
   * PsdActpresentationFk
   */
  PsdActpresentationFk?: number | null;

  /**
   * PsdBaseactivityFk
   */
  PsdBaseactivityFk?: number | null;

  /**
   * PsdBaselineFk
   */
  PsdBaselineFk?: number | null;

  /**
   * PsdConstrainttypeFk
   */
  PsdConstrainttypeFk?: number | null;

  /**
   * PsdEventtypeFk
   */
  PsdEventtypeFk?: number | null;

  /**
   * PsdLoblabelplacementFk
   */
  PsdLoblabelplacementFk?: number | null;

  /**
   * PsdParentactivityFk
   */
  PsdParentactivityFk?: number | null;

  /**
   * PsdPerformanceruleFk
   */
  PsdPerformanceruleFk?: number | null;

  /**
   * PsdProgressreportmethodFk
   */
  PsdProgressreportmethodFk?: number | null;

  /**
   * PsdScheduleFk
   */
  PsdScheduleFk: number;

  /**
   * PsdSchedulingmethodFk
   */
  PsdSchedulingmethodFk?: number | null;

  /**
   * PsdSubscheduleFk
   */
  PsdSubscheduleFk?: number | null;

  /**
   * PsdTasktypeFk
   */
  PsdTasktypeFk?: number | null;

  /**
   * Quantity
   */
  Quantity?: number | null;

  /**
   * QuantityuomFk
   */
  QuantityuomFk?: number | null;

  /**
   * ResRequisitionEntities
   */
  ResRequisitionEntities?: IResRequisitionEntity[] | null;

  /**
   * Resourcefactor
   */
  Resourcefactor?: number | null;

  /**
   * ScurveFk
   */
  ScurveFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * Specification
   */
  Specification?: string | null;

  /**
   * Totalfloattime
   */
  Totalfloattime?: number | null;

  /**
   * Userdefineddate01
   */
  Userdefineddate01?: Date | string | null;

  /**
   * Userdefineddate02
   */
  Userdefineddate02?: Date | string | null;

  /**
   * Userdefineddate03
   */
  Userdefineddate03?: Date | string | null;

  /**
   * Userdefineddate04
   */
  Userdefineddate04?: Date | string | null;

  /**
   * Userdefineddate05
   */
  Userdefineddate05?: Date | string | null;

  /**
   * Userdefineddate06
   */
  Userdefineddate06?: Date | string | null;

  /**
   * Userdefineddate07
   */
  Userdefineddate07?: Date | string | null;

  /**
   * Userdefineddate08
   */
  Userdefineddate08?: Date | string | null;

  /**
   * Userdefineddate09
   */
  Userdefineddate09?: Date | string | null;

  /**
   * Userdefineddate10
   */
  Userdefineddate10?: Date | string | null;

  /**
   * Userdefinednumber01
   */
  Userdefinednumber01?: number | null;

  /**
   * Userdefinednumber02
   */
  Userdefinednumber02?: number | null;

  /**
   * Userdefinednumber03
   */
  Userdefinednumber03?: number | null;

  /**
   * Userdefinednumber04
   */
  Userdefinednumber04?: number | null;

  /**
   * Userdefinednumber05
   */
  Userdefinednumber05?: number | null;

  /**
   * Userdefinednumber06
   */
  Userdefinednumber06?: number | null;

  /**
   * Userdefinednumber07
   */
  Userdefinednumber07?: number | null;

  /**
   * Userdefinednumber08
   */
  Userdefinednumber08?: number | null;

  /**
   * Userdefinednumber09
   */
  Userdefinednumber09?: number | null;

  /**
   * Userdefinednumber10
   */
  Userdefinednumber10?: number | null;

  /**
   * Userdefinedtext01
   */
  Userdefinedtext01?: string | null;

  /**
   * Userdefinedtext02
   */
  Userdefinedtext02?: string | null;

  /**
   * Userdefinedtext03
   */
  Userdefinedtext03?: string | null;

  /**
   * Userdefinedtext04
   */
  Userdefinedtext04?: string | null;

  /**
   * Userdefinedtext05
   */
  Userdefinedtext05?: string | null;

  /**
   * Userdefinedtext06
   */
  Userdefinedtext06?: string | null;

  /**
   * Userdefinedtext07
   */
  Userdefinedtext07?: string | null;

  /**
   * Userdefinedtext08
   */
  Userdefinedtext08?: string | null;

  /**
   * Userdefinedtext09
   */
  Userdefinedtext09?: string | null;

  /**
   * Userdefinedtext10
   */
  Userdefinedtext10?: string | null;

  /**
   * Work
   */
  Work?: number | null;
}
