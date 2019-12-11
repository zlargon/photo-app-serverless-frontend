#!/bin/bash
set -e
cd ${0%/*}/..
function echo_y() { echo -e "\033[1;33m$@\033[0m" ; } # yellow echo

# The S3 bucket for static website
S3_REACT_APP_BUCKET=""

# 1. build react app
npm run build

# 2. upload build folder
echo_y "Upload static website to s3 bucket"
cd build
aws s3 sync . "s3://${S3_REACT_APP_BUCKET}"

# 3. open URL
open "http://${S3_REACT_APP_BUCKET}.s3-website-us-east-1.amazonaws.com"
