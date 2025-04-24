/*
 * Copyright(c) RIB Software GmbH
 */

import { IHeaderPparamEntity } from './header-pparam-entity.interface';

export interface IHeaderPparamComplateEntityGenerated {

  /**
   * HeaderPparamToDelete
   */
  HeaderPparamToDelete?: IHeaderPparamEntity[] | null;

  /**
   * HeaderPparamToSave
   */
  HeaderPparamToSave?: IHeaderPparamEntity[] | null;

  /**
   * Type
   */
  Type: 'Package' | 'Requisition' | 'Quote' | 'Contract' | 'Pes' | 'Project' | 'Bid' | 'Order' | 'Wip' | 'Bill';
}
