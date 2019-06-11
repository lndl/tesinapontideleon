# Aplicación de certificación de archivos en Ethereum

Este documento describe la instalación de la infraestructura de la aplicación desarrollada para la tesina titulada "Integridad de archivos y su distribución en una red blockchain".

## Instalación

Para seguir los pasos de esta instalación se deberá contar con NodeJs, Docker y Docker-Compose instalado en la computadora.

### Paso 1

Primero se debe desplegar el contrato y obtener la dirección del mismo siguiendo los pasos del instructivo ubicado en la carpeta _contratos/deploy_

### Paso 2
En el archivo `file-fingerprint-dapp/config.js` reemplazar el valor `address` por la dirección obtenida del paso anterior.

Luego ejecutar el siguiente comando:
```bash
$> docker-compose up
```

El comando anterior instalará y ejecutará:

* El servidor de archivos (realizado en Node/Express)
* Un microservidor que sirve la aplicación de certificaciones, es decir, el frontend (realizado en React)

### Paso 3

Por defecto, la aplicación frontend corre en el puerto 33333. Entrar a cualquier navegador e ingresar a la aplicación a través de la siguiente URL: http://localhost:33333
