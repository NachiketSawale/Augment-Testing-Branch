/*
 * Copyright(c) RIB Software GmbH
 */


import { INavigationInfo } from './navigation-info.interface';

/**
 * Interface for ModuleNavigation
 */
export interface IModuleNavigation {

	/**
   * navigate to a certain module
   * @param navigationInfo
   */
  navigate(navigationInfo: INavigationInfo): Promise<boolean>;
}