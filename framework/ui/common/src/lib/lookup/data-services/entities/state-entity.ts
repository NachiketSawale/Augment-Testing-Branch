/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * state entity
 */
export class StateEntity {

  public CountryFk!: number;

  public State?: string;

  public constructor(public Id: number, public Description: string) {

  }
}