@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Release" set config=Release.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink reporting platform

if not defined NOPAUSE pause
goto :eof


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink
set modul=%1
set submodul=%2
set link="%binpool%\%config%\%modul%.%submodul%"
if exist %link% (
	rmdir %link%
	if exist %link% (
		rmdir /s /q %link%
	)	
)
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink
set modul=%1
set submodul=%2
set link="%binpool%\%config%\%modul%.%submodul%"
set target="%myself%\%submodul%"

call :removeSymLink %1 %2

mklink /j %link% %target%
echo.

goto :eof
