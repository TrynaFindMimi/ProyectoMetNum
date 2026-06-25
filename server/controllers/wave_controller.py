import numpy as np
from fastapi import APIRouter
from ..models.schemas import InterpRequest, InterpResponse, WaveRequest, WaveResponse
from ..services.interpolation_service import interpolate, gen_wave, get_available_functions

router = APIRouter()


@router.post("/interpolate")
def interpolate_endpoint(req: InterpRequest):
    x = np.array(req.x)
    y = np.array(req.y)
    polynomial, points = interpolate(x, y, req.n_points)
    return InterpResponse(polynomial=polynomial, points=points)


@router.post("/wave")
def wave_endpoint(req: WaveRequest):
    xs, ys = gen_wave(
        function_type=req.function_type,
        n_control=req.n_control,
        n_points=req.n_points,
        x_min=req.x_min,
        x_max=req.x_max,
    )
    return WaveResponse(
        function_type=req.function_type,
        x=[round(v, 4) for v in xs],
        y=[round(v, 4) for v in ys],
        available_functions=get_available_functions(),
    )


@router.get("/")
def root():
    return {
        "message": "Newton Function Interpolation API",
        "endpoints": ["/interpolate", "/wave"],
    }
