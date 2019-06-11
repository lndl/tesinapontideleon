# Despliegue del contrato

Para deplegar el contrato primero se necesita acceso al proveedor.

## Paso 1
Registrase en [Infura](https://infura.io/), crear un nuevo proyecto y obtener la url del endpoint para **Kovan**.

## Paso 2

Ejecutar el siguiente comando para crear el archivo de configuracion `.env`:
```
$> cp .env.example .env
```

Reemplazar la url obtenida del **Paso 1** en el campo `RPC_URL` y la clave privada de la cuanta que va a desplegar el contrato en `DEPLOYMENT_ACCOUNT_PRIVATE_KEY` (la cuenta debe poseer ether).

## Paso 3

Compilar el contrato ejecutando:
```
$> cd .. && npm run compile && cd deploy
```
Luego desplegar el contrato:
```
$> node deploy.js
```
