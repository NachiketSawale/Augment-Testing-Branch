# Generates uniform .eslintrc.json files for all modules of the application
# with references to the global parent file, as well as module-specific
# rules for selector prefixes.

$scriptDir = $PSScriptRoot
$baseDir = [System.IO.Path]::Combine($scriptDir, '..', '..')

$jsonOptions = New-Object -TypeName 'System.Text.Json.JsonWriterOptions'
$jsonOptions.Indented = $True

function Generate-ESLint-Settings {
	param (
		[string] $Path,
		[string] $Module,
		[string] $SubModule,
		[int] $Level
	)
	
	$isCommonModule = $SubModule -eq 'common'
	
	$parentPath = ''
	for ($i = $Level; $i -gt 0; $i--)
	{
		$parentPath = $parentPath + '../'
	}
	
	$kebabCaseModule = ("$Module-$SubModule" -creplace '[^-]([A-Z])', '-$1').ToLowerInvariant()
	$camelCaseModule = $kebabCaseModule -creplace '-([a-z0-9])', {return $_.Groups[1].Value.ToUpperInvariant()}
	
	Write-Host "- $Module.$SubModule ($kebabCaseModule / $camelCaseModule)"
	
	$targetFilePath = [System.IO.Path]::Combine($Path, '.eslintrc.json')
	
	$file = [System.IO.File]::Create($targetFilePath)
	$writer = New-Object -TypeName 'System.Text.Json.Utf8JsonWriter' -ArgumentList ($file, $jsonOptions)
	try
	{
		$writer.WriteStartObject()
		
		$writer.WriteStartArray('extends')
		$writer.WriteStringValue("$($parentPath).eslintrc.json")
		$writer.WriteEndArray()
		
		$writer.WriteStartArray('ignorePatterns')
		$writer.WriteStringValue('!**/*')
		$writer.WriteEndArray()
		
		$writer.WriteStartArray('overrides')
		
		$writer.WriteStartObject() # override 1
		
		$writer.WriteStartArray('files')
		$writer.WriteStringValue('*.ts')
		$writer.WriteEndArray()
		
		$writer.WriteStartArray('extends')
		$writer.WriteStringValue('plugin:@nrwl/nx/angular')
		$writer.WriteStringValue('plugin:@angular-eslint/template/process-inline-templates')
		$writer.WriteStringValue("$($parentPath).eslintrc.rules.json")
		$writer.WriteEndArray()
		
		$writer.WriteStartObject('rules')
		
		$writer.WriteStartArray('@angular-eslint/directive-selector')
		$writer.WriteStringValue('error')
		$writer.WriteStartObject()
		$writer.WriteString('type', 'attribute')
		if ($isCommonModule)
		{
			$writer.WriteStartArray('prefix')
			$writer.WriteStringValue($camelCaseModule)
			$writer.WriteStringValue($camelCaseModule.Substring(0, $camelCaseModule.Length - 6))
			$writer.WriteEndArray()
		}
		else
		{
			$writer.WriteString('prefix', $camelCaseModule)
		}
		$writer.WriteString('style', 'camelCase')
		$writer.WriteEndObject()
		$writer.WriteEndArray()
		
		$writer.WriteStartArray('@angular-eslint/component-selector')
		$writer.WriteStringValue('error')
		$writer.WriteStartObject()
		$writer.WriteString('type', 'element')
		if ($isCommonModule)
		{
			$writer.WriteStartArray('prefix')
			$writer.WriteStringValue($kebabCaseModule)
			$writer.WriteStringValue($kebabCaseModule.Substring(0, $kebabCaseModule.Length - 7))
			$writer.WriteEndArray()
		}
		else
		{
			$writer.WriteString('prefix', $kebabCaseModule)
		}
		$writer.WriteString('style', 'kebab-case')
		$writer.WriteEndObject()
		$writer.WriteEndArray()
		
		$writer.WriteEndObject() # rules
		
		$writer.WriteEndObject() # override 1
		
		$writer.WriteStartObject() # override 2
		
		$writer.WriteStartArray('files')
		$writer.WriteStringValue('*.html')
		$writer.WriteEndArray()
		
		$writer.WriteStartArray('extends')
		$writer.WriteStringValue("$($parentPath).eslintrc.rules.json")
		$writer.WriteEndArray()
		
		$writer.WriteEndObject() # override 2
		
		$writer.WriteEndArray() # overrides
		
		$writer.WriteEndObject() # root
	}
	finally
	{
		$writer.Dispose()
		$file.Dispose()
	}
	
	Write-Host "    $targetFilePath saved."
}

Write-Host $baseDir

foreach ($subModuleDir in Get-ChildItem -Path $([System.IO.Path]::Combine($baseDir, 'libs', 'platform')) -Directory)
{
	Generate-ESLint-Settings -Path $subModuleDir -Module 'platform' -SubModule $subModuleDir.Name -Level 3
}
foreach ($subModuleDir in Get-ChildItem -Path $([System.IO.Path]::Combine($baseDir, 'libs', 'ui')) -Directory)
{
	Generate-ESLint-Settings -Path $subModuleDir -Module 'ui' -SubModule $subModuleDir.Name -Level 3
}
foreach ($moduleDir in Get-ChildItem -Path $([System.IO.Path]::Combine($baseDir, 'libs', 'modules')) -Directory)
{
	foreach ($subModuleDir in Get-ChildItem -Path $moduleDir -Directory)
	{
		Generate-ESLint-Settings -Path $subModuleDir -Module $moduleDir.Name -SubModule $subModuleDir.Name -Level 4
	}
}