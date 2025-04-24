/*
 * Copyright(c) RIB Software GmbH
 */

import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { Tree, generateFiles, names, getProjects, readJson } from '@nx/devkit';
import * as path from 'path';
import { componentSchema, nameSet } from './schema';
import * as ts from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '../rib-content-module';

/**
 * @description Provides rule to create container with IContainerUiAddOns injected and updating stub to module-info.class.ts
 * @param {Tree} tree
 * @param {componentSchema} schema
 */
export default async function (tree: Tree, schema: componentSchema) {
   const project = getProjects(tree).get(schema.project);
   const workspace = readJson(tree, 'angular.json');
   const componentNames = names(schema.name);
   const sourceRoot = project?.projectType == 'application' ? project.sourceRoot : project?.sourceRoot + '/lib';
   const targetPath = sourceRoot + '/components';
   const sourcePath = schema.nostory ? 'files_nostory' : 'files';

   const componentGenerator = wrapAngularDevkitSchematic('@schematics/angular', 'component');

   await componentGenerator(tree, {
      name: schema.name,
      project: schema.project,
      path: targetPath,
      style: 'scss',
   });

   generateFiles(tree, path.join(__dirname, sourcePath), targetPath, {
      ...schema,
      ...componentNames,
      tmpl: '',
      selector: workspace.projects[schema.project].prefix + '-' + componentNames.fileName,
   });

   if (schema.addOn) {
      updateContainerInfo(tree, componentNames, sourceRoot);
   }
}

/**
 * @name updateContainerInfo
 * @description It updates container information
 * @param {Tree}tree
 * @param {nameSet}componentNames
 * @param {string}sourceRoot
 */
function updateContainerInfo(tree: Tree, componentNames: nameSet, sourceRoot: string | undefined) {
   const moduleInfoPath = '/model/module-info.class.ts';
   const moduleInfoClassFile = readFileIfExisting(sourceRoot + moduleInfoPath);
   const newContents = tsquery.replace(moduleInfoClassFile, 'PropertyDeclaration', (node) => {
      const declaration = node as ts.PropertyDeclaration;

      if ((declaration.name as ts.Identifier).escapedText === 'uiContainers') {
         const targetNode = declaration;
         const className = getClassName(componentNames);
         const toInsert = getContainerDefinition(className);
         const arrLiteral = declaration.initializer as ts.ArrayLiteralExpression;

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

   if (newContents != moduleInfoClassFile && newContents !== null) {
      const containerStub = {
         data: newContents.trim(),
         tree: tree,
      };
      importModuleInfo(containerStub.tree, containerStub.data, componentNames, sourceRoot, moduleInfoPath);
   }
}

/**
 * @name importModuleInfo
 * @description Adds import statement to file
 * @param {Tree}tree
 * @param {string}data
 * @param {nameSet} componentNames
 * @param {string}sourceRoot
 * @param {string}moduleInfoPath
 */
function importModuleInfo(tree: Tree, data: string, componentNames: nameSet, sourceRoot: string | undefined, moduleInfoPath: string) {
   const moduleInfoClassFile = data;
   const importContent = tsquery.replace(moduleInfoClassFile, 'ClassDeclaration', (node) => {
      const classDeclaration = node as ts.ClassDeclaration;

      if ((classDeclaration.name as ts.Identifier).escapedText === 'ModuleInfo') {
         const suffix = classDeclaration.getFullText();
         const fileName = getFileName(componentNames);
         const filePath = getFilePath(fileName);
         const className = getClassName(componentNames);
         const importDeclaration = getImportDeclaration(className, filePath);
         const toInsert = importDeclaration.replace(/\r\n|\n|\r/gm, '');
         const newImportContent = toInsert + '\n' + suffix;
         return newImportContent;
      }
   });

   if (importContent != moduleInfoClassFile && importContent !== null) {
      const prettier = require('prettier');
      const file = prettier.format(importContent, {parser: 'typescript'});
      tree.write(sourceRoot + moduleInfoPath, file);
   }
}

/**
 * @name getClassName
 * @description creates class name
 * @param {nameSet}names
 * @returns {string}
 */
function getClassName(names: nameSet): string | null {
   const className = names ? names.className : '';
   return className ? className + 'Component' : null;
}

/**
 * @name getFileName
 * @description creates file name
 * @param {nameSet}names
 * @returns {string}
 */
function getFileName(names: nameSet): string | null {
   const fileName = names ? names.fileName : '';
   return fileName ? fileName : '';
}

/**
 * @name getFilePath
 * @description creates file path
 * @param {string} fileName
 * @returns {string}
 */
function getFilePath(fileName: string | null): string | null {
   const path = '../../../components/' + fileName + '/' + fileName + '.component';
   return path;
}

/**
 * @name getImportDeclaration
 * @description creates import statement
 * @param {string} className
 * @param  {string} filePath
 * @returns {string}
 */
function getImportDeclaration(className: string | null, filePath: string | null): string {
   const importContent = 'import {' + className + '} from' + `'` + filePath + `';`;
   return importContent;
}

/**
 * @name getContainerDefinition
 * @description creates container definition to insert
 * @param  {string} className
 * @returns {string}
 */
function getContainerDefinition(className: string | null): string {
   const toInsert =
      `
						new ContainerDefinition(
							'',
							{
								text: 'sample',
							},` +
      className +
      `)`;

   return toInsert;
}
