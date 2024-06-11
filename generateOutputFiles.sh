#!/bin/bash

# Read values from the file and run the node script for each value
while IFS= read -r value || [ -n "$value" ]
do
  node fetchAndConvert.js "$value"
done < addresses.txt