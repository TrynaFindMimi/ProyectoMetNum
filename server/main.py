# server/main.py
# Servidor FastAPI — expone endpoints para que React consuma los cálculos
# con numpy sin que el frontend tenga que hacer cómputo pesado.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .numerical_methods import f, wave_svg, area_data

app = FastAPI(title="Métodos Numéricos API")

# CORS: permitir que el dev server de Vite (puerto 5173) haga fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Esquemas de validación con Pydantic ──────────────────────────
class WaveRequest(BaseModel):
    freq: float = 1
    amp: float = 1
    phase: float = 0
    offset: float = 0
    color: str = "#a78bfa"


class AreaRequest(BaseModel):
    a: float = 0
    b: float = 10
    n: int = 100
    method: str = "trapezoidal"


# ─── Endpoints ────────────────────────────────────────────────────

@app.get("/api/config")
def get_config():
    """Devuelve la configuración por defecto (función, límites, etc.)"""
    return {"function": "sin(x + 1)", "x_min": 0, "x_max": 10, "y_top": 1.8}


@app.post("/api/wave")
def get_wave(req: WaveRequest):
    """Genera el código SVG de la onda coseno con los parámetros dados"""
    svg = wave_svg(req.freq, req.amp, req.phase, req.offset, req.color)
    return {"svg": svg}


@app.post("/api/area")
def get_area(req: AreaRequest):
    """Calcula el área bajo la curva usando el método especificado"""
    return area_data(f, req.a, req.b, req.n, req.method)
