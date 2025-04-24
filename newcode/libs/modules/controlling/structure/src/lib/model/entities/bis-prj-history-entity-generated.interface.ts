/*
 * Copyright(c) RIB Software GmbH
 */

import { IBisPaActivityDocEntity } from './bis-pa-activity-doc-entity.interface';
import { IBisPaActivityEntity } from './bis-pa-activity-entity.interface';
import { IBisPaBoqEntity } from './bis-pa-boq-entity.interface';
import { IBisPaChangeorderEntity } from './bis-pa-changeorder-entity.interface';
import { IBisPaCoAttributeEntity } from './bis-pa-co-attribute-entity.interface';
import { IBisPaCoDataConfigEntity } from './bis-pa-co-data-config-entity.interface';
import { IBisPaCoDataEntity } from './bis-pa-co-data-entity.interface';
import { IBisPaCoEntity } from './bis-pa-co-entity.interface';
import { IBisPrjClassification1Entity } from './bis-prj-classification-1entity.interface';
import { IBisPrjClassification2Entity } from './bis-prj-classification-2entity.interface';
import { IBisPrjClassification3Entity } from './bis-prj-classification-3entity.interface';
import { IBisPrjClassification4Entity } from './bis-prj-classification-4entity.interface';
import { IBisPrjCostcodeCoEntity } from './bis-prj-costcode-co-entity.interface';
import { IBisPrjCostcodeEntity } from './bis-prj-costcode-entity.interface';
import { IBisPrjKeyfigureEntity } from './bis-prj-keyfigure-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBisPrjHistoryEntityGenerated extends IEntityBase {

/*
 * BisPaActivityDocEntities
 */
  BisPaActivityDocEntities?: IBisPaActivityDocEntity[] | null;

/*
 * BisPaActivityEntities
 */
  BisPaActivityEntities?: IBisPaActivityEntity[] | null;

/*
 * BisPaBoqEntities
 */
  BisPaBoqEntities?: IBisPaBoqEntity[] | null;

/*
 * BisPaChangeorderEntities
 */
  BisPaChangeorderEntities?: IBisPaChangeorderEntity[] | null;

/*
 * BisPaCoAttributeEntities
 */
  BisPaCoAttributeEntities?: IBisPaCoAttributeEntity[] | null;

/*
 * BisPaCoDataConfigEntities
 */
  BisPaCoDataConfigEntities?: IBisPaCoDataConfigEntity[] | null;

/*
 * BisPaCoDataEntities
 */
  BisPaCoDataEntities?: IBisPaCoDataEntity[] | null;

/*
 * BisPaCoEntities
 */
  BisPaCoEntities?: IBisPaCoEntity[] | null;

/*
 * BisPrjClassification1Entities
 */
  BisPrjClassification1Entities?: IBisPrjClassification1Entity[] | null;

/*
 * BisPrjClassification2Entities
 */
  BisPrjClassification2Entities?: IBisPrjClassification2Entity[] | null;

/*
 * BisPrjClassification3Entities
 */
  BisPrjClassification3Entities?: IBisPrjClassification3Entity[] | null;

/*
 * BisPrjClassification4Entities
 */
  BisPrjClassification4Entities?: IBisPrjClassification4Entity[] | null;

/*
 * BisPrjCostcodeCoEntities
 */
  BisPrjCostcodeCoEntities?: IBisPrjCostcodeCoEntity[] | null;

/*
 * BisPrjCostcodeEntities
 */
  BisPrjCostcodeEntities?: IBisPrjCostcodeEntity[] | null;

/*
 * BisPrjKeyfigureEntities
 */
  BisPrjKeyfigureEntities?: IBisPrjKeyfigureEntity[] | null;

/*
 * HistoryDate
 */
  HistoryDate?: string | null;

/*
 * HistoryDescription
 */
  HistoryDescription?: string | null;

/*
 * HistoryRemark
 */
  HistoryRemark?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * ReportLog
 */
  ReportLog?: string | null;

/*
 * RibCompanyId
 */
  RibCompanyId: string;

/*
 * RibHistoryId
 */
  RibHistoryId: number;

/*
 * RibPrjId
 */
  RibPrjId: string;

/*
 * RibPrjVersion
 */
  RibPrjVersion: number;

/*
 * TransferLog
 */
  TransferLog?: string | null;
}
