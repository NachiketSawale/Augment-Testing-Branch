# modifies sub-modules so they appear in Typedoc

$scriptDir = $PSScriptRoot
$baseDir = [System.IO.Path]::Combine($scriptDir, '..', '..')

$jsonOptions = New-Object -TypeName 'System.Text.Json.JsonWriterOptions'
$jsonOptions.Indented = $True

Write-Host $baseDir

foreach ($moduleDir in Get-ChildItem -Path $([System.IO.Path]::Combine($baseDir, 'libs', 'modules')) -Directory)
{
	foreach ($subModuleDir in Get-ChildItem -Path $moduleDir -Directory)
	{
		$moduleName = $moduleDir.Name
		$subModuleName = $subModuleDir.Name
		
		if ($subModuleName -eq 'assets') {
			continue
		}
		if ($moduleName -eq 'example') {
			continue
		}
		
		$pkgJsonPath = [System.IO.Path]::Combine($subModuleDir, 'package.json')
		if (-not (Test-Path "$pkgJsonPath"))
		{
			$file = [System.IO.File]::Create($pkgJsonPath)
			$writer = New-Object -TypeName 'System.Text.Json.Utf8JsonWriter' -ArgumentList ($file, $jsonOptions)
			
			try
			{
				$writer.WriteStartObject()
				
				$writer.WriteString('name', "$($moduleDir.Name)-$($subModuleDir.Name)")
				
				$writer.writeEndObject() # root
			}
			finally
			{
				$writer.Dispose()
				$file.Dispose()
			}
		}
		
		$typedocPath = [System.IO.Path]::Combine($subModuleDir, 'typedoc.json')
		if (-not (Test-Path "$typedocPath"))
		{
			$file = [System.IO.File]::Create($typedocPath)
			$writer = New-Object -TypeName 'System.Text.Json.Utf8JsonWriter' -ArgumentList ($file, $jsonOptions)
			
			try
			{
				$writer.WriteStartObject()
				
				$writer.WriteStartArray('extends')
				$writer.WriteStringValue('../../../../typedoc.base.json')
				$writer.WriteEndArray()
				
				$writer.WriteStartArray('entryPoints')
				$writer.WriteStringValue('src/index.ts')
				$writer.WriteEndArray()
				
				$writer.WriteString('readme', '.typedoc/typedoc-index.md')
				
				$writer.writeEndObject() # root
			}
			finally
			{
				$writer.Dispose()
				$file.Dispose()
			}
		}
		
		$typedocDir = [System.IO.Path]::Combine($subModuleDir, '.typedoc')
		New-Item -Path "$SubModuleDir" -Name '.typedoc' -ItemType 'directory' -Force
		
		$typedocIndexPath = [System.IO.Path]::Combine($subModuleDir, '.typedoc', 'typedoc-index.md')
		if (-not (Test-Path "$typedocIndexPath"))
		{
			"This is the $($subModuleDir.Name) area of the $($moduleDir.Name) main module." | Out-File -FilePath "$typedocIndexPath"
		}
		
		Write-Host "$($moduleDir.Name)-$($subModuleDir.Name) done."
	}
}
