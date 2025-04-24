/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { PlatformPermissionService, PlatformTranslateService, DesktopGroupListService, PlatformModuleManagerService } from '@libs/platform/common';
import * as _ from 'lodash';
import { IDefaultPage } from '../models/interfaces/default-page.interface';
import { ITilesData } from '../models/interfaces/tile.interface';
import { IGroup } from '../models/interfaces/group.interface';
import { ITileArray } from '../models/interfaces/tile-data.interface';
import { IDefaultTiles } from '../models/interfaces/default-tiles.interface';
import { ITile } from '@libs/platform/common';
import { desktopGroupList } from '@libs/platform/common';
import { ITileGroup } from '../models/interfaces/tile-group.interface';
import { IDesktopPage } from '../models/interfaces/desktop-page.interface';
import { IDefaultTilesGroup } from '../models/interfaces/default-tiles-group.interface';


@Injectable({
   providedIn: 'root',
})
/**
 * Service file for Desktop module
 */
export class DesktopModuleService {
   /**
    * Variable for ModuleTypes object.
    */
   public moduleTypes = {
      internal: 0,
      external: 1,
      web: 2,
   };
   /**
    * Variable for default modules.
    */
   public defaultModules!: IDefaultPage[];

   /**
    * Variable for permissionProp.
    */
   public permissionProp: string = 'permission';
   /**
    * Variable for nameProp.
    */
   public nameProp: string = 'displayName';
   /**
    * Variable for descriptionProp.
    */
   public descriptionProp: string = 'description';
   /**
    * Variable for disabledProp.
    */
   public disabledProp: string = 'disabled';

   public desktopTileList: IDefaultPage[];

   public preloadDesktopTiles: ITile[];


   public constructor(private platformPermissionService: PlatformPermissionService, private platformTranslateService: PlatformTranslateService, public moduleManagerService: PlatformModuleManagerService, public desktopGroupListService: DesktopGroupListService) {
      this.preloadDesktopTiles = this.moduleManagerService.preloadDesktopTileData();
      let desktopListDefaultId;
      for (let i = 0; i < this.preloadDesktopTiles.length; i++) {
         const desktopDefaultId = this.preloadDesktopTiles[i].defaultGroupId;
         desktopListDefaultId = desktopGroupListService.loadDomain(desktopDefaultId);
         if (desktopDefaultId) {
            Object.assign(this.preloadDesktopTiles[i], ...desktopListDefaultId);
         }
      }
      const desktopDefaultTiles: IDefaultTiles[] = [];
      const tileList: ITileArray[] = [];
      const groupList: ITileGroup[] = [];
      let tileGroupList: ITileGroup[] = [];

      this.preloadDesktopTiles.map((preloadDesktopTiles) => {
         const obj = {
            tileColor: preloadDesktopTiles.color,
            defaultSorting: preloadDesktopTiles.defaultSorting,
            description: preloadDesktopTiles.description,
            displayName: preloadDesktopTiles.displayName,
            tileGroupId: preloadDesktopTiles.defaultGroupId,
            iconClass: preloadDesktopTiles.iconClass,
            iconColor: preloadDesktopTiles.iconColor,
            id: preloadDesktopTiles.id,
            tileOpacity: preloadDesktopTiles.opacity,
            permission: preloadDesktopTiles.permissionGuid,
            textColor: preloadDesktopTiles.textColor,
            tileSize: preloadDesktopTiles.tileSize,
            targetRoute: preloadDesktopTiles.targetRoute,
         };
         tileList.push(obj);
      });

      this.preloadDesktopTiles.map((preloadDesktopTiles) => {
         const tileData = tileList.filter((tileList) => tileList.tileGroupId === preloadDesktopTiles.defaultGroupId);
         const desktopGroupList = this.getDefaultId(preloadDesktopTiles);
         desktopGroupList.map((desktopGroupList) => {
            groupList.push({
               id: preloadDesktopTiles.defaultGroupId,
               mainPageId: desktopGroupList.pageId,
               tiles: tileData,
               groupNameKey: desktopGroupList.key
            });
         });
      });

      tileGroupList = Object.values(groupList.reduce((acc: IDefaultTilesGroup, cur: ITileGroup) => {
         return Object.assign(acc, { [String(cur.id)]: cur });
      }, {}));

      this.preloadDesktopTiles.map((preloadDesktopTiles) => {
         const defaultTileGroupList = this.getDefaultId(preloadDesktopTiles);
         defaultTileGroupList.map((defaultTileGroupList) => {
            const desktopGroupList = tileGroupList.filter((tileGroupList) => tileGroupList.mainPageId === defaultTileGroupList.pageId);
            desktopDefaultTiles.push({ id: defaultTileGroupList.pageId, groups: desktopGroupList });
         });
      });

      this.desktopTileList = Object.values(desktopDefaultTiles.reduce((acc: IDesktopPage, cur: IDefaultTiles) => Object.assign(acc, { [cur.id]: cur }), {}));
   }

