/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

//import { Iitem } from './toolbar.interface';

export abstract class Toolbar {
   toolbarItems: any = [];

   constructor() {
   }

   platformCreateUuid(long: boolean) {
      if (long) {
         return this._p8(false) + this._p8(false) + this._p8(false) + this._p8(false);
      } else {
         return this._p8(false) + this._p8(false) + this._p8(false) + this._p8(false);
      }
   }

   _p8(s: boolean) {
      const p = (Math.random().toString(16) + '000000000').substr(2, 8);

      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
   }

   create(toolbarId: string) {
      this.toolbarItems.push(toolbarId);
      const item = {
         id: toolbarId,
         items: [],
      };
      this.toolbarItems.push(item);
      return toolbarId;
   }

   /*
   register(toolbarId: string, toolItem: Iitem) {
      this.toolbarItems.push(toolItem);
      return toolItem.id ? toolItem.id : this.platformCreateUuid(true);
   }
   */
   unregister(toolbarId: string) {
      // remove item from array
      if (this.toolbarItems.item.id === toolbarId) {
         this.toolbarItems.pop(toolbarId);
      }
   }

   getById(key: string, value: string) {
      return this.toolbarItems.find([key, value]);
   }

   getToolbarObjectById(toolbarId: string) {
      return this.getById('id', toolbarId);
   }

   updateItem(toolbarId: string, item: Array<object>) {
      if (!Array.isArray(item)) {
         item = [item];
      }
      if (this.getToolbarObjectById(toolbarId)) {
         this.getToolbarObjectById(toolbarId).link.updateFields(item);
      }
   }

   addItems(toolbarId: string, item: Array<object>) {
      //this.updateItem(toolbarId, item);
      this.toolbarItems.push(toolbarId, item);
   }

   deleteItems(toolbarId: string, item: Array<object>) {
      this.toolbarItems.pop(toolbarId, item);
   }

   addItemsByIndex(toolbarId: string, index: number, items: Array<object>, subListId: string) {
      if (!Array.isArray(items)) {
         items = [items];
      }
      this.getToolbarObjectById(toolbarId).link.addFieldsByIndex(items, 1);
   }

   addClass(toolbarId: string, itemId: string, cssClass: string) {
   }

   removeClass(toolbarId: string, itemId: string, cssClass: string) {
   }

   toggleClass(toolbarId: string, itemId: string, cssClass: string) {
   }

   hide(toolbarId: string, itemId: string, value: boolean) {
   }
}
