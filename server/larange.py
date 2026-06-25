import numpy as np

def li(x, k):
    t = np.polynomial.Polynomial([0, 1])
    n = len(x)
    p = np.polynomial.Polynomial([1])
    for i in range(n):
        if i != k:
            p = p * (t - x[i]) / (x[k] - x[i])
    return p

def lagrange(x, y):
    n = len(x)
    p = np.polynomial.Polynomial([0])
    for i in range(n):
        p = p + y[i] * li(x, i)
    return p

def newton(x, y):
    n = len(x)
    coef = np.copy(y).astype(float)
    for j in range(1, n):
        for i in range(n - 1, j - 1, -1):
            coef[i] = (coef[i] - coef[i - 1]) / (x[i] - x[i - j])

    t = np.polynomial.Polynomial([0, 1])
    p = np.polynomial.Polynomial([coef[0]])
    for k in range(1, n):
        term = np.polynomial.Polynomial([coef[k]])
        for j in range(k):
            term = term * (t - x[j])
        p = p + term
    return p

FUNCTIONS = {
    "cos": np.cos,
    "sin": np.sin,
    "square": lambda x: x ** 2,
}

def generate_wave(function_type, n_control=8, n_points=100, x_range=(0, 4)):
    fn = FUNCTIONS.get(function_type)
    if fn is None:
        raise ValueError(f"Unknown function '{function_type}'. Options: {list(FUNCTIONS.keys())}")

    x_ctrl = np.linspace(x_range[0], x_range[1], n_control)
    y_ctrl = fn(x_ctrl)

    p = newton(x_ctrl, y_ctrl)
    xs = np.linspace(x_range[0], x_range[1], n_points)
    ys = [float(p(xi)) for xi in xs]
    return xs.tolist(), ys

if __name__ == "__main__":
    x = np.array([-2, -1, 0, 1, 2])
    y = np.cos(x)
    p = newton(x, y)
    print("Polinomio interpolante (Newton):", p)
    print("\nPuntos del grafico (interpolacion Newton):")
    xs = np.linspace(-2, 2, 11)
    for xi in xs:
        print(f"x = {xi:.1f}, y = {float(p(xi)):.4f}")
