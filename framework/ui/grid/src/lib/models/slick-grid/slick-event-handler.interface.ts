/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickEventData } from "./slick-event-data.interface";
import { ISlickEvent } from "./slick-event.interface";

export type Handler<H> = (e: ISlickEventData, data: H) => void;

export interface ISlickEventHandler {
  /** Subscribe to a SlickGrid Event and execute its handler callback */
  subscribe: <T = any>(slickEvent: ISlickEvent<T>, handler: Handler<T>) => this;

  /** Unsubscribe to a SlickGrid Event and execute its handler callback */
  unsubscribe: <T = any>(slickEvent: ISlickEvent<T>, handler: Handler<T>) => this;

  /** Unsubscribe and remove all SlickGrid Event Handlers */
  unsubscribeAll: () => void;
}
