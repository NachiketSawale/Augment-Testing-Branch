/*
 * Copyright(c) RIB Software GmbH
 */


import { LazyInjectionToken } from '@libs/platform/common';
import { ICostCodeEntity } from '../entities/lookup/basics/costcodes/cost-code-entity.interface';
import { IBasicsEfbsheetsEntity } from '../entities/efbsheets/basics-efbsheets-entity.interface';
import { childType } from '../enums/basics-efbsheets-childtype.enum';

export interface IBasicsEfbsheetsCommonService {

  /**
   * Sets the selected lookup item and updates the corresponding entity properties.
   *
   * @template T - The type of entity that extends an object with an optional `MdcCostCodeFk` property.
   * @param lookupItem - The lookup item containing details such as `Id`, `OriginalId`, and `Rate`.
   * @param isProject - A flag indicating whether the operation is project-specific.
   * @param entities - The list of entities to be updated.
   * 
   * @returns void
   */
    
	setSelectedLookupItem<T extends { MdcCostCodeFk?: number }>(
        lookupItem:ICostCodeEntity,
        isProject: boolean,
        entities: T[]
      ):void;

   /**
   * Calculates crew mixes and their child entities based on the specified type.
   *
   * @param crewMixItem - The crew mix item to be processed.
   * @param childType - The type of child entity to calculate (e.g., AverageWage, CrewMixAF, etc.).
   * 
   * @returns void
   */
      calculateCrewmixesAndChilds(
        crewMixItem: IBasicsEfbsheetsEntity,
        childType: childType
      ): void;
	
}

export const BASICS_EFBSHEETS_COMMON_SERVICE_TOKEN = new LazyInjectionToken<IBasicsEfbsheetsCommonService>('baiscs-efbsheets-common-service');
