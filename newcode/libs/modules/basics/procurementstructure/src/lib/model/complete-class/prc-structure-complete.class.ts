/*
 * Copyright(c) RIB Software GmbH
 */



import { IPrcStructureEntity, IPrcStructureTaxEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { IPrcConfiguration2CertEntity } from '../entities/prc-configuration-2-cert-entity.interface';
import { IPrcConfiguration2GeneralsEntity } from '../entities/prc-configuration-2-generals-entity.interface';
import { IPrcStructure2EvaluationEntity } from '../entities/prc-structure-2-evaluation-entity.interface';
import { IPrcStructure2clerkEntity } from '../entities/prc-structure-2-clerk-entity.interface';
import { IPrcStructureAccountEntity } from '../entities/prc-structure-account-entity.interface';
import { IPrcStructureDocEntity } from '../entities/prc-structure-doc-entity.interface';
import { IPrcStructureEventEntity } from '../entities/prc-structure-event-entity.interface';
import { MdcContextComplete } from './mdc-context-complete.class';

export class PrcStructureComplete implements CompleteIdentification<IPrcStructureEntity>{

  /**
   * ClerkDataToDelete
   */
  // public ClerkDataToDelete?: IClerkDataEntity[] | null = [];

  /**
   * ClerkDataToSave
   */
  // public ClerkDataToSave?: IClerkDataEntity[] | null = [];

  /**
   * MdcContextToDelete
   */
  public MdcContextToDelete?: MdcContextComplete[] | null = [];

  /**
   * MdcContextToSave
   */
  public MdcContextToSave?: MdcContextComplete[] | null = [];

  /**
   * PrcConfiguration2certToDelete
   */
  public PrcConfiguration2certToDelete?: IPrcConfiguration2CertEntity[] | null = [];

  /**
   * PrcConfiguration2certToSave
   */
  public PrcConfiguration2certToSave?: IPrcConfiguration2CertEntity[] | null = [];

  /**
   * PrcConfiguration2generalsToDelete
   */
  public PrcConfiguration2generalsToDelete?: IPrcConfiguration2GeneralsEntity[] | null = [];

  /**
   * PrcConfiguration2generalsToSave
   */
  public PrcConfiguration2generalsToSave?: IPrcConfiguration2GeneralsEntity[] | null = [];

  /**
   * PrcStructure
   */
  public PrcStructure?: IPrcStructureEntity | null;

  /**
   * PrcStructure2EvaluationToDelete
   */
  public PrcStructure2EvaluationToDelete?: IPrcStructure2EvaluationEntity[] | null = [];

  /**
   * PrcStructure2EvaluationToSave
   */
  public PrcStructure2EvaluationToSave?: IPrcStructure2EvaluationEntity[] | null = [];

  /**
   * PrcStructure2clerkToDelete
   */
  public PrcStructure2clerkToDelete?: IPrcStructure2clerkEntity[] | null = [];

  /**
   * PrcStructure2clerkToSave
   */
  public PrcStructure2clerkToSave?: IPrcStructure2clerkEntity[] | null = [];

  /**
   * PrcStructureDocToDelete
   */
  public PrcStructureDocToDelete?: IPrcStructureDocEntity[] | null = [];

  /**
   * PrcStructureDocToSave
   */
  public PrcStructureDocToSave?: IPrcStructureDocEntity[] | null = [];

  /**
   * PrcStructureEventToDelete
   */
  public PrcStructureEventToDelete?: IPrcStructureEventEntity[] | null = [];

  /**
   * PrcStructureEventToSave
   */
  public PrcStructureEventToSave?: IPrcStructureEventEntity[] | null = [];

  /**
   * PrcStructureTaxToDelete
   */
  public PrcStructureTaxToDelete?: IPrcStructureTaxEntity[] | null = [];

  /**
   * PrcStructureTaxToSave
   */
  public PrcStructureTaxToSave?: IPrcStructureTaxEntity[] | null = [];

  /**
   * PrcStructureToSave
   */
  public PrcStructureToSave?: IPrcStructureEntity[] | null = [];

  /**
   * PrcStructureaccountToDelete
   */
  public PrcStructureaccountToDelete?: IPrcStructureAccountEntity[] | null = [];

  /**
   * PrcStructureaccountToSave
   */
  public PrcStructureaccountToSave?: IPrcStructureAccountEntity[] | null = [];

  public constructor(e: IPrcStructureEntity | null) {
    if (e) {
        this.PrcStructure = e;
    }
}
}
