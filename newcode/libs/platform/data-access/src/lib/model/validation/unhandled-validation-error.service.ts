/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {Dictionary} from '@libs/platform/common';


@Injectable({
  providedIn: 'root'
})
export class UnhandledValidationErrorService {

  private unhandledValidationError: Dictionary<string, boolean> = new Dictionary<string, boolean>();

  public hasUnhandledErrors(): boolean {
    return this.unhandledValidationError.keys().length > 0;
  }

  /**
   * add data service having issues to registry for stopping the update process
   * @param serviceName
   */
  public addServiceWithErrors(serviceName: string): void {
    this.unhandledValidationError.add(serviceName, true);
  }

  /**
   * remove data service having all issues fixed from registry for allowing the update
   * @param serviceName
   */
  public removeServiceWithErrors(serviceName: string): void {
    this.unhandledValidationError.remove(serviceName);
  }
}
