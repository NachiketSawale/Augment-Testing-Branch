/*
 * Copyright(c) RIB Software GmbH
 */


import { IModuleNavigator, ModuleNavigatorIdentification } from './module-navigator.interface';

/**
 * ModuleNavigationManager interface
 */
export interface IModuleNavigationManager {

  /**
   * adds a navigator
   * @param navigator
   */
  addNavigator(navigator: IModuleNavigator | IModuleNavigator[]): void;

  /**
   * removes a navigator
   * @param navigator
   */
  removeNavigator(navigator: ModuleNavigatorIdentification): void;


  /**
   * removes all navigators
   * @param navigator
   */
  removeAllNavigator(): void;
}