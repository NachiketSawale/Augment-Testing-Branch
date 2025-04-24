/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { ICharacteristicDataEntity } from '@libs/basics/interfaces';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstResourceCharacteristicEntityGenerated {

/*
 * UserDefinedcolsOfOldResources
 */
  //UserDefinedcolsOfOldResources?: IUserDefinedcolValEntity[] | null;

/*
 * UserDefinedcolsOfResource
 */
  // UserDefinedcolsOfResource?: IUserDefinedcolValEntity[] | null;

/*
 * resources
 */
  resources?: IEstResourceEntity[] | null;

/*
 * resourcesAssembliesCharacteristics
 */
  resourcesAssembliesCharacteristics?: ICharacteristicDataEntity[] | null;

/*
 * resourcesCharacteristics
 */
  resourcesCharacteristics?: ICharacteristicDataEntity[] | null;
}
