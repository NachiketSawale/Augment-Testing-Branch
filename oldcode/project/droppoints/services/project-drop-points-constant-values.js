	/**
 * Created by nitsche on 21.01.2025
 */

(function (angular) {
	/* global  */
	'use strict';
	let myModule = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsConstantValues
	 * @description projectDropPointsConstantValues provides constants used in Project.DropPoints client development
	 */
	myModule.value('projectDropPointsConstantValues', {
		schemes: {
			project: {
				typeName: 'ProjectDto',
				moduleSubModule: 'Project.Main'
			},
			dropPoint: {typeName: 'DropPointDto', moduleSubModule: 'Project.DropPoints'},
			dropPointArticles: {typeName: 'DropPointArticlesDto', moduleSubModule: 'Project.DropPoints'}
		},
		uuid: {
			container: {
				dropPointHeaderList: '3a0dc5aa130e4d95af119b5c76ef47f8',
				dropPointHeaderDetails: '44050882a8e14d9386fe79f4fadd0192',
				dropPointList: '21b52f02742f4796a8e165d8ead4f9d5',
				dropPointDetails: 'b485c4cb24344d54aef27530cc7d7563',
				dropPointArticlesList: '0b2fbc87a2c644a8b84c1fac7174b06b',
				dropPointArticlesDetails: 'eea4f9c32c8b4560b09f926350aa28c8'
			}
		},
		record: {
			type: {
				plant: 2,
				material: 3,
				fabricatedProduct: 6
			}
		}
	});
})(angular);