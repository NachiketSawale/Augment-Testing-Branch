/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ValidationResult } from './validation-result.class';
import { Dictionary } from '@libs/platform/common';


@Injectable({
  providedIn: 'root'
})
export class PendingAsyncValidationService {

  private pendingValidations: Dictionary<string, Promise<ValidationResult>> = new Dictionary<string, Promise<ValidationResult>>();
  private nextId: number = 1001;
  /**
   * register a validation promise
   * @param promise
   */
  public register(promise: Promise<ValidationResult>): string {
	  const uuid = this.nextId.toString();
	  this.nextId += 1;
	  this.pendingValidations.add(uuid, promise);
	  promise.then(() => {
		  this.unregister(uuid);
	  });
	  return uuid;
  }

  /**
   * unregister a validation promise with an uuid
   * @param uuid
   */
  private unregister(uuid: string): void {
    this.pendingValidations.remove(uuid);
  }

  /**
   * get all pending validations in one promise
   */
  public async getAll(): Promise<ValidationResult[]> {
	  if(this.pendingValidations.keys().length === 0){
		  return Promise.resolve([]);
	  }
    return Promise.all(this.pendingValidations.values());
  }

}
