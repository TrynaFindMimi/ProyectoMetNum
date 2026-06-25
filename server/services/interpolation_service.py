import numpy as np
from ..larange import newton, generate_wave, FUNCTIONS


def interpolate(x: np.ndarray, y: np.ndarray, n_points: int = 10):
    p = newton(x, y)
    xs = np.linspace(x.min(), x.max(), n_points)
    points = [{"x": round(float(xi), 4), "y": round(float(p(xi)), 4)} for xi in xs]
    return str(p), points


def gen_wave(
    function_type: str = "cos",
    n_control: int = 8,
    n_points: int = 200,
    x_min: float = 0.0,
    x_max: float = 4.0,
):
    xs, ys = generate_wave(
        function_type=function_type,
        n_control=n_control,
        n_points=n_points,
        x_range=(x_min, x_max),
    )
    return xs, ys


def get_available_functions() -> list[str]:
    return list(FUNCTIONS.keys())
