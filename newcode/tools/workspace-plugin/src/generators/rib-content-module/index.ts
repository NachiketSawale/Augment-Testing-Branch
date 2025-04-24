/*
 * Copyright(c) RIB Software GmbH
 */

import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { Tree, formatFiles, generateFiles, names, getProjects, ProjectConfiguration } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import { contentModuleSchema, nameSet } from './schema';
import { existsSync, readFileSync } from 'fs';
import * as ts from 'typescript';

/**
 * @param {Tree}tree
 * @param {contentModuleSchema}schema
 * @description provides rules for creating content module
 */
export default async function (tree: Tree, schema: contentModuleSchema) {
   const libraryName = schema.name.replace(/\//g, '-');
   const project = getProjects(tree).get(libraryName);
   const componentNames = names(libraryName);
   let isCreated = false;

   if (project === undefined) {
      let sourcePath = 'files';
      const targetPath = 'libs/' + schema.name;
      generateFiles(tree, path.join(__dirname, sourcePath), targetPath, {
         tmpl: '',
         browserFile: '.browserslistrc',
      });

      const libraryGenerator = wrapAngularDevkitSchematic('@nx/angular', 'lib');
      await libraryGenerator(tree, {
         name: schema.name,
      });
      sourcePath = 'template';
      generateFiles(tree, path.join(__dirname, sourcePath), targetPath, {
         ...schema,
         ...componentNames,
         tmpl: '',
         browserFile: '.browserslistrc',
         modelname: 'module-info',
      });
      isCreated = true;
   } else {
      const prompt = require('prompt-sync')();
      const response: string = prompt('Library ' + libraryName + ' already exists. Do you want to overwrite? Y/N  ');

      await updateLibrary(response, libraryName, project, tree);
      isCreated = true;
   }
   if (isCreated) addRouteInfo(tree, componentNames, schema.name);
   await formatFiles(tree);
}

/**
 * @name updateLibrary
 * @description overwrites module and module info file of existing library
 * @param {string} response
 * @param {string} name
 * @param {ProjectConfiguration} project
 * @param {Tree} tree
 */
async function updateLibrary(response: string, name: string, project: ProjectConfiguration, tree: Tree) {
   if (response === 'y' || response === 'Y') {
      const nameSet = names(name);
      const sourcePath = 'template';
      const targetPath = project.root;
      generateFiles(tree, path.join(__dirname, sourcePath), targetPath, {
         ...nameSet,
         tmpl: '',
         browserFile: '.browserslistrc',
         modelname: 'module-info',
      });
      console.log(name + '.module.ts and module-info.class.ts files are updated.');
   }
}

export function readFileIfExisting(path: string) {
   try {
      if (existsSync(path)) {
         return readFileSync(path).toString();
      }
   } catch (err) {
   }

   return '';
}

/**
 * @name addRouteInfo
 * @description adds route info to the relative module-preload-info class file
 * @param {Tree} tree
 * @param {nameSet} nameSet
 * @param {string} name
 */
function addRouteInfo(tree: Tree, nameSet: nameSet, name: string) {
   const preloadSuffixPos = name.substring(0, name.lastIndexOf('/') + 1) + 'preload';
   const preloadName = preloadSuffixPos.replace(/\//g, '-');
   const project = getProjects(tree).get(preloadName);

   if (project !== undefined) {
      const sourcePath = project?.sourceRoot + '/lib/model/module-preload-info.class.ts';
      const prealodInfoFile = readFileIfExisting(sourcePath);

      const newContents = tsquery.replace(prealodInfoFile, 'VariableDeclaration', (node) => {
         const declaration = node as ts.VariableDeclaration;

         if ((declaration.name as ts.Identifier).escapedText === 'subModuleRouteInfo') {
            const arrLiteral = declaration.initializer as ts.ArrayLiteralExpression;
            const targetNode = declaration;
            const toInsert = createRouteInfo(nameSet, name);

            if (arrLiteral.elements.length > 0) {
               let nodeArray = arrLiteral.elements;
               const nodetext = nodeArray[arrLiteral.elements.length - 1].getFullText();
               const previousUiContainers = targetNode.getFullText();
               const insertPosition = previousUiContainers.indexOf(nodetext);
               const prefix = previousUiContainers.substring(0, insertPosition + nodetext.length + 1);
               const suffix = previousUiContainers.substring(insertPosition + nodetext.length + 1);
               const newContainers = `${prefix}${toInsert}${suffix}`;
               return newContainers;
            } else {
               const containerArr = arrLiteral.getFullText();
               const previousUiContainers = targetNode.getFullText();
               const insertPosition = previousUiContainers.indexOf(containerArr);
               const prefix = previousUiContainers.substring(0, insertPosition + 2);
               const suffix = previousUiContainers.substring(insertPosition + 2);
               const newContainers = `${prefix}${toInsert}${suffix}`;
               return newContainers;
            }
         }
         return null;
      });
      if (prealodInfoFile !== newContents && newContents !== null) tree.write(sourcePath, newContents);
   } else {
      console.error(preloadName + ' does not exist');
   }
}

/**
 * @name createRouteInfo
 * @description provides route information
 * @param {nameSet} nameSet
 * @param {string} name
 * @returns {string}
 */
function createRouteInfo(nameSet: nameSet, name: string): string {
   const project = '@itwo40/';
   const subModuleName = "subModuleName: '" + name.substring(name.lastIndexOf('/') + 1) + "',";
   const loadChildren = 'loadChildren: () =>';
   const importPath = " import('" + project + name + "').";
   const moduleName = nameSet.className + 'Module';
   const moduleStr = 'then((module) => module.' + moduleName + ')';
   const toInsert = '{' + '\n' + subModuleName + '\n' + loadChildren + importPath + moduleStr + '\n' + '}';
   return toInsert;
}
