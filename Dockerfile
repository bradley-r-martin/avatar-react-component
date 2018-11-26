FROM php:7.2-apache

COPY ./build/ /var/www/html/
COPY ./src/upload.php /var/www/html/

EXPOSE 80