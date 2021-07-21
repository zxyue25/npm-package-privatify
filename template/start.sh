#!/bin/bash

SHELL_FOLDER=$(cd "$(dirname "$0")";pwd);
cd $SHELL_FOLDER;
node node_modules/verdaccio/bin/verdaccio --config ./config.yaml;