/*
 * Copyright(c) RIB Software GmbH
 */

import { formatFiles, generateFiles, getProjects, names, Tree } from '@nx/devkit';
import * as path from 'path';
import { classSchema } from './schema';
import { camelize, classify, dasherize, underscore } from '@nx/workspace/src/utils/strings';

export default async function (host: Tree, schema: classSchema) {
   const project = getProjects(host).get(schema.project);
   if (project === undefined) {
      console.error('project ' + schema.project + ' does not exist.');
   } else {
      const sourceRoot = project?.projectType == 'application' ? project.sourceRoot : project?.sourceRoot + '/lib';

      const templatePath = 'tools/workspace-plugin/src/generators/rib-class/files';

      let classNames = names(schema.name);
      const folderIndex = schema.name.indexOf('/');

      if (folderIndex > 0) {
         const formattedName = schema.name.substring(folderIndex + 1);
         classNames = {
            name: dasherize(formattedName),
            className: classify(formattedName),
            propertyName: camelize(formattedName),
            constantName: underscore(formattedName).toUpperCase(),
            fileName: dasherize(schema.name),
         };
      }
      const targetFolder = folderIndex > 0 ? 'services' : 'models';
      const targetPath = path.join(sourceRoot!, targetFolder);

      const substitutions = {
         ...schema,
         ...classNames,
         tmpl: '',
      };

      generateFiles(host, templatePath, targetPath, substitutions);

      await formatFiles(host);
   }
}
