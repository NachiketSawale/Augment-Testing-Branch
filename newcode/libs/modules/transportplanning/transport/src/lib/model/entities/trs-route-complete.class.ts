/*
 * Copyright(c) RIB Software GmbH
 */

//import { IRoute2ClerkEntity } from './route-2-clerk-entity.interface';
import { ITrsWaypointEntity } from './trs-waypoint-entity.interface';
import { TrsWaypointComplete } from './trs-waypoint-complete.class';

import { CompleteIdentification } from '@libs/platform/common';
import { ITrsRouteEntity } from './trs-route-entity.interface';

export class TrsRouteComplete implements CompleteIdentification<ITrsRouteEntity>{

  /**
   * EventLogToSave
   */
  //public EventLogToSave?: IIIdentifyable[] | null = [];

  /**
   * MainItemId
   */
  //public MainItemId: number;

  /**
   * NewRequisitionToShow
   */
 // public NewRequisitionToShow?: IIIdentifyable[] | null = [];

  /**
   * PpsDocumentToDelete
   */
  //public PpsDocumentToDelete?: IIIdentifyable[] | null = [];

  /**
   * PpsDocumentToSave
   */
  //public PpsDocumentToSave?: IIIdentifyable[] | null = [];

  /**
   * ResRequisitionToDelete
   */
  //public ResRequisitionToDelete?: IIIdentifyable[] | null = [];

  /**
   * ResRequisitionToSave
   */
 // public ResRequisitionToSave?: IIIdentifyable[] | null = [];

  /**
   * ResReservationToDelete
   */
  //public ResReservationToDelete?: IIIdentifyable[] | null = [];

  /**
   * ResReservationToSave
   */
  //public ResReservationToSave?: IIIdentifyable[] | null = [];

  /**
   * Route2ClerkToDelete
   */
  //public Route2ClerkToDelete?: IRoute2ClerkEntity[] | null = [];

  /**
   * Route2ClerkToSave
   */
  //public Route2ClerkToSave?: IRoute2ClerkEntity[] | null = [];

  /**
   * SpecialRequisitionToDelete
   */
  //public SpecialRequisitionToDelete?: IIIdentifyable[] | null = [];

  /**
   * SpecialRequisitionToSave
   */
  //public SpecialRequisitionToSave?: IIIdentifyable[] | null = [];

  /**
   * TransportPackageToDelete
   */
  //public TransportPackageToDelete?: ITransportPackageEntity[] | null = [];

  /**
   * TransportPackageToSave
   */
  //public TransportPackageToSave?: TransportPackageComplete[] | null = [];

  /**
   * TrsRoute
   */
  //public TrsRoute?: {} | null = [];

  /**
   * TrsRoutes
   */
 // public TrsRoutes?: {}[] | null = [];

  /**
   * TrsWaypointToDelete
   */
  public TrsWaypointToDelete?: ITrsWaypointEntity[] | null = [];

  /**
   * TrsWaypointToSave
   */
  public TrsWaypointToSave?: TrsWaypointComplete[] | null = [];
}
