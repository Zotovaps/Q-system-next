#!/bin/bash

set -e

npm run build
npm run export

aws configure set aws_access_key_id $KEY && aws configure set aws_secret_access_key $SECRET && aws configure set region "ru-central1"

aws --endpoint-url=https://storage.yandexcloud.net/ s3 sync ./out s3://testq/ --delete

busybox httpd -f -h ./rootfs/var/www/html"]