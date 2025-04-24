/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPlantGroup2ResTypeEntity, IResourceTypeEntity } from '@libs/resource/interfaces';
import { IPlanningBoardFilterEntity } from '@libs/resource/interfaces';
import { IRequestedTypeEntity } from '@libs/resource/interfaces';
import { IRequiredSkillEntity } from '@libs/resource/interfaces';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IResourceTypeEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CreateTemporaryResource
 */
  CreateTemporaryResource?: boolean | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DispatcherGroupFk
 */
  DispatcherGroupFk?: number | null;

/*
 * EtmPlantgroup2restypeEntities
 */
  EtmPlantgroup2restypeEntities?: IPlantGroup2ResTypeEntity[] | null;

/*
 * GroupFk
 */
  GroupFk?: number | null;

/*
 * HR
 */
  HR?: boolean | null;

/*
 * Has2ndDemand
 */
  Has2ndDemand?: boolean | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsBulk
 */
  IsBulk?: boolean | null;

/*
 * IsCrane
 */
  IsCrane?: boolean | null;

/*
 * IsDetailer
 */
  IsDetailer?: boolean | null;

/*
 * IsDriver
 */
  IsDriver?: boolean | null;

/*
 * IsPlant
 */
  IsPlant?: boolean | null;

/*
 * IsSmallTools
 */
  IsSmallTools?: boolean | null;

/*
 * IsStructuralEngineer
 */
  IsStructuralEngineer?: boolean | null;

/*
 * IsTrailer
 */
  IsTrailer?: boolean | null;

/*
 * IsTransportPermission
 */
  IsTransportPermission?: boolean | null;

/*
 * IsTruck
 */
  IsTruck?: boolean | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * PlantGroupFk
 */
  PlantGroupFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * ResPlanningboardfilterEntities
 */
  ResPlanningboardfilterEntities?: IPlanningBoardFilterEntity[] | null;

/*
 * ResRequestedtypeEntities_ResTypeFk
 */
  ResRequestedtypeEntities_ResTypeFk?: IRequestedTypeEntity[] | null;

/*
 * ResRequestedtypeEntities_ResTyperequestedFk
 */
  ResRequestedtypeEntities_ResTyperequestedFk?: IRequestedTypeEntity[] | null;

/*
 * ResType2skillEntities
 */
  ResType2skillEntities?: IRequiredSkillEntity[] | null;

/*
 * ResourceContextFk
 */
  ResourceContextFk?: number | null;

/*
 * ResourceTypeFk
 */
  ResourceTypeFk?: number | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * Specification
 */
  Specification?: string | null;

/*
 * SubResources
 */
  SubResources?: IResourceTypeEntity[] | null;

/*
 * UoMFk
 */
  UoMFk?: number | null;

/*
 * UserDefinedBool01
 */
  UserDefinedBool01?: boolean | null;

/*
 * UserDefinedBool02
 */
  UserDefinedBool02?: boolean | null;

/*
 * UserDefinedBool03
 */
  UserDefinedBool03?: boolean | null;

/*
 * UserDefinedBool04
 */
  UserDefinedBool04?: boolean | null;

/*
 * UserDefinedBool05
 */
  UserDefinedBool05?: boolean | null;

/*
 * UserDefinedDate01
 */
  UserDefinedDate01?: string | null;

/*
 * UserDefinedDate02
 */
  UserDefinedDate02?: string | null;

/*
 * UserDefinedDate03
 */
  UserDefinedDate03?: string | null;

/*
 * UserDefinedDate04
 */
  UserDefinedDate04?: string | null;

/*
 * UserDefinedDate05
 */
  UserDefinedDate05?: string | null;

/*
 * UserDefinedNumber01
 */
  UserDefinedNumber01?: number | null;

/*
 * UserDefinedNumber02
 */
  UserDefinedNumber02?: number | null;

/*
 * UserDefinedNumber03
 */
  UserDefinedNumber03?: number | null;

/*
 * UserDefinedNumber04
 */
  UserDefinedNumber04?: number | null;

/*
 * UserDefinedNumber05
 */
  UserDefinedNumber05?: number | null;

/*
 * UserDefinedText01
 */
  UserDefinedText01?: string | null;

/*
 * UserDefinedText02
 */
  UserDefinedText02?: string | null;

/*
 * UserDefinedText03
 */
  UserDefinedText03?: string | null;

/*
 * UserDefinedText04
 */
  UserDefinedText04?: string | null;

/*
 * UserDefinedText05
 */
  UserDefinedText05?: string | null;
}
