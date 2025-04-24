/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import {
	IJobDocumentEntity,
	IJobEntity,
	IJobPlantAllocationEntity,
	ILogisticEquipmentCatalogPriceEntity, ILogisticJobCostCodeRateEntity, ILogisticJobMaterialCatalogPriceEntity, ILogisticJobPlantPriceEntity, ILogisticJobSundryServicePriceEntity,
	IProject2MaterialEntity
} from '@libs/logistic/interfaces';
import { IJobTaskEntity } from '@libs/logistic/interfaces';
import { LogisticMaterialComplete } from './logistic-material-complete.class';
import { LogisticJobPlantAllocationComplete } from './logistic-job-plant-allocation-complete.class';



export class JobComplete extends CompleteIdentification<IJobEntity>{
  /**
   * CostCodeRatesToDelete
   */
  public  CostCodeRatesToDelete?: ILogisticJobCostCodeRateEntity[] | null = [];

  /**
   * CostCodeRatesToSave
   */
  public CostCodeRatesToSave?: ILogisticJobCostCodeRateEntity[] | null = [];

  /**
   * EquipmentCatPricesToDelete
   */
  public EquipmentCatPricesToDelete?: ILogisticEquipmentCatalogPriceEntity[] | null = [];

  /**
   * EquipmentCatPricesToSave
   */
  public EquipmentCatPricesToSave?: ILogisticEquipmentCatalogPriceEntity[] | null = [];

  /**
   * JobDocumentToDelete
   */
  public JobDocumentToDelete?: IJobDocumentEntity[] | null = [];

  /**
   * JobDocumentToSave
   */
  public JobDocumentToSave?: IJobDocumentEntity[] | null = [];

  /**
   * JobTasksToDelete
   */
  public JobTasksToDelete?: IJobTaskEntity[] | null = [];

  /**
   * JobTasksToSave
   */
  public JobTasksToSave?: IJobTaskEntity[] | null = [];
  /**
   * Jobs
   */
  public Jobs: IJobEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MaterialCatPricesToDelete
   */
  public MaterialCatPricesToDelete?: ILogisticJobMaterialCatalogPriceEntity[] | null = [];

  /**
   * MaterialCatPricesToSave
   */
  public MaterialCatPricesToSave?: LogisticMaterialComplete[] | null = [];

  /**
   * PlantAllocationsToDelete
   */
  public PlantAllocationsToDelete?: IJobPlantAllocationEntity[] | null = [];

  /**
   * PlantAllocationsToSave
   */
  public PlantAllocationsToSave: LogisticJobPlantAllocationComplete[] | null = [];

  /**
   * PlantPricesToDelete
   */
  public PlantPricesToDelete?: ILogisticJobPlantPriceEntity[] | null = [];

  /**
   * PlantPricesToSave
   */
  public PlantPricesToSave?: ILogisticJobPlantPriceEntity[] | null = [];

  /**
   * Prj2MaterialsToDelete
   */
  public Prj2MaterialsToDelete?: IProject2MaterialEntity[] | null = [];

  /**
   * Prj2MaterialsToSave
   */
  public Prj2MaterialsToSave?: IProject2MaterialEntity[] | null = [];

  /**
   * SundryServicePricesToDelete
   */
  public SundryServicePricesToDelete?: ILogisticJobSundryServicePriceEntity[] | null = [];

  /**
   * SundryServicePricesToSave
   */
  public SundryServicePricesToSave?: ILogisticJobSundryServicePriceEntity[] | null = [];
}


