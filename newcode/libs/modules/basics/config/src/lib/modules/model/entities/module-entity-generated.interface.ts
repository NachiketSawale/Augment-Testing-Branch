/*
 * Copyright(c) RIB Software GmbH
 */

// import { ICommandbarConfigEntity } from './commandbar-config-entity.interface';
// import { IDashboard2moduleEntity } from './dashboard-2module-entity.interface';
// import { IGenericWizardInstanceEntity } from './generic-wizard-instance-entity.interface';
// import { IMcTwoQnAEntity } from './mc-two-qn-aentity.interface';
// import { IModuleGroupEntity } from './module-group-entity.interface';
// import { IModuleTabEntity } from './module-tab-entity.interface';
// import { IModuleColumnInfoEntity } from './module-column-info-entity.interface';
// import { IModuleTableInfoEntity } from './module-table-info-entity.interface';
// import { INavbarConfigEntity } from './navbar-config-entity.interface';
// import { IReportGroupEntity } from './report-group-entity.interface';
// import { IWizard2ModuleEntity } from './wizard-2module-entity.interface';
// import { IWizardGroupEntity } from './wizard-group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IModuleEntityGenerated extends IEntityBase {

/*
 * AfterSearch
 */
  AfterSearch?: number | null;

/*
 * AuditTrailArdFk
 */
  AuditTrailArdFk?: number | null;

/*
 * Color
 */
  Color?: string | null;

/*
 * CombarEnabled
 */
  CombarEnabled?: boolean | null;

/*
 * CombarPortalEnabled
 */
  CombarPortalEnabled?: boolean | null;

/*
 * CommandbarConfigEntities
 */
  // CommandbarConfigEntities?: ICommandbarConfigEntity[] | null;

/*
 * Dashboard2moduleEntities
 */
  // Dashboard2moduleEntities?: IDashboard2moduleEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DisplayName
 */
  DisplayName?: IDescriptionInfo | null;

/*
 * GenericWizardInstanceEntities
 */
  // GenericWizardInstanceEntities?: IGenericWizardInstanceEntity[] | null;

/*
 * HasCommandBarConfig
 */
  HasCommandBarConfig?: boolean | null;

/*
 * HasCommandBarPortalConfig
 */
  HasCommandBarPortalConfig?: boolean | null;

/*
 * HasLastObjects
 */
  HasLastObjects?: boolean | null;

/*
 * HasNavBarConfig
 */
  HasNavBarConfig?: boolean | null;

/*
 * HasNavBarPortalConfig
 */
  HasNavBarPortalConfig?: boolean | null;

/*
 * HasWatchList
 */
  HasWatchList?: boolean | null;

/*
 * IconFk
 */
  IconFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * InternalName
 */
  InternalName?: string | null;

/*
 * IsActive
 */
  IsActive?: boolean | null;

/*
 * IsHome
 */
  IsHome?: boolean | null;

/*
 * LastobjectsIconFk
 */
  LastobjectsIconFk?: number | null;

/*
 * LogFileTableName
 */
  LogFileTableName?: string | null;

/*
 * MaxPageSize
 */
  MaxPageSize?: number | null;

/*
 * MctwoQnaEntities
 */
  // MctwoQnaEntities?: IMcTwoQnAEntity[] | null;

/*
 * ModuleGroupEntity
 */
  // ModuleGroupEntity?: IModuleGroupEntity | null;

/*
 * ModuleGroupFk
 */
  ModuleGroupFk?: number | null;

/*
 * ModuleName
 */
  ModuleName?: IDescriptionInfo | null;

/*
 * ModuleTabEntities
 */
  // ModuleTabEntities?: IModuleTabEntity[] | null;

/*
 * ModuleType
 */
  ModuleType?: boolean | null;

/*
 * ModuleView
 */
  ModuleView?: string | null;

/*
 * ModulecolumninfoEntities
 */
  // ModulecolumninfoEntities?: IModuleColumnInfoEntity[] | null;

/*
 * ModuletableinfoEntities
 */
  // ModuletableinfoEntities?: IModuleTableInfoEntity[] | null;

/*
 * NavbarConfigEntities
 */
  // NavbarConfigEntities?: INavbarConfigEntity[] | null;

/*
 * NavbarEnabled
 */
  NavbarEnabled?: boolean | null;

/*
 * NavbarPortalEnabled
 */
  NavbarPortalEnabled?: boolean | null;

/*
 * NoCompany
 */
  NoCompany?: boolean | null;

/*
 * PageCount
 */
  PageCount?: number | null;

/*
 * PageSize
 */
  PageSize?: number | null;

/*
 * ReportGroupEntities
 */
  // ReportGroupEntities?: IReportGroupEntity[] | null;

/*
 * SidebarStartmodus
 */
  SidebarStartmodus?: number | null;

/*
 * SortOrderPath
 */
  SortOrderPath?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * SystemoptionFk
 */
  SystemoptionFk?: number | null;

/*
 * TileColor
 */
  TileColor?: string | null;

/*
 * TileType
 */
  TileType?: boolean | null;

/*
 * WatchListIconFk
 */
  WatchListIconFk?: number | null;

/*
 * Wizard2ModuleEntities
 */
  // Wizard2ModuleEntities?: IWizard2ModuleEntity[] | null;

/*
 * WizardGroupEntities
 */
  // WizardGroupEntities?: IWizardGroupEntity[] | null;
}
