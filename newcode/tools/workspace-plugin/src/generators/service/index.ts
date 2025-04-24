/*
 * Copyright(c) RIB Software GmbH
 */

import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { Tree, formatFiles, generateFiles, names, getProjects } from '@nx/devkit';
import * as path from 'path';
import { serviceSchema } from './schema';

export default async function (tree: Tree, schema: serviceSchema) {
   const project = getProjects(tree).get(schema.project);
   const serviceNames = names(schema.name);
   const sourceRoot = project?.projectType == 'application' ? project.sourceRoot : project?.sourceRoot + '/lib';

   const targetPath = sourceRoot + '/services/' + serviceNames.fileName;

   const serviceGenerator = wrapAngularDevkitSchematic('@schematics/angular', 'service');

   await serviceGenerator(tree, {
      name: schema.name,
      project: schema.project,
      path: targetPath,
   });

   generateFiles(tree, path.join(__dirname, 'files'), targetPath, {
      ...schema,
      ...serviceNames,
      tmpl: '',
   });

   await formatFiles(tree);
}
