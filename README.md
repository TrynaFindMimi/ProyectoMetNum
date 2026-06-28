# Proyecto Metodos Numericos — Interpolacion de Newton

Visualizador web interactivo de interpolacion polinomial usando el metodo de Newton. Genera puntos de control a partir de funciones trigonometricas y cuadraticas, calcula el polinomio interpolante y lo grafica en SVG.

## Integrantes

- **Nahomi Humerez**
- **Isamu Nikaldo**

## Proposito

La idea del proyecto es implementar metodos numericos (en este caso interpolacion) dentro de una aplicacion web con frontend interactivo, para que las ecuaciones matematicas no se queden solo en el cuaderno o en un script de Python, sino que se puedan visualizar y manipular desde una interfaz. Esto sirve para aplicar los metodos numericos a problemas reales de nuestras carreras, donde muchas veces hay que modelar datos discretos con polinomios y ver los resultados graficamente.

## Que hace

Elegis una funcion (`cos(x)`, `sin(x)` o `x^2`), cuantos puntos de control usar (1 a 15) y el rango en X. El servidor calcula el polinomio interpolante de Newton y lo dibuja al toque. Tiene control de colores, estilo de linea, relleno de area y hasta una curva paralela.

## Metodo numerico

Al principio arrancamos con **Lagrange** porque era lo que habiamos visto en clase. Hicimos `li()` y `lagrange()` en `larange.py` pero a la hora de graficar daba cualquier cosa con mas de 5 puntos, los polinomios se disparaban y el grafico quedaba horrible. Ahi nos dimos cuenta que Lagrange es medio delicado numericamente cuando tenes muchos puntos uniformes.

Pasamos a **Newton** con diferencias divididas y ahi funcionó bien para cualquier cantidad de puntos. El codigo final usa `newton()` que construye el polinomio en forma de potencias encadenadas `(x - x0)(x - x1)...`. Es mas estable y si queres agregar puntos no tenes que rehacer todo.

## Estructura del proyecto

```
ProyMetNum/
├── server/                    # Backend Python
│   ├── main.py                # App FastAPI con CORS
│   ├── larange.py             # Metodos: li(), lagrange(), newton(), generate_wave()
│   ├── controllers/
│   │   └── wave_controller.py # Rutas POST /wave, /interpolate, GET /
│   ├── models/
│   │   └── schemas.py         # Pydantic: WaveRequest, WaveResponse, InterpRequest, InterpResponse
│   └── services/
│       └── interpolation_service.py  # Logica de negocio
├── client/                    # Frontend React + TypeScript + Vite + Tailwind
│   ├── src/
│   │   ├── App.tsx            # Estado y layout principal
│   │   ├── components/
│   │   │   ├── Controls.tsx   # Panel de controles
│   │   │   └── WavePlot.tsx   # Grafico SVG inline
│   │   ├── hooks/
│   │   │   └── useWave.ts     # Hook para fetch de datos
│   │   └── services/
│   │       └── api.ts         # Cliente HTTP
│   ├── package.json
│   └── vite.config.ts         # Proxy a localhost:8001
└── .gitignore
```

## Requisitos

### Servidor (Python 3.14+)
- fastapi
- uvicorn
- numpy
- pydantic

Se pueden instalar con pip parado en la carpeta `server/`.

### Cliente (Node 20+)
- React 18
- TypeScript 5.6
- Vite 6
- Tailwind CSS 3.4

Correr con `npm install` y `npm run dev` desde `client/`.

## Como correrlo

1. **Servidor:** `uvicorn server.main:app --reload --port 8001` desde la raiz del proyecto
2. **Cliente:** `npm run dev` desde `client/`
3. Abrir `http://localhost:5173`

## Herramientas usadas

- **DeepSeek** para partes del codigo y debug
- **Claude / QA** para refactorizar componentes y el README
- **Notebooks de clase** como referencia para los metodos numericos
