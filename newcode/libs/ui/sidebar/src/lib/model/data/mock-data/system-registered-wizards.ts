/**
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';

/**
 * Mock Register wizards data for testing;
 */
export const SYSTEM_WIZARDS = [
   {
      uuid: 'b33407a3003f42e9b86f1f13616b47cb',
      name: 'Test Wizard',
      description: 'Tests the wizard system.',
      execute(context: IInitializationContext): Promise<void> {
         const promise = new Promise<void>((resolve, reject) => {
            return resolve(console.log('I AM THE POWERFUL WIZARD!'));
         });

         return promise;
      },
   },
   {
      uuid: 'b010117e602649b4bfc0b802fce5b7ec',
      name: 'Other Wizard',
      execute(context: IInitializationContext): Promise<void> {
         const promise = new Promise<void>((resolve, reject) => {
            return resolve(console.log('I AM THE POWERFUL WIZARD!'));
         });

         return promise;
      },
   },
];
