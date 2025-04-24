/*
 * Copyright(c) RIB Software GmbH
 */

import { formatFiles, generateFiles, getProjects, names, ProjectConfiguration, Tree } from '@nx/devkit';
import * as ts from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { ArrayLiteralExpression, VariableStatement } from 'typescript';
import { preloadModuleSchema, nameSet } from './schema';
import * as path from 'path';
import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { readFileIfExisting } from '../rib-content-module';

/**
 * @description provides rule to create preload module with library
 * @param {Tree}tree
 * @param {preloadModuleSchema}schema
 */
export default async function (tree: Tree, schema: preloadModuleSchema) {
   schema.name = schema.name.includes('preload') ? schema.name : schema.name + '/preload';
   const libraryName = schema.name.replace(/\//g, '-');
   const classNames = names(libraryName);
   const project = getProjects(tree).get(libraryName);
   const preloadModulePath = 'apps/itwo40/src/app/model/module-management/preload-modules.model.ts';
   const prealodFile = readFileIfExisting(preloadModulePath);
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
         preloadClassName: 'module-preload-info',
         tmpl: '',
         ...classNames,
         browserFile: '.browserslistrc',
      });
      isCreated = true;
   } else {
      const prompt = require('prompt-sync')();
      const response: string = prompt('Library ' + libraryName + ' already exists. Do you want to overwrite (Y/N)? ');

      await updateLibrary(response, libraryName, project, tree);
      isCreated = true;
   }
   if (isCreated) addPreloadModule(tree, classNames, preloadModulePath, prealodFile, schema.name);
}

/**
 * @name addPreloadModule
 * @description Adds preload module to preload-modules.model.ts
 * @param {Tree} tree
 * @param {nameSet} nameSet
 * @param {string} preloadModulePath
 * @param {string} file
 * @param {string} modulePath
 */
async function addPreloadModule(tree: Tree, nameSet: nameSet, preloadModulePath: string, file: string, modulePath: string) {
   const preloadContents = tsquery.replace(file, 'VariableStatement', (node) => {
      const vsNode = node as VariableStatement;
      const className = getClassName(nameSet);
      const declarations = vsNode.declarationList.declarations[0];

      if (!file.includes(className as string)) {
         if ((declarations.name as ts.Identifier).escapedText === 'preloadModules') {
            const moduleName = ', ' + className;
            const arrLiteral = declarations.initializer as ArrayLiteralExpression;

            if (arrLiteral.elements.length > 0) {
               let nodeArray = arrLiteral.elements;
               const nodetext = nodeArray[arrLiteral.elements.length - 1].getFullText();
               const previousModules = vsNode.getText();
               const insertPosition = previousModules.indexOf(nodetext);
               const prefix = previousModules.substring(0, insertPosition + nodetext.length);
               const suffix = previousModules.substring(insertPosition + nodetext.length);
               const newModules = `${prefix}${moduleName}${suffix}`;
               return newModules;
            } else {
               const previousModules = vsNode.getText();
               const insertPosition = previousModules.indexOf(arrLiteral.getText());
               const prefix = previousModules.substring(0, insertPosition);
               const moduleName = '[ ' + className + ' ]';
               const newModules = `${prefix}${moduleName}`;
               return newModules;
            }
         }
      }
   });

   if (preloadContents !== undefined) {
      let importContents = '';
      let importCnt = 0;
      const className = getClassName(nameSet);
      const filePath = getFilePath(modulePath);
      const toInsertImport = getImportDeclaration(className, filePath);
      const sourceFile = ts.createSourceFile('file.ts', preloadContents, ts.ScriptTarget.Latest, true);

      ts.forEachChild(sourceFile, (node) => {
         if (node.kind === ts.SyntaxKind.ImportDeclaration) importCnt++;
      });

      if (importCnt != 0) {
         importContents = tsquery.replace(preloadContents, 'ImportDeclaration', (node) => {
            if (node.kind === ts.SyntaxKind.ImportDeclaration) {
               importCnt--;
               if (importCnt === 0) {
                  const targetImportNode = node.getFullText();
                  const newImportContent = targetImportNode + '\n' + toInsertImport;
                  return newImportContent.trim();
               }
            }
         });
      } else {
         importContents = '\n' + toInsertImport + '\n' + preloadContents;
      }

      if (importContents != file) {
         tree.write(preloadModulePath, importContents);
      }
   }

   await formatFiles(tree);
}

/**
 * @name getClassName
 * @description returns class name
 * @param {nameSet} names
 * @returns {string}
 */
function getClassName(names: nameSet): string | null {
   const className = names ? names.className : '';
   return className ? className + 'Module' : null;
}

/**
 * @name getImportDeclaration
 * @description creates import statement
 * @param {string} className
 * @param  {string} filePath
 * @returns {string}
 */
function getImportDeclaration(className: string | null, filePath: string | null): string {
   const importContent = 'import { ' + className + ' } from' + `'` + filePath + `';`;
   return importContent;
}

/**
 * @name getFilePath
 * @description creates file path
 * @param {string} modulePath
 * @returns {string}
 */
function getFilePath(modulePath: string | null): string | null {
   const path = '@itwo40/' + modulePath;
   return path;
}

/**
 * @name updateLibrary
 * @description overwrites module and module info file of existing library
 * @param response
 * @param name
 * @param project
 * @param tree
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
         preloadClassName: 'module-preload-info',
      });
      console.log(name + '.module.ts and module-preload-info.class.ts files are updated.');
   }
}
