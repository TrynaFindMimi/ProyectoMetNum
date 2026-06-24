# Métodos Numéricos

Visualizador de área bajo la curva y generador SVG, implementado en Python con `numpy` y `matplotlib`.

## Requisitos

- Python >= 3.10
- `numpy`
- `matplotlib`

```bash
pip install -r requirements.txt
```

## Uso

### Visualizador de onda interactivo

```bash
python main.py wave
```

Comandos disponibles dentro del modo interactivo:
- `f` — cambiar frecuencia
- `a` — cambiar amplitud
- `p` — cambiar fase
- `o` — cambiar offset vertical
- `c` — cambiar color
- `s` — exportar SVG a `wave.svg`
- `q` — salir

### Calcular área bajo la curva

```bash
python main.py area --a 0 --b 10 --n 100 --method trapezoidal
```

Métodos disponibles: `left`, `right`, `midpoint`, `trapezoidal`, `simpson`.

### Exportar SVG sin interfaz

```bash
python main.py wave --freq 2 --amp 1.5 --phase 1.57 --offset 0.2 --color "#ff6600" --svg salida.svg --no-gui
```

## Cambiar la función

Edita `metnum/config.py`:

```python
def f(x):
    return np.sin(x + 1)   # <- cambia esta función
```

## Estructura

```
metnum/
├── __init__.py
├── config.py            # función f(x) y constantes
├── numerical_methods.py # Riemann, trapecio, Simpson, wave_points
└── visualizer.py        # matplotlib + generación SVG
main.py                  # CLI entry point
requirements.txt
```
