@echo off
SET originalDir=%cd%
SET baseDir=%~dp0
CD %baseDir%
CD src
RD build /S /Q
call yarn
SET NODE_ENV=%1
call gulp build
CD %originalDir%
