/*
 * Copyright(c) RIB Software GmbH
 */

import { formatFiles, generateFiles, getProjects, names, Tree } from '@nx/devkit';
import { InterfaceSchema } from './schema';

export default async function (host: Tree, schema: InterfaceSchema) {
   const project = getProjects(host).get(schema.project);

   if (project === undefined) {
      console.error('project ' + schema.project + ' does not exist.');
   } else {
      const sourceRoot = project?.projectType == 'application' ? project.sourceRoot : project?.sourceRoot + '/lib';
      const targetPath = sourceRoot + '/model';

      const templatePath = 'tools/workspace-plugin/src/generators/rib-interface/files';

      const interfaceNames = names(schema.name);

      const substitutions = {
         ...schema,
         ...interfaceNames,
         tmpl: '',
      };

      generateFiles(host, templatePath, targetPath, substitutions);

      await formatFiles(host);
   }
}
