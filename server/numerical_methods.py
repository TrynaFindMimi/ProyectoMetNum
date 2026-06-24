# server/numerical_methods.py
# Módulo de métodos numéricos — todo el cómputo pesado corre en numpy

import numpy as np


# ─── Función matemática a evaluar ─────────────────────────────────
# El usuario puede cambiar esta función para probar distintas curvas
def f(x):
    return np.sin(x + 1)


# ─── Sumas de Riemann ─────────────────────────────────────────────
# Aproxima el área usando rectángulos. El parámetro 'method' controla
# si el rectángulo se toma del extremo izquierdo, derecho, o del punto medio.
def riemann_sum(fn, a, b, n=100, method="left"):
    xs = np.linspace(a, b, n + 1)       # n+1 puntos equiespaciados
    dx = (b - a) / n                     # ancho de cada subintervalo
    if method == "left":
        samples = xs[:-1]                # evaluamos f en el extremo izquierdo
    elif method == "right":
        samples = xs[1:]                 # evaluamos f en el extremo derecho
    elif method == "midpoint":
        samples = (xs[:-1] + xs[1:]) / 2 # evaluamos f en el punto medio
    else:
        raise ValueError(f"Unknown method: {method}")
    return float(np.sum(fn(samples)) * dx)


# ─── Regla del trapecio ───────────────────────────────────────────
# Aproxima el área usando trapecios en cada subintervalo.
# Fórmula: (dx/2) * [f(x0) + 2*sum(f(x1..xn-1)) + f(xn)]
def trapezoidal(fn, a, b, n=100):
    xs = np.linspace(a, b, n + 1)
    ys = fn(xs)
    dx = (b - a) / n
    return float(dx * (np.sum(ys[1:-1]) + (ys[0] + ys[-1]) / 2))


# ─── Regla de Simpson 1/3 ─────────────────────────────────────────
# Aproxima el área usando parábolas en cada par de subintervalos.
# Requiere n par. Fórmula: (dx/3) * [f0 + 4*f1 + 2*f2 + 4*f3 + ... + fn]
def simpson(fn, a, b, n=100):
    if n % 2 != 0:   # Simpson requiere número par de subintervalos
        n += 1
    xs = np.linspace(a, b, n + 1)
    ys = fn(xs)
    dx = (b - a) / n
    return float(dx / 3 * (ys[0] + ys[-1] + 4 * np.sum(ys[1:-1:2]) + 2 * np.sum(ys[2:-1:2])))


# ─── Generación de SVG de onda coseno ─────────────────────────────
# Produce un string SVG listo para incrustar en HTML. Usa un polígono
# cerrado para rellenar el área bajo la onda con transparencia.
def wave_svg(freq=1, amp=1, phase=0, offset=0, color="#a78bfa", width=800, height=400):
    SAMPLES = 300                                 # puntos de muestreo
    xs = np.linspace(0, width, SAMPLES + 1)       # coordenadas x en píxeles
    t = np.linspace(0, 1, SAMPLES + 1)            # parámetro normalizado [0,1]
    ys = height / 2 - amp * np.cos(freq * t * 2 * np.pi + phase) * (height / 3)

    # Cerramos el polígono agregando las esquinas inferior-derecha e inferior-izquierda
    poly_x = np.concatenate([xs, [width, 0]])
    poly_y = np.concatenate([ys, [height / 2 - offset * (height / 3)] * 2])
    pts = np.column_stack([poly_x, poly_y])

    points_str = " ".join(f"{x},{y}" for x, y in pts)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">\n'
        f'  <polygon points="{points_str}" fill="{color}" '
        f'fill-opacity="0.5" stroke="{color}" '
        f'stroke-width="2" stroke-linejoin="round" />\n'
        f"</svg>"
    )


# ─── Datos para visualización de área en React ────────────────────
# Calcula el área y devuelve todo lo necesario para que el frontend
# dibuje la curva y los rectángulos/trapecios sin hacer ningún cómputo.
def area_data(fn, a, b, n=100, method="trapezoidal"):
    xs = np.linspace(a, b, n + 1)
    ys = fn(xs)
    dx = (b - a) / n

    # Según el método, calculamos el área y los polígonos de cada subdivisión
    if method == "trapezoidal":
        area = trapezoidal(fn, a, b, n)
        # Cada trapecio es un cuadrilátero: (x,0), (x,f(x)), (x+dx,f(x+dx)), (x+dx,0)
        rects = [[[float(xs[i]), 0], [float(xs[i]), float(ys[i])],
                  [float(xs[i + 1]), float(ys[i + 1])], [float(xs[i + 1]), 0]]
                 for i in range(n)]
    elif method == "simpson":
        area = simpson(fn, a, b, n)
        rects = []  # Simpson no tiene rectángulos individuales visibles
    elif method in ("left", "right", "midpoint"):
        area = riemann_sum(fn, a, b, n, method)
        if method == "left":
            x_rect = xs[:-1]
        elif method == "right":
            x_rect = xs[1:]
        else:
            x_rect = (xs[:-1] + xs[1:]) / 2
        # Cada rectángulo de Riemann: (x,0), (x,f(x)), (x+dx,f(x)), (x+dx,0)
        rects = [[[float(xc), 0], [float(xc), float(fn(xc))],
                  [float(xc + dx), float(fn(xc))], [float(xc + dx), 0]]
                 for xc in x_rect]
    else:
        raise ValueError(f"Unknown method: {method}")

    # Curva suave para dibujar — mil puntos para que se vea prolijo
    x_dense = np.linspace(a, b, 1000).tolist()
    y_dense = fn(np.array(x_dense)).tolist()

    return {
        "area": area,
        "rects": rects,
        "curve_x": x_dense,
        "curve_y": y_dense,
        "a": a,
        "b": b,
        "method": method,
        "n": n,
    }
