@echo off

%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Release" set config=Release.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

echo. >mklink.log

dir "%binpool%\%config%\app\component?" | find /c "<JUNCTION>" >>mklink.log

if %ERRORLEVEL% equ 0 (
 echo _make.components.angular.links.cmd has already been executed!
 echo app\components folder already linked - execution aborted!
 pause
 goto :eof
)

call :createPlatformSymLinkPlatform app app
call :createPlatformSymLinkPlatform lib lib
call :createPlatformSymLinkPlatform languages languages

echo.
echo links created sucessfully
echo.

if not defined NOPAUSE pause

goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createPlatformSymLinkPlatform
@echo off
set part=%1
set folder=%2
set link="%binpool%\%config%\%part%"
set target="%myself%\%folder%"

if exist %link% (
	rmdir /q %link% 2>nul
	if exist %link% (
		rmdir /s /q %link%
	)
)

mklink /j %link% %target% >>mklink.log
goto :eof

