/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { formatFiles, generateFiles, getProjects, names, Tree } from '@nx/devkit';
import * as path from 'path';
import { camelize, classify, dasherize, underscore } from '@nx/workspace/src/utils/strings';
import { ComponentSchema } from './schema';

export default async function (host: Tree, schema: ComponentSchema) {
	const project = getProjects(host).get(schema.project);
	const sourceRoot = project?.projectType == 'application' ? project.sourceRoot : project?.sourceRoot + '/lib';
	const targetPath = sourceRoot + '/components';
	const sourcePath = schema.nostory ? 'files_nostory' : 'files';

	let componentNames = names(schema.name);

	componentNames = {
		name: dasherize(schema.project) + '-' + dasherize(schema.name),
		className: classify(schema.project) + classify(schema.name),
		propertyName: camelize(schema.name),
		constantName: underscore(schema.name).toUpperCase(),
		fileName: dasherize(schema.name),
	};

	const substitutions = {
		tmpl: '',
		styleext: schema.style ? schema.style : 'scss',
		...componentNames,
	};

	generateFiles(host, path.join(__dirname, sourcePath), targetPath, substitutions);

	await formatFiles(host);
}
