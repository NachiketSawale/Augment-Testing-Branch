/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBundleEntity } from './entities/bundle-entity.interface';

export class BundleComplete implements CompleteIdentification<IBundleEntity>{

 /*
  * Bundle
  */
  public Bundle: [] | null = [];

 /*
  * Bundles
  */
  public Bundles: [] | null = [];

 /*
  * EventToDelete
  */
  //public EventToDelete: IIIdentifyable[] | null = [];

 /*
  * EventToSave
  */
  //public EventToSave: IIIdentifyable[] | null = [];

 /*
  * Id
  */
  public Id: number | null = 10;

 /*
  * LoadingDeviceToDelete
  */
  //public LoadingDeviceToDelete: IIIdentifyable[] | null = [];

 /*
  * LoadingDeviceToSave
  */
  //public LoadingDeviceToSave: IIIdentifyable[] | null = [];

 /*
  * MainItemId
  */
  public MainItemId: number | null = 10;

 /*
  * PpsDocumentToDelete
  */
  //public PpsDocumentToDelete: IIIdentifyable[] | null = [];

 /*
  * PpsDocumentToSave
  */
  //public PpsDocumentToSave: IIIdentifyable[] | null = [];

 /*
  * ProductToDelete
  */
 // public ProductToDelete: IIIdentifyable[] | null = [];

 /*
  * ProductToSave
  */
  //public ProductToSave: IIIdentifyable[] | null = [];

 /*
  * ResReservationToDelete
  */
  //public ResReservationToDelete: IIIdentifyable[] | null = [];

 /*
  * ResReservationToSave
  */
  //public ResReservationToSave: IIIdentifyable[] | null = [];
}