   /**
    * To get default tile id.
    * @param preloadDesktopTiles
    * @return {ITile[]}
    */
   public getDefaultId(preloadDesktopTiles: ITile) {
      return desktopGroupList.filter((desktopGroupList) => desktopGroupList.groupName === preloadDesktopTiles.defaultGroupId);
   }

   /**
    * To get default modules.
    * @returns {IDefaultPage[]}
    */
   public getDefaultModules(): IDefaultPage[] {
      if (_.isUndefined(this.defaultModules)) {
         this.defaultModules = _.clone(this.desktopTileList);
      }
      return this.defaultModules;
   }

   /**
    * To get descriptor of page.
    * @param pages
    * @returns {string[]}
    */
   public getDescriptors(pages: IDefaultPage[]): string[] {
      let descriptors: string[] = [];
      if (pages) {
         pages.forEach((page: IDefaultPage) => {
            descriptors = descriptors.concat(
               _.reduce(
                  page.groups,
                  (result: string[], item: IGroup) => {
                     return result.concat(_.compact(_.map(item.tiles, this.permissionProp)));
                  },
                  []
               )
            );
         });
      }
      return descriptors;
   }

   /**
    * Returns group of tiles.
    * @param {IGroup} group To accept group of tiles.
    * @param ignorePermissions accepts boolean value.
    * @returns {ITilesData[]}
    */
   public getTilesByGroup(group: IGroup, ignorePermissions: boolean): ITilesData[] {
      if (group && group.tiles) {
         return _.reduce(
            group.tiles,
            (result: ITilesData[], tile: ITilesData) => {
               if (tile.permission || ignorePermissions) {
                  this.platformTranslateService.translateObject(tile, [this.nameProp, this.descriptionProp]);

                  tile.disabled = this.platformPermissionService.hasExecute(tile.permission ?? '', true) ? 0 : 1;
                  ignorePermissions = true;
                  if (ignorePermissions || this.platformPermissionService.hasRead(tile.permission ?? '', true)) {
                     result.push(tile);
                  }
                  if (tile.id === 'example.topic-one' || tile.id === 'example.topic-two' || tile.id === 'example.container-layout-demo' || tile.id === 'webapihelp.webapi-help') {
                     // Quick hack to get the sample tiles active for sure
                     tile.disabled = 0;
                  }
               } else if (tile.type === this.moduleTypes.external || tile.type === this.moduleTypes.web) {
                  result.push(tile);
               }
               return result;
            },
            []
         );
      } else {
         return [];
      }
   }

   /**
    * Returns an array of all modules that the user has permission to access.
    * @param {boolean} ignorePermissions If true, the permissions of the current user will not be checked.
    * @return { array } An array of modules
    */
   public getModules(ignorePermissions: boolean) {
      const internalResult = this.getInternalModules(ignorePermissions);
      return internalResult;
   }

   /**
    * Returns an array of all external modules that the user has permission to access.
    * @param { boolean } ignorePermissions True, if the access rights of the current user should not be checked.
    * @return {  ITilesData[] | Promise<ITilesData[]> } An array of modules
    */
   public getInternalModules(ignorePermissions: boolean): ITilesData[] | Promise<ITilesData[]> {
      const ribPagesStructure = this.getDefaultModules();

      const iterateStructure = (structure: IDefaultPage[]): ITilesData[] => {
         let modules: ITilesData[] = [];
         structure.forEach((page: IDefaultPage) => {
            if (page.groups) {
               page.groups.forEach((group: IGroup) => {
                  group.tiles = this.getTilesByGroup(group, ignorePermissions);
                  if (group.tiles && group.tiles.length) {
                     modules = modules.concat(group.tiles);
                  }
               });
            }
         });
         return modules;
      };

      if (ignorePermissions) {
         if (ribPagesStructure) {
            return iterateStructure(ribPagesStructure);
         }
         return [];
      } else {
         const descriptors: string[] = this.getDescriptors(ribPagesStructure);
         //loadPermissions please confirm second parameter
         return this.platformPermissionService.loadPermissions(descriptors, false).then(() => {
            if (descriptors.length) {
               return iterateStructure(ribPagesStructure);
            }
            return [];
         });
      }
   }

}
